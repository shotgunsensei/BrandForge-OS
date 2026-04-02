import { Router, type IRouter } from "express";
import { eq, desc, sql, count } from "drizzle-orm";
import { db, tenantsTable, usersTable, membershipsTable, subscriptionsTable, featureFlagsTable, usageRecordsTable, integrationsTable } from "@workspace/db";
import { requirePlatformAdmin } from "../lib/tenant-auth";
import { getPlanLimits } from "../lib/plan-limits";

const router: IRouter = Router();

router.get("/admin/overview", async (req, res): Promise<void> => {
  if (!(await requirePlatformAdmin(req, res))) return;

  const tenants = await db.select().from(tenantsTable).orderBy(desc(tenantsTable.createdAt));
  const users = await db.select().from(usersTable);
  const [{ total: totalUsage }] = await db.select({ total: sql<number>`coalesce(sum(${usageRecordsTable.credits}), 0)` }).from(usageRecordsTable);

  const planDistribution: Record<string, number> = {};
  const statusDistribution: Record<string, number> = {};
  tenants.forEach(t => {
    planDistribution[t.plan] = (planDistribution[t.plan] || 0) + 1;
    statusDistribution[t.billingStatus] = (statusDistribution[t.billingStatus] || 0) + 1;
  });

  const recentTenants = tenants.slice(0, 10).map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    plan: t.plan,
    billingStatus: t.billingStatus,
    aiCreditsUsed: t.aiCreditsUsed,
    aiCreditsLimit: t.aiCreditsLimit,
    onboardingCompleted: t.onboardingCompleted,
    activationScore: t.activationScore,
    createdAt: t.createdAt.toISOString(),
  }));

  res.json({
    totalTenants: tenants.length,
    totalUsers: users.length,
    totalAiCreditsUsed: totalUsage,
    planDistribution: Object.entries(planDistribution).map(([plan, count]) => ({ plan, count })),
    statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({ status, count })),
    recentTenants,
    metrics: {
      activeTenants: tenants.filter(t => t.billingStatus === "active").length,
      trialTenants: tenants.filter(t => t.trialEndsAt && t.trialEndsAt > new Date()).length,
      onboardedTenants: tenants.filter(t => t.onboardingCompleted).length,
      paidTenants: tenants.filter(t => t.plan !== "free").length,
    },
  });
});

router.get("/admin/tenants", async (req, res): Promise<void> => {
  if (!(await requirePlatformAdmin(req, res))) return;

  const tenants = await db.select().from(tenantsTable).orderBy(desc(tenantsTable.createdAt));
  res.json(tenants.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    plan: t.plan,
    billingStatus: t.billingStatus,
    aiCreditsUsed: t.aiCreditsUsed,
    aiCreditsLimit: t.aiCreditsLimit,
    storageUsedMb: t.storageUsedMb,
    storageLimitMb: t.storageLimitMb,
    onboardingCompleted: t.onboardingCompleted,
    activationScore: t.activationScore,
    trialEndsAt: t.trialEndsAt?.toISOString() || null,
    createdAt: t.createdAt.toISOString(),
  })));
});

router.get("/admin/feature-flags", async (req, res): Promise<void> => {
  if (!(await requirePlatformAdmin(req, res))) return;
  const flags = await db.select().from(featureFlagsTable).orderBy(featureFlagsTable.key);
  res.json(flags);
});

router.put("/admin/feature-flags/:key", async (req, res): Promise<void> => {
  if (!(await requirePlatformAdmin(req, res))) return;
  const key = req.params.key as string;
  const { isEnabled, targetPlans } = req.body;

  const [existing] = await db.select().from(featureFlagsTable).where(eq(featureFlagsTable.key, key)).limit(1);

  if (existing) {
    const [flag] = await db.update(featureFlagsTable).set({
      isEnabled: isEnabled !== undefined ? isEnabled : existing.isEnabled,
      targetPlans: targetPlans || existing.targetPlans,
    }).where(eq(featureFlagsTable.id, existing.id)).returning();
    res.json(flag);
  } else {
    const [flag] = await db.insert(featureFlagsTable).values({
      key,
      name: req.body.name || key,
      description: req.body.description || "",
      isEnabled: isEnabled || false,
      targetPlans: targetPlans || [],
    }).returning();
    res.json(flag);
  }
});

router.get("/admin/integrations-health", async (req, res): Promise<void> => {
  if (!(await requirePlatformAdmin(req, res))) return;

  const integrations = await db.select().from(integrationsTable);
  const providerCounts: Record<string, { connected: number; errored: number; total: number }> = {};
  integrations.forEach(i => {
    if (!providerCounts[i.provider]) providerCounts[i.provider] = { connected: 0, errored: 0, total: 0 };
    providerCounts[i.provider].total++;
    if (i.status === "connected") providerCounts[i.provider].connected++;
    if (i.status === "error") providerCounts[i.provider].errored++;
  });

  res.json(Object.entries(providerCounts).map(([provider, counts]) => ({ provider, ...counts })));
});

export default router;
