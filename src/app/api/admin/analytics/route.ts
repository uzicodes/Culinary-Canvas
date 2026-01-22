import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayParam = searchParams.get("day");
    
    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    // 1. Fetch Real-Time User Count from 'members' collection
    const totalMembersCount = await db.collection("members").countDocuments();

    // 2. Fetch recent orders for the table
    const recentOrders = await db.collection("orders")
      .find({})
      .sort({ orderTime: -1 })
      .limit(10)
      .toArray();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const getRevenueForRange = async (start: Date, end: Date) => {
      const stats = await db.collection("orders").aggregate([
        { $match: { orderTime: { $gte: start, $lt: end } } },
        { 
          $group: { 
            _id: null, 
            total: { $sum: { $convert: { input: "$totalCost", to: "double", onError: 0 } } }
          } 
        }
      ]).toArray();
      return stats[0] || { total: 0 };
    };

    // Monthly & Daily Revenue calculations
    const monthlyStats = await getRevenueForRange(new Date(year, month, 1), new Date(year, month + 1, 1));
    const todayStats = await getRevenueForRange(new Date(year, month, now.getDate()), new Date(year, month, now.getDate() + 1));

    let specificDayRevenue = 0;
    if (dayParam) {
      const day = parseInt(dayParam);
      specificDayRevenue = (await getRevenueForRange(new Date(year, month, day), new Date(year, month, day + 1))).total;
    }

    return NextResponse.json({
      todayRevenue: todayStats.total,
      monthlyRevenue: monthlyStats.total,
      // Sending the actual member count
      totalCustomers: totalMembersCount, 
      recentOrders,
      specificDayRevenue
    });

  } catch (error) {
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}