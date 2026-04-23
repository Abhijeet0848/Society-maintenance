import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Clock,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) fetchNotifications();
  }, [user._id]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notif read');
    }
  };

  return (
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] bg-blue-50 p-1 px-3 rounded-full">System Alerts</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Activity <span className="text-blue-600">History</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Review all your recent interactions and society alerts.</p>
        </div>
        <div className="flex gap-3">
           <button className="btn btn-secondary px-6 py-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <Trash2 size={16} /> Archive All
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 flex flex-col gap-4">
           {loading ? (
              <div className="flex flex-col gap-4">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-3xl" />
                 ))}
              </div>
           ) : notifications.length > 0 ? (
              <div className="flex flex-col gap-4">
                 {notifications.map((notif, i) => (
                    <GlassCard 
                        key={i} 
                        className={`p-8 border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between gap-6 ${!notif.read ? 'bg-white' : 'bg-slate-50/50'}`}
                        onClick={() => !notif.read && markRead(notif._id)}
                    >
                       <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                                notif.type === 'SUCCESS' ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                                notif.type === 'WARNING' ? 'bg-amber-500 text-white shadow-amber-100' : 'bg-blue-600 text-white shadow-blue-100'
                            }`}>
                                {notif.type === 'SUCCESS' ? <CheckCircle2 size={24} /> : 
                                    notif.type === 'WARNING' ? <AlertTriangle size={24} /> : <Info size={24} />}
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h3 className={`text-lg font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-500'}`}>{notif.title}</h3>
                                    {!notif.read && <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">New Account Alert</span>}
                                </div>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">{notif.message}</p>
                            </div>
                       </div>
                       <div className="flex flex-col items-end gap-1 shrink-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Clock size={12} className="text-blue-500" /> {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase">{new Date(notif.createdAt).toLocaleDateString()}</p>
                       </div>
                    </GlassCard>
                 ))}
              </div>
           ) : (
              <div className="py-32 text-center flex flex-col items-center gap-6 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[3rem]">
                 <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-100">
                    <Bell size={40} />
                 </div>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No activity found in your logs</p>
              </div>
           )}
        </div>

        <div className="flex flex-col gap-8">
           <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 text-[11px] px-2">Refine Activity</h2>
              <GlassCard className="bg-white border-slate-100 p-8 flex flex-col gap-6 shadow-sm rounded-[2.5rem]">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none" placeholder="Search alerts..." />
                 </div>
                 <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-2xl">
                       <span className="text-[10px] font-black uppercase tracking-widest">All Events</span>
                       <Filter size={14} />
                    </button>
                    <button className="flex items-center justify-between p-4 bg-white text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
                       <span className="text-[10px] font-black uppercase tracking-widest">Security Only</span>
                       <ShieldCheck size={14} />
                    </button>
                 </div>
              </GlassCard>
           </div>
        </div>
      </div>
    </div>
  );
};

