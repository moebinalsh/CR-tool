import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { authRouter } from "./auth-router";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

  users: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),

  changeRequests: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        reason: z.string().min(1),
        affectedResources: z.string().min(1),
        assigneeId: z.number(),
        prLink: z.string().optional(),
        rollbackPlan: z.string().min(1),
        status: z.enum(["draft", "pending", "approved", "rejected", "implemented", "rolled_back"]).default("draft"),
        priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
        scheduledDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        
        await db.createChangeRequest({
          ...input,
          createdById: ctx.user.id,
        });
        
        return { success: true };
      }),

    list: protectedProcedure.query(async () => {
      return await db.getAllChangeRequests();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const cr = await db.getChangeRequestById(input.id);
        if (!cr) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Change request not found" });
        }
        return cr;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        reason: z.string().min(1).optional(),
        affectedResources: z.string().min(1).optional(),
        assigneeId: z.number().optional(),
        prLink: z.string().optional(),
        rollbackPlan: z.string().min(1).optional(),
        status: z.enum(["draft", "pending", "approved", "rejected", "implemented", "rolled_back"]).optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        scheduledDate: z.date().optional(),
        implementedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateChangeRequest(id, data);
        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({ searchTerm: z.string() }))
      .query(async ({ input }) => {
        return await db.searchChangeRequests(input.searchTerm);
      }),

    getByStatus: protectedProcedure
      .input(z.object({ status: z.string() }))
      .query(async ({ input }) => {
        return await db.getChangeRequestsByStatus(input.status);
      }),

    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await db.getRecentChangeRequests(input.limit);
      }),

    stats: protectedProcedure.query(async () => {
      const allCRs = await db.getAllChangeRequests();
      
      return {
        total: allCRs.length,
        draft: allCRs.filter(cr => cr.status === "draft").length,
        pending: allCRs.filter(cr => cr.status === "pending").length,
        approved: allCRs.filter(cr => cr.status === "approved").length,
        rejected: allCRs.filter(cr => cr.status === "rejected").length,
        implemented: allCRs.filter(cr => cr.status === "implemented").length,
        rolledBack: allCRs.filter(cr => cr.status === "rolled_back").length,
      };
    }),

    // Get pending CRs assigned to current user
    myPendingReviews: protectedProcedure.query(async ({ ctx }) => {
      const allCRs = await db.getAllChangeRequests();
      
      // Filter CRs that are assigned to this user and pending review
      return allCRs.filter(cr => 
        cr.assigneeId === ctx.user.id && 
        (cr.status === "pending" || cr.status === "approved")
      );
    }),
  }),
});

export type AppRouter = typeof appRouter;
