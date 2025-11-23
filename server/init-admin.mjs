import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
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

    // Create admin user
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    
    await db.insert(users).values({
      username: DEFAULT_ADMIN.username,
      passwordHash,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      role: DEFAULT_ADMIN.role,
      loginMethod: "local",
      lastSignedIn: new Date(),
    });

    console.log("✓ Default admin account created");
    console.log(`  Username: ${DEFAULT_ADMIN.username}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password}`);
    console.log("  Please change the password after first login!");
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

initAdmin();
