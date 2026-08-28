import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Shield, 
  Calendar, 
  Search, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  Megaphone,
  Plus,
  Send,
  X
} from 'lucide-react';

export const NoticesPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States for Compose and Detail Modals
  const [showCompose, setShowCompose] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', priority: 'Medium' });
  const [publishing, setPublishing] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    setLoading(true);
    fetchWithAuth('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notices:', err);
        setLoading(false);
      });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const response = await fetchWithAuth('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm),
      });
      if (response.ok) {
        setNoticeForm({ title: '', content: '', priority: 'Medium' });
        setShowCompose(false);
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to publish:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Retract this circular from the public board?')) return;
    
    try {
      const res = await fetchWithAuth(`/api/notices/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchNotices();
    } catch (err) {
      console.error('Deletion failed');
    }
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-blue-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Society Bulletin</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Official <span className="text-blue-600">Notices</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Stay updated with the latest circulars and announcements.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowCompose(true)}
            className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-100 hover:scale-105 transition-all text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} /> Publish Notice
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white border border-slate-200 focus:border-blue-500 rounded-2xl shadow-sm outline-none font-medium text-sm transition-all" 
            placeholder="Search circulars or announcements..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-10">
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
          {loading ? (
             <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                   <div key={i} className="h-28 sm:h-32 bg-slate-100 animate-pulse rounded-2xl sm:rounded-3xl" />
                ))}
             </div>
          ) : filteredNotices.length > 0 ? (
            <div className="flex flex-col gap-4 sm:gap-6">
               {filteredNotices.map((notice, i) => (
                  <GlassCard key={i} 
                    onClick={() => {
                        setSelectedNotice(notice);
                        setShowDetail(true);
                    }}
                    className="bg-white border-none shadow-sm hover:shadow-lg hover:translate-x-1 sm:hover:translate-x-2 transition-all p-0 overflow-hidden flex flex-col sm:flex-row group cursor-pointer"
                  >
                     <div className={`h-1.5 sm:h-auto sm:w-2 shrink-0 ${notice.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
                     <div className="p-5 sm:p-8 flex-1 flex flex-col gap-3 sm:gap-4">
                        <div className="flex justify-between items-start">
                           <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 notice.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                 {notice.priority || 'Medium'} Notification
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 <Calendar size={12} /> {new Date(notice.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                           <div className="flex items-center gap-2 sm:gap-3">
                               {isAdmin && (
                                  <button 
                                    onClick={(e) => handleDelete(notice._id, e)}
                                    className="p-1.5 sm:p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Retract Notice"
                                  >
                                     <X size={14} className="sm:w-4 sm:h-4" />
                                  </button>
                               )}
                               <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                            </div>
                        </div>
                        <div>
                           <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{notice.title}</h3>
                           <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">{notice.content}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-50">
                           <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-bold">Official Broadcast</p>
                           <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              <Shield size={10} /> Authenticated
                           </div>
                        </div>
                     </div>
                  </GlassCard>
               ))}
            </div>
          ) : (
            <GlassCard className="p-8 sm:p-16 text-center flex flex-col items-center gap-4 bg-white border-slate-100">
               <Megaphone size={40} className="text-slate-200 sm:w-12 sm:h-12" />
               <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Circulars Found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">No announcements matching your search query were discovered.</p>
               </div>
            </GlassCard>
          )}
        </div>

        <div className="flex flex-col gap-6">
           <GlassCard className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border-none shadow-xl flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                 <AlertTriangle size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-base sm:text-lg">Broadcast Policy</h4>
                 <p className="text-xs text-slate-400 mt-1 leading-relaxed">All published circulars are legally binding on residents of Vrundavan Society as per the 2024 Bylaws.</p>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Compose Notice Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCompose(false)}></div>
          <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[3rem] relative">
            <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Megaphone size={18} />
                 </div>
                 <h3 className="text-lg sm:text-xl font-bold text-slate-900">Publish Notice</h3>
              </div>
              <button onClick={() => setShowCompose(false)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handlePublish} className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Circular Headline</label>
                <input 
                  required
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-sm"
                  placeholder="e.g. Lift Maintenance Schedule"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Notice Body</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-sm"
                  placeholder="Detailed explanation of the announcement..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Priority Level</label>
                <div className="flex gap-2 sm:gap-4">
                  {['High', 'Medium', 'Low'].map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setNoticeForm({ ...noticeForm, priority: p })}
                      className={`flex-1 py-2.5 sm:py-3 rounded-xl border text-xs font-bold transition-all ${
                        noticeForm.priority === p 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                          : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={publishing}
                className="btn btn-primary py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-blue-100 font-bold text-xs sm:text-sm uppercase tracking-widest"
              >
                <Send size={16} /> {publishing ? 'Broadcasting...' : 'Publish to Board'}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {showDetail && selectedNotice && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDetail(false)}></div>
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-0 overflow-hidden rounded-3xl sm:rounded-[3rem] relative">
            <div className={`h-2.5 sm:h-3 ${selectedNotice.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
            <div className="p-5 sm:p-10 flex flex-col gap-5 sm:gap-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <span className={`w-max px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                     selectedNotice.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                     {selectedNotice.priority} PRIORITY
                  </span>
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{selectedNotice.title}</h2>
                </div>
                <button onClick={() => setShowDetail(false)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-3 sm:py-4 border-y border-slate-50">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={13} className="text-blue-500" /> {new Date(selectedNotice.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={13} className="text-blue-500" /> {new Date(selectedNotice.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotice.content}
              </div>

              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                      <Shield size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Signature</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">Vrundavan Society Management</p>
                   </div>
                </div>
                {isAdmin && (
                  <button 
                    onClick={(e) => {
                      setShowDetail(false);
                      handleDelete(selectedNotice._id, e);
                    }}
                    className="flex items-center gap-2 text-red-500 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl transition-all"
                  >
                    Retract Circular
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
