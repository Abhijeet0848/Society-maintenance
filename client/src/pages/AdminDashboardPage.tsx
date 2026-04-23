import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Users, 
  CreditCard, 
  MessageSquare,
  Plus, 
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Key,
  RefreshCw,
  Calendar,
  Clock,
  ArrowRight,
  Search
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
    fetchWithAuth('http://localhost:5000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setStats(data);
      })
      .catch(err => console.error('Error fetching stats:', err));
  };

  const fetchResidentsDues = () => {
    fetchWithAuth('http://localhost:5000/api/admin/residents-dues')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           console.log('Fetched Dues Data:', data);
           setResidentsDues(data);
        }
      })
      .catch(err => console.error('Error fetching residents dues:', err));
  };

  const fetchConfig = () => {
    fetchWithAuth('http://localhost:5000/api/config/maintenance_fee')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'number') setMaintenanceValue(data);
      })
      .catch(err => console.error('Error fetching maintenance fee:', err));

    fetchWithAuth('http://localhost:5000/api/config/admin_registration_key')
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
      const response = await fetchWithAuth('http://localhost:5000/api/config', {
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

    console.log(`Requesting payment for ${userId} - ${month} ${year}`);

    try {
      const response = await fetchWithAuth('http://localhost:5000/api/admin/request-payment', {
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
      const response = await fetchWithAuth('http://localhost:5000/api/notices', {
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
      const response = await fetchWithAuth(`http://localhost:5000/api/complaints/${id}`, {
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
      const response = await fetchWithAuth('http://localhost:5000/api/config', {
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
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <p className="text-amber-600 font-bold uppercase tracking-widest text-[10px] bg-amber-50 p-1 px-3 rounded-full">Management Control Center</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Society Hub Admin
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Vrundavan Society • Real-time Infrastructure</p>
        </div>
        <div className="flex gap-3">
           <button className="btn btn-secondary px-6">
             <Key size={18} /> Credentials
           </button>
           <button className="btn btn-primary px-8">
             <Plus size={18} /> Global Notify
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statConfig.map((stat, i) => (
          <GlassCard key={i} className="border-none shadow-sm hover:shadow-xl transition-all bg-white">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex justify-between items-end">
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rapid Infrastructure Management</h2>
             <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Live Data Feed</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-6 p-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white"><CreditCard size={20} /></div>
                      <h3 className="font-bold text-lg">Monthly Fee</h3>
                   </div>
                   <div className="text-[10px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase tracking-widest">Billing</div>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base Maintenance Amount</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input 
                           type="number" 
                           className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                           value={maintenanceValue}
                           onChange={(e) => setMaintenanceValue(Number(e.target.value))}
                        />
                     </div>
                     <button 
                        className="btn btn-primary px-6" 
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

              <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-6 p-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white"><MessageSquare size={20} /></div>
                    <h3 className="font-bold text-lg">Bulletin Broadcast</h3>
                 </div>
                 <form onSubmit={handlePublishNotice} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notice Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Annual General Meeting" 
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                         value={noticeForm.title}
                         onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                         required
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content</label>
                       <textarea 
                         rows={2}
                         placeholder="Detailed announcement details..."
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                         value={noticeForm.content}
                         onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                         required
                       />
                    </div>
                    <button type="submit" disabled={publishing} className="btn btn-primary w-full py-4 text-[10px] font-black uppercase tracking-widest">
                       {publishing ? 'Publishing...' : 'Broadcast to Residents'}
                    </button>
                 </form>
              </GlassCard>

             <GlassCard className="bg-white border-slate-100 shadow-sm flex flex-col gap-6 p-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-600 rounded-lg text-white"><Key size={20} /></div>
                      <h3 className="font-bold text-lg">Staff Security</h3>
                   </div>
                   <div className="text-[10px] font-black px-2 py-1 bg-amber-50 text-amber-600 rounded uppercase tracking-widest">Strict</div>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Incharge Key</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input 
                           type="text" 
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-amber-600 tracking-[0.2em] focus:outline-none" 
                           value={adminKey}
                           readOnly
                        />
                     </div>
                     <button 
                        className="btn bg-amber-600 text-white hover:bg-amber-700 px-4 transition-colors" 
                        onClick={generateAndSaveKey}
                        disabled={keyLoading}
                     >
                        <RefreshCw size={20} className={keyLoading ? 'animate-spin' : ''} />
                     </button>
                   </div>
                   {keyStatus && <p className="text-[10px] font-black text-amber-600 mt-1 uppercase tracking-widest animate-fade-in">{keyStatus}</p>}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Verify new staff using this rotating credential.</p>
             </GlassCard>
          </div>

          {/* Maintenance Solicitation Section */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Revenue Recovery Control</h2>
                <span className="text-[10px] font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-2">
                   <CreditCard size={12} /> Active Ledger
                </span>
             </div>
             <GlassCard className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm">
                <div className="flex flex-col divide-y divide-slate-50">
                   {residentsDues.length > 0 ? residentsDues.map((resident, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${resident.billStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : resident.billStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                              {resident.name?.charAt(0) || 'R'}
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{resident.name}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                    resident.billStatus === 'PAID' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 
                                    resident.billStatus === 'PENDING' ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 
                                    'bg-slate-200 text-slate-500'
                                }`}>
                                   {resident.billStatus.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mt-1">Flat {resident.flatNo || 'N/A'} • Monthly Unit: ₹{maintenanceValue}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           {resident.billStatus === 'PAID' ? (
                               <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
                                  <ShieldCheck size={14} /> Clear
                               </div>
                           ) : (
                               <button 
                                 onClick={() => handleRequestPayment(resident._id)}
                                 disabled={requestingId === resident._id}
                                 className={`flex items-center gap-2 btn btn-primary text-[10px] py-2 px-6 uppercase tracking-widest font-black shadow-lg shadow-blue-100 transition-all hover:translate-x-1 ${requestingId === resident._id ? 'opacity-50 cursor-wait' : ''}`}
                               >
                                  {requestingId === resident._id ? (
                                     <><RefreshCw size={14} className="animate-spin" /> Working...</>
                                  ) : resident.billStatus === 'PENDING' ? (
                                     <><ArrowRight size={14} /> Remind</>
                                  ) : (
                                     <><Plus size={14} /> Generate Bill</>
                                  )}
                               </button>
                           )}
                        </div>
                     </div>
                   )) : (
                     <div className="p-16 text-center flex flex-col items-center gap-4 bg-slate-50/30">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                           <Users size={28} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No residents found in ledger</p>
                     </div>
                   )}
                </div>
             </GlassCard>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Incident Command Center</h2>
                <span className="text-[10px] font-black text-red-500 px-3 py-1 bg-red-50 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Tickets
                </span>
             </div>
             <GlassCard className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm">
                <div className="flex flex-col divide-y divide-slate-50">
                   {stats.recentIssues.length > 0 ? stats.recentIssues.map((item, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">
                              {item.userId?.name?.charAt(0) || 'C'}
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{item.title}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow-lg shadow-red-200`}>High</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mt-1">{item.userId?.name || 'Unknown'} • {item.userId?.flatNo || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button className="flex-1 sm:flex-none btn bg-white border-slate-200 text-slate-500 text-[10px] py-2 px-4 uppercase tracking-widest font-black transition-all hover:bg-slate-50">Assign</button>
                           <button 
                             onClick={() => handleResolve(item._id)}
                             className="flex-1 sm:flex-none btn bg-emerald-600 text-white text-[10px] py-2 px-4 uppercase tracking-widest font-black shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
                           >
                             Resolve
                           </button>
                        </div>
                     </div>
                   )) : (
                     <div className="p-16 text-center flex flex-col items-center gap-4 bg-slate-50/30">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                           <Search size={28} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active incidents reported</p>
                     </div>
                   )}
                </div>
             </GlassCard>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Amenity Reservation Desk</h2>
                <span className="text-[10px] font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-2">
                   <Calendar size={12} /> Active Passes
                </span>
             </div>
             <GlassCard className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm">
                <div className="flex flex-col divide-y divide-slate-50">
                   {stats.recentBookings.length > 0 ? stats.recentBookings.map((bk, i) => (
                     <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                              {bk.facilityId?.icon || '🏢'}
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{bk.facilityId?.name}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-lg shadow-emerald-100`}>Confirmed</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mt-1">Booked by <span className="text-slate-900 font-bold">{bk.userId?.name || 'Resident'}</span> • Flat {bk.userId?.flatNo || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <Calendar size={12} className="text-blue-500" /> {new Date(bk.bookingDate).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <Clock size={12} className="text-amber-500" /> {bk.timeSlot}
                           </div>
                        </div>
                     </div>
                   )) : (
                     <div className="p-16 text-center flex flex-col items-center gap-4 bg-slate-50/30">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                           <Calendar size={28} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active bookings for today</p>
                     </div>
                   )}
                </div>
             </GlassCard>
          </div>
        </div>

        <div className="flex flex-col gap-10">
           <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 tracking-tight">
                <Users size={20} className="text-blue-600" /> Member Pipeline
              </h2>
              <GlassCard className="bg-white border-slate-100 p-6 flex flex-col gap-4 shadow-sm rounded-[2rem]">
                 <div className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <Users size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Total Residents</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stats.residents} Verified</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                 </div>
                 <button className="btn btn-secondary w-full text-[10px] font-black uppercase tracking-widest py-3 mt-4">Full Member Directory</button>
              </GlassCard>
           </div>

           <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 tracking-tight">
                <ShieldCheck size={20} className="text-emerald-600" /> Security
              </h2>
              <GlassCard className="bg-slate-900 text-white border-none shadow-2xl p-8 rounded-[2rem] relative overflow-hidden">
                 <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                 <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cameras</span>
                    <span className="text-lg font-black tracking-tight flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 24 Online
                    </span>
                 </div>
                 <div className="flex flex-col gap-4 relative z-10">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Society perimeter is secure. No motion alerts in the last 4 hours.</p>
                 </div>
                 <button className="btn bg-white/10 border border-white/10 hover:bg-white/20 text-white w-full text-[10px] mt-8 py-3 font-black uppercase tracking-[0.2em] tracking-widest">Live Feed</button>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};

