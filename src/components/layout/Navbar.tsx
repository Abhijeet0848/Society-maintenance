import React from 'react';
import Link from 'next/link';
import { Home, Shield, Bell, HelpCircle, CreditCard, Calendar, Users } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="glass-card mb-4" style={{ borderRadius: '0 0 1rem 1rem', padding: '1rem 2rem' }}>
      <div className="flex justify-between items-center max-width-1200 mx-auto">
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <Shield className="text-primary" size={24} />
          <span className="gradient-text font-bold text-xl" style={{ fontSize: '1.25rem' }}>SocietyPro</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/maintenance" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <CreditCard size={18} /> Billing
          </Link>
          <Link href="/complaints" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <HelpCircle size={18} /> Helpdesk
          </Link>
          <Link href="/facilities" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Calendar size={18} /> Facilities
          </Link>
          <Link href="/residents" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Users size={18} /> Residents
          </Link>
          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Shield size={18} className="text-amber-400" /> Admin
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold hover:scale-105 transition-all text-decoration-none">
            JD
          </Link>
        </div>
      </div>
    </nav>
  );
};
