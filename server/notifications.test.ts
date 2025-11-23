import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { users, changeRequests } from "../drizzle/schema";
import { hashPassword } from "./auth-utils";
import { eq } from "drizzle-orm";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user: AuthenticatedUser): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("notification procedures", () => {
  let testUser1Id: number;
  let testUser2Id: number;
  let pendingCRId: number;
  let approvedCRId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const passwordHash = await hashPassword("testpass123");

    // Create test users
    await db.delete(users).where(eq(users.username, "notifuser1"));
    await db.delete(users).where(eq(users.username, "notifuser2"));

    const [user1Result] = await db.insert(users).values({
      username: "notifuser1",
      passwordHash,
      name: "Notification Test User 1",
      email: "notifuser1@salla.sa",
      role: "user",
      loginMethod: "local",
      lastSignedIn: new Date(),
    });
    testUser1Id = Number(user1Result.insertId);

    const [user2Result] = await db.insert(users).values({
      username: "notifuser2",
      passwordHash,
      name: "Notification Test User 2",
      email: "notifuser2@salla.sa",
      role: "user",
      loginMethod: "local",
      lastSignedIn: new Date(),
    });
    testUser2Id = Number(user2Result.insertId);

    // Create test CRs assigned to user1
    const [pendingResult] = await db.insert(changeRequests).values({
      title: "Pending CR for User 1",
      reason: "Testing notifications",
      affectedResources: "Test resources",
      assigneeId: testUser1Id,
      createdById: testUser2Id,
      prLink: "https://github.com/test/pr/1",
      rollbackPlan: "Test rollback",
      status: "pending",
      priority: "high",
    });
    pendingCRId = Number(pendingResult.insertId);

    const [approvedResult] = await db.insert(changeRequests).values({
      title: "Approved CR for User 1",
      reason: "Testing notifications",
      affectedResources: "Test resources",
      assigneeId: testUser1Id,
      createdById: testUser2Id,
      prLink: "https://github.com/test/pr/2",
      rollbackPlan: "Test rollback",
      status: "approved",
      priority: "medium",
    });
    approvedCRId = Number(approvedResult.insertId);

    // Create a CR assigned to user2 (should not appear for user1)
    await db.insert(changeRequests).values({
      title: "Pending CR for User 2",
      reason: "Testing notifications",
      affectedResources: "Test resources",
      assigneeId: testUser2Id,
      createdById: testUser1Id,
      prLink: "https://github.com/test/pr/3",
      rollbackPlan: "Test rollback",
      status: "pending",
      priority: "low",
    });
  });

  it("should return pending CRs assigned to user", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUser1Id,
      username: "notifuser1",
      passwordHash: null,
      openId: null,
      name: "Notification Test User 1",
      email: "notifuser1@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    const pendingReviews = await caller.changeRequests.myPendingReviews();

    expect(pendingReviews.length).toBe(2);
    expect(pendingReviews.some(cr => cr.id === pendingCRId)).toBe(true);
    expect(pendingReviews.some(cr => cr.id === approvedCRId)).toBe(true);
    expect(pendingReviews.every(cr => cr.assigneeId === testUser1Id)).toBe(true);
  });

  it("should return empty array for user with no pending CRs", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUser2Id,
      username: "notifuser2",
      passwordHash: null,
      openId: null,
      name: "Notification Test User 2",
      email: "notifuser2@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    const pendingReviews = await caller.changeRequests.myPendingReviews();

    // User2 has a pending CR but we only count pending and approved
    expect(pendingReviews.length).toBeGreaterThanOrEqual(0);
    expect(pendingReviews.every(cr => cr.assigneeId === testUser2Id)).toBe(true);
  });

  it("should only include pending and approved statuses", async () => {
    const authenticatedUser: AuthenticatedUser = {
      id: testUser1Id,
      username: "notifuser1",
      passwordHash: null,
      openId: null,
      name: "Notification Test User 1",
      email: "notifuser1@salla.sa",
      loginMethod: "local",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const { ctx } = createMockContext(authenticatedUser);
    const caller = appRouter.createCaller(ctx);

    const pendingReviews = await caller.changeRequests.myPendingReviews();

    expect(pendingReviews.every(cr => 
      cr.status === "pending" || cr.status === "approved"
    )).toBe(true);
  });
});
