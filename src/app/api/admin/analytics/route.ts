import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayParam = searchParams.get("day");
    const fetchMembers = searchParams.get("members");
    
    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    // ── Fetch all members (admin only, on demand) ───────────────
    if (fetchMembers === "true") {
      const members = await db.collection("members")
        .find({}, { projection: { password: 0, resetToken: 0, resetTokenExpiry: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json({ members });
    }

    // ── User Count ──────────────────────────────────────────────
    const totalMembersCount = await db.collection("members").countDocuments();

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

    // ── Monthly & Daily Revenue ─────────────────────────────────
    const monthlyStats = await getRevenueForRange(new Date(year, month, 1), new Date(year, month + 1, 1));
    const todayStats = await getRevenueForRange(new Date(year, month, now.getDate()), new Date(year, month, now.getDate() + 1));

    let specificDayRevenue = 0;

    // ── Orders query: filtered by day OR all recent ─────────────
    let recentOrders;
    if (dayParam) {
      const day = parseInt(dayParam);
      const dayStart = new Date(year, month, day);
      const dayEnd = new Date(year, month, day + 1);

      specificDayRevenue = (await getRevenueForRange(dayStart, dayEnd)).total;

      // Return only orders from the selected day
      recentOrders = await db.collection("orders")
        .find({ orderTime: { $gte: dayStart, $lt: dayEnd } })
        .sort({ orderTime: -1 })
        .toArray();
    } else {
      // No date filter — show 10 most recent orders
      recentOrders = await db.collection("orders")
        .find({})
        .sort({ orderTime: -1 })
        .limit(10)
        .toArray();
    }

    return NextResponse.json({
      todayRevenue: todayStats.total,
      monthlyRevenue: monthlyStats.total,
      totalCustomers: totalMembersCount, 
      recentOrders,
      specificDayRevenue
    });

  } catch (error) {
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}