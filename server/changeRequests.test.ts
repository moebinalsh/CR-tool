import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("changeRequests procedures", () => {
  it("should create a change request", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.changeRequests.create({
      title: "Test Change Request",
      reason: "Testing the system",
      affectedResources: "Test resources",
      assigneeId: 1,
      rollbackPlan: "Rollback steps here",
      status: "draft",
      priority: "medium",
    });

    expect(result).toEqual({ success: true });
  });

  it("should list all change requests", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.changeRequests.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get statistics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.changeRequests.stats();

    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("draft");
    expect(stats).toHaveProperty("pending");
    expect(stats).toHaveProperty("approved");
    expect(stats).toHaveProperty("rejected");
    expect(stats).toHaveProperty("implemented");
    expect(stats).toHaveProperty("rolledBack");
  });

  it("should get recent change requests", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const recent = await caller.changeRequests.getRecent({ limit: 5 });

    expect(Array.isArray(recent)).toBe(true);
    expect(recent.length).toBeLessThanOrEqual(5);
  });
});
