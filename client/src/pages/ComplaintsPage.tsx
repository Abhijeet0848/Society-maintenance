import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Plus, 
  Search, 
  Clock, 
  Wrench, 
  Zap, 
  Droplet, 
  ShieldAlert, 
  HelpCircle,
  X,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'PLUMBING',
    description: '',
    priority: 'MEDIUM',
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/complaints');
      const data = await res.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user._id || user.id,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', category: 'PLUMBING', description: '', priority: 'MEDIUM' });
        fetchComplaints();
      }
    } catch (err) {
      console.error('Failed to submit ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetchWithAuth(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchComplaints();
        if (selectedTicket && selectedTicket._id === id) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PLUMBING': return <Droplet size={18} className="text-blue-600" />;
      case 'ELECTRICAL': return <Zap size={18} className="text-amber-500" />;
      case 'SECURITY': return <ShieldAlert size={18} className="text-red-500" />;
      case 'MAINTENANCE': return <Wrench size={18} className="text-emerald-600" />;
      default: return <HelpCircle size={18} className="text-slate-500" />;
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
             <p className="text-amber-700 font-black uppercase tracking-wider text-[10px] sm:text-xs bg-amber-50 border border-amber-200 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Help & Support</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Resident <span className="text-amber-600">Complaints</span>
          </h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-lg mt-0.5 sm:mt-1">Log issues and track repair resolutions in real time.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-100 hover:scale-105 transition-all text-xs font-black uppercase tracking-wider active:scale-95"
        >
          <Plus size={18} /> Raise New Ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
        <div className="relative flex-1 md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-slate-300 focus:border-blue-600 rounded-2xl shadow-sm outline-none font-semibold text-slate-900 text-sm placeholder:text-slate-400 transition-all" 
            placeholder="Search tickets by keyword or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
           ))}
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredComplaints.map((ticket, i) => (
            <GlassCard 
              key={i} 
              className="flex flex-col justify-between p-5 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer rounded-3xl"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
                    {getCategoryIcon(ticket.category)}
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">{ticket.category}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                    'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {ticket.status?.replace('_', ' ')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{ticket.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">{ticket.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-600" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span className="text-blue-700 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ArrowRight size={14} /></span>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 sm:p-20 text-center flex flex-col items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-3xl">
          <MessageSquare size={40} className="text-slate-300 sm:w-12 sm:h-12" />
          <h3 className="text-lg sm:text-2xl font-black text-slate-900">No Tickets Found</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm">No complaints or maintenance inquiries were found matching your current filter.</p>
        </GlassCard>
      )}

      {/* Raise Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] relative">
            <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Wrench size={18} />
                 </div>
                 <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Raise Ticket</h3>
                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Service Request</p>
                 </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Ticket Subject</label>
                <input 
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl sm:rounded-2xl outline-none focus:border-blue-600 font-semibold text-slate-900 text-sm shadow-sm transition-all"
                  placeholder="e.g. Water leakage in bathroom"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</label>
                  <select 
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl sm:rounded-2xl outline-none focus:border-blue-600 font-semibold text-slate-900 text-sm shadow-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="SECURITY">Security</option>
                    <option value="MAINTENANCE">General Maintenance</option>
                    <option value="OTHER">Other Issue</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Urgency Level</label>
                  <select 
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl sm:rounded-2xl outline-none focus:border-blue-600 font-semibold text-slate-900 text-sm shadow-sm"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Issue Details</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl sm:rounded-2xl outline-none focus:border-blue-600 font-medium text-slate-900 text-sm shadow-sm transition-all resize-none"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-primary py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-blue-100 font-black text-xs sm:text-sm uppercase tracking-wider active:scale-95"
              >
                {submitting ? 'Submitting...' : 'Submit Service Ticket'}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedTicket(null)}></div>
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] relative">
            <div className="flex justify-between items-start gap-4 pb-4 sm:pb-6 border-b border-slate-100">
              <div className="flex flex-col gap-1">
                <span className={`w-max px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedTicket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  selectedTicket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                  'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  Status: {selectedTicket.status?.replace('_', ' ')}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">{selectedTicket.title}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 border-b border-slate-100 text-xs font-bold text-slate-600">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Category</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedTicket.category}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Reported By</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedTicket.userId?.name || 'Resident'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Date Logged</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="py-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Incident Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedTicket._id, st)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                        selectedTicket.status === st 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Mark {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};
