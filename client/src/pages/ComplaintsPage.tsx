import { useState, useEffect, useMemo } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  AlertCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  X,
  CheckCircle2
} from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isRaising, setIsRaising] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Maintenance' });
  const [status, setStatus] = useState('');
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) return;
    
    try {
      const res = await fetchWithAuth(`/api/complaints?userId=${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const filteredAndSortedComplaints = useMemo(() => {
    let result = [...complaints];

    // Filter by Search Query
    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== 'ALL') {
      result = result.filter(c => c.status === filterStatus);
    }

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [complaints, searchQuery, filterStatus, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const res = await fetchWithAuth('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user._id }),
      });
      if (res.ok) {
        setStatus('Success! Complaint raised.');
        setFormData({ title: '', description: '', category: 'Maintenance' });
        setTimeout(() => {
          setIsRaising(false);
          setStatus('');
          fetchComplaints();
        }, 2000);
      }
    } catch (err) {
      setStatus('Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-blue-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Support Center</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Helpdesk & <span className="text-blue-600">Complaints</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Review, filter, and track your active flat concerns.</p>
        </div>
        <button 
          onClick={() => setIsRaising(true)}
          className="w-full md:w-auto btn btn-primary px-6 sm:px-8 py-3.5 sm:py-4 shadow-xl shadow-blue-200 group text-xs sm:text-sm uppercase tracking-widest font-black"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Raise New Complaint
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between items-center w-full">
        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-2xl shadow-sm outline-none font-medium text-sm transition-all" 
            placeholder="Search tickets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
           {/* Status Filter */}
           <div className="flex p-1 bg-slate-100 rounded-2xl flex-1 sm:flex-none justify-between sm:justify-start">
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {s}
                </button>
              ))}
           </div>

           {/* Date Sort Toggle */}
           <button 
            onClick={() => setSortBy(sortBy === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
            className={`flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl transition-all flex-1 sm:flex-none text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm ${sortBy === 'NEWEST' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-slate-900 text-white shadow-slate-200'}`}
           >
             {sortBy === 'NEWEST' ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {sortBy}
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredAndSortedComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-12 sm:pb-20">
          {filteredAndSortedComplaints.map((complaint) => (
            <GlassCard 
               key={complaint._id} 
               className="flex flex-col justify-between gap-4 sm:gap-6 hover:shadow-lg transition-all p-5 sm:p-8 rounded-3xl bg-white border-slate-100 group"
            >
               <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex justify-between items-start gap-2">
                     <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                           {complaint.category || 'General'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <Clock size={12} /> {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                     <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0 ${
                        complaint.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${complaint.status === 'OPEN' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                        {complaint.status}
                     </span>
                  </div>

                  <div>
                     <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">{complaint.title}</h3>
                     <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed line-clamp-3">{complaint.description}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Ticket ID: #{complaint._id.slice(-6)}</span>
                  <span className="text-slate-500">{complaint.userId?.flatNo ? `Flat ${complaint.userId.flatNo}` : 'Resident'}</span>
               </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 sm:p-16 text-center flex flex-col items-center gap-4 bg-white border-slate-100">
           <AlertCircle size={40} className="text-slate-200 sm:w-12 sm:h-12" />
           <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Tickets Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">No complaints matching the selected filters were found.</p>
           </div>
        </GlassCard>
      )}

      {/* Raise Complaint Modal */}
      {isRaising && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsRaising(false)}></div>
          <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] relative">
             <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageSquare size={18} />
                   </div>
                   <h3 className="text-lg sm:text-xl font-bold text-slate-900">New Assistance Ticket</h3>
                </div>
                <button onClick={() => setIsRaising(false)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                  <X size={18} />
                </button>
             </div>
             
             <div className="flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descriptive Title</label>
                      <input 
                         required
                         className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-bold outline-none text-sm" 
                         placeholder="e.g. Water seepage from ceiling" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>

                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Service Category</label>
                      <select 
                         className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-bold outline-none text-sm"
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                         <option>Maintenance</option>
                         <option>Electrical</option>
                         <option>Security</option>
                         <option>Housekeeping</option>
                         <option>Other</option>
                      </select>
                   </div>

                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Issue Description</label>
                      <textarea 
                         required
                         rows={4}
                         className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-medium outline-none resize-none text-sm" 
                         placeholder="Please explain the problem including the specific area..." 
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>

                   <button 
                      type="submit" 
                      className="btn btn-primary w-full py-4 sm:py-5 text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-blue-200"
                      disabled={loading}
                   >
                      {loading ? 'Transmitting...' : 'Submit Assistance Ticket'}
                   </button>
                   {status && (
                     <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold animate-fade-in text-xs uppercase tracking-widest">
                        <CheckCircle2 size={16} /> {status}
                     </div>
                   )}
                </form>
             </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
