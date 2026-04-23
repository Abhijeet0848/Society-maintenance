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
  Lock,
  ArrowRight,
  RefreshCw,
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
      const res = await fetchWithAuth(`http://localhost:5000/api/billing/${userId}`);
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
          const res = await fetchWithAuth(`http://localhost:5000/api/billing/pay/${selectedBill._id}`, {
            method: 'POST'
          });
          if (res.ok) {
            setStatus('Payment Verified! Generating Invoice...');
            setTimeout(() => {
                fetchBills();
                setShowPayModal(false);
                setShowInvoice(true); // Open invoice immediately after payment
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
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] bg-emerald-50 p-1 px-3 rounded-full">Financial Center</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Maintenance <span className="text-emerald-600">& Dues</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Review your community invoices and pending dues.</p>
        </div>
        <div className="flex gap-4">
           <GlassCard className="bg-emerald-600 text-white border-none p-6 px-8 rounded-3xl flex items-center gap-4 shadow-xl shadow-emerald-100">
              <div className="p-3 bg-white/20 rounded-2xl"><CreditCard size={28} /></div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Outstanding Balance</p>
                 <p className="text-2xl font-black">₹ {totalUnpaid.toLocaleString()}</p>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900 px-2 tracking-tight">Invoice History</h2>
          
          <div className="flex flex-col gap-4">
             {loading ? (
                [1,2,3].map(i => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-3xl" />)
             ) : bills.length > 0 ? (
               bills.map((bill, i) => (
                 <GlassCard key={i} className="bg-white border-none shadow-sm flex items-center justify-between p-8 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {bill.status === 'PAID' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{bill.month} {bill.year}</h3>
                          <p className="text-xs font-bold text-slate-400">Invoice ID: VAP-{(bill._id || 'INV').slice(-6).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <div className="text-right flex flex-col gap-0.5">
                          <p className="text-xl font-black text-slate-900">₹ {bill.amount.toLocaleString()}</p>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${bill.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{bill.status}</span>
                       </div>
                       {bill.status === 'PAID' ? (
                          <button 
                            onClick={() => {
                                setSelectedBill(bill);
                                setShowInvoice(true);
                            }}
                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-slate-100 shadow-sm"
                            title="View Invoice"
                          >
                             <Download size={20} />
                          </button>
                       ) : (
                          <button 
                            onClick={() => {
                                setSelectedBill(bill);
                                setShowPayModal(true);
                            }}
                            className="btn btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                          >
                             Pay Now
                          </button>
                       )}
                    </div>
                 </GlassCard>
               ))
             ) : (
               <div className="py-20 text-center flex flex-col items-center gap-4 bg-slate-50 rounded-[3rem]">
                  <CreditCard size={48} className="text-slate-200" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No billing records found</p>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <GlassCard className="bg-slate-900 text-white p-8 flex flex-col gap-8 shadow-2xl rounded-[3rem] border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="flex flex-col gap-2 relative z-10">
                 <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight"><ShieldCheck size={20} className="text-blue-400" /> Instant Digital Receipts</h3>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Vrundavan Society uses state-of-the-art secure payment processing for all maintenance dues.</p>
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                 <div className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-4">
                    <span className="text-slate-500 uppercase tracking-widest">Processing Fee</span>
                    <span className="text-emerald-400">₹ 0.00</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">Security Grade</span>
                    <span className="text-blue-400">AES-256</span>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && selectedBill && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isPaying && setShowPayModal(false)}></div>
           <GlassCard className="w-full max-w-xl bg-white border-none shadow-2xl animate-fade-in z-10 p-0 relative overflow-hidden rounded-[3rem]">
              <div className="bg-slate-900 p-10 text-white flex flex-col gap-4 relative overflow-hidden">
                 <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-blue-400">
                       <Lock size={14} /> Secure Checkout
                    </div>
                    {!isPaying && (
                       <button onClick={() => setShowPayModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                          <X size={20} />
                       </button>
                    )}
                 </div>
                 <div className="flex flex-col relative z-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</p>
                    <h2 className="text-4xl font-black tracking-tight">₹ {selectedBill.amount.toLocaleString()}.00</h2>
                 </div>
              </div>

              <div className="p-10 flex flex-col gap-8">
                 {!isPaying ? (
                    <>
                       <div className="flex flex-col gap-6">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><CreditCard className="text-blue-600" size={20} /></div>
                                <div>
                                   <p className="text-xs font-bold text-slate-900 uppercase">Maintenance Invoice</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedBill.month} {selectedBill.year}</p>
                                </div>
                             </div>
                             <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">No Added Fees</div>
                          </div>

                          <div className="flex flex-col gap-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Details</label>
                             <div className="flex flex-col gap-3">
                                <div className="relative">
                                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                   <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" placeholder="0000 0000 0000 0000" readOnly defaultValue="4111 2222 3333 4444" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                   <input type="text" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" placeholder="MM / YY" readOnly defaultValue="12 / 28" />
                                   <input type="password" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" placeholder="CVC" readOnly defaultValue="***" />
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <button 
                           onClick={handlePayment}
                           className="btn btn-primary w-full py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95"
                          >
                             Complete Transaction <ArrowRight size={20} />
                          </button>
                          <p className="text-[10px] text-center text-slate-400 font-medium italic">Payments are processed instantly for Society Hub ledger.</p>
                       </div>
                    </>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-8">
                       <div className="relative">
                          <div className="w-24 h-24 rounded-full border-4 border-slate-50 border-t-blue-600 animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <ShieldCheck className="text-blue-500 animate-pulse" size={32} />
                          </div>
                       </div>
                       <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2">{status}</p>
                          <p className="text-sm font-bold text-slate-400">Please do not refresh or close this window.</p>
                       </div>
                    </div>
                 )}
              </div>
           </GlassCard>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedBill && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowInvoice(false)}></div>
           <GlassCard className="w-full max-w-3xl bg-white border-none shadow-2xl animate-fade-in z-10 p-0 relative overflow-hidden rounded-[3rem]">
              <div className="p-12 flex flex-col gap-10">
                 {/* Invoice Header */}
                 <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">BH</div>
                          <h2 className="text-2xl font-black tracking-tighter text-slate-900">Vrundavan Society</h2>
                       </div>
                       <p className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-1">Official Maintenance Receipt</p>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                       <div className="flex items-center gap-2 justify-end text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
                          <BadgeCheck size={14} /> Transaction Verified
                       </div>
                       <p className="text-sm font-bold text-slate-900">Receipt #VRE-{(selectedBill._id || 'REC').slice(-8).toUpperCase()}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Issued: {new Date().toLocaleDateString()}</p>
                    </div>
                 </div>

                 {/* Bill Summary */}
                 <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-50">
                    <div className="flex flex-col gap-6">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Billed To</p>
                          <p className="text-lg font-bold text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500 font-medium">Flat No: {user.flatNo || 'N/A'}</p>
                          <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                       </div>
                    </div>
                    <div className="flex flex-col gap-6 text-right">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Payment Period</p>
                          <p className="text-lg font-bold text-slate-950">{selectedBill.month} {selectedBill.year}</p>
                          <p className="text-sm text-slate-500 font-medium italic">Status: Fully Discharged</p>
                       </div>
                    </div>
                 </div>

                 {/* Table Body */}
                 <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center px-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Description</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Amount</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600"><FileText size={18} /></div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">Monthly Maintenance Fee</p>
                             <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Building infrastructure & Staff</p>
                          </div>
                       </div>
                       <p className="text-lg font-black text-slate-900">₹ {selectedBill.amount.toLocaleString()}.00</p>
                    </div>
                 </div>

                 {/* Footer & Total */}
                 <div className="flex flex-col md:flex-row justify-between items-end gap-10 mt-6">
                    <div className="flex flex-col gap-3">
                       <div className="w-20 h-20 opacity-10 grayscale">
                          <img src="https://media.istockphoto.com/id/1321462048/vector/qr-code-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=K5Rly-a-C7vE6Pms8A9S8yUfI9VqK4WfC6iV6h5J1wA=" alt="QR" className="w-full h-full object-contain" />
                       </div>
                       <p className="text-[10px] text-slate-300 font-medium max-w-xs leading-relaxed">This is a digitally generated invoice. No physical signature is required under Vrundavan Society Bylaws.</p>
                    </div>
                    <div className="flex flex-col gap-6 items-end w-full md:w-auto">
                       <div className="flex flex-col gap-1 items-end">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid Amount</p>
                          <p className="text-5xl font-black text-slate-900 tracking-tighter">₹ {selectedBill.amount.toLocaleString()}.00</p>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => window.print()}
                            className="btn btn-secondary px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                          >
                             <Printer size={16} /> Print
                          </button>
                          <button onClick={() => setShowInvoice(false)} className="btn btn-primary px-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">Done</button>
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

