
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: any; promise: Promise<any> | null } | undefined;
}
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}


let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const c = cached as NonNullable<typeof cached>;
  if (c.conn) return c.conn;
  if (!c.promise) {
    c.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  c.conn = await c.promise;
  return c.conn;
}

export default dbConnect;