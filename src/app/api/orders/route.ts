import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();

  // Accept both frontend and backend field names
  const name = data.name || data.customerName;
  const email = data.email || data.customerEmail;
  const itemsOrdered = data.itemsOrdered || data.orderItems;
  const totalCost = data.totalCost || data.total;

  if (!name || !email || !itemsOrdered || !totalCost) {
    return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
  }


  // Transform itemsOrdered to only include the name of each item
  let formattedItems = itemsOrdered;
  if (Array.isArray(itemsOrdered) && itemsOrdered.length > 0 && typeof itemsOrdered[0] === 'object') {
    formattedItems = itemsOrdered.map((item: any) => item.name || item._id || item);
  }

  const order = {
    name,
    email,
    orderTime: new Date(),
    itemsOrdered: formattedItems,
    totalCost,
  };

  const result = await db.collection('orders').insertOne(order);
  const insertedOrder = { ...order, _id: result.insertedId };
  return new Response(JSON.stringify(insertedOrder), { status: 201 });
}