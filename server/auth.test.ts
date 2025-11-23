import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { hashPassword } from "./auth-utils";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user: AuthenticatedUser | null = null): { 
  ctx: TrpcContext; 
  cookies: Record<string, string>;
} {
  const cookies: Record<string, string> = {};

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      cookies,
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => {
        cookies[name] = value;
      },
      clearCookie: (name: string) => {
        delete cookies[name];
      },
    } as TrpcContext["res"],
  };

  return { ctx, cookies };
}

describe("auth procedures", () => {
  let testUserId: number;

  beforeAll(async () => {
    // Create a test user for authentication tests
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const passwordHash = await hashPassword("testpass123");
    
    // Clean up any existing test user
    await db.delete(users).where(eq(users.username, "testuser"));
    
    const [result] = await db.insert(users).values({
      username: "testuser",
      passwordHash,
      name: "Test User",
      email: "test@salla.sa",
      role: "user",
      loginMethod: "local",
      lastSignedIn: new Date(),
    });

    testUserId = Number(result.insertId);
  });

  it("should login with valid credentials", async () => {
    const { ctx, cookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      username: "testuser",
      password: "testpass123",
    });

    expect(result.success).toBe(true);
    expect(result.user.username).toBe("testuser");
    expect(result.user.email).toBe("test@salla.sa");
    expect(cookies).toHaveProperty("app_session_id");
  });

  it("should reject login with invalid password", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        username: "testuser",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid username or password");
  });

  it("should reject login with non-existent user", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        username: "nonexistent",
        password: "anypassword",
      })
    ).rejects.toThrow("Invalid username or password");
  });

  it("should return user info for authenticated user", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUserId,
      username: "testuser",
      passwordHash: null,
      openId: null,
      name: "Test User",
      email: "test@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toEqual(authenticatedUser);
  });

  it("should return null for unauthenticated user", async () => {
    const { ctx } = createMockContext(null);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("should change password with valid current password", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUserId,
      username: "testuser",
      passwordHash: null,
      openId: null,
      name: "Test User",
      email: "test@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.changePassword({
      currentPassword: "testpass123",
      newPassword: "newpass456",
    });

    expect(result.success).toBe(true);

    // Verify new password works
    const { ctx: loginCtx } = createMockContext();
    const loginCaller = appRouter.createCaller(loginCtx);

    const loginResult = await loginCaller.auth.login({
      username: "testuser",
      password: "newpass456",
    });

    expect(loginResult.success).toBe(true);
  });

  it("should reject password change with wrong current password", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUserId,
      username: "testuser",
      passwordHash: null,
      openId: null,
      name: "Test User",
      email: "test@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.changePassword({
        currentPassword: "wrongpassword",
        newPassword: "newpass789",
      })
    ).rejects.toThrow("Current password is incorrect");
  });

  it("should allow admin to create new user", async () => {
    const adminUser: AuthenticatedUser = {
      id: 1,
      username: "admin",
      passwordHash: null,
      openId: null,
      name: "Administrator",
      email: "admin@salla.sa",
      loginMethod: "local",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.createUser({
      username: "newuser",
      password: "password123",
      name: "New User",
      email: "newuser@salla.sa",
      role: "user",
    });

    expect(result.success).toBe(true);

    // Clean up
    const db = await getDb();
    if (db) {
      await db.delete(users).where(eq(users.username, "newuser"));
    }
  });

  it("should reject user creation by non-admin", async () => {
    const regularUser: AuthenticatedUser = {
      id: testUserId,
      username: "testuser",
      passwordHash: null,
      openId: null,
      name: "Test User",
      email: "test@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(regularUser);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.createUser({
        username: "anotheruser",
        password: "password123",
        role: "user",
      })
    ).rejects.toThrow("Only admins can create users");
  });
});
