import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Shield, CreditCard, HelpCircle, Bell, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-12">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-6">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text" style={{ fontSize: '4rem', lineHeight: '1.2' }}>
          Modernize Your <br /> Society Management
        </h1>
        <p className="text-xl max-w-2xl" style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
          A premium, all-in-one platform for residents and committee members to handle billing, complaints, and communication effortlessly.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/login">
            <Button className="text-lg px-8 py-4">Get Started</Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary" className="text-lg px-8 py-4">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-3 gap-6 mt-8">
        <GlassCard className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <CreditCard className="text-primary" size={28} />
          </div>
          <h3 className="text-xl font-bold">Automated Billing</h3>
          <p>Generate maintenance bills, track payments, and send reminders automatically every month.</p>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <HelpCircle className="text-primary" size={28} />
          </div>
          <h3 className="text-xl font-bold">Smart Helpdesk</h3>
          <p>Residents can raise complaints with photos and track resolution status in real-time.</p>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bell className="text-primary" size={28} />
          </div>
          <h3 className="text-xl font-bold">digital Notice Board</h3>
          <p>Share important society updates, meeting minutes, and event flyers instantly.</p>
        </GlassCard>
      </section>

      {/* Stats/Trust Section */}
      <section className="mt-12 glass-card p-12 flex justify-around text-center">
        <div>
          <h2 className="text-4xl font-bold text-primary">500+</h2>
          <p className="text-sm uppercase tracking-wider font-bold mt-2">Active Societies</p>
        </div>
        <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
        <div>
          <h2 className="text-4xl font-bold text-primary">50k+</h2>
          <p className="text-sm uppercase tracking-wider font-bold mt-2">Happy Residents</p>
        </div>
        <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
        <div>
          <h2 className="text-4xl font-bold text-primary">99.9%</h2>
          <p className="text-sm uppercase tracking-wider font-bold mt-2">Billing Accuracy</p>
        </div>
      </section>
    </div>
  );
}
