import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  User, 
  Shield, 
  Lock, 
  Bell, 
  Home, 
  LogOut, 
  Camera,
  X,
  QrCode,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('IDENTITY');
  const [status, setStatus] = useState('');
  
  // 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [secLoading, setSecLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser._id) {
       setUser(storedUser);
       setIs2FAEnabled(storedUser.twoFactorEnabled || false);
    } else {
       navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const setup2FA = async () => {
    setSecLoading(true);
    try {
        const res = await fetchWithAuth('/api/security/setup-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        const data = await res.json();
        setTwoFactorData(data);
        setShow2FAModal(true);
    } catch (err) {
        console.error('Failed to setup 2FA');
    } finally {
        setSecLoading(false);
    }
  };

  const confirm2FA = async () => {
    setSecLoading(true);
    try {
        const res = await fetchWithAuth('/api/security/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: user._id, 
                secret: twoFactorData.secret,
                code: verificationCode
            })
        });
        if (res.ok) {
            setIs2FAEnabled(true);
            const updatedUser = { ...user, twoFactorEnabled: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShow2FAModal(false);
            setStatus('2FA Protocol Activated');
            setTimeout(() => setStatus(''), 3000);
        }
    } catch (err) {
        console.error('Failed to verify 2FA');
    } finally {
        setSecLoading(false);
    }
  };

  const disable2FA = async () => {
    setSecLoading(true);
    try {
        await fetchWithAuth('/api/security/disable-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        });
        setIs2FAEnabled(false);
        const updatedUser = { ...user, twoFactorEnabled: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setStatus('Security Shield Deactivated');
        setTimeout(() => setStatus(''), 3000);
    } catch (err) {
        console.error('Failed to disable 2FA');
    } finally {
        setSecLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-blue-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Secure Profile</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Account <span className="text-blue-600">Preferences</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Manage your identity and residency credentials.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full md:w-auto btn flex items-center justify-center gap-2 sm:gap-3 bg-red-50 text-red-600 border-none px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-100/50"
        >
          <LogOut size={16} /> Exit Platform
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Left Column: Avatar */}
        <div className="flex flex-col gap-4 sm:gap-8">
           <GlassCard className="flex flex-col items-center gap-4 sm:gap-6 py-8 sm:py-12 bg-white border-none shadow-sm relative overflow-hidden group rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
              <div className="relative">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[3rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl sm:text-5xl font-black text-blue-600 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    {user.name?.charAt(0) || 'U'}
                 </div>
                 <button className="absolute bottom-0 right-0 p-2 sm:p-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-white hover:bg-blue-700 transition-all">
                    <Camera size={14} className="sm:w-4 sm:h-4" />
                 </button>
              </div>
              <div className="text-center flex flex-col gap-0.5 sm:gap-1">
                 <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                 <p className="text-xs sm:text-sm font-bold text-slate-400 flex items-center justify-center gap-1.5 uppercase tracking-widest">
                    <Home size={13} className="text-blue-500" /> Flat {user.flatNo || 'D-108'}
                 </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-1 sm:mt-2">
                 <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {user.role}
                 </span>
                 <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {is2FAEnabled ? 'Shield Active' : 'Verified'}
                 </span>
              </div>
           </GlassCard>

           <GlassCard className="p-0 overflow-hidden bg-white border-none shadow-sm rounded-2xl sm:rounded-[2.5rem]">
              <div className="flex flex-col divide-y divide-slate-50">
                 {[
                   { id: 'IDENTITY', icon: User, label: "Identity & Bio" },
                   { id: 'SECURITY', icon: Lock, label: "Security & Passwords" },
                   { id: 'NOTIFS', icon: Bell, label: "Notification Hub" },
                   { id: 'PRIVACY', icon: Shield, label: "Society Privacy" },
                 ].map((item) => (
                   <button 
                     key={item.id}
                     onClick={() => setActiveTab(item.id)}
                     className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left font-bold text-xs sm:text-sm transition-all ${
                       activeTab === item.id 
                         ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                         : 'text-slate-500 hover:bg-slate-50'
                     }`}
                   >
                     <item.icon size={16} className="sm:w-5 sm:h-5 shrink-0" />
                     <span>{item.label}</span>
                   </button>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard className="bg-white border-none shadow-sm p-5 sm:p-10 rounded-3xl flex flex-col gap-6 sm:gap-8">
               {activeTab === 'IDENTITY' && (
                 <div className="flex flex-col gap-5 sm:gap-6 animate-fade-in">
                    <div className="flex flex-col gap-1 pb-4 border-b border-slate-50">
                       <h3 className="text-lg sm:text-2xl font-bold text-slate-900">Personal Details</h3>
                       <p className="text-xs sm:text-sm text-slate-500 font-medium">Update your profile information on the society register.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                          <input 
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-slate-900 font-bold outline-none text-sm" 
                            defaultValue={user.name} 
                            readOnly 
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                          <input 
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-slate-900 font-bold outline-none text-sm" 
                            defaultValue={user.email} 
                            readOnly 
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Flat Number</label>
                          <input 
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-slate-900 font-bold outline-none text-sm" 
                            defaultValue={user.flatNo || 'N/A'} 
                            readOnly 
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Role / Status</label>
                          <input 
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl text-slate-900 font-bold outline-none text-sm" 
                            defaultValue={user.role || 'RESIDENT'} 
                            readOnly 
                          />
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'SECURITY' && (
                  <div className="flex flex-col gap-6 sm:gap-10 animate-fade-in">
                     <div className="flex flex-col gap-4 sm:gap-8">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl"><Shield size={20} className="sm:w-6 sm:h-6" /></div>
                           <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Security Hardening</h3>
                        </div>
                        <div className={`p-5 sm:p-10 rounded-2xl sm:rounded-[3rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-all duration-500 ${is2FAEnabled ? 'bg-emerald-900 text-white shadow-xl' : 'bg-slate-50'}`}>
                           <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm border transition-all shrink-0 ${is2FAEnabled ? 'bg-emerald-500/20 text-emerald-400 border-white/10' : 'bg-white text-slate-400 border-slate-100'}`}>
                                 {is2FAEnabled ? <ShieldCheck size={24} className="sm:w-8 sm:h-8" /> : <Lock size={24} className="sm:w-8 sm:h-8" />}
                              </div>
                              <div>
                                 <p className={`text-base sm:text-xl font-black tracking-tight ${is2FAEnabled ? 'text-white' : 'text-slate-900'}`}>Two-Factor Authentication</p>
                                 <p className={`text-xs font-medium max-w-sm mt-0.5 sm:mt-1 leading-relaxed ${is2FAEnabled ? 'text-emerald-200' : 'text-slate-500'}`}>
                                    {is2FAEnabled ? 'Your account is under heavy encryption. Unauthorized access is prevented.' : 'Establish a secondary layer of identity verification to shield your digital account.'}
                                 </p>
                              </div>
                           </div>
                           {is2FAEnabled ? (
                               <button 
                                   onClick={disable2FA}
                                   className="w-full md:w-auto btn bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 sm:px-10 py-3 sm:py-4 text-[10px] font-black uppercase tracking-widest relative z-10 active:scale-95 transition-all"
                                   disabled={secLoading}
                               >
                                   {secLoading ? 'Processing...' : 'Disable Shield'}
                               </button>
                           ) : (
                               <button 
                                   onClick={setup2FA}
                                   className="w-full md:w-auto btn btn-secondary border-none shadow-xl shadow-black/5 px-6 sm:px-10 py-3 sm:py-4 text-[10px] font-black uppercase tracking-widest relative z-10 active:scale-95 transition-all"
                                   disabled={secLoading}
                               >
                                   {secLoading ? 'Initiating...' : 'Enable Shield'}
                               </button>
                           )}
                        </div>
                     </div>

                     <div className="flex flex-col gap-4 sm:gap-8 border-t border-slate-50 pt-6 sm:pt-10">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl"><Lock size={20} className="sm:w-6 sm:h-6" /></div>
                           <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Active Sessions</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                           <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 sm:gap-4">
                                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0"><Home size={18} /></div>
                                 <div>
                                    <p className="text-xs sm:text-sm font-black text-slate-900 uppercase">Current Session</p>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active now • Vrundavan Portal</p>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">Primary</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {(activeTab === 'NOTIFS' || activeTab === 'PRIVACY') && (
                  <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 sm:gap-6 animate-fade-in text-center">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        {activeTab === 'NOTIFS' ? <Bell size={32} className="sm:w-10 sm:h-10" /> : <Shield size={32} className="sm:w-10 sm:h-10" />}
                     </div>
                     <div className="flex flex-col gap-1 sm:gap-2">
                        <h4 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Refining Configuration</h4>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">We're tailoring these granular settings to match your residency tier.</p>
                     </div>
                  </div>
               )}

               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-10 mt-4 sm:mt-6 border-t border-slate-50">
                  <button 
                   onClick={() => {
                     setStatus('Preferences Synchronized!');
                     setTimeout(() => setStatus(''), 3000);
                   }}
                   className="btn btn-primary px-8 sm:px-12 py-3.5 sm:py-5 text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 w-full sm:w-auto"
                  >
                    Save Changes
                  </button>
                  <button className="btn bg-white border border-slate-200 text-slate-400 px-6 sm:px-10 py-3.5 sm:py-5 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all w-full sm:w-auto">Discard</button>
               </div>
               {status && <p className="text-center font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600 animate-fade-in mt-2">{status}</p>}
            </GlassCard>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && twoFactorData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShow2FAModal(false)}></div>
           <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 relative overflow-hidden rounded-3xl sm:rounded-[2.5rem]">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                 <div className="flex items-center gap-2">
                    <QrCode size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encryption Enrollment</span>
                 </div>
                 <button onClick={() => setShow2FAModal(false)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                    <X size={18} />
                 </button>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                 <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-3xl font-black text-slate-900">Establish 2FA Shield</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">Scan the QR code with Google Authenticator or Microsoft Auth app.</p>
                 </div>

                 <div className="flex flex-col items-center gap-4 p-6 sm:p-10 bg-slate-50 rounded-2xl sm:rounded-[3rem] border border-slate-100">
                    <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-[2rem] shadow-xl border-4 border-white">
                        <img src={twoFactorData.qrUrl} alt="2FA QR Code" className="w-36 h-36 sm:w-48 sm:h-48" />
                    </div>
                    <div className="text-center w-full">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Manual Entry Key</p>
                        <code className="block bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-slate-100 font-black text-xs sm:text-base tracking-widest text-blue-600 shadow-sm border-dashed truncate">
                           {twoFactorData.secret}
                        </code>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Authentication Code</label>
                    <div className="relative">
                       <ShieldCheck className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input 
                        type="text" 
                        maxLength={6}
                        placeholder="0 0 0 0 0 0"
                        className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3.5 sm:py-5 bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none text-center" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                       />
                    </div>
                    <div className="flex items-start gap-2.5 p-3 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100 text-amber-700">
                       <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                       <p className="text-[10px] sm:text-[11px] font-medium leading-relaxed italic">Confirming this step will lock your account with mandatory 2FA on next login.</p>
                    </div>
                 </div>

                 <button 
                  onClick={confirm2FA}
                  className="btn btn-primary w-full py-4 sm:py-5 text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all rounded-2xl"
                  disabled={secLoading || verificationCode.length !== 6}
                 >
                    {secLoading ? 'Finalizing...' : 'Activate Shield'}
                 </button>
              </div>
           </GlassCard>
        </div>
      )}
    </div>
  );
};
