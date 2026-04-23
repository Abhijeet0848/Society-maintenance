import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Users, 
  Search, 
  Mail, 
  ChevronRight, 
  Filter,
  UserCheck,
  X,
  MapPin,
  Home,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Phone
} from 'lucide-react';

export const DirectoryPage = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/auth/residents')
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
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left relative">
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
            <GlassCard 
                key={i} 
                className="flex flex-col gap-6 p-8 border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer"
                onClick={() => {
                    setSelectedResident(resident);
                    setShowModal(true);
                }}
            >
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl capitalize group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    {resident.name.charAt(0)}
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Flat No</span>
                    <span className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase">{resident.flatNo}</span>
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
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
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

      {/* Resident Profile Modal */}
      {showModal && selectedResident && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
           <GlassCard className="w-full max-w-2xl bg-white border-none shadow-2xl animate-fade-in z-10 p-0 relative overflow-hidden rounded-[3rem]">
              {/* Profile Background Banner */}
              <div className="h-40 bg-gradient-to-r from-emerald-600 to-emerald-400 relative">
                 <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="px-10 pb-10 relative">
                 {/* Avatar Overflow */}
                 <div className="relative mt-[-4rem] mb-6 inline-block">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-8 border-white shadow-xl flex items-center justify-center text-5xl font-black text-emerald-600">
                       {selectedResident.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
                 </div>

                 <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                       <div className="flex flex-col gap-1">
                          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{selectedResident.name}</h2>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                             <ShieldCheck size={14} /> Verified Member • Vrundavan Society
                          </p>
                       </div>
                       <div className="flex gap-3">
                          <button className="btn btn-primary px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-100">
                             <MessageCircle size={18} /> Send Message
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Home size={12} className="text-emerald-500" /> Residency
                          </span>
                          <span className="text-xl font-black text-slate-900 uppercase">Flat {selectedResident.flatNo}</span>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Mail size={12} className="text-emerald-500" /> Email
                          </span>
                          <span className="text-sm font-bold text-slate-900 truncate">{selectedResident.email}</span>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={12} className="text-emerald-500" /> Member Since
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                             {new Date(selectedResident.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}
                          </span>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Additional Information</h4>
                       <div className="flex flex-wrap gap-3">
                          <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold border border-slate-100 flex items-center gap-2">
                             <UserCheck size={12} /> Registered Resident
                          </div>
                          <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold border border-slate-100 flex items-center gap-2">
                             <Phone size={12} /> Contact Verified
                          </div>
                          <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold border border-slate-100 flex items-center gap-2">
                             <MapPin size={12} /> Primary Address
                          </div>
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

