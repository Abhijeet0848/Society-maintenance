import { GlassCard } from "../components/ui/GlassCard";
import { Calendar, Users, MapPin, Clock, ArrowRight } from 'lucide-react';

export const FacilitiesPage = () => {
  const facilities = [
    { name: "Club House", icon: "🏠", desc: "For parties and events", capacity: 50, location: "Near Wing A" },
    { name: "Gymnasium", icon: "🏋️", desc: "Available 6 AM - 10 PM", capacity: 10, location: "Basement 1" },
    { name: "Swimming Pool", icon: "🏊", desc: "Closed on Mondays", capacity: 20, location: "Ground Central" },
    { name: "Garden Pavilion", icon: "🌳", desc: "Open seating area", capacity: 15, location: "Rear Garden" },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in text-left">
      <div>
        <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">Vrundavan Society</p>
        <h1 className="text-4xl font-bold">Society Facilities</h1>
        <p className="text-muted-foreground mt-1">Book amenities for your family and guests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac, i) => (
          <GlassCard key={i} className="flex gap-6 items-start hover:bg-white/5 group transition-all cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg shadow-black/10">
              {fac.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{fac.name}</h3>
                <span className="text-[10px] uppercase font-black px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Available</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{fac.desc}</p>
              
              <div className="flex gap-4 mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1"><Users size={12} /> {fac.capacity} Max</div>
                <div className="flex items-center gap-1"><MapPin size={12} /> {fac.location}</div>
                <div className="flex items-center gap-1"><Clock size={12} /> Pre-book</div>
              </div>

              <button className="flex items-center gap-2 text-blue-500 font-bold text-sm mt-4 hover:underline">
                Book Now <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
