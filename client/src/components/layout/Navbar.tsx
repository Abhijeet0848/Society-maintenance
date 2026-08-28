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
      const res = await fetchWithAuth(`/api/notifications/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications');
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetchWithAuth(`/api/notifications/read/${id}`, { method: 'PATCH' });
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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-12">
            <Link to="/" className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 group flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs rotate-12 group-hover:rotate-0 transition-all duration-500">BH</div>
              <span>Society<span className="text-blue-600">Hub</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 xl:px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all text-decoration-none ${location.pathname === link.to ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'}`}
                >
                  <link.icon size={18} /> {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             {/* Notification Bell (Visible on both Desktop & Mobile Header) */}
             <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border relative ${showNotifs ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'}`}
                  aria-label="Notifications"
                >
                   <Bell size={18} className="sm:w-5 sm:h-5" />
                   {unreadCount > 0 && (
                      <span className="absolute top-[-2px] right-[-2px] w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                         {unreadCount}
                      </span>
                   )}
                </button>

                {/* Notifications Panel */}
                {showNotifs && (
                  <div className="fixed sm:absolute top-16 sm:top-14 right-2 sm:right-0 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] shadow-2xl animate-fade-in overflow-hidden z-[1000]">
                     <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Notifications</h4>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">{unreadCount} New</span>
                     </div>
                     <div className="max-h-[350px] overflow-y-auto flex flex-col">
                        {notifications.length > 0 ? notifications.map((notif, i) => (
                          <div 
                            key={i} 
                            className={`p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 relative ${!notif.read ? 'bg-blue-50/20' : ''}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                             <div className="flex gap-3 sm:gap-4">
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center ${
                                    notif.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                    notif.type === 'WARNING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                   {notif.type === 'SUCCESS' ? <CheckCircle2 size={16} /> : 
                                    notif.type === 'WARNING' ? <AlertTriangle size={16} /> : <Info size={16} />}
                                </div>
                                <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
                                   <p className="text-xs font-extrabold text-slate-900 leading-tight truncate">{notif.title}</p>
                                   <p className="text-xs text-slate-600 font-semibold leading-relaxed line-clamp-2">{notif.message}</p>
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                      {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                   </p>
                                </div>
                             </div>
                             {!notif.read && <div className="absolute top-5 right-4 w-2 h-2 bg-blue-600 rounded-full" />}
                          </div>
                        )) : (
                          <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-3">
                             <Bell size={28} className="text-slate-300" />
                             <p className="text-xs font-bold uppercase tracking-wider text-slate-500">All caught up</p>
                          </div>
                        )}
                     </div>
                     <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100">
                        <Link 
                          to="/notifications" 
                          onClick={() => setShowNotifs(false)}
                          className="w-full py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-all flex items-center justify-center gap-2 text-decoration-none shadow-sm"
                        >
                           View All Activity <ChevronRight size={14} />
                        </Link>
                     </div>
                  </div>
                )}
             </div>

             {/* Desktop Quick Links */}
             <div className="hidden lg:flex items-center gap-3">
                 <Link to="/profile" className="flex items-center gap-2 pl-3 border-l border-slate-200 text-decoration-none group" title="My Profile">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                       <Users size={20} />
                    </div>
                 </Link>

                 {user.role === 'ADMIN' && (
                    <>
                      <Link 
                        to="/admin" 
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${location.pathname === '/admin' ? 'bg-amber-600 text-white border-amber-600' : 'text-amber-700 hover:bg-amber-50 border-amber-200'}`}
                        title="Incharge Panel"
                      >
                         <Shield size={20} />
                      </Link>
                      <Link 
                        to="/admin/messages" 
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${location.pathname === '/admin/messages' ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-700 hover:bg-blue-50 border-blue-200'}`}
                        title="Service Hub"
                      >
                         <MessageSquare size={20} />
                      </Link>
                    </>
                 )}

                 <button 
                   onClick={handleLogout}
                   className="w-11 h-11 rounded-2xl flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 transition-all border border-red-200"
                   title="Logout"
                 >
                    <LogOut size={20} />
                 </button>
             </div>

             {/* Mobile Hamburger Toggle */}
             <button 
               className="lg:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-xl focus:outline-none" 
               onClick={toggleMenu}
               aria-label="Toggle navigation menu"
             >
               {isOpen ? <X size={22} /> : <Menu size={22} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed top-16 sm:top-20 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-y-auto z-[99]">
          <div className="flex flex-col p-4 sm:p-6 gap-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-3 py-1">Navigation</div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMenu}
                className={`flex items-center gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl font-extrabold text-sm transition-all ${location.pathname === link.to ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <link.icon size={18} /> {link.label}
              </Link>
            ))}

            {user.role === 'ADMIN' && (
              <>
                <div className="text-xs font-black uppercase tracking-wider text-amber-700 px-3 pt-3">Administration</div>
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className={`flex items-center gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl font-extrabold text-sm transition-all ${location.pathname === '/admin' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'}`}
                >
                  <Shield size={18} /> Incharge Dashboard
                </Link>
                <Link
                  to="/admin/messages"
                  onClick={toggleMenu}
                  className={`flex items-center gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl font-extrabold text-sm transition-all ${location.pathname === '/admin/messages' ? 'bg-blue-600 text-white' : 'text-blue-800 bg-blue-50 hover:bg-blue-100'}`}
                >
                  <MessageSquare size={18} /> Service Hub & Messages
                </Link>
              </>
            )}

            <div className="h-px bg-slate-200 my-2" />
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-3 py-1">Account</div>
            
            <Link 
              to="/profile" 
              className={`flex items-center gap-3.5 p-3 sm:p-4 rounded-xl font-extrabold text-sm ${location.pathname === '/profile' ? 'bg-blue-600 text-white' : 'text-slate-800 hover:bg-slate-100'}`}
              onClick={toggleMenu}
            >
               <Users size={18} /> My Profile & Security
            </Link>

            <button 
              onClick={() => { toggleMenu(); handleLogout(); }} 
              className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl text-red-600 font-extrabold text-sm hover:bg-red-50 text-left w-full mt-2"
            >
               <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
