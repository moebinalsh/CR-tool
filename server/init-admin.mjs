import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Generate a secure random password
function generateSecurePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const randomBytes = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
}

const DEFAULT_ADMIN = {
  username: "admin",
  name: "Administrator",
  email: "admin@salla.sa",
  role: "admin",
};

async function initAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  try {
    // Check if admin already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, DEFAULT_ADMIN.username))
      .limit(1);

    if (existing.length > 0) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Create admin user with generated password
    const generatedPassword = generateSecurePassword(16);
    const passwordHash = await bcrypt.hash(generatedPassword, 10);
    
    await db.insert(users).values({
      username: DEFAULT_ADMIN.username,
      passwordHash,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      role: DEFAULT_ADMIN.role,
      loginMethod: "local",
      lastSignedIn: new Date(),
    });

    console.log("\n" + "=".repeat(70));
    console.log("  ✓ DEFAULT ADMIN ACCOUNT CREATED SUCCESSFULLY!");
    console.log("=".repeat(70));
    console.log("\n  Username: " + DEFAULT_ADMIN.username);
    console.log("  Password: " + generatedPassword);
    console.log("\n" + "=".repeat(70));
    console.log("  ⚠️  IMPORTANT: Save this password now!");
    console.log("  This password will NOT be shown again.");
    console.log("  Change it immediately after first login in Settings.");
    console.log("=".repeat(70) + "\n");
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

initAdmin();
