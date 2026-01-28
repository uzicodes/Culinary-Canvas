import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Config
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

// --- UNIVERSAL DELETE METHOD ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    // Fetch the item first to retrieve the Image URL
    const item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Universal Cloudinary Image Deletion Logic
    if (item.image && item.image.includes("cloudinary")) {
      try {
        /**
         * UNIVERSAL delete (for the previous images & new)  ["culinary-canvas/items/abc123" or "xyz789"]
         */
        const regex = /\/v\d+\/(.+)\./;
        const match = item.image.match(regex);
        
        if (match && match[1]) {
          const publicId = match[1]; 
          
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Cloudinary deletion attempt for ID [${publicId}]:`, result);
        }
      } catch (cloudErr) {
        console.error("Cloudinary Deletion Error:", cloudErr);
      }
    }

    // Delete from MongoDB
    const result = await db.collection("items").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found in database" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Item and associated image deleted successfully" 
    });
  } catch (error) {
    console.error("Global Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}