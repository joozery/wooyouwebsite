import mongoose from "mongoose";

// Cache connection across hot-reloads in dev
const globalWithMongoose = global as typeof global & {
  _mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

const cache = globalWithMongoose._mongooseCache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
