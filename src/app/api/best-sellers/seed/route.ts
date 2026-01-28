import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    const client = await clientPromise;
    const db = client.db("culinary-canvas");
    const initial = [
        { slotIndex: 0, name: 'Tiramisu', price: '200', originalPrice: '220', rating: 5, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930251/kyvcoohzi6saedxpguns.png' },
        { slotIndex: 1, name: 'Burger', price: '380', originalPrice: '400', rating: 5, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928494/lqhcxe20m6ws6hkurvhf.png' },
        { slotIndex: 2, name: 'Croissant', price: '170', originalPrice: '200', rating: 5, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930115/ke9r6yd2hj2osscss29n.png' },
        { slotIndex: 3, name: 'Spaghetti', price: '180', originalPrice: '200', rating: 5, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930944/zb7hv5nzgmm2jgynnjnb.png' },
    ];
    await db.collection("best_sellers").deleteMany({});
    await db.collection("best_sellers").insertMany(initial);
    return NextResponse.json({ message: "Seeded!" });
}