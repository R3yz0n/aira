#!/usr/bin/env node
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * scripts/set-admin-password.mjs
 *
 * CLI helper to update the single admin user's password directly in the DB.
 * This is useful when you cannot use the running app (or want an out-of-band
 * password rotation). Protect the script with `ADMIN_SCRIPT_SECRET` in your
 * `.env` if you need an extra layer of safety.
 *
 * Usage:
 *   node scripts/set-admin-password.mjs NEW_PASSWORD SCRIPT_SECRET
 */

dotenv.config();

const uri = process.env.MONGODB_URI;
const adminEmail = process.env.ADMIN_EMAIL;
const scriptSecretEnv = process.env.ADMIN_SCRIPT_SECRET;

async function main() {
  const [, , newPassword, scriptSecret] = process.argv;
  if (!newPassword || !scriptSecret) {
    console.error("Usage: node scripts/set-admin-password.mjs NEW_PASSWORD SCRIPT_SECRET");
    process.exit(1);
  }
  if (scriptSecretEnv && scriptSecret !== scriptSecretEnv) {
    console.error("Invalid script secret");
    process.exit(2);
  }
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(3);
  }
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not set");
    process.exit(4);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const admin = await db.collection("admins").findOne({ email: adminEmail });
  if (!admin) {
    console.error("Admin user not found for", adminEmail);
    await client.close();
    process.exit(5);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await db
    .collection("admins")
    .updateOne({ _id: admin._id }, { $set: { passwordHash: hash, updatedAt: new Date() } });
  console.log("Admin password updated for", adminEmail);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
