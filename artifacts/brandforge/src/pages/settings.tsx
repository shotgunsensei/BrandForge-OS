import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetTenant, useUpdateTenant, useListMembers, useGetUsage, getGetTenantQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Settings, CreditCard, Users, Shield, Zap, ArrowUpRight,
  Mail, Plus, Check, Globe, Link2, Building2,
} from "lucide-react";
import { Link } from "wouter";

const planLimits: Record<string, { credits: number; price: string; seats: number; brands: number }> = {
  free: { credits: 50, price: "Free", seats: 1, brands: 1 },
  starter: { credits: 200, price: "$19/mo", seats: 2, brands: 3 },
  growth: { credits: 1000, price: "$59/mo", seats: 5, brands: 10 },
  agency: { credits: 5000, price: "$149/mo", seats: 15, brands: 25 },
  enterprise: { credits: 999999, price: "Custom", seats: 999, brands: 999 },
};

const integrations = [
  { name: "Meta Ads", desc: "Facebook & Instagram advertising", status: "available", icon: "📘" },
  { name: "Google Ads", desc: "Search & display campaigns", status: "available", icon: "🔍" },
  { name: "Mailchimp", desc: "Email marketing automation", status: "available", icon: "📧" },
  { name: "LinkedIn", desc: "Professional network ads & posts", status: "coming_soon", icon: "💼" },
  { name: "Slack", desc: "Team notifications", status: "coming_soon", icon: "💬" },
  { name: "HubSpot", desc: "CRM & marketing automation", status: "coming_soon", icon: "🟠" },
];

export default function SettingsPage() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { data: tenant } = useGetTenant(tenantId!, { query: { enabled: !!tenantId } });
  const { data: members } = useListMembers(tenantId!, { query: { enabled: !!tenantId } });
  const { data: usage } = useGetUsage(tenantId!, { query: { enabled: !!tenantId } });
  const updateTenant = useUpdateTenant();
  const [name, setName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

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
  const creditsUsed = usage?.creditsUsed || 0;
  const creditsLimit = usage?.creditsLimit || info.credits;
  const creditPercent = creditsLimit > 0 ? Math.round((creditsUsed / creditsLimit) * 100) : 0;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your workspace, billing, team, and integrations</p>
        </div>

        <Tabs defaultValue="workspace">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="workspace" className="text-xs"><Building2 className="h-3.5 w-3.5 mr-1.5" /> Workspace</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs"><CreditCard className="h-3.5 w-3.5 mr-1.5" /> Billing</TabsTrigger>
            <TabsTrigger value="team" className="text-xs"><Users className="h-3.5 w-3.5 mr-1.5" /> Team</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs"><Link2 className="h-3.5 w-3.5 mr-1.5" /> Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Workspace Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Workspace Name</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={name} onChange={e => setName(e.target.value)} />
                    <Button onClick={handleSave} disabled={updateTenant.isPending} className="rounded-full">Save</Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Workspace Slug</Label>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{tenant?.slug}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Current Plan</CardTitle>
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <Link href="/pricing"><ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Upgrade</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
                    {plan[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold capitalize">{plan} Plan</div>
                    <div className="text-sm text-muted-foreground">{info.price}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold">{info.brands}</div>
                    <div className="text-[10px] text-muted-foreground">Brands</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold">{info.seats}</div>
                    <div className="text-[10px] text-muted-foreground">Team Seats</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold">{info.credits}</div>
                    <div className="text-[10px] text-muted-foreground">AI Credits/mo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">AI Credits Usage</CardTitle>
                  <Badge variant="secondary" className={`text-xs ${creditPercent > 80 ? "text-red-500" : "text-green-600"}`}>
                    {creditPercent}% used
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${creditPercent > 80 ? "bg-red-500" : creditPercent > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(creditPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{creditsUsed} credits used</span>
                  <span className="font-medium">{creditsLimit - creditsUsed} remaining</span>
                </div>
                {creditPercent > 80 && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/50">
                    <p className="text-xs text-red-700 dark:text-red-400">You're running low on AI credits. Upgrade your plan for more.</p>
                    <Button variant="outline" size="sm" asChild className="mt-2 rounded-full text-xs">
                      <Link href="/pricing">Upgrade Plan</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Team Members</CardTitle>
                  <Badge variant="secondary" className="text-xs">{members?.length || 0} / {info.seats} seats</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!members || members.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No team members</p>
                ) : (
                  members.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {(m.userName || m.userId || "?")[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{m.userName || m.userId}</p>
                          {m.userEmail && <p className="text-[11px] text-muted-foreground">{m.userEmail}</p>}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize text-[10px]">{m.role}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Invite Member</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input placeholder="team@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="flex-1" />
                  <Button className="rounded-full" disabled={!inviteEmail}>
                    <Mail className="h-3.5 w-3.5 mr-1.5" /> Invite
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Team members will receive an email invitation to join your workspace.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map(int => (
                <Card key={int.name} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">{int.icon}</div>
                      <div>
                        <div className="font-semibold text-sm">{int.name}</div>
                        <div className="text-xs text-muted-foreground">{int.desc}</div>
                      </div>
                    </div>
                    {int.status === "coming_soon" ? (
                      <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-full text-xs">Connect</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
