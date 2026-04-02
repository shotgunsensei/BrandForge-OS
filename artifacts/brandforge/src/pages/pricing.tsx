import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["1 Brand", "3 Campaigns", "50 AI Credits/mo", "Basic Analytics", "Copy Studio"], cta: "Get Started" },
  { name: "Starter", price: "$19", period: "/month", features: ["3 Brands", "10 Campaigns", "200 AI Credits/mo", "Full Analytics", "Content Calendar", "Priority Support"], cta: "Start Free Trial" },
  { name: "Growth", price: "$59", period: "/month", popular: true, features: ["10 Brands", "Unlimited Campaigns", "1,000 AI Credits/mo", "Advanced Analytics", "Strategy Workspace", "Team Members (5)", "API Access"], cta: "Start Free Trial" },
  { name: "Agency", price: "$149", period: "/month", features: ["25 Brands", "Unlimited Campaigns", "5,000 AI Credits/mo", "White Label Reports", "Client Management", "Team Members (15)", "Custom Integrations"], cta: "Start Free Trial" },
  { name: "Enterprise", price: "$399+", period: "/month", features: ["Unlimited Brands", "Unlimited Everything", "Unlimited AI Credits", "Dedicated Support", "Custom Onboarding", "SLA Guarantee", "SSO / SAML"], cta: "Contact Sales" },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-card">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">BF</div>
          <span className="font-bold text-xl">BrandForge</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-muted-foreground hover:text-foreground font-medium">Login</Link>
          <Button asChild><Link href="/login">Get Started</Link></Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground">Choose the plan that fits your marketing ambitions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map(plan => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg relative" : ""}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2"><span className="text-3xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">{plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>{f}</span></li>
                ))}</ul>
                <Button asChild variant={plan.popular ? "default" : "outline"} className="w-full"><Link href="/login">{plan.cta}</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
