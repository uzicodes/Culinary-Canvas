import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("culinary-canvas");
        const bestSellers = await db
            .collection("best_sellers")
            .find({})
            .sort({ slotIndex: 1 })
            .toArray();
        return NextResponse.json(bestSellers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("culinary-canvas");
        const body = await req.json();
        const { slotIndex, id, name, price, originalPrice, rating, image } = body;

        if (slotIndex === undefined || slotIndex < 0 || slotIndex > 3) {
            return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
        }

        const result = await db.collection("best_sellers").updateOne(
            { slotIndex: slotIndex },
            { 
                $set: { 
                    productId: id,
                    name,
                    price,
                    originalPrice,
                    rating: Number(rating),
                    image,
                    badge: "SALE",
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        return NextResponse.json({ message: "Updated" });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}