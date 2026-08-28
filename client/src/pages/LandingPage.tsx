import { Link } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import { Shield, CreditCard, HelpCircle, Bell, Users, CheckCircle2, Star } from 'lucide-react';

export const LandingPage = () => {
  const features = [
    { title: "One-Click Payments", desc: "Pay your maintenance dues instantly via UPI, Cards or Net Banking.", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Online Helpdesk", desc: "Raise maintenance complaints and track resolution status in real-time.", icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Digital Notices", desc: "Stay updated with important announcements and society circulars.", icon: Bell, color: "text-red-500", bg: "bg-red-50" },
    { title: "Resident Directory", desc: "Securely connect with your neighbors and committee members.", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-8 sm:py-16 animate-fade-in text-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 sm:gap-10 px-2 sm:px-4">
        <div className="px-4 sm:px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-bold border border-blue-100 animate-fade-in inline-flex items-center gap-2">
          <Shield size={16} /> Trusted by 500+ Luxury Societies
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl leading-[1.15]">
          Vrundavan Society <br /><span className="text-blue-600">Digital Experience</span>
        </h1>
        <p className="text-base sm:text-xl max-w-2xl text-slate-500 leading-relaxed px-2">
          The official digital portal for Vrundavan Society. Experience modern community living with seamless payments, instant communication, and transparency.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full justify-center max-w-md sm:max-w-none">
          <Link to="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-xl shadow-blue-200">Join Our Society</Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl bg-white border-slate-200 hover:bg-slate-50">Member Login</Button>
          </Link>
        </div>
      </section>

      {/* Galaxy Apartment Showcase Section */}
      <section className="w-full">
        <div className="relative group overflow-hidden rounded-3xl sm:rounded-[3rem] shadow-2xl shadow-blue-200/50">
          <img 
            src="/galaxy_apartment.png" 
            alt="Galaxy Apartment" 
            className="w-full h-[360px] sm:h-[480px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent flex flex-col justify-end p-6 sm:p-12 text-left">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
               <div className="flex gap-1 text-amber-400">
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
               </div>
               <span className="text-white/80 font-bold text-xs sm:text-sm tracking-widest uppercase">Premier Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-2 sm:mb-4 tracking-tighter">Galaxy Apartment</h2>
            <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
              A flagship residence of Vrundavan Society. Experience futuristic architecture, ultra-modern amenities, and a community like no other.
            </p>
            <div className="mt-4 sm:mt-8 flex flex-wrap gap-4 sm:gap-6">
               <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">120+</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Luxury Units</span>
               </div>
               <div className="border-l border-white/20 h-8 sm:h-10 self-center" />
               <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">25+</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Amenities</span>
               </div>
               <div className="border-l border-white/20 h-8 sm:h-10 self-center" />
               <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Gold</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">Certification</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Everything You Need</h2>
          <p className="text-sm sm:text-base text-slate-500">Simplify your daily society interactions with our integrated services.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, i) => (
            <div key={i} className="glass-card flex flex-col items-center text-center gap-4 sm:gap-6 group hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 border-none bg-white shadow-sm">
              <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <feature.icon size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="glass-card bg-slate-900 text-white border-none py-10 sm:py-16 px-6 sm:px-10 rounded-3xl sm:rounded-[3rem] overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
         </div>
         
         <div className="relative z-10 grid md:grid-cols-2 gap-8 sm:gap-12 items-center text-left">
            <div className="flex flex-col gap-6 sm:gap-8">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">Manage Your Home <br /> From Anywhere.</h2>
              <div className="flex flex-col gap-3 sm:gap-4">
                 {[
                   "Secure Cloud-based Infrastructure",
                   "Real-time Committee Updates",
                   "Automated Maintenance Billing",
                   "Secure Resident Data Privacy"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
                      <span className="text-sm sm:text-base text-slate-300 font-medium">{item}</span>
                   </div>
                 ))}
              </div>
              <Link to="/register">
                 <button className="btn bg-white text-slate-900 px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm sm:text-base">Start Living Smarter</button>
              </Link>
            </div>
            <div className="hidden md:block">
               <div className="glass-card bg-white/10 backdrop-blur-md border-white/10 rotate-3 translate-x-12 translate-y-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center">✓</div>
                        <div className="h-2 w-32 bg-white/20 rounded-full" />
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center">✓</div>
                        <div className="h-2 w-48 bg-white/20 rounded-full" />
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center">●</div>
                        <div className="h-2 w-24 bg-white/20 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
