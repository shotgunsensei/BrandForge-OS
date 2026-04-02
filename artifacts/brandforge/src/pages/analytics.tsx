import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  const { tenantId } = useTenant();
  const { data: analytics, isLoading } = useGetAnalytics(tenantId!, {}, { query: { enabled: !!tenantId } });

  if (isLoading || !analytics) {
    return (
      <AppLayout>
        <div className="p-8 space-y-4">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />)}</div>
        </div>
      </AppLayout>
    );
  }

  const maxContent = Math.max(...(analytics.contentOutput?.map(d => d.value) || [1]));
  const maxAi = Math.max(...(analytics.aiUsageTrend?.map(d => d.value) || [1]));

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your marketing performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Content Output (30 days)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-[2px] h-40">
                {analytics.contentOutput?.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div className="bg-primary/80 rounded-t-sm min-h-[2px]" style={{ height: `${(d.value / maxContent) * 100}%` }} title={`${d.date}: ${d.value}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{analytics.contentOutput?.[0]?.date}</span>
                <span>{analytics.contentOutput?.[analytics.contentOutput.length - 1]?.date}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">AI Usage Trend (30 days)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-[2px] h-40">
                {analytics.aiUsageTrend?.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div className="bg-violet-500/80 rounded-t-sm min-h-[2px]" style={{ height: `${maxAi > 0 ? (d.value / maxAi) * 100 : 0}%` }} title={`${d.date}: ${d.value}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{analytics.aiUsageTrend?.[0]?.date}</span>
                <span>{analytics.aiUsageTrend?.[analytics.aiUsageTrend.length - 1]?.date}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Channel Breakdown</CardTitle></CardHeader>
            <CardContent>
              {analytics.channelBreakdown?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No channel data yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.channelBreakdown?.map(ch => {
                    const max = Math.max(...(analytics.channelBreakdown?.map(c => c.count) || [1]));
                    return (
                      <div key={ch.channel}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{ch.channel}</span>
                          <span className="text-muted-foreground">{ch.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(ch.count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader>
            <CardContent>
              {!analytics.campaignPerformance || analytics.campaignPerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No campaign performance data yet. Create and run campaigns to see results.</p>
              ) : (
                <div className="space-y-4">
                  {analytics.campaignPerformance.map((cp, i) => (
                    <div key={i}>
                      <p className="font-medium text-sm mb-2">{cp.name}</p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-lg font-bold">{cp.impressions?.toLocaleString()}</p><p className="text-xs text-muted-foreground">Impressions</p></div>
                        <div><p className="text-lg font-bold">{cp.clicks?.toLocaleString()}</p><p className="text-xs text-muted-foreground">Clicks</p></div>
                        <div><p className="text-lg font-bold">{cp.conversions?.toLocaleString()}</p><p className="text-xs text-muted-foreground">Conversions</p></div>
                      </div>
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
