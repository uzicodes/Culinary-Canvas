import clientPromise from '@/lib/mongodb';
import { generateOrderId } from '@/lib/generateOrderId';
import nodemailer from 'nodemailer';

const MAX_RETRY_ATTEMPTS = 3;

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order: any) => {
  try {
    const transporter = createTransporter();

    // Format items for email
    const itemsHtml = order.itemsOrdered.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const deliveryFee = order.deliveryMethod === 'Priority' ? 60 : 45;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 30px; text-align: center;">
          <h1 style="color: #BCE334; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">
            Culinary Canvas
          </h1>
          <p style="color: #888; margin: 8px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">Order Confirmation</p>
        </div>
        
        <!-- Success Message -->
        <div style="background-color: #F7FBE7; padding: 40px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background-color: #BCE334; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px;">✓</span>
          </div>
          <h2 style="margin: 0 0 10px; font-size: 24px; font-weight: 900; color: #000; text-transform: uppercase;">Order Confirmed!</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Thank you for your order, <strong>${order.name}</strong>!</p>
        </div>
        
        <!-- Order ID -->
        <div style="background-color: #000; padding: 20px 30px; text-align: center;">
          <p style="margin: 0 0 5px; color: #BCE334; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Order ID</p>
          <p style="margin: 0; color: #fff; font-size: 24px; font-weight: 900; letter-spacing: -1px;">#${order.order_id}</p>
        </div>
        
        <!-- Order Details -->
        <div style="padding: 30px;">
          <h3 style="margin: 0 0 20px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #888;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="padding: 10px 0; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Item</th>
                <th style="padding: 10px 0; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Qty</th>
                <th style="padding: 10px 0; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <!-- Summary -->
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px dashed #eee;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888; font-size: 13px;">Subtotal</span>
              <span style="font-weight: 600; font-size: 13px;">৳${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888; font-size: 13px;">Delivery (${order.deliveryMethod})</span>
              <span style="font-weight: 600; font-size: 13px;">৳${deliveryFee.toFixed(2)}</span>
            </div>
            ${order.tip > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888; font-size: 13px;">Tip</span>
              <span style="font-weight: 600; color: #22c55e; font-size: 13px;">৳${order.tip.toFixed(2)}</span>
            </div>
            ` : ''}
            ${order.couponDiscount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888; font-size: 13px;">Discount (${order.couponCode})</span>
              <span style="font-weight: 600; color: #ef4444; font-size: 13px;">-৳${order.couponDiscount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #000;">
              <span style="font-weight: 900; font-size: 16px; text-transform: uppercase;">Total</span>
              <span style="font-weight: 900; font-size: 20px; color: #000;">৳${order.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <!-- Delivery Info -->
        <div style="background-color: #f8f8f8; padding: 25px 30px;">
          <h3 style="margin: 0 0 15px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #888;">Delivery Information</h3>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Address:</strong> ${order.address}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Phone:</strong> ${order.phone}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Payment:</strong> ${order.paymentType.toUpperCase()}</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <p style="margin: 0 0 10px; color: #BCE334; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
            Thank You For Choosing Us!
          </p>
          <p style="margin: 0; color: #666; font-size: 11px;">
            If you have any questions, reply to this email or contact our support.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      to: order.email,
      subject: `Order Confirmed! #${order.order_id} - Culinary Canvas`,
      html: emailHtml,
    });

    console.log(`Order confirmation email sent to ${order.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
};

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();

  // Accept both frontend and backend field names
  const name = data.name || data.customerName;
  const email = data.email || data.customerEmail;
  const itemsOrdered = data.itemsOrdered || data.orderItems;
  const totalCost = data.totalCost || data.total;
  const address = data.address || data.customerAddress;
  let paymentType = data.paymentType || data.paymentMethod;

  // Normalize paymentType to match required values
  if (paymentType) {
    paymentType = paymentType.toLowerCase();
    if (paymentType === 'cash on delivery') paymentType = 'cod';
    if (paymentType === 'bkash') paymentType = 'bkash';
    if (paymentType === 'nagad') paymentType = 'nagad';
    if (paymentType === 'card/debit card') paymentType = 'card';
  }

  if (!name || !email || !itemsOrdered || !totalCost || !address || !paymentType) {
    return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
  }

  // Transform itemsOrdered to include name, quantity, and price for each item
  let formattedItems = itemsOrdered;
  if (Array.isArray(itemsOrdered) && itemsOrdered.length > 0 && typeof itemsOrdered[0] === 'object') {
    formattedItems = itemsOrdered.map((item: any) => ({
      name: item.name || item.title || 'Unknown Item',
      quantity: item.quantity || 1,
      price: item.price || 0,
    }));
  }

  // Ensure unique index exists on order_id field
  try {
    await db.collection('orders').createIndex({ order_id: 1 }, { unique: true, sparse: true });
  } catch (indexError) {
    // Index might already exist, which is fine
    console.log('Index creation skipped or already exists');
  }

  // Retry loop for collision-resistant ID generation
  let attempts = 0;
  let insertedOrder = null;
  let lastError = null;

  while (attempts < MAX_RETRY_ATTEMPTS) {
    attempts++;

    // Generate a new unique order ID on the server side
    const orderId = generateOrderId();

    const order = {
      order_id: orderId,
      name,
      email,
      address,
      phone: data.customerPhone || data.phone || data.mobileNumber,
      orderTime: new Date(),
      itemsOrdered: formattedItems,
      totalCost,
      paymentType,
      // Additional fields from frontend
      deliveryMethod: data.deliveryMethod,
      tip: data.tip || 0,
      subtotal: data.subtotal,
      couponCode: data.couponCode,
      couponDiscount: data.couponDiscount || 0,
    };

    try {
      const result = await db.collection('orders').insertOne(order);
      insertedOrder = {
        ...order,
        _id: result.insertedId.toString(), // Convert ObjectId to string for safety
        orderId: order.order_id // Include as orderId for frontend compatibility
      };
      break; // Success - exit the retry loop
    } catch (error: any) {
      lastError = error;
      // Check if it's a duplicate key error (code 11000)
      if (error.code === 11000 && error.keyPattern?.order_id) {
        console.warn(`Order ID collision detected (attempt ${attempts}), regenerating...`);
        continue; // Try again with a new ID
      }
      // For other errors, throw immediately
      throw error;
    }
  }

  if (!insertedOrder) {
    console.error(`Failed to generate unique order ID after ${MAX_RETRY_ATTEMPTS} attempts`);
    return new Response(
      JSON.stringify({ message: 'Failed to create order. Please try again.' }),
      { status: 500 }
    );
  }

  // Send order confirmation email (non-blocking)
  sendOrderConfirmationEmail(insertedOrder);

  // Return the order with the server-generated ID
  // Intentionally exclude MongoDB _id from primary identification to prevent order scraping
  return new Response(JSON.stringify({
    order_id: insertedOrder.order_id,
    orderId: insertedOrder.order_id, // Alias for frontend compatibility
    name: insertedOrder.name,
    email: insertedOrder.email,
    address: insertedOrder.address,
    phone: insertedOrder.phone,
    orderTime: insertedOrder.orderTime,
    itemsOrdered: insertedOrder.itemsOrdered,
    totalCost: insertedOrder.totalCost,
    paymentType: insertedOrder.paymentType,
    deliveryMethod: insertedOrder.deliveryMethod,
    tip: insertedOrder.tip,
    subtotal: insertedOrder.subtotal,
    couponCode: insertedOrder.couponCode,
    couponDiscount: insertedOrder.couponDiscount,
  }), { status: 201 });
}