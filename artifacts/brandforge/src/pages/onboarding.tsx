import { useState } from "react";
import { useTenant } from "@/lib/tenant-context";
import { useCreateTenant, useCompleteOnboarding, getListTenantsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

const industries = ["Technology", "E-commerce", "Healthcare", "Finance", "Education", "Real Estate", "Food & Beverage", "Fitness", "Fashion", "Consulting", "Agency", "Other"];
const businessTypes = ["B2B", "B2C", "B2B2C", "D2C", "Marketplace", "SaaS"];
const goalOptions = ["Brand Awareness", "Lead Generation", "Sales Growth", "Customer Retention", "Content Marketing", "Social Media Growth", "SEO/Organic Traffic", "Paid Advertising"];
const channelOptions = ["Instagram", "Twitter/X", "LinkedIn", "Facebook", "YouTube", "TikTok", "Email", "Blog", "Google Ads", "SEO"];

export default function Onboarding() {
  const { tenantId, setTenantId } = useTenant();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const createTenant = useCreateTenant();
  const completeOnboarding = useCompleteOnboarding();
  const [step, setStep] = useState(0);
  const [createdTenantId, setCreatedTenantId] = useState<number | null>(tenantId);
  const [form, setForm] = useState({
    businessName: "", industry: "", businessType: "", products: "", idealCustomer: "",
    geoMarket: "", tone: "", competitors: "", goals: [] as string[], channels: [] as string[], brandColors: [] as string[],
  });

  const toggleGoal = (g: string) => setForm(f => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g] }));
  const toggleChannel = (c: string) => setForm(f => ({ ...f, channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c] }));

  const handleCreateWorkspace = () => {
    if (!form.businessName) return;
    createTenant.mutate(
      { data: { name: form.businessName, industry: form.industry, businessType: form.businessType } },
      {
        onSuccess: (data) => {
          setCreatedTenantId(data.id);
          setTenantId(data.id);
          queryClient.invalidateQueries({ queryKey: getListTenantsQueryKey() });
          setStep(1);
        },
      }
    );
  };

  const handleComplete = () => {
    const tid = createdTenantId;
    if (!tid) return;
    completeOnboarding.mutate(
      { tenantId: tid, data: form },
      { onSuccess: () => setLocation("/dashboard") }
    );
  };

  const steps = [
    {
      title: "Your Business",
      content: (
        <div className="space-y-4">
          <div><Label>Business Name</Label><Input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder="Acme Corp" /></div>
          <div><Label>Industry</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">{industries.map(i => (
              <Button key={i} variant={form.industry === i ? "default" : "outline"} size="sm" onClick={() => setForm({...form, industry: i})}>{i}</Button>
            ))}</div>
          </div>
          <div><Label>Business Type</Label>
            <div className="flex flex-wrap gap-2 mt-1">{businessTypes.map(t => (
              <Button key={t} variant={form.businessType === t ? "default" : "outline"} size="sm" onClick={() => setForm({...form, businessType: t})}>{t}</Button>
            ))}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Your Audience",
      content: (
        <div className="space-y-4">
          <div><Label>Products / Services</Label><Textarea value={form.products} onChange={e => setForm({...form, products: e.target.value})} placeholder="Describe your main products or services..." rows={3} /></div>
          <div><Label>Ideal Customer</Label><Textarea value={form.idealCustomer} onChange={e => setForm({...form, idealCustomer: e.target.value})} placeholder="Describe your ideal customer..." rows={3} /></div>
          <div><Label>Geographic Market</Label><Input value={form.geoMarket} onChange={e => setForm({...form, geoMarket: e.target.value})} placeholder="US, Global, Southeast Asia..." /></div>
        </div>
      ),
    },
    {
      title: "Brand & Voice",
      content: (
        <div className="space-y-4">
          <div><Label>Brand Tone</Label><Input value={form.tone} onChange={e => setForm({...form, tone: e.target.value})} placeholder="Professional, playful, authoritative, empathetic..." /></div>
          <div><Label>Competitors</Label><Textarea value={form.competitors} onChange={e => setForm({...form, competitors: e.target.value})} placeholder="List your main competitors..." rows={2} /></div>
        </div>
      ),
    },
    {
      title: "Goals & Channels",
      content: (
        <div className="space-y-4">
          <div><Label>Marketing Goals</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">{goalOptions.map(g => (
              <Button key={g} variant={form.goals.includes(g) ? "default" : "outline"} size="sm" onClick={() => toggleGoal(g)} className="justify-start">{g}</Button>
            ))}</div>
          </div>
          <div><Label>Active Channels</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">{channelOptions.map(c => (
              <Button key={c} variant={form.channels.includes(c) ? "default" : "outline"} size="sm" onClick={() => toggleChannel(c)}>{c}</Button>
            ))}</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">BF</div>
            <span className="font-bold text-lg">BrandForge</span>
          </div>
          <div className="flex gap-1 mb-4">{steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>
          <CardTitle>{step === 0 && !createdTenantId ? "Set Up Your Workspace" : steps[step]?.title || "Complete"}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && !createdTenantId ? (
            <div className="space-y-4">
              {steps[0].content}
              <Button onClick={handleCreateWorkspace} disabled={!form.businessName || createTenant.isPending} className="w-full">
                Create Workspace <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : step < steps.length ? (
            <div className="space-y-4">
              {steps[step].content}
              <div className="flex justify-between">
                {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft className="h-4 w-4 mr-2" /> Back</Button>}
                <Button onClick={() => setStep(step + 1)} className="ml-auto">
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"><Check className="h-8 w-8 text-green-600" /></div>
              <h3 className="text-xl font-semibold">All Set!</h3>
              <p className="text-muted-foreground">Your workspace is ready. Let's start building your marketing engine.</p>
              <Button onClick={handleComplete} disabled={completeOnboarding.isPending} size="lg">
                Go to Dashboard <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
