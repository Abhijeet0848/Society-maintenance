import { useState, useEffect, useMemo } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ChevronRight, 
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  History,
  TrendingDown,
  TrendingUp
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
      const res = await fetchWithAuth(`http://localhost:5000/api/complaints?userId=${user._id}`);
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
      const res = await fetchWithAuth('http://localhost:5000/api/complaints', {
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
    <div className="flex flex-col gap-10 py-10 animate-fade-in text-left relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] bg-blue-50 p-1 px-3 rounded-full">Support Center</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Helpdesk & <span className="text-blue-600">Complaints</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Review, filter, and track your active flat concerns.</p>
        </div>
        <button 
          onClick={() => setIsRaising(true)}
          className="btn btn-primary px-8 py-4 shadow-xl shadow-blue-200 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Raise New Complaint
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center px-2">
        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-2xl shadow-sm outline-none font-medium transition-all" 
            placeholder="Search tickets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
           {/* Status Filter */}
           <div className="flex p-1 bg-slate-100 rounded-2xl flex-1 lg:flex-none">
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {s}
                </button>
              ))}
           </div>

           {/* Date Sort Toggle */}
           <button 
            onClick={() => setSortBy(sortBy === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
            className={`flex items-center justify-center gap-3 py-3 px-6 rounded-2xl transition-all flex-1 lg:flex-none text-[10px] font-black uppercase tracking-widest shadow-sm ${sortBy === 'NEWEST' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-slate-900 text-white shadow-slate-200'}`}
           >
             {sortBy === 'NEWEST' ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {sortBy}
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredAndSortedComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {filteredAndSortedComplaints.map((item, i) => (
            <GlassCard key={i} className="flex flex-col gap-6 p-8 border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer">
              <div className="flex justify-between items-start">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${item.status === 'RESOLVED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                   {item.status || 'OPEN'}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-colors uppercase tracking-widest">
                   ID #{item._id.slice(-4)} <ChevronRight size={14} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{item.description}</p>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <Clock size={12} className="text-blue-400" /> {new Date(item.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <AlertCircle size={12} className="text-amber-500" /> {item.category || 'Maintenance'}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-24 text-center flex flex-col items-center justify-center gap-6 bg-white border-2 border-dashed border-slate-100 shadow-sm rounded-[3rem]">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
             <History size={48} className="text-blue-200" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900">No Tickets Found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              {searchQuery || filterStatus !== 'ALL' 
                ? "No complaints match your current search or filter criteria. Try adjusting them." 
                : "Everything in your flat seems to be working perfectly. If any issues arise, we're here to help."}
            </p>
          </div>
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
              if (complaints.length === 0) setIsRaising(true);
            }}
            className="btn btn-primary px-10 py-4 shadow-xl shadow-blue-100 mt-4"
          >
            {complaints.length === 0 ? 'New Complaint Report' : 'Clear All Filters'}
          </button>
        </GlassCard>
      )}

      {/* New Complaint Modal Overlay */}
      {isRaising && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsRaising(false)}></div>
          <GlassCard className="w-full max-w-xl bg-white border-none shadow-2xl animate-fade-in z-10 p-10 relative overflow-hidden rounded-[2.5rem]">
             <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsRaising(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                   <X size={24} className="text-slate-400" />
                </button>
             </div>
             
             <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest mb-1">
                      <MessageSquare size={16} /> New Assistance Ticket
                   </div>
                   <h2 className="text-3xl font-black text-slate-900">Incident Details</h2>
                   <p className="text-slate-500 font-medium leading-relaxed">Provide as much information as possible for faster resolution.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descriptive Title</label>
                      <input 
                         required
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-2xl text-slate-900 transition-all font-bold outline-none" 
                         placeholder="e.gars Water seepage from ceiling" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>

                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Service Category</label>
                      <select 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-2xl text-slate-900 transition-all font-bold outline-none appearance-none"
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
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Issue Description</label>
                      <textarea 
                         required
                         rows={4}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-2xl text-slate-900 transition-all font-medium outline-none resize-none" 
                         placeholder="Please explain the problem including the specific area..." 
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>

                   <button 
                      type="submit" 
                      className="btn btn-primary w-full py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-200"
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

