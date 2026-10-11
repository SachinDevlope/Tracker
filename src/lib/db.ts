import "server-only";
import mongoose from "mongoose";
import { env } from "./env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse connection across hot reloads
const globalCache = globalThis as unknown as { mongoose?: Cache };
const cache: Cache = globalCache.mongoose ?? { conn: null, promise: null };
globalCache.mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB,
      bufferCommands: false,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
