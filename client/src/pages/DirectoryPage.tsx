import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Users, 
  Search, 
  Mail, 
  ChevronRight, 
  Filter,
  UserCheck
} from 'lucide-react';

export const DirectoryPage = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/residents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setResidents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching residents:', err);
        setLoading(false);
      });
  }, []);

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.flatNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] bg-emerald-50 p-1 px-3 rounded-full">Member Directory</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Vrundavan <span className="text-emerald-600">Residents</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Search and connect with your society neighbors.</p>
        </div>
        <div className="flex gap-4">
           <GlassCard className="bg-emerald-500 text-white border-none p-4 px-6 rounded-2xl flex items-center gap-3">
              <Users size={24} />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Connected Members</p>
                 <p className="text-xl font-bold">{residents.length}</p>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl shadow-sm outline-none font-medium transition-all" 
            placeholder="Search by name or flat number (e.g. A-402)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
           <Filter size={14} /> Advanced Filter
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2.5rem]" />
           ))}
        </div>
      ) : residents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.map((resident, i) => (
            <GlassCard key={i} className="flex flex-col gap-6 p-8 border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer">
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl capitalize group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    {resident.name.charAt(0)}
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Flat No</span>
                    <span className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{resident.flatNo}</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-1">
                 <h3 className="text-xl font-bold text-slate-900">{resident.name}</h3>
                 <p className="text-xs font-black text-emerald-600/70 uppercase tracking-widest flex items-center gap-1">
                    <UserCheck size={12} /> Verified Resident
                 </p>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <Mail size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium">{resident.email}</span>
                 </div>
                 <div className="flex items-center justify-between mt-2">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                       View Profile <ChevronRight size={12} />
                    </button>
                    <div className="flex gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
                    </div>
                 </div>
              </div>
            </GlassCard>
          ))}
          
          {filteredResidents.length === 0 && (
             <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                   <Search size={32} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No neighbors found</h3>
                <p className="text-slate-500 font-medium">Try searching for a different flat or name.</p>
             </div>
          )}
        </div>
      ) : (
        <GlassCard className="p-20 text-center flex flex-col items-center gap-4 bg-white border-2 border-dashed border-slate-100 shadow-sm rounded-[3rem]">
           <Users size={48} className="text-slate-200" />
           <h3 className="text-2xl font-bold text-slate-900">Directory is currently empty</h3>
           <p className="text-slate-400 font-medium max-w-sm">When neighbors register their accounts, they will appear here automatically.</p>
        </GlassCard>
      )}
    </div>
  );
};

