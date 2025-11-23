import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Default admin credentials (password generated during initialization)
 * Run: pnpm exec tsx server/init-admin.mjs
 */
export const DEFAULT_ADMIN = {
  username: "admin",
  name: "Administrator",
  email: "admin@salla.sa",
  role: "admin" as const,
};
