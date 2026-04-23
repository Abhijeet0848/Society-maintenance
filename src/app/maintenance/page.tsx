"use client";

import React, { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CreditCard, Download, History, ArrowUpRight } from 'lucide-react';

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState('current');

  const bills = [
    { id: 1, month: 'October', year: 2023, amount: 2500, status: 'PENDING', due: 'Oct 31, 2023' },
    { id: 2, month: 'September', year: 2023, amount: 2500, status: 'PAID', paidOn: 'Sep 05, 2023' },
    { id: 3, month: 'August', year: 2023, amount: 2500, status: 'PAID', paidOn: 'Aug 04, 2023' },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Billing</h1>
          <p className="text-muted-foreground">Manage and track your society dues</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'current' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Active Bills
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Billing History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="grid-span-2 flex flex-col gap-6" style={{ gridColumn: 'span 2' }}>
          {bills.filter(b => activeTab === 'history' ? b.status === 'PAID' : b.status === 'PENDING').map(bill => (
            <GlassCard key={bill.id} className="flex justify-between items-center p-8">
              <div className="flex gap-6 items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bill.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{bill.month} {bill.year} Maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    {bill.status === 'PAID' ? `Paid on ${bill.paidOn}` : `Due by ${bill.due}`}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <p className="text-2xl font-bold">₹ {bill.amount.toLocaleString()}</p>
                {bill.status === 'PENDING' ? (
                  <Button className="flex items-center gap-2">
                    Pay Now <ArrowUpRight size={18} />
                  </Button>
                ) : (
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Download size={18} /> Receipt
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
          {bills.filter(b => activeTab === 'history' ? b.status === 'PAID' : b.status === 'PENDING').length === 0 && (
            <GlassCard className="py-20 text-center flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                <History size={40} />
              </div>
              <p className="text-xl font-medium">All caught up! No pending bills.</p>
            </GlassCard>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <GlassCard className="p-8 bg-primary/10 border-primary/20">
            <h3 className="text-lg font-bold mb-4">Quick Summary</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-bold text-red-400">₹ 2,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Advance Paid</span>
                <span className="font-bold text-emerald-400">₹ 0.00</span>
              </div>
              <div style={{ height: '1px', background: 'var(--glass-border)' }}></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Due</span>
                <span>₹ 2,500.00</span>
              </div>
            </div>
            <Button className="w-full mt-6 py-4">Pay All Dues</Button>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 bg-[#FF5F00]/10 flex items-center justify-center rounded">
                  <span className="text-[10px] font-black text-[#FF5F00]">MC</span>
                </div>
                <span className="text-sm font-medium">•••• 4582</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded">
                  <span className="text-[10px] font-black text-blue-400">UPI</span>
                </div>
                <span className="text-sm font-medium">john@okaxis</span>
              </div>
            </div>
            <button className="w-full mt-4 text-xs font-bold text-primary hover:underline">Manage methods</button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
