import type { Request, Response } from "express";
import { db, membershipsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

export function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export async function requireTenantAccess(req: Request, res: Response, tenantId: number): Promise<boolean> {
  if (!requireAuth(req, res)) return false;
  
  const [membership] = await db
    .select()
    .from(membershipsTable)
    .where(and(eq(membershipsTable.userId, req.user!.id), eq(membershipsTable.tenantId, tenantId)));
  
  if (!membership) {
    res.status(403).json({ error: "Access denied" });
    return false;
  }
  return true;
}

export function parseTenantId(req: Request): number {
  const raw = Array.isArray(req.params.tenantId) ? req.params.tenantId[0] : req.params.tenantId;
  return parseInt(raw, 10);
}
