import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";


export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("culinary-canvas");


  const orders = await db
    .collection("orders")
    .find({ email: session.user.email })
    .sort({ orderTime: -1, _id: -1 })
    .toArray();

  return NextResponse.json(orders);
}