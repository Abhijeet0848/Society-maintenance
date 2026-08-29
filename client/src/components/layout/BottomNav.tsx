import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, CreditCard, HelpCircle, User } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isPublicPage = location.pathname === '/';

  const userId = user._id || user.id;

  // Do not render on login/register/landing or if user not logged in
  if (isAuthPage || isPublicPage || !userId) return null;

  const tabs = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/notices', label: 'Notices', icon: Shield },
    { to: '/maintenance', label: 'Bills', icon: CreditCard },
    { to: '/complaints', label: 'Helpdesk', icon: HelpCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 text-decoration-none min-w-[54px] ${
                isActive ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600 shadow-sm scale-105' : 'text-slate-500'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
