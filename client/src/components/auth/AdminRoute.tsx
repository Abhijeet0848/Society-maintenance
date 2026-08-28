import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export const AdminRoute = ({ children }: { children?: ReactNode }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user._id) {
      setIsVerified(false);
      return;
    }

    // Verify role with backend to prevent "Inspect Element" bypasses
    fetchWithAuth('/api/auth/verify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id }),
    })
      .then(res => res.json())
      .then(data => {
        setIsVerified(data.verified === true);
      })
      .catch(() => {
        setIsVerified(false);
      });
  }, []);

  if (isVerified === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold text-xs uppercase tracking-[0.2em]">Authenticating Staff Credentials...</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="container py-40 text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-100/20 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 shadow-xl shadow-red-100">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight italic">Security Breach Attempt</h2>
            <p className="text-slate-500 font-medium mt-3 max-w-sm mx-auto leading-relaxed">
              Unauthorized access detected. This attempt has been logged. Please contact the Vrundavan IT department if you believe this is an error.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="btn btn-secondary px-8 py-3 text-xs font-black uppercase tracking-widest border-slate-200"
          >
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

