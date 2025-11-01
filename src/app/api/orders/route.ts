import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();
  const result = await db.collection('orders').insertOne(data);
  const insertedOrder = { ...data, _id: result.insertedId };
  return new Response(JSON.stringify(insertedOrder), { status: 201 });
}