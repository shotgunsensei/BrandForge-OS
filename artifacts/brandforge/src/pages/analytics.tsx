import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, Zap, PenTool, Megaphone, BarChart3,
  Lightbulb, AlertTriangle, ArrowUpRight, Eye, MousePointerClick, Target,
  Sparkles,
} from "lucide-react";

const aiRecommendations = [
  { icon: AlertTriangle, text: "Your landing page is missing proof elements — add testimonials or case studies", type: "warning" },
  { icon: Lightbulb, text: "Try shorter hook variants for paid ads — under 6 words tend to perform 2x better", type: "tip" },
  { icon: TrendingUp, text: "Create retargeting variants for your best-performing copy assets", type: "growth" },
  { icon: AlertTriangle, text: "You haven't published any content in the last 8 days", type: "warning" },
  { icon: Lightbulb, text: "Your audience targeting seems too broad for the current offer — try narrowing to 2-3 specific segments", type: "tip" },
  { icon: Target, text: "This campaign has no clear CTA — adding a specific CTA could improve conversions by 30%", type: "growth" },
];

const mockMetrics = [
  { label: "Total Impressions", value: "47.2K", change: "+12.4%", up: true, icon: Eye },
  { label: "Total Clicks", value: "3,841", change: "+8.7%", up: true, icon: MousePointerClick },
  { label: "Avg. Conversion", value: "3.2%", change: "-0.4%", up: false, icon: Target },
  { label: "Content Produced", value: "156", change: "+24", up: true, icon: PenTool },
];

export default function Analytics() {
  const { tenantId } = useTenant();
  const { data: analytics, isLoading } = useGetAnalytics(tenantId!, {}, { query: { enabled: !!tenantId } });

  if (isLoading || !analytics) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div>
        </div>
      </AppLayout>
    );
  }

  const maxContent = Math.max(...(analytics.contentOutput?.map((d: any) => d.value) || [1]));
  const maxAi = Math.max(...(analytics.aiUsageTrend?.map((d: any) => d.value) || [1]));

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">Track performance and get AI-powered insights</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map(m => (
            <Card key={m.label} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <m.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className={`text-[10px] ${m.up ? "text-green-600" : "text-red-500"}`}>
                    {m.up ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                    {m.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold tracking-tight">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Content Output (30 days)</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Daily</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-[3px] h-44">
                  {analytics.contentOutput?.map((d: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group relative">
                      <div
                        className="bg-primary/70 hover:bg-primary rounded-t-sm min-h-[2px] transition-colors cursor-default"
                        style={{ height: `${maxContent > 0 ? (d.value / maxContent) * 100 : 0}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {d.date}: {d.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-1">
                  <span>{analytics.contentOutput?.[0]?.date}</span>
                  <span>{analytics.contentOutput?.[analytics.contentOutput.length - 1]?.date}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">AI Credits Usage (30 days)</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Daily</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-[3px] h-36">
                  {analytics.aiUsageTrend?.map((d: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group relative">
                      <div
                        className="bg-violet-500/70 hover:bg-violet-500 rounded-t-sm min-h-[2px] transition-colors cursor-default"
                        style={{ height: `${maxAi > 0 ? (d.value / maxAi) * 100 : 0}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {d.date}: {d.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-1">
                  <span>{analytics.aiUsageTrend?.[0]?.date}</span>
                  <span>{analytics.aiUsageTrend?.[analytics.aiUsageTrend.length - 1]?.date}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.channelBreakdown?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No channel data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {analytics.channelBreakdown?.map((ch: any) => {
                        const max = Math.max(...(analytics.channelBreakdown?.map((c: any) => c.count) || [1]));
                        return (
                          <div key={ch.channel}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium capitalize">{ch.channel}</span>
                              <span className="text-muted-foreground">{ch.count} items</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(ch.count / max) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {!analytics.campaignPerformance || analytics.campaignPerformance.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Run campaigns to see performance data</p>
                  ) : (
                    <div className="space-y-4">
                      {analytics.campaignPerformance.map((cp: any, i: number) => (
                        <div key={i} className="p-3 bg-muted/30 rounded-lg">
                          <p className="font-medium text-sm mb-2">{cp.name}</p>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div><p className="text-lg font-bold">{cp.impressions?.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Impressions</p></div>
                            <div><p className="text-lg font-bold">{cp.clicks?.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Clicks</p></div>
                            <div><p className="text-lg font-bold">{cp.conversions?.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Conversions</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200 dark:border-amber-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      rec.type === "warning" ? "bg-yellow-500/10 text-yellow-600" :
                      rec.type === "tip" ? "bg-blue-500/10 text-blue-500" :
                      "bg-green-500/10 text-green-600"
                    }`}>
                      <rec.icon className="h-3 w-3" />
                    </div>
                    <p className="text-xs leading-relaxed">{rec.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Active Campaigns", value: analytics.campaignPerformance?.length || 0, icon: Megaphone },
                  { label: "Total Assets", value: analytics.contentOutput?.reduce((s: number, d: any) => s + d.value, 0) || 0, icon: PenTool },
                  { label: "AI Sessions", value: analytics.aiUsageTrend?.reduce((s: number, d: any) => s + d.value, 0) || 0, icon: Zap },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <s.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{s.label}</span>
                    </div>
                    <span className="font-bold text-sm">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

