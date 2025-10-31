import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const order = await Order.create(data);
  return new Response(JSON.stringify(order), { status: 201 });
}