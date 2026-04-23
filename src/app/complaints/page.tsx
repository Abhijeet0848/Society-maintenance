"use client";

import React, { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HelpCircle, Plus, Search, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function ComplaintsPage() {
  const [isAdding, setIsAdding] = useState(false);

  const complaints = [
    { id: 1, title: 'Water Leakage in Bathroom', status: 'OPEN', date: 'Oct 14, 2023', category: 'Plumbing' },
    { id: 2, title: 'Elevator Not Working', status: 'RESOLVED', date: 'Oct 10, 2023', category: 'Common Area' },
    { id: 3, title: 'Garbage Collection Issue', status: 'RESOLVED', date: 'Oct 05, 2023', category: 'Sanitation' },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Helpdesk</h1>
          <p className="text-muted-foreground">Report issues and track resolutions</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
          {isAdding ? 'Cancel' : <><Plus size={18} /> New Complaint</>}
        </Button>
      </div>

      {isAdding && (
        <GlassCard className="p-8 animate-fade-in border-primary/30">
          <h2 className="text-xl font-bold mb-6">Raise New Complaint</h2>
          <form className="grid grid-cols-2 gap-6">
            <Input label="Complaint Title" placeholder="Brief summary of the issue" />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <select className="input-field">
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Sanitation</option>
                <option>Common Area</option>
                <option>Security</option>
              </select>
            </div>
            <div className="flex flex-col gap-2" style={{ gridColumn: 'span 2' }}>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <textarea 
                className="input-field" 
                rows={4} 
                placeholder="Provide detailed information about the problem..."
                style={{ resize: 'none' }}
              ></textarea>
            </div>
            <div className="flex gap-4" style={{ gridColumn: 'span 2' }}>
              <Button type="submit">Submit Complaint</Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-4">
            <select className="bg-transparent border-none text-sm font-bold text-muted-foreground outline-none cursor-pointer hover:text-white">
              <option>All Status</option>
              <option>Open</option>
              <option>Resolved</option>
            </select>
            <select className="bg-transparent border-none text-sm font-bold text-muted-foreground outline-none cursor-pointer hover:text-white">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {complaints.map(complaint => (
            <GlassCard key={complaint.id} className="flex justify-between items-center p-6 transition-all hover:border-primary/50">
              <div className="flex gap-6 items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${complaint.status === 'OPEN' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {complaint.status === 'OPEN' ? <Clock size={24} /> : <CheckCircle size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/10 text-white/60 tracking-wider">
                      {complaint.category}
                    </span>
                    <span className="text-xs text-muted-foreground">ID: #C-{complaint.id}42</span>
                  </div>
                  <h3 className="text-lg font-bold">{complaint.title}</h3>
                  <p className="text-xs text-muted-foreground">Reported on {complaint.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className={`text-xs font-bold uppercase tracking-widest ${complaint.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {complaint.status}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Last updated 2h ago</p>
                </div>
                <Button variant="secondary" className="p-3">
                  <MessageSquare size={18} />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
