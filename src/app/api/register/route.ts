import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { name, email, phone, password } = await req.json();
  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection("members").findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection("members").insertOne({
    name,
    email,
    phone,
    password: hashedPassword,
    createdAt: new Date()
  });

  return NextResponse.json({ success: true, userId: result.insertedId });
}