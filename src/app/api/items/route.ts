import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("culinary-canvas"); // Targets your specific database
  const items = await db.collection("items").find({}).toArray(); // Fetches all 54 items
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

// --- NEW DELETE METHOD ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("culinary-canvas");
    
    // Deletes the specific document from your 'items' collection
    const result = await db.collection("items").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}