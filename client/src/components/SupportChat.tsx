import { useState, useEffect, useRef } from 'react';
import { GlassCard } from "./ui/GlassCard";
import { MessageSquare, Send, X, Shield, Clock } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

export const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  // For residents, we chat with the "Office" (Admins)
  // For simplicity, we'll fetch a generic office ID or 
  // assume the server handles "Office" as a destination.
  // Here we'll hardcode a search for an admin ID to chat with.
  const [adminId, setAdminId] = useState<string>('');

  useEffect(() => {
    if (user._id && !isAdmin) {
       fetchAdminId();
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openSupportChat', handleOpen);
    return () => window.removeEventListener('openSupportChat', handleOpen);
  }, [user._id]);

  useEffect(() => {
    if (isOpen && adminId) {
       fetchMessages();
       const interval = setInterval(fetchMessages, 5000);
       return () => clearInterval(interval);
    }
  }, [isOpen, adminId]);

  useEffect(() => {
    if (chatRef.current) {
       chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAdminId = async () => {
     try {
        await fetchWithAuth('/api/auth/residents');
        setAdminId('OFFICE_RECIPIENT'); // Placeholder logic
     } catch (err) {}
  };

  const fetchMessages = async () => {
    try {
      const res = await fetchWithAuth(`/api/messages/${adminId || 'ADMIN'}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error('Error fetching chat history');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      await fetchWithAuth('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          receiverId: adminId || 'ADMIN',
          content: newMessage
        })
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  if (!user._id || isAdmin) return null; // Only show for residents to contact office

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[1000] flex flex-col items-end gap-3 sm:gap-4 max-w-[100vw]">
      {isOpen && (
        <GlassCard className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-sm h-[480px] max-h-[80vh] bg-white border-slate-100 shadow-2xl rounded-3xl sm:rounded-[2.5rem] flex flex-col p-0 overflow-hidden animate-slide-up">
           <div className="bg-blue-600 p-4 sm:p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Shield size={18} />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">Society Helpdesk</h4>
                    <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Office Representative</p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                 <X size={18} />
              </button>
           </div>

           <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-slate-50/50">
              {messages.length > 0 ? messages.map((m, i) => (
                <div key={i} className={`flex ${m.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm ${
                      m.senderId === user._id 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                   }`}>
                      <p className="font-medium leading-relaxed">{m.content}</p>
                      <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-widest ${m.senderId === user._id ? 'text-blue-200' : 'text-slate-300'}`}>
                         <Clock size={10} className="inline mr-1" /> {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </div>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 gap-3">
                   <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center opacity-40">
                      <MessageSquare size={28} />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      Start a direct chat with the management office for any queries.
                   </p>
                </div>
              )}
           </div>

           <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-50 flex gap-2 sm:gap-3">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-90 shrink-0"
              >
                 <Send size={16} />
              </button>
           </form>
        </GlassCard>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 text-white rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-105 transition-all active:scale-95 group relative"
        aria-label="Open support chat"
      >
         <MessageSquare size={22} className={`sm:w-7 sm:h-7 ${isOpen ? 'hidden' : 'block group-hover:rotate-12 transition-transform'}`} />
         <X size={22} className={`sm:w-7 sm:h-7 ${isOpen ? 'block' : 'hidden'}`} />
         {!isOpen && (
           <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
         )}
      </button>
    </div>
  );
};
