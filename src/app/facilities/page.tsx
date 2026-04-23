"use client";

import React, { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Coffee, Dumbbell, Users, Calendar, Clock, MapPin } from 'lucide-react';

export default function FacilitiesPage() {
  const facilities = [
    { id: 1, name: "Clubhouse Hall", rate: "₹ 5,000/day", icon: Users, desc: "Perfect for parties and gatherings up to 100 people.", availability: "Available" },
    { id: 2, name: "Fitness Center", rate: "Included", icon: Dumbbell, desc: "Fully equipped gym with modern machines and trainers.", availability: "Open" },
    { id: 3, name: "Co-working Space", rate: "₹ 100/hr", icon: Coffee, desc: "High-speed internet and quiet environment for work.", availability: "Limited" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Facility Booking</h1>
        <p className="text-muted-foreground">Reserve society amenities for your personal events</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {facilities.map(facility => (
          <GlassCard key={facility.id} className="flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <facility.icon className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
              <p className="text-sm text-muted-foreground">{facility.desc}</p>
            </div>
            <div className="flex justify-between items-center py-4" style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground">Rate</p>
                <p className="font-bold">{facility.rate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-black text-muted-foreground">Status</p>
                <p className={`font-bold ${facility.availability === 'Open' || facility.availability === 'Available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {facility.availability}
                </p>
              </div>
            </div>
            <Button className="w-full">Check Availability</Button>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar size={20} className="text-primary" /> My Recent Bookings</h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary"><Users size={20} /></div>
              <div>
                <h4 className="font-bold">Clubhouse Hall</h4>
                <p className="text-xs text-muted-foreground">Oct 28, 2023 • 10:00 AM - 08:00 PM</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Confirmed</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
