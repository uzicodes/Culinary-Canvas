import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();

  // Get the next order number for custom orderId
  const orderCount = await db.collection('orders').countDocuments();
  const orderId = `CC-${(orderCount + 1).toString().padStart(4, '0')}`;

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


  // Transform itemsOrdered to only include the name of each item
  let formattedItems = itemsOrdered;
  if (Array.isArray(itemsOrdered) && itemsOrdered.length > 0 && typeof itemsOrdered[0] === 'object') {
    formattedItems = itemsOrdered.map((item: any) => item.name || item._id || item);
  }

  const order = {
    order_id: orderId,
    name,
    email,
    address,
    orderTime: new Date(),
    itemsOrdered: formattedItems,
    totalCost,
    paymentType,
  };

  const result = await db.collection('orders').insertOne(order);
  const insertedOrder = { ...order, _id: result.insertedId };
  return new Response(JSON.stringify(insertedOrder), { status: 201 });
}