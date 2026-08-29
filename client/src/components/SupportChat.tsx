import { useState, useEffect, useRef } from 'react';
import { GlassCard } from "./ui/GlassCard";
import { MessageSquare, Send, X, Clock, Bot, Sparkles } from 'lucide-react';
import { fetchWithAuth } from '../services/api';

interface ChatMessage {
  _id?: string;
  senderId: string;
  receiverId?: string;
  content: string;
  isBot?: boolean;
  createdAt: string | Date;
}

export const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id || user.id;
  const isAdmin = user.role === 'ADMIN';

  // Quick suggestion chips for common resident queries
  const quickQuestions = [
    { label: "💳 Pay Maintenance", query: "How do I pay my maintenance dues?" },
    { label: "🛠️ Raise Complaint", query: "How to register a repair complaint?" },
    { label: "🏊 Facility Timings", query: "What are the clubhouse and swimming pool timings?" },
    { label: "🚨 Security & Gate", query: "How to contact society security gate?" },
  ];

  useEffect(() => {
    if (userId && !isAdmin) {
      fetchAdminId();
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openSupportChat', handleOpen);
    return () => window.removeEventListener('openSupportChat', handleOpen);
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen, userId, adminId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  const fetchAdminId = async () => {
    try {
      const res = await fetchWithAuth('/api/auth/admins');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAdminId(data[0]._id);
      } else {
        setAdminId('ADMIN');
      }
    } catch {
      setAdminId('ADMIN');
    }
  };

  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const res = await fetchWithAuth(`/api/messages/${adminId || 'ADMIN'}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length === 0 && messages.length === 0) {
          // Welcome message from Bot
          setMessages([
            {
              senderId: 'BOT',
              content: `Hello ${user.name || 'Resident'}! 👋 I am your Vrundavan Society Assistant. How can I help you today? You can ask about maintenance bills, complaints, club bookings, or committee contacts.`,
              isBot: true,
              createdAt: new Date().toISOString()
            }
          ]);
        } else if (data.length > 0) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const getBotResponse = (query: string): string | null => {
    const q = query.toLowerCase();

    if (q.includes('maintenance') || q.includes('bill') || q.includes('pay') || q.includes('due')) {
      return "💳 Maintenance Dues: You can view and pay your monthly maintenance bill online under the 'Bills' tab in the navigation menu. Invoices and receipts are instantly downloadable.";
    }
    if (q.includes('complaint') || q.includes('leak') || q.includes('repair') || q.includes('plumb') || q.includes('electric')) {
      return "🛠️ Complaints: To file a new maintenance or repair request, head to the 'Helpdesk' (Complaints) page and click 'Raise New Ticket'. Our society management tracks every issue until resolved.";
    }
    if (q.includes('facility') || q.includes('club') || q.includes('pool') || q.includes('gym') || q.includes('book') || q.includes('timing')) {
      return "🏊 Amenities: Club House, Gymnasium, and Swimming Pool are open daily from 6:00 AM to 10:00 PM (Pool closed on Mondays for cleaning). You can reserve slots from the 'Facilities' tab.";
    }
    if (q.includes('security') || q.includes('gate') || q.includes('guard') || q.includes('emergency') || q.includes('contact')) {
      return "🚨 Society Office & Gate Security: Main Gate Intercom: Dial Ext. 101 / Emergency Security Desk: +91 98765 43210. Management Office hours: 10:00 AM - 7:00 PM.";
    }
    if (q.includes('notice') || q.includes('announcement') || q.includes('meeting') || q.includes('circular')) {
      return "📢 Official Notices: Check the 'Notices' tab on your navigation bar for all official circulars, AGM updates, and committee broadcasts.";
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hi ${user.name || 'there'}! 😊 How can I assist you with Vrundavan Society services today?`;
    }

    return "Thank you for reaching out. Your inquiry has been forwarded to the Society Management Committee. An administrator will review and get back to you shortly.";
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || newMessage).trim();
    if (!textToSend || !userId) return;
    
    setLoading(true);
    setNewMessage('');

    // Optimistically add user message
    const userMsg: ChatMessage = {
      senderId: userId,
      receiverId: adminId || 'ADMIN',
      content: textToSend,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    // Send to backend database for committee records
    try {
      await fetchWithAuth('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: adminId || 'ADMIN',
          content: textToSend
        })
      });
    } catch (err) {
      console.error('Failed to post message to backend:', err);
    } finally {
      setLoading(false);
    }

    // Trigger instant chatbot reply
    const botReply = getBotResponse(textToSend);
    if (botReply) {
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setMessages(prev => [
          ...prev,
          {
            senderId: 'BOT',
            content: botReply,
            isBot: true,
            createdAt: new Date().toISOString()
          }
        ]);
      }, 750);
    }
  };

  if (!userId || isAdmin) return null; // Only show for residents

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[1000] flex flex-col items-end gap-3 sm:gap-4 max-w-[100vw]">
      {isOpen && (
        <GlassCard className="w-[calc(100vw-2rem)] sm:w-[400px] max-w-sm h-[520px] max-h-[80vh] bg-white border border-slate-200 shadow-2xl rounded-3xl sm:rounded-[2.5rem] flex flex-col p-0 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-white">Society Helpdesk</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-blue-100 font-medium">AI Assistant & Office Desk</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
              aria-label="Close support chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3 bg-slate-50">
            {messages.map((m, i) => {
              const isMine = m.senderId === userId;
              const isBotMsg = m.isBot || m.senderId === 'BOT';

              return (
                <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {isBotMsg && (
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles size={11} /> Helpdesk Assistant
                    </span>
                  )}
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMine 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md font-semibold' 
                      : isBotMsg
                        ? 'bg-blue-50 text-blue-950 border border-blue-200/80 rounded-tl-none shadow-sm font-medium'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-sm font-semibold'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${
                      isMine ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      <Clock size={10} className="inline mr-1" /> 
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isBotTyping && (
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 p-2.5 rounded-2xl border border-blue-100 w-fit">
                <Bot size={14} className="animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full text-[10px] font-bold text-slate-700 hover:text-blue-700 whitespace-nowrap transition-all shadow-2xs"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} 
            className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0"
          >
            <input 
              type="text" 
              placeholder="Ask anything or message office..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !newMessage.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50 active:scale-95 shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </GlassCard>
      )}

      {/* Floating Action Button - Positioned above BottomNav on mobile (bottom-20) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl hover:scale-105 transition-all active:scale-95 group relative border-2 border-white/80"
        aria-label="Open society helpdesk chat"
      >
        <MessageSquare size={22} className={`sm:w-6 sm:h-6 ${isOpen ? 'hidden' : 'block group-hover:rotate-12 transition-transform'}`} />
        <X size={22} className={`sm:w-6 sm:h-6 ${isOpen ? 'block' : 'hidden'}`} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};
