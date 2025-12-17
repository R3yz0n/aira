import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is required");

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

export function connectMongoose() {
  if (!global._mongoosePromise) {
    // Disable command buffering to surface connection issues early
    mongoose.set("bufferCommands", false);
    global._mongoosePromise = mongoose.connect(uri as string);
  }
  return global._mongoosePromise;
}

export { mongoose };
