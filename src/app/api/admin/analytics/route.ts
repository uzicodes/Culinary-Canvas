import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayParam = searchParams.get("day");
    
    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 1. Fetch real order history for the table
    const recentOrders = await db.collection("orders")
      .find({})
      .sort({ orderTime: -1 })
      .limit(10)
      .toArray();

    // Reusable Revenue Aggregation Function
    const getRevenueForRange = async (start: Date, end: Date) => {
      const stats = await db.collection("orders").aggregate([
        { 
          $match: { 
            orderTime: { $gte: start, $lt: end } 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: { $convert: { input: "$totalCost", to: "double", onError: 0 } } },
            count: { $sum: 1 } 
          } 
        }
      ]).toArray();
      return stats[0] || { total: 0, count: 0 };
    };

    // Monthly Range (Full January)
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);
    const monthlyStats = await getRevenueForRange(startOfMonth, endOfMonth);

    // Today's Range (Jan 22)
    const startOfToday = new Date(year, month, now.getDate());
    const endOfToday = new Date(year, month, now.getDate() + 1);
    const todayStats = await getRevenueForRange(startOfToday, endOfToday);

    // Specific Day Logic 
    let specificDayRevenue = 0;
    if (dayParam) {
      const day = parseInt(dayParam);
      const startOfDay = new Date(year, month, day);
      const endOfDay = new Date(year, month, day + 1);
      const dayStats = await getRevenueForRange(startOfDay, endOfDay);
      specificDayRevenue = dayStats.total;
    }

    return NextResponse.json({
      todayRevenue: todayStats.total,
      monthlyRevenue: monthlyStats.total,
      totalCustomers: monthlyStats.count,
      recentOrders: recentOrders,
      specificDayRevenue
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}