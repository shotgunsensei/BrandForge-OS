import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetDashboard, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Megaphone, PenTool, Calendar, Zap, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { tenantId } = useTenant();
  const { data: dashboard, isLoading } = useGetDashboard(tenantId!, { query: { enabled: !!tenantId } });
  const { data: activity } = useGetRecentActivity(tenantId!, { limit: 10 }, { query: { enabled: !!tenantId } });

  if (isLoading || !dashboard) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-lg" />)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: "Brands", value: dashboard.totalBrands, icon: Palette, color: "text-violet-500" },
    { label: "Campaigns", value: dashboard.totalCampaigns, icon: Megaphone, color: "text-blue-500" },
    { label: "Active Campaigns", value: dashboard.activeCampaigns, icon: TrendingUp, color: "text-green-500" },
    { label: "Copy Assets", value: dashboard.totalCopyAssets, icon: PenTool, color: "text-orange-500" },
    { label: "Calendar Items", value: dashboard.totalCalendarItems, icon: Calendar, color: "text-pink-500" },
    { label: "AI Credits", value: `${dashboard.aiCreditsUsed}/${dashboard.aiCreditsLimit}`, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your marketing command center</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Status</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.campaignsByStatus.length === 0 ? (
                <p className="text-sm text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
              ) : (
                <div className="space-y-3">
                  {dashboard.campaignsByStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">{item.status}</Badge>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {!activity || activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet. Start creating content to see your feed.</p>
              ) : (
                <div className="space-y-3">
                  {activity.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="capitalize font-medium">{item.action}</span>{" "}
                        <span className="text-muted-foreground">{item.entityType}:</span>{" "}
                        <span>{item.entityName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Copy Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.recentCopyAssets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No copy assets yet. Visit Copy Studio to create some.</p>
              ) : (
                <div className="space-y-3">
                  {dashboard.recentCopyAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <div className="truncate flex-1 mr-2">
                        <p className="font-medium text-sm truncate">{asset.title}</p>
                        <p className="text-xs text-muted-foreground">{asset.copyType}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">{asset.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.upcomingCalendarItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming items. Plan your content calendar.</p>
              ) : (
                <div className="space-y-3">
                  {dashboard.upcomingCalendarItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="truncate flex-1 mr-2">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.scheduledDate}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">{item.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
