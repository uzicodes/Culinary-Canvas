import clientPromise from '@/lib/mongodb';
import { generateOrderId } from '@/lib/generateOrderId';

const MAX_RETRY_ATTEMPTS = 3;

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