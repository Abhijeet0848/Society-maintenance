import { GlassCard } from "../components/ui/GlassCard";
import { CreditCard, Download, Search, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in text-left">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">Vrundavan Society</p>
          <h1 className="text-4xl font-bold">Billing & Maintenance</h1>
          <p className="text-muted-foreground mt-1">Manage your dues and payment history</p>
        </div>
        <button className="btn btn-primary">Pay Total Outstanding</button>
      </div>

      <div className="flex gap-4 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('current')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'current' ? 'text-blue-500' : 'text-muted-foreground hover:text-white'}`}
        >
          Current Dues
          {activeTab === 'current' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'history' ? 'text-blue-500' : 'text-muted-foreground hover:text-white'}`}
        >
          Payment History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
        </button>
      </div>

      {activeTab === 'current' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-6">
            <GlassCard className="p-8 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/5 bg-white/[0.01]">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CreditCard size={32} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">All Dues Paid</h2>
                <p className="text-muted-foreground mt-1">You don't have any outstanding maintenance bills for this month.</p>
              </div>
              <button className="btn btn-secondary text-xs">View Last Receipt</button>
            </GlassCard>
          </div>
          
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-lg">Bill Summary</h3>
             <GlassCard className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-muted-foreground text-sm">Monthly Service</span>
                   <span className="font-bold">₹ 2,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-muted-foreground text-sm">Parking Charges</span>
                   <span className="font-bold">₹ 500</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="font-bold text-lg text-blue-500">Total Amount</span>
                   <span className="font-bold text-lg text-blue-500">₹ 2,500</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                   <AlertCircle size={10} /> Bills are generated on the 1st of every month.
                </p>
             </GlassCard>
          </div>
        </div>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-20 text-center flex flex-col items-center gap-4">
             <Search size={48} className="text-muted-foreground opacity-20" />
             <p className="text-muted-foreground font-medium">Your payment history will appear here once you make your first payment.</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
