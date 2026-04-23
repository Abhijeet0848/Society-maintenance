import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  CreditCard, 
  HelpCircle, 
  Bell, 
  Calendar, 
  ArrowUpRight, 
  MessageSquare, 
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Users,
  Search,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  const stats = [
    { title: "Current Dues", value: "₹ 0.00", icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10", trend: "Paid in full" },
    { title: "Complaints", value: "0", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", trend: "0 pending resolution" },
    { title: "Notice Board", value: "0", icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10", trend: "Check for updates" },
    { title: "Society Fund", value: "Audited", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: `Updated ${new Date().getFullYear()}` },
  ];

  const quickActions = [
    { name: "Maintenance", icon: CreditCard, path: "/maintenance", color: "bg-blue-500", desc: "Pay dues" },
    { name: "Complaints", icon: MessageSquare, path: "/complaints", color: "bg-amber-500", desc: "Get help" },
    { name: "Facilities", icon: Calendar, path: "/facilities", color: "bg-emerald-500", desc: "Book now" },
    { name: "Directory", icon: Users, path: "/directory", color: "bg-purple-500", desc: "Search neighbors" },
  ];

  return (
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px] bg-blue-50 p-1 px-3 rounded-full">Vrundavan Society Portal</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Hello, {user?.name || 'Resident'} 👋
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">
            {user?.flatNo ? `Flat ${user.flatNo} • Active Member` : 'Welcome back to your society dashboard'}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button 
             onClick={() => navigate('/complaints')}
             className="flex-1 md:flex-none btn btn-primary px-8 py-4 shadow-xl shadow-blue-200"
           >
             <PlusCircle size={20} /> Create New Request
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex flex-col gap-4 border-none shadow-sm hover:shadow-xl group transition-all cursor-pointer bg-white">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.title}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" /> {stat.trend}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Member Services</h2>
            <Link to="/facilities" className="text-sm font-bold text-blue-500 hover:underline">Explore all services</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
             {quickActions.map((action, i) => (
               <Link key={i} to={action.path} className="text-decoration-none group">
                 <GlassCard className="flex flex-col items-center text-center gap-3 py-8 hover:bg-slate-50 border-slate-100 transition-all h-full shadow-sm">
                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white ${action.color} shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                      <action.icon size={28} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{action.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 block">{action.desc}</span>
                    </div>
                 </GlassCard>
               </Link>
             ))}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recent Activity</h2>
            <GlassCard className="p-0 overflow-hidden border-slate-100 shadow-sm bg-white">
               <div className="p-16 text-center flex flex-col items-center gap-4 bg-slate-50/50">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
                     <Search size={32} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">Cleared for {currentMonth}</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm mx-auto">You have no pending maintenance bills or resolved complaints this month. Great job!</p>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Link to="/maintenance" className="btn btn-secondary py-2 px-6">View Billing</Link>
                    <Link to="/complaints" className="btn btn-secondary py-2 px-6">View Tickets</Link>
                  </div>
               </div>
            </GlassCard>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell size={24} className="text-blue-500" /> Community
          </h2>
          <div className="flex flex-col gap-4">
               <GlassCard className="p-10 text-center flex flex-col items-center justify-center gap-4 border-slate-100 shadow-sm bg-white">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                     <Bell size={28} className="text-blue-200" />
                  </div>
                  <h4 className="font-bold text-slate-900">No New Notices</h4>
                  <p className="text-sm text-muted-foreground">The society office hasn't posted any new updates today.</p>
                  <Link to="/notices" className="w-full">
                    <button className="btn btn-secondary w-full">Browse Archives</button>
                  </Link>
               </GlassCard>

               <div className="p-8 bg-gradient-to-br from-blue-700 to-blue-900 text-white border-none shadow-blue-200 shadow-2xl rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h4 className="font-bold text-xl tracking-tight">Need Assistance?</h4>
                    <p className="text-white text-sm mt-2 font-medium leading-relaxed">Reach out to the management committee for any emergency help.</p>
                    <button 
                       onClick={() => window.dispatchEvent(new CustomEvent('openSupportChat'))}
                       className="mt-8 w-full py-4 bg-white text-blue-700 font-bold rounded-2xl text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                       Contact Committee
                    </button>
                  </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
};

