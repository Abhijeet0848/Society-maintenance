"use client";

import React, { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // In a real app, we would call a server action here
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex items-center justify-center py-20">
      <GlassCard className="w-full max-w-md flex flex-col gap-8 p-10 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-2">
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Access your society dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <Mail className="absolute left-3 top-[38px] text-muted-foreground" size={18} />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-[38px] text-muted-foreground" size={18} />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-primary" />
              <span>Remember me</span>
            </label>
            <Link href="#" className="text-primary hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" className="w-full py-3 text-lg font-bold">
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register your society</Link>
        </div>
      </GlassCard>
    </div>
  );
}
