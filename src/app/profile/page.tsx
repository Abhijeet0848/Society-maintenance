import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Shield, Lock, Bell, HelpCircle, Phone, Mail, Home } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-6">
          <GlassCard className="flex flex-col items-center gap-4 py-10">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              JD
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-muted-foreground flex items-center justify-center gap-1">
                <Home size={14} /> Flat 402, Wing A
              </p>
            </div>
            <button className="btn btn-secondary text-xs mt-2 px-6">Change Avatar</button>
          </GlassCard>

          <GlassCard className="p-0 overflow-hidden">
            <div className="flex flex-col">
              <button className="flex items-center gap-4 p-4 text-left glass-card" style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid var(--glass-border)', background: 'hsl(var(--primary) / 0.1)' }}>
                <User size={20} className="text-primary" />
                <span className="font-bold">Edit Profile</span>
              </button>
              <button className="flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-all" style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid var(--glass-border)' }}>
                <Lock size={20} className="text-muted-foreground" />
                <span className="font-bold">Change Password</span>
              </button>
              <button className="flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-all" style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid var(--glass-border)' }}>
                <Bell size={20} className="text-muted-foreground" />
                <span className="font-bold">Notification Preferences</span>
              </button>
              <button className="flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-all" style={{ border: 'none', borderRadius: 0 }}>
                <Shield size={20} className="text-muted-foreground" />
                <span className="font-bold">Privacy & Security</span>
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="grid-span-2" style={{ gridColumn: 'span 2' }}>
          <GlassCard className="p-10 flex flex-col gap-8">
            <h3 className="text-xl font-bold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <input type="text" className="input-field" defaultValue="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input type="email" className="input-field" defaultValue="john@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input type="tel" className="input-field" defaultValue="+91 98765 43210" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
                <input type="tel" className="input-field" placeholder="+91 XXXX XXXX" />
              </div>
            </div>

            <h3 className="text-xl font-bold mt-4">Flat Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Flat No</label>
                <input type="text" className="input-field" defaultValue="402" disabled />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Wing</label>
                <input type="text" className="input-field" defaultValue="A" disabled />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Occupancy</label>
                <input type="text" className="input-field" defaultValue="Owner" disabled />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="btn btn-primary px-10">Save Changes</button>
              <button className="btn btn-secondary">Discard</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
