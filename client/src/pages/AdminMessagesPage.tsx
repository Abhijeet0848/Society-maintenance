import { useState, useEffect } from 'react';
import { GlassCard } from "../components/ui/GlassCard";
import { MessageSquare, Send, Clock, User, Shield, Search } from 'lucide-react';
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
      const res = await fetchWithAuth('http://localhost:5000/api/auth/residents');
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    } catch (err) {}
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/messages/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    setLoading(true);
    try {
      await fetchWithAuth('http://localhost:5000/api/messages', {
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
    <div className="flex flex-col gap-10 py-10 animate-fade-in h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Management <span className="text-blue-600">Helpdesk</span>
        </h1>
        <p className="text-slate-500 font-medium">Respond to resident queries and official communications.</p>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
        {/* Residents List */}
        <div className="w-[350px] flex flex-col gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Search Residents..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none"
              />
           </div>
           <GlassCard className="flex-1 overflow-y-auto p-0 bg-white border-slate-100 shadow-sm rounded-[2rem]">
              <div className="flex flex-col divide-y divide-slate-50">
                 {conversations.map((res, i) => (
                   <div 
                    key={i} 
                    onClick={() => setSelectedUser(res)}
                    className={`p-6 cursor-pointer transition-all flex items-center gap-4 ${selectedUser?._id === res._id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}
                   >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase transition-all group-hover:scale-110">
                         {res.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                         <p className="font-bold text-slate-900 text-sm">{res.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Flat {res.flatNo}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0">
           {selectedUser ? (
             <GlassCard className="flex-1 flex flex-col p-0 bg-white border-slate-100 shadow-xl rounded-[2rem] overflow-hidden">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black">
                         {selectedUser.name.charAt(0)}
                      </div>
                      <div className="text-left">
                         <h4 className="font-bold">{selectedUser.name}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Authorized Resident • Flat {selectedUser.flatNo}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Member Online</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-slate-50/50">
                   {messages.map((m, i) => (
                     <div key={i} className={`flex ${m.senderId !== selectedUser._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-5 rounded-3xl text-sm ${
                           m.senderId !== selectedUser._id 
                             ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                             : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                        }`}>
                           <p className="font-medium leading-relaxed">{m.content}</p>
                           <div className="text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40">
                              {new Date(m.createdAt).toLocaleTimeString()}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-4 shrink-0">
                   <input 
                    placeholder="Provide assistance or information..." 
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                   />
                   <button 
                    type="submit"
                    className="btn btn-primary px-8 rounded-2xl flex items-center gap-3"
                    disabled={loading}
                   >
                     <Send size={18} /> {loading ? 'Sending...' : 'Dispatch'}
                   </button>
                </form>
             </GlassCard>
           ) : (
             <GlassCard className="flex-1 flex flex-col items-center justify-center text-center gap-6 bg-white border-none shadow-sm rounded-[3rem]">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-200">
                   <MessageSquare size={48} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900">No Citizen Selected</h3>
                   <p className="text-slate-400 font-medium max-w-xs mx-auto">Select a resident from the directory to start a new service conversation.</p>
                </div>
             </GlassCard>
           )}
        </div>
      </div>
    </div>
  );
};
