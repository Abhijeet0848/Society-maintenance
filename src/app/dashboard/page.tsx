import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard, HelpCircle, Bell, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for initial UI
  const stats = [
    { title: "Maintenance Due", value: "₹ 2,500", icon: CreditCard, color: "text-red-400" },
    { title: "Pending Complaints", value: "3", icon: HelpCircle, color: "text-amber-400" },
    { title: "New Notices", value: "2", icon: Bell, color: "text-blue-400" },
    { title: "Residents", value: "124", icon: Users, color: "text-emerald-400" },
  ];

  const recentNotices = [
    { id: 1, title: "Annual General Meeting", date: "Oct 15, 2023", priority: "High" },
    { id: 2, title: "Elevator Maintenance Schedule", date: "Oct 12, 2023", priority: "Medium" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resident Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John Doe (Flat 402)</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div> Active Resident
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Recent Maintenance Bills */}
        <div className="grid-span-2 flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard size={20} className="text-primary" /> Maintenance Overview
          </h2>
          <GlassCard className="p-0 overflow-hidden">
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">Period</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">Amount</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">Status</th>
                  <th className="p-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td className="p-4 font-medium">October 2023</td>
                  <td className="p-4">₹ 2,500.00</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">Unpaid</span>
                  </td>
                  <td className="p-4">
                    <Link href="/maintenance" className="text-primary hover:underline font-bold text-sm">Pay Now</Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">September 2023</td>
                  <td className="p-4">₹ 2,500.00</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold">Paid</span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">Downloaded</td>
                </tr>
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Notices Sidebar */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell size={20} className="text-primary" /> Recent Notices
          </h2>
          <div className="flex flex-col gap-4">
            {recentNotices.map(notice => (
              <GlassCard key={notice.id} className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${notice.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {notice.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">{notice.date}</span>
                </div>
                <h4 className="font-bold">{notice.title}</h4>
                <Link href="/notices" className="text-xs text-primary font-bold hover:underline">Read more →</Link>
              </GlassCard>
            ))}
            <Link href="/notices">
              <button className="w-full btn btn-secondary text-sm">View All Notices</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
