import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("culinary-canvas");
    const body = await req.json();

    // Create the item object
    const newItem = {
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      image: body.image, // This will be the Cloudinary URL
      description: body.description,
      available: true,
      createdAt: new Date(),
    };

    const result = await db.collection("items").insertOne(newItem);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: "Failed to add item" }, { status: 500 });
  }
}