import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    // Use the order_id from the already-created order
    const tran_id = body.order_id;

    if (!tran_id) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const data = {
        store_id: store_id,
        store_passwd: store_passwd,
        total_amount: body.total,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
        fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
        ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Food Order',
        product_category: 'Food',
        product_profile: 'general',
        // Customer info
        cus_name: body.customerName || 'Customer',
        cus_email: body.customerEmail || 'customer@example.com',
        cus_add1: body.address || 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: body.phone || '01700000000',
        // Shipping info (required by SSLCommerz)
        ship_name: body.customerName || 'Customer',
        ship_add1: body.address || 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
    };

    // SSLCommerz API endpoint
    const apiUrl = is_live 
        ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    try {
        // Convert data to URL-encoded form
        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const apiResponse = await response.json();
        
        // Return sessionkey for EasyCheckout embedded popup
        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json({ 
                sessionkey: apiResponse.sessionkey,
                GatewayPageURL: apiResponse.GatewayPageURL,
                status: 'SUCCESS'
            });
        } else {
            console.error('SSLCommerz Init Failed:', apiResponse);
            return NextResponse.json({ 
                error: apiResponse.failedreason || "Session initialization failed",
                status: 'FAILED'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('SSLCommerz Init Error:', error);
        return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
    }
}