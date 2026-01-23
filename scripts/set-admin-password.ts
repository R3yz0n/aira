#!/usr/bin/env node

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { AdminModel, AdminMongoModel } from "../lib/models/admin";
import { connectMongoose, mongoose } from "../lib/db/mongoose";

/**
 * scripts/set-admin-password.ts
 *
 * CLI helper to update the single admin user's password directly in the DB.
 * This is useful when you cannot use the running app (or want an out-of-band
 * password rotation). Protect the script with `ADMIN_SCRIPT_SECRET` in your
 * `.env` if you need an extra layer of safety.
 *
 * Usage:
 *   npx tsx scripts/set-admin-password.ts NEW_PASSWORD SCRIPT_SECRET
 */

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL;
const scriptSecretEnv = process.env.ADMIN_SCRIPT_SECRET;

async function main() {
  const [, , newPassword, scriptSecret] = process.argv;
  if (!newPassword || !scriptSecret) {
    console.error("Usage: npx tsx scripts/set-admin-password.ts NEW_PASSWORD SCRIPT_SECRET");
    process.exit(1);
  }
  if (scriptSecretEnv && scriptSecret !== scriptSecretEnv) {
    console.error("Invalid script secret");
    process.exit(2);
  }
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not set");
    process.exit(4);
  }

  await connectMongoose();
  const admin = await AdminMongoModel.findOne({ email: adminEmail });
  if (!admin) {
    console.error("Admin user not found for", adminEmail);
    await mongoose.disconnect();
    process.exit(5);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await AdminModel.updatePassword(String(admin._id), hash);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
