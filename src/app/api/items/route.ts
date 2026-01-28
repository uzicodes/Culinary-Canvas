import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary'; //

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// --- UPDATED DELETE METHOD ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    // 2. Fetch the item first to retrieve the Cloudinary Image URL
    const item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 3. Delete the image from Cloudinary
    if (item.image && item.image.includes("cloudinary")) {
      try {
        // Extract the specific ID from the URL (e.g., spzco8tvg4e7dbsippj7)
        const publicId = item.image.split('/').pop()?.split('.')[0];
        
        // Construct the full path matching your Cloudinary folder structure
        const fullPublicId = `culinary-canvas/items/${publicId}`;

        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudErr) {
        console.error("Cloudinary Deletion Failed:", cloudErr);
        // We continue deleting from the DB so the item doesn't become "stuck"
      }
    }

    // 4. Delete the document from MongoDB
    const result = await db.collection("items").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item and image deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}