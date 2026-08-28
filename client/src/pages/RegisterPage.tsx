import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, MapPin, ArrowRight, HardHat, Users, Key, Sparkles } from 'lucide-react';
import { resolveApiUrl } from '../services/api';

export const RegisterPage = () => {
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [adminCount, setAdminCount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    flatNo: '',
    role: 'RESIDENT',
    adminKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if any admins exist to determine bootstrap mode
    fetch(resolveApiUrl('/api/auth/admin-count'))
      .then(res => res.json())
      .then(data => setAdminCount(data.count))
      .catch(err => console.error('Error fetching admin count:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (admin: boolean) => {
    setIsAdminRegister(admin);
    setFormData({ ...formData, role: admin ? 'ADMIN' : 'RESIDENT' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Only validate Admin Key if registering as incharge AND at least one admin already exists
    if (isAdminRegister && adminCount !== null && adminCount > 0) {
      try {
        const keyResponse = await fetch(resolveApiUrl('/api/config/admin_registration_key'));
        const validKey = await keyResponse.json();
        const keyToCheck = validKey || 'SOCIETY2024';
        
        if (formData.adminKey !== keyToCheck) {
          setError('Invalid Admin Security Key. Please contact the existing committee.');
          setLoading(false);
          return;
        }
      } catch (err) {
        if (formData.adminKey !== 'SOCIETY2024') {
          setError('Could not verify registration key. Try again later.');
          setLoading(false);
          return;
        }
      }
    }

    try {
      const response = await fetch(resolveApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          flatNo: isAdminRegister ? 'OFFICE' : formData.flatNo,
          role: isAdminRegister ? 'ADMIN' : 'RESIDENT'
        }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showKeyField = isAdminRegister && adminCount !== null && adminCount > 0;

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-8 bg-[#f8fafc] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100/30 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-[500px] relative z-10 animate-fade-in">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-600 border border-slate-100">
            <Building size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium mt-1">Join the Vrundavan Digital Community</p>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-white shadow-[0_8px_40px_rgb(0,0,0,0.06)] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 w-full">
          
          {/* Role Switcher */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl relative">
            <button 
              type="button"
              onClick={() => setRole(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all duration-300 z-10 ${!isAdminRegister ? 'text-blue-600 shadow-sm bg-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={16} /> Resident
            </button>
            <button 
              type="button"
              onClick={() => setRole(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all duration-300 z-10 ${isAdminRegister ? 'text-amber-600 shadow-sm bg-white' : 'text-slate-400 hover:text-slate-600'}`}
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

          {isAdminRegister && adminCount === 0 && (
             <div className="py-4 px-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                   <Sparkles size={20} className="animate-spin-slow" />
                   <span className="font-black text-xs uppercase tracking-[0.2em]">First-Time Setup</span>
                </div>
                <p className="text-xs font-medium opacity-90 leading-relaxed">
                   No Incharge found in the system. You can register as the primary administrator without a security key.
                </p>
             </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className={`grid grid-cols-1 ${showKeyField ? 'sm:grid-cols-2' : ''} gap-5`}>
               <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">Full Name</label>
                 <div className="relative flex items-center">
                   <User className="absolute left-4 text-slate-500 pointer-events-none" size={17} />
                   <input 
                     name="name"
                     type="text" 
                     placeholder="John Doe"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-slate-900 transition-all font-semibold text-sm outline-none shadow-sm"
                     required
                   />
                 </div>
               </div>

               {!isAdminRegister && (
                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">Flat Number</label>
                   <div className="relative flex items-center">
                     <MapPin className="absolute left-4 text-slate-500 pointer-events-none" size={17} />
                     <input 
                       name="flatNo"
                       type="text" 
                       placeholder="A-402"
                       value={formData.flatNo}
                       onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-slate-900 transition-all font-semibold text-sm outline-none shadow-sm"
                       required
                     />
                   </div>
                 </div>
               )}

               {showKeyField && (
                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">Admin Key</label>
                   <div className="relative flex items-center">
                     <Key className="absolute left-4 text-amber-600 pointer-events-none" size={17} />
                     <input 
                       name="adminKey"
                       type="password" 
                       placeholder="••••••••"
                       value={formData.adminKey}
                       onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:bg-white focus:border-amber-600 focus:ring-4 focus:ring-amber-500/15 rounded-2xl text-slate-900 transition-all font-semibold text-sm outline-none shadow-sm"
                       required
                     />
                   </div>
                 </div>
               )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-500 pointer-events-none" size={17} />
                <input 
                  name="email"
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-slate-900 transition-all font-semibold text-sm outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 ml-1">Create Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-500 pointer-events-none" size={17} />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-slate-900 transition-all font-semibold text-sm outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 mt-4 text-sm font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-300 flex gap-3 items-center justify-center outline-none active:scale-95 ${isAdminRegister ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25 text-white' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 text-white'}`} 
              disabled={loading}
            >
              {loading ? 'Processing...' : (isAdminRegister && adminCount === 0 ? 'Initialize Admin Account' : `Register as ${isAdminRegister ? 'Incharge' : 'Resident'}`)}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600 font-semibold">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

