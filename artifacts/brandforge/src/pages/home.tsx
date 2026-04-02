import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">BF</div>
          <span className="font-bold text-xl">BrandForge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground font-medium">Pricing</Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground font-medium">Login</Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            The Operating System for Modern Marketers
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Command your entire marketing lifecycle from a single cockpit. AI-powered copy, campaign planning, and analytics built for founders and agencies.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
        
        <div className="rounded-2xl border bg-card p-2 shadow-2xl overflow-hidden aspect-video">
          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center border border-dashed border-border/50 text-muted-foreground font-medium">
            Product Dashboard Preview
          </div>
        </div>
      </main>
    </div>
  );
}
