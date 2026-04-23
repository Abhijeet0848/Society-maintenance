import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Phone, Mail, Home, Search, Filter } from 'lucide-react';

export default function ResidentsPage() {
  const residents = [
    { name: "Amit Sharma", flat: "402-A", phone: "+91 98765 43210", email: "amit@example.com", status: "Owner" },
    { name: "Priya Patel", flat: "105-B", phone: "+91 87654 32109", email: "priya@example.com", status: "Tenant" },
    { name: "Rahul Verma", flat: "302-C", phone: "+91 76543 21098", email: "rahul@example.com", status: "Owner" },
    { name: "Suman Singh", flat: "501-A", phone: "+91 65432 10987", email: "suman@example.com", status: "Owner" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resident Directory</h1>
          <p className="text-muted-foreground">List of all families in the society</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Search flat or name..." className="input-field pl-10 w-64" />
          </div>
          <button className="btn btn-secondary px-3"><Filter size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {residents.map((res, i) => (
          <GlassCard key={i} className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {res.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{res.name}</h3>
                  <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-white/10 text-white/70">
                    {res.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Flat Number</p>
                <p className="text-xl font-bold text-primary">{res.flat}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-primary" />
                <span>{res.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-primary" />
                <span className="truncate">{res.email}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
