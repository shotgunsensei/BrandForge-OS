import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useGetCampaign, useUpdateCampaign, useListCopyAssets, getGetCampaignQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CampaignDetail({ campaignId }: { campaignId: number }) {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { data: campaign, isLoading } = useGetCampaign(tenantId!, campaignId, { query: { enabled: !!tenantId } });
  const { data: copyAssets } = useListCopyAssets(tenantId!, { campaignId }, { query: { enabled: !!tenantId } });
  const updateCampaign = useUpdateCampaign();
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (campaign) setForm({
      name: campaign.name, objective: campaign.objective || "", status: campaign.status,
      targetAudience: campaign.targetAudience || "", coreMessage: campaign.coreMessage || "",
      offer: campaign.offer || "", notes: campaign.notes || "", budget: campaign.budget || "",
      startDate: campaign.startDate || "", endDate: campaign.endDate || "",
    });
  }, [campaign]);

  const handleSave = () => {
    if (!tenantId) return;
    updateCampaign.mutate(
      { tenantId, campaignId, data: form },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCampaignQueryKey(tenantId, campaignId) }) }
    );
  };

  if (isLoading) return <AppLayout><div className="p-8"><div className="h-8 bg-muted rounded w-48 animate-pulse" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-5xl">
        <div className="flex items-center gap-4">
          <Link href="/campaigns"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{campaign?.name}</h1>
            <p className="text-muted-foreground">Campaign details and assets</p>
          </div>
          <Select value={form.status || "draft"} onValueChange={v => setForm({...form, status: v})}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Campaign Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Name</Label><Input value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>Objective</Label><Textarea value={form.objective || ""} onChange={e => setForm({...form, objective: e.target.value})} rows={3} /></div>
              <div><Label>Core Message</Label><Input value={form.coreMessage || ""} onChange={e => setForm({...form, coreMessage: e.target.value})} /></div>
              <div><Label>Target Audience</Label><Input value={form.targetAudience || ""} onChange={e => setForm({...form, targetAudience: e.target.value})} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Schedule & Budget</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Offer</Label><Input value={form.offer || ""} onChange={e => setForm({...form, offer: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date</Label><Input type="date" value={form.startDate || ""} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.endDate || ""} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
              </div>
              <div><Label>Budget</Label><Input value={form.budget || ""} onChange={e => setForm({...form, budget: e.target.value})} placeholder="$5,000" /></div>
              <div><Label>Notes</Label><Textarea value={form.notes || ""} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSave} disabled={updateCampaign.isPending}>Save Changes</Button>

        <Card>
          <CardHeader><CardTitle className="text-base">Copy Assets</CardTitle></CardHeader>
          <CardContent>
            {!copyAssets || copyAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No copy assets linked to this campaign. Visit Copy Studio to create some.</p>
            ) : (
              <div className="space-y-2">
                {copyAssets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div><p className="font-medium text-sm">{asset.title}</p><p className="text-xs text-muted-foreground">{asset.copyType} - {asset.channel}</p></div>
                    <Badge variant="outline" className="capitalize">{asset.status}</Badge>
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
