import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const tran_id = formData.get('tran_id') as string;
        const error = formData.get('error') as string;

        // Update order status to "Failed" in MongoDB if transaction ID exists
        if (tran_id) {
            const client = await clientPromise;
            const db = client.db();
            
            await db.collection('orders').updateOne(
                { order_id: tran_id },
                { 
                    $set: { 
                        paymentStatus: 'Failed',
                        paymentFailedAt: new Date(),
                        paymentFailReason: error || 'Payment failed',
                    } 
                }
            );
        }

        // Redirect to checkout page with failure notification
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=failed`,
            303
        );
    } catch (err) {
        console.error('Payment fail handler error:', err);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=failed`,
            303
        );
    }
}

// Handle GET requests (for direct URL access)
export async function GET(req: Request) {
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=failed`,
        303
    );
}
