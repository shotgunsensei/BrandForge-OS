import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetTenant, useUpdateTenant, useListMembers, useGetUsage, getGetTenantQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const planLimits: Record<string, { credits: number; price: string }> = {
  free: { credits: 50, price: "Free" },
  starter: { credits: 200, price: "$19/mo" },
  growth: { credits: 1000, price: "$59/mo" },
  agency: { credits: 5000, price: "$149/mo" },
  enterprise: { credits: 999999, price: "$399+/mo" },
};

export default function SettingsPage() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { data: tenant } = useGetTenant(tenantId!, { query: { enabled: !!tenantId } });
  const { data: members } = useListMembers(tenantId!, { query: { enabled: !!tenantId } });
  const { data: usage } = useGetUsage(tenantId!, { query: { enabled: !!tenantId } });
  const updateTenant = useUpdateTenant();
  const [name, setName] = useState("");

  useEffect(() => { if (tenant) setName(tenant.name); }, [tenant]);

  const handleSave = () => {
    if (!tenantId) return;
    updateTenant.mutate(
      { tenantId, data: { name } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetTenantQueryKey(tenantId) }) }
    );
  };

  const plan = tenant?.plan || "free";
  const info = planLimits[plan] || planLimits.free;

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your workspace and billing</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Workspace</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Workspace Name</Label><div className="flex gap-2"><Input value={name} onChange={e => setName(e.target.value)} /><Button onClick={handleSave} disabled={updateTenant.isPending}>Save</Button></div></div>
            <div><Label>Slug</Label><p className="text-sm text-muted-foreground">{tenant?.slug}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Plan & Billing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="capitalize text-sm">{plan}</Badge>
              <span className="text-sm text-muted-foreground">{info.price}</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>AI Credits Used</span>
                <span>{usage?.creditsUsed || 0} / {usage?.creditsLimit || info.credits}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${((usage?.creditsUsed || 0) / (usage?.creditsLimit || info.credits)) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Team Members</CardTitle></CardHeader>
          <CardContent>
            {!members || members.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members found.</p>
            ) : (
              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{m.userName || m.userId}</p>
                      {m.userEmail && <p className="text-xs text-muted-foreground">{m.userEmail}</p>}
                    </div>
                    <Badge variant="outline" className="capitalize">{m.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
