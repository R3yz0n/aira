#!/usr/bin/env node

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { AdminModel } from "../lib/models/admin";
import { mongoose } from "../lib/db/mongoose";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL;
const setupSecretEnv = process.env.ADMIN_SETUP_SECRET;

async function main() {
  const [, , password, setupSecret] = process.argv;
  if (!password) {
    console.error("Usage: npx tsx scripts/create-admin.ts PASSWORD [SETUP_SECRET]");
    process.exit(1);
  }
  if (setupSecretEnv && setupSecret !== setupSecretEnv) {
    console.error("Invalid or missing setup secret");
    process.exit(2);
  }
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not set");
    process.exit(4);
  }

  // Use AdminModel for all DB logic
  const existing = await AdminModel.findByEmail(adminEmail);
  if (existing) {
    console.error("Admin already exists for", adminEmail);
    process.exit(5);
  }

  const hash = await bcrypt.hash(password, 10);
  await AdminModel.create(adminEmail, hash);
  console.log("Admin created for", adminEmail);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
