/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LandingPage — Public landing/marketing page for Plant Lab Inventory.
 *
 * Phase 10.4 — Landing & onboarding page.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
    ArrowRight,
    BarChart3,
    FlaskConical,
    Leaf,
    Lock,
    Sprout,
    TestTube,
    Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

/* ─── Feature Data ──────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Sprout,
    title: "Plant & Species Management",
    description:
      "Track plant samples, varieties, and species with rich metadata, images, and lifecycle data.",
  },
  {
    icon: Wrench,
    title: "Equipment Tracking",
    description:
      "Monitor lab equipment status, schedule maintenance, and manage borrowing records.",
  },
  {
    icon: FlaskConical,
    title: "Experiment Tracking",
    description:
      "Design experiments, track growth data, and record propagation outcomes.",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description:
      "Manage contracts, payments, and client relationships with real-time analytics.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description:
      "Fine-grained permissions for admins, lab managers, researchers, and students.",
  },
  {
    icon: TestTube,
    title: "Lab Services",
    description:
      "Handle external service requests, track fees, and manage client deliverables.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Navigation Bar ── */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Plant Lab
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Leaf className="h-3.5 w-3.5 text-emerald-500" />
            Laboratory Inventory Management System
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-[1.1]">
            Manage your plant lab
            <br />
            <span className="text-primary">with precision</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive inventory management system for agricultural
            research labs. Track samples, experiments, equipment, and business
            operations — all in one place.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link to="/register">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.15), transparent)",
          }}
        />
      </section>

      {/* ── Features Grid ── */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From seedling tracking to financial reporting, Plant Lab covers
              the full lifecycle of agricultural research management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12+", label: "Modules" },
              { value: "RBAC", label: "Role Access" },
              { value: "Real-time", label: "Analytics" },
              { value: "REST", label: "API Ready" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Ready to streamline your lab?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join research teams using Plant Lab to manage their inventory,
            experiments, and business operations.
          </p>
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link to="/register">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            <span>Plant Lab Inventory</span>
          </div>
          <p>Built for agricultural research</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feature Card ──────────────────────────────────────────────────────── */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
