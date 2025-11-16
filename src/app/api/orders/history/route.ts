import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Missing email parameter.' }, { status: 400 });
  }
  const orders = await db
    .collection('orders')
    .find({ email })
    .sort({ orderTime: -1 })
    .toArray();
  return NextResponse.json(orders);
}
