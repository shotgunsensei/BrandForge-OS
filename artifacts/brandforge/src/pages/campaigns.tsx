import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useListCampaigns, useCreateCampaign, useDeleteCampaign, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, Trash2 } from "lucide-react";
import { Link } from "wouter";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-500",
};

export default function Campaigns() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: campaigns, isLoading } = useListCampaigns(tenantId!, {}, { query: { enabled: !!tenantId } });
  const createCampaign = useCreateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", objective: "", status: "draft", coreMessage: "" });

  const filtered = campaigns?.filter(c => statusFilter === "all" || c.status === statusFilter) || [];

  const handleCreate = () => {
    if (!tenantId || !form.name) return;
    createCampaign.mutate(
      { tenantId, data: form },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey(tenantId) }); setOpen(false); setForm({ name: "", objective: "", status: "draft", coreMessage: "" }); } }
    );
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">Plan and manage your marketing campaigns</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Campaign</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Campaign Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Q1 Product Launch" /></div>
                <div><Label>Objective</Label><Textarea value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} placeholder="What's the goal of this campaign?" /></div>
                <div><Label>Core Message</Label><Input value={form.coreMessage} onChange={e => setForm({...form, coreMessage: e.target.value})} placeholder="The key message you want to convey" /></div>
                <Button onClick={handleCreate} disabled={!form.name} className="w-full">Create Campaign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          {["all", "draft", "active", "paused", "completed"].map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">Create your first campaign to start planning your marketing.</p>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Create Campaign</Button>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(campaign => (
              <Card key={campaign.id} className="group">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <Link href={`/campaigns/${campaign.id}`}>
                      <h3 className="font-semibold hover:text-primary cursor-pointer">{campaign.name}</h3>
                    </Link>
                    {campaign.objective && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{campaign.objective}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[campaign.status] || ""}`}>{campaign.status}</span>
                      {campaign.startDate && <span className="text-xs text-muted-foreground">{campaign.startDate} - {campaign.endDate || "Ongoing"}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => tenantId && deleteCampaign.mutate({ tenantId, campaignId: campaign.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey(tenantId) }) })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
