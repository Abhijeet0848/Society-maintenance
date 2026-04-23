import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../services/api';
import { 
  Home, 
  Shield, 
  HelpCircle, 
  CreditCard, 
  Calendar, 
  Users, 
  Menu, 
  X, 
  Bell, 
  LogOut,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user._id) {
       fetchNotifications();
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user._id]);

  const fetchNotifications = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/notifications/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications');
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetchWithAuth(`http://localhost:5000/api/notifications/read/${id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notif read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/notices', label: 'Notices', icon: Shield },
    { to: '/complaints', label: 'Helpdesk', icon: HelpCircle },
    { to: '/maintenance', label: 'Maintenance', icon: CreditCard },
    { to: '/facilities', label: 'Amenities', icon: Calendar },
    { to: '/directory', label: 'Directory', icon: Users },
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPublicPage = location.pathname === '/';

  if (isAuthPage || isPublicPage) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = (notif: any) => {
    if (notif._id) markRead(notif._id);
    setShowNotifs(false);
    
    // Smart Redirection based on Notification Content
    const text = (notif.title + ' ' + (notif.message || '')).toLowerCase();
    
    if (text.includes('maintenance') || text.includes('bill') || text.includes('pay')) {
       navigate('/maintenance');
    } else if (text.includes('notice') || text.includes('circular') || text.includes('broadcast')) {
       navigate('/notices');
    } else if (text.includes('complaint') || text.includes('helpdesk') || text.includes('ticket')) {
       navigate('/complaints');
    } else if (text.includes('amenity') || text.includes('booking') || text.includes('facility')) {
       navigate('/facilities');
    } else if (text.includes('profile')) {
       navigate('/profile');
    } else {
       navigate('/notifications');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 group flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs rotate-12 group-hover:rotate-0 transition-all duration-500">BH</div>
              <span>Society<span className="text-blue-600">Hub</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all text-decoration-none ${location.pathname === link.to ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <link.icon size={18} /> {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-4 relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border relative ${showNotifs ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border-slate-100'}`}
                >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                      <span className="absolute top-[-2px] right-[-2px] w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                         {unreadCount}
                      </span>
                   )}
                </button>

                {/* Notifications Panel */}
                {showNotifs && (
                  <div className="absolute top-14 right-0 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-2xl animate-fade-in overflow-hidden z-[1000]">
                     <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                     </div>
                     <div className="max-h-[400px] overflow-y-auto flex flex-col">
                        {notifications.length > 0 ? notifications.map((notif, i) => (
                          <div 
                            key={i} 
                            className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 relative ${!notif.read ? 'bg-blue-50/10' : ''}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                             <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                    notif.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 
                                    notif.type === 'WARNING' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                                }`}>
                                   {notif.type === 'SUCCESS' ? <CheckCircle2 size={18} /> : 
                                    notif.type === 'WARNING' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                </div>
                                <div className="flex flex-col gap-1">
                                   <p className="text-xs font-bold text-slate-900 leading-tight">{notif.title}</p>
                                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                      {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                   </p>
                                </div>
                             </div>
                             {!notif.read && <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                          </div>
                        )) : (
                          <div className="p-12 text-center flex flex-col items-center gap-4">
                             <Bell size={32} className="text-slate-100" />
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">All caught up</p>
                          </div>
                        )}
                     </div>
                     <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                        <Link 
                          to="/notifications" 
                          onClick={() => setShowNotifs(false)}
                          className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2 text-decoration-none"
                        >
                           View All Activity <ChevronRight size={12} />
                        </Link>
                     </div>
                  </div>
                )}

                 <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-slate-100 text-decoration-none group">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                       <Users size={20} />
                    </div>
                 </Link>

                 {user.role === 'ADMIN' && (
                    <>
                      <Link 
                        to="/admin" 
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${location.pathname === '/admin' ? 'bg-amber-600 text-white border-amber-600' : 'text-amber-500 hover:bg-amber-50 border-amber-100'}`}
                        title="Incharge Panel"
                      >
                         <Shield size={20} />
                      </Link>
                      <Link 
                        to="/admin/messages" 
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${location.pathname === '/admin/messages' ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-500 hover:bg-blue-50 border-blue-100'}`}
                        title="Service Hub"
                      >
                         <MessageSquare size={20} />
                      </Link>
                    </>
                 )}

                 <button 
                   onClick={handleLogout}
                   className="w-11 h-11 rounded-2xl flex items-center justify-center text-red-500 hover:text-white hover:bg-red-600 transition-all border border-red-50"
                   title="Logout"
                 >
                    <LogOut size={20} />
                 </button>
             </div>

             <button className="lg:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-xl" onClick={toggleMenu}>
               {isOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 animate-slide-down">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${location.pathname === link.to ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <link.icon size={20} /> {link.label}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <Link to="/profile" className="flex items-center gap-4 p-4 text-slate-600 font-bold" onClick={toggleMenu}>
               <Users size={20} /> My Profile
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-red-500 font-bold">
               <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
