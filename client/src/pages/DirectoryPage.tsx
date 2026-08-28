import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Users, 
  Search, 
  Mail, 
  ChevronRight, 
  UserCheck, 
  X, 
  Home, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  MapPin 
} from 'lucide-react';

export const DirectoryPage = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWithAuth('/api/auth/residents')
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
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-blue-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Community Hub</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Resident <span className="text-blue-600">Directory</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Connect and coordinate with verified members of Vrundavan Society.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 sm:p-4 px-4 sm:px-6 rounded-2xl shadow-sm w-full md:w-auto">
           <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users size={18} />
           </div>
           <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Total Families</p>
              <p className="text-base sm:text-xl font-extrabold text-slate-900">{residents.length} Active</p>
           </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full">
        <div className="relative w-full sm:flex-1 md:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-slate-200 focus:border-blue-500 rounded-2xl shadow-sm outline-none font-medium text-sm transition-all" 
            placeholder="Search by name or flat number (e.g. A-402)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="h-44 sm:h-48 bg-slate-100 animate-pulse rounded-2xl sm:rounded-[2.5rem]" />
           ))}
        </div>
      ) : residents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredResidents.map((resident, i) => (
            <GlassCard 
                key={i} 
                className="flex flex-col gap-4 sm:gap-6 p-5 sm:p-8 border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer"
                onClick={() => {
                    setSelectedResident(resident);
                    setShowModal(true);
                }}
            >
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg sm:text-xl capitalize group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {resident.name.charAt(0)}
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300">Flat No</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{resident.flatNo}</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-1">
                 <h3 className="text-base sm:text-xl font-bold text-slate-900">{resident.name}</h3>
                 <p className="text-[10px] sm:text-xs font-black text-blue-600/70 uppercase tracking-widest flex items-center gap-1">
                    <UserCheck size={12} /> Verified Resident
                 </p>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2 sm:gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <Mail size={14} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-medium truncate">{resident.email}</span>
                 </div>
                 <div className="flex items-center justify-between mt-1 sm:mt-2">
                    <button className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                       View Profile <ChevronRight size={12} />
                    </button>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase">Live</span>
                    </div>
                 </div>
              </div>
            </GlassCard>
          ))}
          
          {filteredResidents.length === 0 && (
             <div className="col-span-full py-12 sm:py-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 flex items-center justify-center">
                   <Search size={28} className="text-slate-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">No neighbors found</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Try searching for a different flat or name.</p>
             </div>
          )}
        </div>
      ) : (
        <GlassCard className="p-8 sm:p-20 text-center flex flex-col items-center gap-4 bg-white border-2 border-dashed border-slate-100 shadow-sm rounded-3xl sm:rounded-[3rem]">
           <Users size={40} className="text-slate-200 sm:w-12 sm:h-12" />
           <h3 className="text-lg sm:text-2xl font-bold text-slate-900">Directory is currently empty</h3>
           <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm">When neighbors register their accounts, they will appear here automatically.</p>
        </GlassCard>
      )}

      {/* Resident Profile Modal */}
      {showModal && selectedResident && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
           <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-0 relative overflow-hidden rounded-3xl sm:rounded-[3rem]">
              {/* Profile Background Banner */}
              <div className="h-28 sm:h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                 <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <div className="px-5 sm:px-10 pb-6 sm:pb-10 relative">
                 {/* Avatar Overflow */}
                 <div className="relative mt-[-3rem] sm:mt-[-4rem] mb-4 sm:mb-6 inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2.5rem] bg-slate-50 border-4 sm:border-8 border-white shadow-xl flex items-center justify-center text-3xl sm:text-5xl font-black text-blue-600">
                       {selectedResident.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-500 border-2 sm:border-4 border-white rounded-full" />
                 </div>

                 <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                       <div className="flex flex-col gap-1">
                          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{selectedResident.name}</h2>
                          <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                             <ShieldCheck size={14} /> Verified Member • Vrundavan Society
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                       <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Home size={12} className="text-blue-500" /> Residency
                          </span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 uppercase">Flat {selectedResident.flatNo}</span>
                       </div>
                       <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Mail size={12} className="text-blue-500" /> Email
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">{selectedResident.email}</span>
                       </div>
                       <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[2rem] flex flex-col gap-1 border border-slate-100">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Calendar size={12} className="text-blue-500" /> Member Since
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                             {new Date(selectedResident.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}
                          </span>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 pt-4 border-t border-slate-50">
                       <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Additional Information</h4>
                       <div className="flex flex-wrap gap-2 sm:gap-3">
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] sm:text-[10px] font-bold border border-slate-100 flex items-center gap-1.5">
                             <UserCheck size={12} /> Registered Resident
                          </div>
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] sm:text-[10px] font-bold border border-slate-100 flex items-center gap-1.5">
                             <Phone size={12} /> Contact Verified
                          </div>
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] sm:text-[10px] font-bold border border-slate-100 flex items-center gap-1.5">
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
