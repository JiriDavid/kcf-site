// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let clientPromise: Promise<MongoClient> | null = null;

function createClient() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
}

async function getClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const client = createClient();
      globalWithMongo._mongoClientPromise = client.connect();
    }

    return globalWithMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = createClient();
    clientPromise = client.connect();
  }

  try {
    return await clientPromise;
  } catch (error) {
    clientPromise = null;
    throw error;
  }
}

export default getClient;

export async function getDb() {
  if (!dbName) {
    throw new Error("Missing MONGODB_DB environment variable");
  }

  const client = await getClient();
  return client.db(dbName);
}
