import dbConnect from '@/lib/mongodb';
import Member from '@/models/member';

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const member = await Member.create(data);
  return new Response(JSON.stringify(member), { status: 201 });
}