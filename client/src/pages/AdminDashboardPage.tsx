import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Users, 
  CreditCard, 
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Search,
  Key,
  Plus
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    residents: 0,
    complaints: 0,
    collection: '0%',
    reserve: '₹ 0k',
    recentIssues: [] as any[],
    recentBookings: [] as any[]
  });
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [residentsDues, setResidentsDues] = useState<any[]>([]);
  const [maintenanceValue, setMaintenanceValue] = useState(2500);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [keyStatus, setKeyStatus] = useState('');

  useEffect(() => {
    fetchStats();
    fetchConfig();
    fetchResidentsDues();
  }, []);

  const fetchStats = () => {
    fetchWithAuth('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setStats(data);
      })
      .catch(err => console.error('Error fetching stats:', err));
  };

  const fetchResidentsDues = () => {
    fetchWithAuth('/api/admin/residents-dues')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           setResidentsDues(data);
        }
      })
      .catch(err => console.error('Error fetching residents dues:', err));
  };

  const fetchConfig = () => {
    fetchWithAuth('/api/config/maintenance_fee')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'number') setMaintenanceValue(data);
      })
      .catch(err => console.error('Error fetching maintenance fee:', err));

    fetchWithAuth('/api/config/admin_registration_key')
      .then(res => res.json())
      .then(data => {
        if (data) setAdminKey(data);
        else setAdminKey('SOCIETY2024');
      })
      .catch(err => console.error('Error fetching admin key:', err));
  };

  const handleUpdateFee = async () => {
    setLoading(true);
    setSaveStatus('');
    try {
      const response = await fetchWithAuth('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'maintenance_fee', value: maintenanceValue }),
      });
      if (response.ok) {
        setSaveStatus('Success! Fee updated.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      setSaveStatus('Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayment = async (userId: string) => {
    setRequestingId(userId);
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    try {
      const response = await fetchWithAuth('/api/admin/request-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: maintenanceValue, month, year }),
      });
      if (response.ok) {
        setTimeout(() => {
            fetchResidentsDues();
            fetchStats();
            setRequestingId(null);
        }, 1000);
      } else {
        setRequestingId(null);
      }
    } catch (err) {
      console.error('Failed to request payment:', err);
      setRequestingId(null);
    }
  };

  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', priority: 'Medium' });
  const [publishing, setPublishing] = useState(false);

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const response = await fetchWithAuth('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm),
      });
      if (response.ok) {
        setNoticeForm({ title: '', content: '', priority: 'Medium' });
        alert('Official Notice Published Successfully!');
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to publish notice:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' }),
      });
      if (response.ok) {
        fetchStats(); 
      }
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
    }
  };

  const generateAndSaveKey = async () => {
    setKeyLoading(true);
    setKeyStatus('');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newKey = '';
    for (let i = 0; i < 8; i++) {
      newKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      const response = await fetchWithAuth('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'admin_registration_key', value: newKey }),
      });
      if (response.ok) {
        setAdminKey(newKey);
        setKeyStatus('New key active!');
        setTimeout(() => setKeyStatus(''), 3000);
      }
    } catch (err) {
      setKeyStatus('Generation failed.');
    } finally {
      setKeyLoading(false);
    }
  };

  const statConfig = [
    { title: "Total Residents", value: stats.residents, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Current Collection", value: stats.collection, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Active Issues", value: stats.complaints, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Financial Reserve", value: stats.reserve, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <p className="text-amber-600 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] bg-amber-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Management Control Center</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Society Hub Admin
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Vrundavan Society • Real-time Infrastructure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statConfig.map((stat, i) => (
          <GlassCard key={i} className="border-none shadow-sm hover:shadow-lg transition-all bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
          <div className="flex justify-between items-end">
             <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Rapid Infrastructure Management</h2>
             <span className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest">Live Data Feed</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
             <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl sm:rounded-3xl">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white"><CreditCard size={18} /></div>
                      <h3 className="font-bold text-base sm:text-lg">Monthly Fee</h3>
                   </div>
                   <div className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase tracking-widest">Billing</div>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Base Maintenance Amount</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input 
                           type="number" 
                           className="w-full pl-8 pr-3 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                           value={maintenanceValue}
                           onChange={(e) => setMaintenanceValue(Number(e.target.value))}
                        />
                     </div>
                     <button 
                        className="btn btn-primary px-4 sm:px-6 py-2 sm:py-3 text-xs font-bold shrink-0" 
                        onClick={handleUpdateFee}
                        disabled={loading}
                     >
                        {loading ? '...' : 'Update'}
                     </button>
                   </div>
                   {saveStatus && <p className="text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-widest animate-fade-in">{saveStatus}</p>}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Updates all future resident invoices automatically.</p>
             </GlassCard>

              <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl sm:rounded-3xl">
                 <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white"><MessageSquare size={18} /></div>
                    <h3 className="font-bold text-base sm:text-lg">Bulletin Broadcast</h3>
                 </div>
                 <form onSubmit={handlePublishNotice} className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Notice Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Annual General Meeting" 
                         className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                         value={noticeForm.title}
                         onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                         required
                       />
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Content</label>
                       <textarea 
                         placeholder="Notice content..." 
                         rows={2}
                         className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                         value={noticeForm.content}
                         onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                         required
                       />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary w-full py-2.5 sm:py-3 text-xs font-bold shadow-lg shadow-blue-100 uppercase tracking-widest"
                      disabled={publishing}
                    >
                      {publishing ? 'Publishing...' : 'Broadcast Notice'}
                    </button>
                 </form>
              </GlassCard>

              <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-3 sm:gap-4 p-5 sm:p-8 rounded-2xl sm:rounded-3xl sm:col-span-2">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                       <div className="p-2 bg-amber-600 rounded-lg text-white"><Key size={18} /></div>
                       <h3 className="font-bold text-base sm:text-lg">Staff Security Passkey</h3>
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 bg-amber-50 text-amber-600 rounded uppercase tracking-widest">Admin Incharge</div>
                 </div>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Registration Key</p>
                      <div className="flex gap-2">
                        <input 
                           type="text" 
                           className="flex-1 px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-black text-amber-600 tracking-[0.2em] text-sm focus:outline-none" 
                           value={adminKey}
                           readOnly
                        />
                        <button 
                           className="btn bg-amber-600 text-white hover:bg-amber-700 px-3.5 py-2 transition-colors rounded-xl" 
                           onClick={generateAndSaveKey}
                           disabled={keyLoading}
                           title="Generate new key"
                        >
                           <RefreshCw size={16} className={keyLoading ? 'animate-spin' : ''} />
                        </button>
                      </div>
                      {keyStatus && <p className="text-[10px] font-black text-amber-600 mt-1 uppercase tracking-widest animate-fade-in">{keyStatus}</p>}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium max-w-xs">Share this key to verify newly onboarded society committee staff during registration.</p>
                 </div>
              </GlassCard>
          </div>

          {/* Maintenance Solicitation Section */}
          <div className="flex flex-col gap-3 sm:gap-4">
             <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">Revenue Recovery Control</h2>
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 px-2.5 sm:px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1.5">
                   <CreditCard size={12} /> Active Ledger
                </span>
             </div>
             <GlassCard className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl">
                <div className="flex flex-col divide-y divide-slate-50">
                   {residentsDues.length > 0 ? residentsDues.map((resident, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:bg-slate-50/50 transition-colors gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                           <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${resident.billStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : resident.billStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                              {resident.name?.charAt(0) || 'R'}
                           </div>
                           <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm sm:text-base">{resident.name}</span>
                                <span className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                    resident.billStatus === 'PAID' ? 'bg-emerald-600 text-white shadow-sm' : 
                                    resident.billStatus === 'PENDING' ? 'bg-amber-600 text-white shadow-sm' : 
                                    'bg-slate-200 text-slate-500'
                                }`}>
                                   {resident.billStatus.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Flat {resident.flatNo || 'N/A'} • Monthly Unit: ₹{maintenanceValue}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                           {resident.billStatus === 'PAID' ? (
                               <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl">
                                  <ShieldCheck size={13} /> Clear
                                </div>
                           ) : (
                               <button 
                                 onClick={() => handleRequestPayment(resident._id)}
                                 disabled={requestingId === resident._id}
                                 className={`flex items-center justify-center gap-1.5 btn btn-primary text-[9px] sm:text-[10px] py-2 px-4 sm:px-6 uppercase tracking-widest font-black shadow-lg shadow-blue-100 transition-all w-full sm:w-auto ${requestingId === resident._id ? 'opacity-50 cursor-wait' : ''}`}
                               >
                                  {requestingId === resident._id ? (
                                     <><RefreshCw size={12} className="animate-spin" /> Working...</>
                                  ) : resident.billStatus === 'PENDING' ? (
                                     <><ArrowRight size={12} /> Remind</>
                                  ) : (
                                     <><Plus size={12} /> Generate Bill</>
                                  )}
                               </button>
                           )}
                        </div>
                     </div>
                   )) : (
                     <div className="p-8 sm:p-16 text-center flex flex-col items-center gap-3 bg-slate-50/30">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                           <Users size={24} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No residents found in ledger</p>
                     </div>
                   )}
                </div>
             </GlassCard>
          </div>

          {/* Incidents & Complaints */}
          <div className="flex flex-col gap-3 sm:gap-4">
             <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">Incident Command Center</h2>
                <span className="text-[9px] sm:text-[10px] font-black text-red-500 px-2.5 sm:px-3 py-1 bg-red-50 rounded-full flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Tickets
                </span>
             </div>
             <GlassCard className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl">
                <div className="flex flex-col divide-y divide-slate-50">
                   {stats.recentIssues.length > 0 ? stats.recentIssues.map((item, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:bg-slate-50/50 transition-colors gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs sm:text-sm shrink-0">
                              {item.userId?.name?.charAt(0) || 'C'}
                           </div>
                           <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</span>
                                <span className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow-sm`}>High</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">{item.userId?.name || 'Unknown'} • Flat {item.userId?.flatNo || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                           <button 
                             onClick={() => handleResolve(item._id)}
                             className="w-full sm:w-auto btn bg-emerald-600 text-white text-[9px] sm:text-[10px] py-2 px-4 uppercase tracking-widest font-black shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
                           >
                             Resolve
                           </button>
                        </div>
                     </div>
                   )) : (
                     <div className="p-8 sm:p-16 text-center flex flex-col items-center gap-3 bg-slate-50/30">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                           <Search size={24} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active incidents reported</p>
                     </div>
                   )}
                </div>
             </GlassCard>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 sm:gap-8">
           <div className="flex flex-col gap-3 sm:gap-4">
              <h2 className="text-base sm:text-xl font-bold flex items-center gap-2 text-slate-900 tracking-tight">
                <ShieldCheck size={18} className="text-emerald-600" /> Security
              </h2>
              <GlassCard className="bg-slate-900 text-white border-none shadow-xl p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] relative overflow-hidden">
                 <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                 <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cameras</span>
                    <span className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 24 Online
                    </span>
                 </div>
                 <div className="flex flex-col gap-3 relative z-10">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed">Society perimeter is secure. No motion alerts in the last 4 hours.</p>
                 </div>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};
