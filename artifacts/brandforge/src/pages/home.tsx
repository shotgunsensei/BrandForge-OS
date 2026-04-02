import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette, PenTool, Megaphone, BarChart3, Calendar, Lightbulb, Zap, Shield,
  Users, ArrowRight, Check, Star, ChevronDown, Workflow, Globe, Layers
} from "lucide-react";

const features = [
  { icon: Palette, title: "Brand HQ", desc: "Centralize brand identity, voice, colors, and guidelines in one place. Every piece of content stays on-brand." },
  { icon: PenTool, title: "AI Copy Studio", desc: "Generate high-converting copy for ads, emails, social posts, and landing pages with channel-specific AI." },
  { icon: Megaphone, title: "Campaign Builder", desc: "Plan, execute, and track multi-channel campaigns with templates, checklists, and linked assets." },
  { icon: Calendar, title: "Content Calendar", desc: "Schedule and visualize your content pipeline. Filter by channel, campaign, or status." },
  { icon: Workflow, title: "AI Workflows", desc: "Launch guided AI workflows for product launches, content plans, and ad campaigns — all brand-aware." },
  { icon: BarChart3, title: "Analytics & Insights", desc: "Track performance across campaigns with AI-powered recommendations to improve results." },
];

const plans = [
  { name: "Free", price: "$0", annual: "$0", features: ["1 Brand", "3 Campaigns", "50 AI Credits/mo", "Basic Analytics"] },
  { name: "Starter", price: "$19", annual: "$15", features: ["3 Brands", "10 Campaigns", "200 AI Credits/mo", "Full Analytics", "Content Calendar"] },
  { name: "Growth", price: "$59", annual: "$47", popular: true, features: ["10 Brands", "Unlimited Campaigns", "1,000 AI Credits/mo", "Advanced Analytics", "Strategy Workspace", "5 Team Members"] },
  { name: "Agency", price: "$149", annual: "$119", features: ["25 Brands", "Unlimited Everything", "5,000 AI Credits/mo", "White Label", "Client Management", "15 Team Members"] },
];

const testimonials = [
  { name: "Sarah Chen", role: "Founder, GlowUp Beauty", text: "BrandForge replaced 4 different tools for us. Our content output tripled in the first month." },
  { name: "Marcus Johnson", role: "CEO, Velocity Agency", text: "Managing 12 client brands was chaos before BrandForge. Now our team operates from one dashboard." },
  { name: "Priya Patel", role: "CMO, ScaleKit", text: "The AI workflows are genuinely useful — not generic fluff. It understands our brand voice perfectly." },
];

const faqs = [
  { q: "How is BrandForge different from other marketing tools?", a: "BrandForge is an all-in-one marketing OS, not a point solution. It combines brand management, AI copy, campaign planning, content calendar, and analytics in one platform — all connected and brand-aware." },
  { q: "Can I manage multiple brands or clients?", a: "Yes. Our Agency plan supports up to 25 brands with team collaboration, client review mode, and workspace isolation. Enterprise supports unlimited brands." },
  { q: "How does the AI work?", a: "Our AI is brand-aware — it learns your voice, audience, and positioning to generate contextual copy, strategies, and campaign ideas. It's not generic; it's personalized to your business." },
  { q: "Is there a free plan?", a: "Yes! Our Free plan includes 1 brand, 3 campaigns, and 50 AI credits per month. No credit card required." },
  { q: "Can I cancel anytime?", a: "Absolutely. No contracts, no hidden fees. Cancel anytime from your settings page." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-sm">B</div>
            <span className="font-bold text-lg tracking-tight">BrandForge</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground font-medium hidden sm:block">Log in</Link>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/login">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              AI-powered marketing for modern teams
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              The Operating System<br />
              <span className="gradient-brand-text">for Modern Marketing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Command your entire marketing lifecycle from one platform. AI-powered copy, campaign management, content calendar, and analytics — built for founders, agencies, and growing teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild className="rounded-full px-8 text-base h-12">
                <Link href="/login">Start Free — No Credit Card <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 text-base h-12">
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Setup in 2 min</span>
            </div>
          </div>
        </section>

        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border bg-card p-2 shadow-2xl overflow-hidden">
              <div className="w-full aspect-[16/9] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-2 p-6 opacity-60">
                  <div className="col-span-2 row-span-6 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                  <div className="col-span-3 row-span-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                  <div className="col-span-3 row-span-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                  <div className="col-span-4 row-span-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                  <div className="col-span-5 row-span-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                  <div className="col-span-5 row-span-4 bg-white dark:bg-slate-800 rounded-lg border shadow-sm" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">B</div>
                  <p className="text-lg font-semibold text-foreground">Your Marketing Command Center</p>
                  <p className="text-sm text-muted-foreground mt-1">Dashboard, Brand HQ, Campaigns, Copy Studio & more</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-y bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div><div className="text-3xl font-bold">10k+</div><div className="text-sm text-muted-foreground">Marketers</div></div>
              <div><div className="text-3xl font-bold">2M+</div><div className="text-sm text-muted-foreground">Copy Generated</div></div>
              <div><div className="text-3xl font-bold">500+</div><div className="text-sm text-muted-foreground">Agencies</div></div>
              <div><div className="text-3xl font-bold">4.9</div><div className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> Rating</div></div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need. Nothing you don't.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Stop juggling 6 different tools. BrandForge gives you one connected platform for your entire marketing operation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} className="group hover:shadow-md hover:border-primary/20 transition-all duration-200">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30 border-y">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-lg text-muted-foreground">From setup to results in three simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Set up your brand", desc: "Answer a few questions about your business, audience, and goals. BrandForge generates your brand snapshot, ICP, and messaging pillars automatically." },
                { step: "2", title: "Create & launch", desc: "Use AI workflows to generate copy, plan campaigns, and schedule content. Everything stays connected and on-brand." },
                { step: "3", title: "Optimize & grow", desc: "Track performance, get AI recommendations, and continuously improve your marketing with data-driven insights." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">{s.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by marketing teams</h2>
              <p className="text-lg text-muted-foreground">See what founders and agencies say about BrandForge</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}</div>
                    <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 px-6 bg-muted/30 border-y">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground">Start free. Scale when you're ready.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((p) => (
                <Card key={p.name} className={`relative ${p.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-brand text-white text-xs font-medium">Most Popular</div>
                  )}
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-4xl font-bold">{p.price}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant={p.popular ? "default" : "outline"} className="w-full rounded-full">
                      <Link href="/login">{p.name === "Free" ? "Get Started" : "Start Free Trial"}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Need more? <Link href="/pricing" className="text-primary hover:underline font-medium">Enterprise plans start at $399/mo</Link> with unlimited everything.
            </p>
          </div>
        </section>

        <section id="faq" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your marketing?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join thousands of teams running their marketing on BrandForge.</p>
            <Button size="lg" asChild className="rounded-full px-10 text-base h-12">
              <Link href="/login">Start for Free <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-xs">B</div>
                <span className="font-bold">BrandForge</span>
              </div>
              <p className="text-sm text-muted-foreground">The marketing OS for modern teams.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Features</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Pricing</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Templates</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Integrations</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">About</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Blog</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Careers</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Contact</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Privacy</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Terms</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Security</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BrandForge OS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
