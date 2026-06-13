import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    const formData = await req.formData();
    const val_id = formData.get('val_id') as string;
    const tran_id = formData.get('tran_id') as string;

    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    // SSLCommerz validation API endpoint
    const validationUrl = is_live
        ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php`
        : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php`;

    try {
        // Validate the transaction with SSLCommerz
        const params = new URLSearchParams({
            val_id: val_id,
            store_id: store_id!,
            store_passwd: store_passwd!,
            format: 'json'
        });

        const response = await fetch(`${validationUrl}?${params.toString()}`, { cache: 'no-store' });
        const validationResponse = await response.json();
        
        if (validationResponse.status === 'VALID' || validationResponse.status === 'VALIDATED') {
            // Update order status to "Paid" in MongoDB
            const client = await clientPromise;
            const db = client.db();
            
            await db.collection('orders').updateOne(
                { order_id: tran_id },
                { 
                    $set: { 
                        paymentStatus: 'Paid',
                        paymentValidatedAt: new Date(),
                        sslcommerzValId: val_id,
                        sslcommerzTranId: validationResponse.tran_id,
                        sslcommerzAmount: validationResponse.amount,
                        sslcommerzCardType: validationResponse.card_type,
                        sslcommerzBankTranId: validationResponse.bank_tran_id,
                    } 
                }
            );

            // Redirect to success page
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
                303
            );
        } else {
            // Payment validation failed
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=validation_failed`,
                303
            );
        }
    } catch (error) {
        console.error('Payment validation error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=error`,
            303
        );
    }
}

// Also handle GET requests (for direct URL access after payment)
export async function GET(req: Request) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    
    if (status === 'success') {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
            303
        );
    }
    
    return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        303
    );
}