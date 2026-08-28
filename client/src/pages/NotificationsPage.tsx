import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { fetchWithAuth } from '../services/api';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) fetchNotifications();
  }, [user._id]);

  const fetchNotifications = async () => {
    try {
      const res = await fetchWithAuth(`/api/notifications/${user._id}`);
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
      await fetchWithAuth(`/api/notifications/read/${id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notif read');
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-blue-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">System Alerts</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Activity <span className="text-blue-600">History</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Review all your recent interactions and society alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-10">
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4">
           {loading ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 sm:h-24 bg-slate-100 animate-pulse rounded-2xl sm:rounded-3xl" />
                 ))}
              </div>
           ) : notifications.length > 0 ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                 {notifications.map((notif, i) => (
                    <GlassCard 
                        key={i} 
                        className={`p-4 sm:p-8 border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 rounded-2xl sm:rounded-3xl ${!notif.read ? 'bg-white' : 'bg-slate-50/50'}`}
                        onClick={() => !notif.read && markRead(notif._id)}
                    >
                       <div className="flex items-start sm:items-center gap-3 sm:gap-6">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                notif.type === 'SUCCESS' ? 'bg-emerald-500 text-white' : 
                                notif.type === 'WARNING' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                            }`}>
                                {notif.type === 'SUCCESS' ? <CheckCircle2 size={18} className="sm:w-6 sm:h-6" /> : 
                                    notif.type === 'WARNING' ? <AlertTriangle size={18} className="sm:w-6 sm:h-6" /> : <Info size={18} className="sm:w-6 sm:h-6" />}
                            </div>
                            <div className="flex flex-col gap-0.5 sm:gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className={`text-sm sm:text-base font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-500'}`}>{notif.title}</h3>
                                    {!notif.read && <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">New</span>}
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-xl">{notif.message}</p>
                            </div>
                       </div>
                       <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                             <Clock size={11} className="text-blue-500" /> {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase">{new Date(notif.createdAt).toLocaleDateString()}</p>
                       </div>
                    </GlassCard>
                 ))}
              </div>
           ) : (
              <div className="py-16 sm:py-32 text-center flex flex-col items-center gap-4 sm:gap-6 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-3xl sm:rounded-[3rem]">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-200">
                    <Bell size={32} className="sm:w-10 sm:h-10" />
                 </div>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No activity found in your logs</p>
              </div>
           )}
        </div>

        <div className="flex flex-col gap-4 sm:gap-8">
           <div className="flex flex-col gap-3 sm:gap-4">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400 px-1">Refine Activity</h2>
              <GlassCard className="bg-white border-slate-100 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 shadow-sm rounded-2xl sm:rounded-3xl">
                 <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between p-3 sm:p-3.5 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl text-xs font-bold">
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">All Events</span>
                       <Filter size={14} />
                    </button>
                    <button className="flex items-center justify-between p-3 sm:p-3.5 bg-white text-slate-400 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all text-xs font-bold">
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Security Only</span>
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

