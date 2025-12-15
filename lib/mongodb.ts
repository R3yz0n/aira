import { MongoClient, Db } from "mongodb";

/**
 * MongoDB connection helper
 *
 * This file centralizes the MongoDB connection logic in a serverless-friendly
 * manner. It uses a global promise in development to avoid creating multiple
 * connections during HMR.
 *
 * Required env:
 * - `MONGODB_URI` - connection string for your MongoDB instance
 */

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is required");

declare global {
  // Reuse client promise across module reloads in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Returns a connected `Db` instance. Call this from server-side code (API
 * routes, server components). Do not call from client-side bundle.
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}
