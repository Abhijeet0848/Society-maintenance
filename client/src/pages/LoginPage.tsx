import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Users, HardHat, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token); // Store cryptographic session token
        
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          if (isAdminLogin) {
             setError('Incharge access only.');
             localStorage.removeItem('user');
             localStorage.removeItem('token');
          } else {
             navigate('/dashboard');
          }
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-8 bg-[#f8fafc] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100/30 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[440px] relative z-10 animate-fade-in">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-600 border border-slate-100">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vrundavan Society</h1>
            <p className="text-slate-500 font-medium mt-1">Sign in to your account</p>
          </div>
        </div>

        {/* Login Card wrapper - standard div to prevent class conflict from GlassCard */}
        <div className="bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_40px_rgb(0,0,0,0.06)] rounded-[2rem] p-8 sm:p-10 flex flex-col gap-8">
          
          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl relative">
            <button 
              type="button"
              onClick={() => { setIsAdminLogin(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all duration-300 z-10 ${!isAdminLogin ? 'text-blue-600 shadow-sm bg-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={16} /> Resident
            </button>
            <button 
              type="button"
              onClick={() => { setIsAdminLogin(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all duration-300 z-10 ${isAdminLogin ? 'text-amber-600 shadow-sm bg-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <HardHat size={16} /> Incharge
            </button>
          </div>

          {error && (
             <div className="py-3 px-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                {error}
             </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-400 pointer-events-none" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-slate-900 transition-all font-medium placeholder:text-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-400 pointer-events-none" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-slate-900 transition-all font-medium placeholder:text-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-medium px-1 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                Keep me logged in
              </label>
              <Link to="#" className={`${isAdminLogin ? 'text-amber-600' : 'text-blue-600'} font-bold hover:underline`}>Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 mt-2 text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 flex gap-3 items-center justify-center outline-none ${isAdminLogin ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 text-white'}`} 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In To Portal'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-medium">
            New to Vrundavan Society? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register your flat</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
