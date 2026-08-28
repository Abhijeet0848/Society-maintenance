import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  X,
  ArrowRight,
  Printer,
  FileText,
  BadgeCheck
} from 'lucide-react';

export const MaintenancePage = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id || user.id;

  useEffect(() => {
    if (userId) {
       fetchBills();
    } else {
       setLoading(false);
    }
  }, [userId]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/billing/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
         setBills(data);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    setStatus('Authenticating with Secure Gateway...');
    
    setTimeout(async () => {
        try {
          const res = await fetchWithAuth(`/api/billing/pay/${selectedBill._id}`, {
            method: 'POST'
          });
          if (res.ok) {
            setStatus('Payment Verified! Generating Invoice...');
            setTimeout(() => {
                fetchBills();
                setShowPayModal(false);
                setShowInvoice(true);
                setIsPaying(false);
                setStatus('');
            }, 1500);
          }
        } catch (err) {
          setStatus('Payment Failed. Please try again.');
          setIsPaying(false);
        }
    }, 2000);
  };

  const totalUnpaid = bills.filter(b => b.status === 'PENDING').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-emerald-700 font-black uppercase tracking-wider text-[10px] sm:text-xs bg-emerald-50 border border-emerald-200 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Financial Portal</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Maintenance <span className="text-emerald-600">& Dues</span>
          </h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-lg mt-0.5 sm:mt-1">Review your community invoices and pending dues.</p>
        </div>
        <div className="w-full md:w-auto">
           <GlassCard className="bg-emerald-600 text-white border-none p-4 sm:p-6 px-5 sm:px-8 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 shadow-xl shadow-emerald-100">
              <div className="p-2.5 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl"><CreditCard size={22} className="sm:w-7 sm:h-7" /></div>
              <div>
                 <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-90">Outstanding Balance</p>
                 <p className="text-xl sm:text-2xl font-black">₹ {totalUnpaid.toLocaleString()}</p>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 px-1 tracking-tight">Invoice History</h2>
          
          <div className="flex flex-col gap-3 sm:gap-4">
             {loading ? (
                [1,2,3].map(i => <div key={i} className="h-24 sm:h-28 bg-slate-100 animate-pulse rounded-2xl sm:rounded-3xl" />)
             ) : bills.length > 0 ? (
               bills.map((bill, i) => (
                 <GlassCard key={i} className="bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-8 hover:shadow-lg transition-all group rounded-2xl sm:rounded-3xl">
                    <div className="flex items-center gap-3 sm:gap-6">
                       <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {bill.status === 'PAID' ? <CheckCircle2 size={22} className="sm:w-7 sm:h-7" /> : <AlertCircle size={22} className="sm:w-7 sm:h-7" />}
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <h3 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">{bill.month} {bill.year}</h3>
                          <p className="text-xs font-bold text-slate-600">Invoice ID: VAP-{(bill._id || 'INV').slice(-6).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                       <div className="text-left sm:text-right flex flex-col gap-0.5">
                          <p className="text-lg sm:text-2xl font-black text-slate-900">₹ {bill.amount.toLocaleString()}</p>
                          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${bill.status === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>{bill.status}</span>
                       </div>
                       {bill.status === 'PAID' ? (
                          <button 
                            onClick={() => {
                                setSelectedBill(bill);
                                setShowInvoice(true);
                            }}
                            className="p-2.5 sm:p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-slate-200 shadow-sm shrink-0 font-bold"
                            title="View Invoice"
                          >
                             <Download size={18} />
                          </button>
                       ) : (
                          <button 
                            onClick={() => {
                                setSelectedBill(bill);
                                setShowPayModal(true);
                            }}
                            className="btn btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-100 shrink-0 active:scale-95"
                          >
                             Pay Now
                          </button>
                       )}
                    </div>
                 </GlassCard>
               ))
             ) : (
               <div className="py-12 sm:py-20 text-center flex flex-col items-center gap-4 bg-slate-50 rounded-3xl sm:rounded-[3rem] border border-slate-200">
                  <CreditCard size={40} className="text-slate-300 sm:w-12 sm:h-12" />
                  <p className="text-slate-600 font-bold text-xs uppercase tracking-wider">No billing records found</p>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
           <GlassCard className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border-none shadow-xl flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <h4 className="font-extrabold text-base sm:text-lg">Payment Guarantee</h4>
                 <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-medium">All digital transactions are encrypted via 256-bit SSL protocols and reconciled against the society ledger automatically.</p>
              </div>
           </GlassCard>
        </div>
      </div>

      {showPayModal && selectedBill && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isPaying && setShowPayModal(false)}></div>
           <GlassCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] relative">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-600">Secure Payment Terminal</span>
                 </div>
                 {!isPaying && (
                   <button onClick={() => setShowPayModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <X size={18} />
                   </button>
                 )}
              </div>

              <div className="flex flex-col gap-6 mt-4">
                 {!isPaying ? (
                    <>
                       <div className="flex flex-col items-center text-center gap-1">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{selectedBill.month} {selectedBill.year} Maintenance</p>
                          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">₹ {selectedBill.amount.toLocaleString()}.00</h2>
                       </div>
                       <div className="flex flex-col gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Credit / Debit Card</span>
                             <div className="flex gap-1.5">
                                <div className="w-7 h-4 bg-blue-600 rounded" />
                                <div className="w-7 h-4 bg-amber-500 rounded" />
                             </div>
                          </div>
                          <div className="flex flex-col gap-3">
                             <input type="text" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none shadow-sm" placeholder="Card Number" readOnly defaultValue="4532 •••• •••• 8821" />
                             <div className="grid grid-cols-2 gap-3">
                                <input type="text" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none shadow-sm" placeholder="MM / YY" readOnly defaultValue="12 / 28" />
                                <input type="password" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none shadow-sm" placeholder="CVC" readOnly defaultValue="***" />
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-3">
                          <button 
                           onClick={handlePayment}
                           className="btn btn-primary w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider shadow-xl shadow-blue-100 flex items-center justify-center gap-2 rounded-2xl active:scale-95"
                          >
                             Complete Transaction <ArrowRight size={18} />
                          </button>
                          <p className="text-xs text-center text-slate-500 font-medium">Payments are processed instantly for Society Hub ledger.</p>
                       </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-6">
                       <div className="relative">
                          <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <ShieldCheck className="text-blue-600 animate-pulse" size={28} />
                          </div>
                       </div>
                       <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-1">{status}</p>
                          <p className="text-xs font-bold text-slate-500">Please do not refresh or close this window.</p>
                       </div>
                    </div>
                 )}
              </div>
           </GlassCard>
        </div>
      )}

      {showInvoice && selectedBill && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowInvoice(false)}></div>
           <GlassCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-0 relative overflow-hidden rounded-3xl sm:rounded-[3rem]">
              <div className="p-5 sm:p-12 flex flex-col gap-6 sm:gap-10">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">VS</div>
                          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">Vrundavan Society</h2>
                       </div>
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Official Maintenance Receipt</p>
                    </div>
                    <div className="text-left sm:text-right flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-0.5 w-max sm:w-auto">
                          <BadgeCheck size={14} className="text-emerald-600" /> Transaction Verified
                       </div>
                       <p className="text-xs sm:text-sm font-extrabold text-slate-900">Receipt #VRE-{(selectedBill._id || 'REC').slice(-8).toUpperCase()}</p>
                       <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Issued: {new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 py-4 sm:py-8 border-y border-slate-200">
                    <div>
                       <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Billed To</p>
                       <p className="text-base sm:text-lg font-black text-slate-900">{user.name}</p>
                       <p className="text-xs sm:text-sm text-slate-700 font-semibold">Flat No: {user.flatNo || 'N/A'}</p>
                       <p className="text-xs sm:text-sm text-slate-600 font-medium">{user.email}</p>
                    </div>
                    <div className="text-left sm:text-right">
                       <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Payment Period</p>
                       <p className="text-base sm:text-lg font-black text-slate-900">{selectedBill.month} {selectedBill.year}</p>
                       <p className="text-xs sm:text-sm text-emerald-700 font-bold">Status: Fully Discharged</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-200">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100"><FileText size={16} /></div>
                          <div>
                             <p className="text-xs sm:text-sm font-extrabold text-slate-900">Monthly Maintenance Fee</p>
                             <p className="text-xs text-slate-600 font-medium">Building infrastructure & Staff</p>
                          </div>
                       </div>
                       <p className="text-base sm:text-lg font-black text-slate-900">₹ {selectedBill.amount.toLocaleString()}.00</p>
                    </div>
                 </div>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-2">
                    <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">This is a digitally generated invoice. No physical signature is required under Vrundavan Society Bylaws.</p>
                    <div className="flex flex-col gap-4 items-start md:items-end w-full md:w-auto">
                       <div className="flex flex-col gap-0.5 items-start md:items-end">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Paid Amount</p>
                          <p className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">₹ {selectedBill.amount.toLocaleString()}.00</p>
                       </div>
                       <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => window.print()}
                            className="btn btn-secondary px-5 flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider border-slate-300"
                          >
                             <Printer size={14} /> Print
                          </button>
                          <button onClick={() => setShowInvoice(false)} className="btn btn-primary px-6 flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider active:scale-95">Done</button>
                       </div>
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};
