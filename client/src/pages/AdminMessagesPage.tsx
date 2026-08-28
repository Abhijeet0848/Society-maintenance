import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { MessageSquare, Send, Search, ArrowLeft } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

export const AdminMessagesPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      const interval = setInterval(() => fetchMessages(selectedUser._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const res = await fetchWithAuth('/api/auth/residents');
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    } catch (err) {}
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetchWithAuth(`/api/messages/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    setLoading(true);
    try {
      await fetchWithAuth('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: newMessage
        })
      });
      setNewMessage('');
      fetchMessages(selectedUser._id);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8 py-4 sm:py-8 animate-fade-in h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
      <div className="flex flex-col gap-1 text-left shrink-0">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Management <span className="text-blue-600">Helpdesk</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Respond to resident queries and official communications.</p>
      </div>

      <div className="flex-1 flex gap-4 sm:gap-8 overflow-hidden min-h-0">
        {/* Residents List (Hidden on mobile if user selected) */}
        <div className={`w-full md:w-[320px] lg:w-[350px] flex flex-col gap-3 shrink-0 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
           <div className="relative shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Search Residents..." 
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-500 transition-all"
              />
           </div>
           <GlassCard className="flex-1 overflow-y-auto p-0 bg-white border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem]">
              <div className="flex flex-col divide-y divide-slate-50">
                 {conversations.map((res, i) => (
                   <div 
                    key={i} 
                    onClick={() => setSelectedUser(res)}
                    className={`p-4 sm:p-5 cursor-pointer transition-all flex items-center gap-3 sm:gap-4 ${selectedUser?._id === res._id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
                   >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm uppercase transition-all shrink-0">
                         {res.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                         <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{res.name}</p>
                         <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Flat {res.flatNo || 'N/A'}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Chat Window (Hidden on mobile if no user selected) */}
        <div className={`flex-1 flex flex-col min-h-0 ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
           {selectedUser ? (
             <GlassCard className="flex-1 flex flex-col p-0 bg-white border-slate-100 shadow-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
                <div className="p-3.5 sm:p-5 bg-slate-900 text-white flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedUser(null)} 
                        className="md:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white mr-1"
                        aria-label="Back to residents list"
                      >
                         <ArrowLeft size={16} />
                      </button>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-base sm:text-lg font-black shrink-0">
                         {selectedUser.name.charAt(0)}
                      </div>
                      <div className="text-left">
                         <h4 className="font-bold text-xs sm:text-sm">{selectedUser.name}</h4>
                         <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Flat {selectedUser.flatNo || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400 hidden sm:inline">Active</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-slate-50/50">
                   {messages.map((m, i) => (
                     <div key={i} className={`flex ${m.senderId !== selectedUser._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm ${
                           m.senderId !== selectedUser._id 
                             ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                             : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                        }`}>
                           <p className="font-medium leading-relaxed">{m.content}</p>
                           <div className="text-[8px] sm:text-[9px] mt-1.5 font-bold uppercase tracking-widest opacity-50">
                              {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex gap-2 sm:gap-3 shrink-0">
                   <input 
                    placeholder="Provide assistance..." 
                    className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <button 
                    type="submit"
                    className="btn btn-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 text-xs font-bold shrink-0"
                    disabled={loading}
                   >
                     <Send size={16} /> <span className="hidden sm:inline">{loading ? 'Sending...' : 'Send'}</span>
                   </button>
                </form>
             </GlassCard>
           ) : (
             <GlassCard className="flex-1 flex flex-col items-center justify-center text-center gap-4 bg-white border-none shadow-sm rounded-3xl p-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-300">
                   <MessageSquare size={32} />
                </div>
                <div>
                   <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Resident Selected</h3>
                   <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">Select a resident from the left panel to review inquiries and send responses.</p>
                </div>
             </GlassCard>
           )}
        </div>
      </div>
    </div>
  );
};
