import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the NodeJS global so the cache survives hot reloads in development.
// Without this, each file save would open a new connection.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Reference the global cache so all module instances share one connection.
const cached: MongooseCache = global.mongoose;

/**
 * Returns a cached Mongoose connection, creating one if none exists.
 * Safe to call in every request handler — it resolves immediately when
 * a connection is already established.
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return the existing connection if healthy
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        'MONGODB_URI environment variable is not defined. Add it to .env.local.'
      );
    }

    cached.promise = mongoose.connect(uri, {
      // Fail immediately on ops when disconnected instead of buffering them
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Clear the cached promise so the next call can attempt a fresh connection
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
