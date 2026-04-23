import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, HelpCircle, CreditCard, Calendar, Users, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Hide Navbar completely on Login and Register pages for a true full-screen experience
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPublicPage = location.pathname === '/';

  if (isAuthPage) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/dashboard", icon: Home, label: "Overview" },
    { to: "/maintenance", icon: CreditCard, label: "Payments" },
    { to: "/complaints", icon: HelpCircle, label: "Helpdesk" },
    { to: "/facilities", icon: Calendar, label: "Amenities" },
    { to: "/residents", icon: Users, label: "Directory" },
    { to: "/admin", icon: Shield, label: "Admin" },
  ];

  return (
    <nav className="glass-card mb-6 sticky top-0 z-[100] border-none shadow-sm" style={{ borderRadius: '0 0 2rem 2rem', padding: '1rem 0', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-decoration-none group">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <Shield size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-slate-900">Vrundavan</span>
        </Link>
        
        {!isPublicPage && (
          <>
            <div className="hidden lg:flex gap-2">
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

            <div className="hidden lg:flex items-center gap-4">
               <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-100">
                  <Bell size={20} />
               </button>
               <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-slate-100 text-decoration-none group">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                     <Users size={20} />
                  </div>
               </Link>
            </div>

            <button className="lg:hidden text-slate-900 p-2 hover:bg-slate-50 rounded-xl" onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}

        {isPublicPage && (
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login">
              <button className="btn btn-secondary py-2.5 px-8 text-sm font-bold border-slate-200">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary py-2.5 px-8 text-sm font-bold shadow-lg shadow-blue-100">Join Society</button>
            </Link>
          </div>
        )}
      </div>

      {!isPublicPage && isOpen && (
        <div className="lg:hidden animate-fade-in px-6 py-6 flex flex-col gap-2 border-t border-slate-50 mt-4 bg-white">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-5 rounded-2xl font-bold transition-all text-decoration-none ${location.pathname === link.to ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <link.icon size={22} /> {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

