import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

// Define a global type for cached connection
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

let cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null };

if (typeof global._mongoose === 'undefined') {
  cached = { conn: null, promise: null };
  global._mongoose = cached;
} else {
  cached = global._mongoose;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {});
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;