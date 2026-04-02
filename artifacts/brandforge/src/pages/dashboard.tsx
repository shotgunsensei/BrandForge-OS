import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetDashboard, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Palette, Megaphone, PenTool, Calendar, Zap, TrendingUp,
  ArrowRight, Lightbulb, AlertTriangle, ArrowUpRight, Plus,
} from "lucide-react";

const recommendations = [
  { icon: Lightbulb, text: "Create your first brand to unlock AI-powered copy generation", action: "/brands", priority: "high" },
  { icon: AlertTriangle, text: "You haven't published any content in the last 7 days", action: "/calendar", priority: "medium" },
  { icon: TrendingUp, text: "Try shorter hook variants for your paid ad campaigns", action: "/copy-studio", priority: "low" },
];

export default function Dashboard() {
  const { tenantId } = useTenant();
  const { data: dashboard, isLoading } = useGetDashboard(tenantId!, { query: { enabled: !!tenantId } });
  const { data: activity } = useGetRecentActivity(tenantId!, { limit: 10 }, { query: { enabled: !!tenantId } });

  if (isLoading || !dashboard) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1,2].map(i => <div key={i} className="h-64 bg-muted rounded-xl" />)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const creditPercent = dashboard.aiCreditsLimit > 0 ? Math.round((dashboard.aiCreditsUsed / dashboard.aiCreditsLimit) * 100) : 0;
  const creditColor = creditPercent > 80 ? "text-red-500" : creditPercent > 50 ? "text-yellow-500" : "text-green-500";

  const stats = [
    { label: "Total Brands", value: dashboard.totalBrands, icon: Palette, color: "bg-violet-500/10 text-violet-500", change: "+2 this month" },
    { label: "Active Campaigns", value: dashboard.activeCampaigns, icon: Megaphone, color: "bg-blue-500/10 text-blue-500", change: `${dashboard.totalCampaigns} total` },
    { label: "Copy Assets", value: dashboard.totalCopyAssets, icon: PenTool, color: "bg-orange-500/10 text-orange-500", change: "Across all brands" },
    { label: "AI Credits", value: `${dashboard.aiCreditsUsed}`, icon: Zap, color: "bg-amber-500/10 text-amber-500", change: `of ${dashboard.aiCreditsLimit} used` },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Your marketing command center</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link href="/copy-studio"><PenTool className="h-3.5 w-3.5 mr-1.5" /> New Copy</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full">
              <Link href="/campaigns"><Plus className="h-3.5 w-3.5 mr-1.5" /> New Campaign</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                <div className="text-[11px] text-muted-foreground/70 mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">AI Credits Usage</CardTitle>
                  <Badge variant="secondary" className={`text-xs ${creditColor}`}>{creditPercent}% used</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${creditPercent > 80 ? "bg-red-500" : creditPercent > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(creditPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{dashboard.aiCreditsUsed} credits used</span>
                  <span className="font-medium">{dashboard.aiCreditsLimit - dashboard.aiCreditsUsed} remaining</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Campaign Status</CardTitle>
                  <Link href="/campaigns" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
                </div>
              </CardHeader>
              <CardContent>
                {dashboard.campaignsByStatus.length === 0 ? (
                  <div className="py-8 text-center">
                    <Megaphone className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground mb-3">No campaigns yet</p>
                    <Button size="sm" variant="outline" asChild className="rounded-full">
                      <Link href="/campaigns">Create your first campaign</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {dashboard.campaignsByStatus.map((item: any) => (
                      <div key={item.status} className="p-3 bg-muted/50 rounded-xl text-center">
                        <div className="text-xl font-bold">{item.count}</div>
                        <div className="text-xs text-muted-foreground capitalize mt-0.5">{item.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Copy Assets</CardTitle>
                  <Link href="/copy-studio" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
                </div>
              </CardHeader>
              <CardContent>
                {dashboard.recentCopyAssets.length === 0 ? (
                  <div className="py-8 text-center">
                    <PenTool className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground mb-3">No copy assets yet</p>
                    <Button size="sm" variant="outline" asChild className="rounded-full">
                      <Link href="/copy-studio">Create with AI</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dashboard.recentCopyAssets.map((asset: any) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="min-w-0 mr-3">
                          <p className="font-medium text-sm truncate">{asset.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{asset.copyType?.replace(/_/g, " ")}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] capitalize shrink-0">{asset.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, i) => (
                  <Link key={i} href={rec.action}>
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        rec.priority === "high" ? "bg-red-500/10 text-red-500" :
                        rec.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        <rec.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug">{rec.text}</p>
                        <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Take action <ArrowUpRight className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Activity Feed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {!activity || activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {activity.slice(0, 6).map((item: any) => (
                      <div key={item.id} className="flex items-start gap-2.5 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                        <div className="min-w-0">
                          <span className="capitalize font-medium">{item.action}</span>{" "}
                          <span className="text-muted-foreground">{item.entityType}:</span>{" "}
                          <span className="truncate">{item.entityName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Upcoming</CardTitle>
                  <Link href="/calendar" className="text-sm text-primary hover:underline flex items-center gap-1">Calendar <ArrowRight className="h-3 w-3" /></Link>
                </div>
              </CardHeader>
              <CardContent>
                {dashboard.upcomingCalendarItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nothing scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dashboard.upcomingCalendarItems.slice(0, 4).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                        <div className="min-w-0 mr-2">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground">{item.scheduledDate}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] capitalize shrink-0">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
