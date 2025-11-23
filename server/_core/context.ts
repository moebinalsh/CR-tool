import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Try local JWT authentication first
  let token = opts.req.cookies?.[COOKIE_NAME];
  
  // If no cookie, check Authorization header
  if (!token) {
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, ENV.cookieSecret) as { userId: number };
      const db = await getDb();
      if (db) {
        const [foundUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, decoded.userId))
          .limit(1);
        if (foundUser) {
          user = foundUser;
        }
      }
    } catch (error) {
      // JWT verification failed, try OAuth fallback
    }
  }

  // Disable OAuth fallback - only use local authentication
  // if (!user) {
  //   try {
  //     user = await sdk.authenticateRequest(opts.req);
  //   } catch (error) {
  //     // Authentication is optional for public procedures.
  //     user = null;
  //   }
  // }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
