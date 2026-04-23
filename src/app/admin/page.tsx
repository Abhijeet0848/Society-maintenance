import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, CreditCard, Shield, AlertTriangle, FileText, Settings, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const adminStats = [
    { title: "Total Collection", value: "₹ 1.2M", icon: BarChart, color: "text-primary" },
    { title: "Pending Dues", value: "₹ 45k", icon: AlertTriangle, color: "text-red-400" },
    { title: "Unresolved Issues", value: "12", icon: Settings, color: "text-amber-400" },
    { title: "Active Residents", value: "148", icon: Users, color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-muted-foreground">Manage your society operations efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary">Generate All Bills</Button>
          <Button variant="secondary">Download PDF Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {adminStats.map((stat, i) => (
          <GlassCard key={i} className="flex flex-col gap-2">
            <stat.icon className={`${stat.color} mb-2`} size={24} />
            <p className="text-xs text-muted-foreground uppercase font-black">{stat.title}</p>
            <h2 className="text-2xl font-bold">{stat.value}</h2>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <GlassCard className="flex flex-col gap-4">
          <h3 className="font-bold border-bottom pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/residents" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary transition-all text-decoration-none color-inherit">
              <Users size={20} className="text-primary" />
              <span className="font-bold">Resident Directory</span>
            </Link>
            <Link href="/notices" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary transition-all text-decoration-none color-inherit">
              <FileText size={20} className="text-primary" />
              <span className="font-bold">Broadcast Notice</span>
            </Link>
            <Link href="/maintenance" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary transition-all text-decoration-none color-inherit">
              <CreditCard size={20} className="text-primary" />
              <span className="font-bold">Bill Management</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary transition-all text-decoration-none color-inherit">
              <Settings size={20} className="text-primary" />
              <span className="font-bold">System Settings</span>
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 className="font-bold border-bottom pb-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>Revenue Trends</h3>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">This Month</span>
                <span className="text-xl font-bold">₹ 142,500</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <TrendingUp size={14} /> +12% from last month
              </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-center text-muted-foreground">85% of residents have paid this month's maintenance</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

const Button = ({ variant = 'primary', children, ...props }: any) => (
  <button className={`btn btn-${variant}`} {...props}>{children}</button>
);
const TrendingUp = ({ className, size }: any) => (
  <span className={className} style={{ width: size, height: size }}>↗</span>
);
