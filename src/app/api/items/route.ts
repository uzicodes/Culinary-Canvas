import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("culinary-canvas");
  const items = await db.collection("items").find({}).toArray();
  return NextResponse.json(items);
}

export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();
  const client = await clientPromise;
  const db = client.db("culinary-canvas");

  await db.collection("items").updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return NextResponse.json({ message: "Item updated successfully" });
}