import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useTenant } from "@/lib/tenant-context";
import { useListCopyAssets, useCreateCopyAsset, useDeleteCopyAsset, useGenerateAiCopy, getListCopyAssetsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PenTool, Sparkles, Trash2, Copy } from "lucide-react";

const copyTypes = ["headline", "body", "subject_line", "social_post", "ad_copy", "email", "landing_page", "tagline", "cta"];
const channels = ["social", "email", "ads", "seo", "content", "website"];

export default function CopyStudio() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { data: copyAssets, isLoading } = useListCopyAssets(tenantId!, {}, { query: { enabled: !!tenantId } });
  const createCopyAsset = useCreateCopyAsset();
  const deleteCopyAsset = useDeleteCopyAsset();
  const generateAiCopy = useGenerateAiCopy();
  const [createOpen, setCreateOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", copyType: "headline", channel: "social", tone: "" });
  const [aiForm, setAiForm] = useState({ copyType: "headline", prompt: "", tone: "", channel: "social", audience: "", length: "" });
  const [generated, setGenerated] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = copyAssets?.filter(a => typeFilter === "all" || a.copyType === typeFilter) || [];

  const handleCreate = () => {
    if (!tenantId || !form.title) return;
    createCopyAsset.mutate(
      { tenantId, data: form },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCopyAssetsQueryKey(tenantId) }); setCreateOpen(false); } }
    );
  };

  const handleGenerate = () => {
    if (!tenantId || !aiForm.prompt) return;
    generateAiCopy.mutate(
      { tenantId, data: aiForm },
      { onSuccess: (data) => { setGenerated(data.variants || []); } }
    );
  };

  const handleSaveGenerated = (variant: any) => {
    if (!tenantId) return;
    createCopyAsset.mutate(
      { tenantId, data: { title: variant.title, content: variant.content, copyType: aiForm.copyType, channel: aiForm.channel, tone: aiForm.tone } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCopyAssetsQueryKey(tenantId) }) }
    );
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Copy Studio</h1>
            <p className="text-muted-foreground">Create and manage marketing copy with AI</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={aiOpen} onOpenChange={setAiOpen}>
              <DialogTrigger asChild><Button variant="outline"><Sparkles className="h-4 w-4 mr-2" /> AI Generate</Button></DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>AI Copy Generator</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Copy Type</Label>
                      <Select value={aiForm.copyType} onValueChange={v => setAiForm({...aiForm, copyType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{copyTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Channel</Label>
                      <Select value={aiForm.channel} onValueChange={v => setAiForm({...aiForm, channel: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{channels.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label>Prompt</Label><Textarea value={aiForm.prompt} onChange={e => setAiForm({...aiForm, prompt: e.target.value})} placeholder="Describe what you want to write about..." rows={3} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Tone (optional)</Label><Input value={aiForm.tone} onChange={e => setAiForm({...aiForm, tone: e.target.value})} placeholder="Professional, casual..." /></div>
                    <div><Label>Audience (optional)</Label><Input value={aiForm.audience} onChange={e => setAiForm({...aiForm, audience: e.target.value})} placeholder="Small business owners..." /></div>
                  </div>
                  <Button onClick={handleGenerate} disabled={generateAiCopy.isPending || !aiForm.prompt} className="w-full">
                    {generateAiCopy.isPending ? "Generating..." : "Generate 3 Variants"}
                  </Button>
                  {generated.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {generated.map((v, i) => (
                        <Card key={i}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm">{v.title}</h4>
                              <Button size="sm" variant="outline" onClick={() => handleSaveGenerated(v)}><Plus className="h-3 w-3 mr-1" /> Save</Button>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{v.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Asset</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Copy Asset</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Hero headline for launch" /></div>
                  <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Type</Label>
                      <Select value={form.copyType} onValueChange={v => setForm({...form, copyType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{copyTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Channel</Label>
                      <Select value={form.channel} onValueChange={v => setForm({...form, channel: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{channels.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleCreate} disabled={!form.title || !form.content} className="w-full">Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant={typeFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("all")}>All</Button>
          {copyTypes.map(t => (
            <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)} className="capitalize">{t.replace(/_/g, " ")}</Button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No copy assets yet</h3>
            <p className="text-muted-foreground mb-4">Create copy manually or use AI to generate it.</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setAiOpen(true)}><Sparkles className="h-4 w-4 mr-2" /> AI Generate</Button>
              <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" /> Create Manual</Button>
            </div>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(asset => (
              <Card key={asset.id} className="group">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{asset.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">{asset.copyType.replace(/_/g, " ")}</Badge>
                        {asset.channel && <Badge variant="outline" className="text-xs capitalize">{asset.channel}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigator.clipboard.writeText(asset.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => tenantId && deleteCopyAsset.mutate({ tenantId, copyAssetId: asset.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCopyAssetsQueryKey(tenantId) }) })}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{asset.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
