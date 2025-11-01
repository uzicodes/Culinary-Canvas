import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function findUserByEmail(email: string) {
  await client.connect();
  const db = client.db();
  const user = await db.collection('members').findOne({ email });
  return user;
}

export async function validPassword(inputPassword: string, userPassword: string) {
  return bcrypt.compare(inputPassword, userPassword);
}
