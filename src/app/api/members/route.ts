import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();
  const result = await db.collection('members').insertOne({ ...data, createdAt: new Date() });
  return new Response(JSON.stringify({ success: true, userId: result.insertedId }), { status: 201 });
}