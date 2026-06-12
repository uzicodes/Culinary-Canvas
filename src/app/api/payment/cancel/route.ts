import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const tran_id = formData.get('tran_id') as string;

        // Update order status to "Cancelled" in MongoDB if transaction ID exists
        if (tran_id) {
            const client = await clientPromise;
            const db = client.db();
            
            await db.collection('orders').updateOne(
                { order_id: tran_id },
                { 
                    $set: { 
                        paymentStatus: 'Cancelled',
                        paymentCancelledAt: new Date(),
                    } 
                }
            );
        }

        // Redirect to checkout page with cancellation notification
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=cancelled`,
            303
        );
    } catch (err) {
        console.error('Payment cancel handler error:', err);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=cancelled`,
            303
        );
    }
}
