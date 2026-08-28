import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../services/api';
import { GlassCard } from "../components/ui/GlassCard";
import { 
  Calendar, 
  Users, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  CreditCard 
} from 'lucide-react';

export const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const [formData, setFormData] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    timeSlot: '18:00 - 20:00',
    members: 2
  });

  useEffect(() => {
    fetchFacilities();
    fetchBookings();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await fetchWithAuth('/api/facilities');
      const data = await res.json();
      if (Array.isArray(data)) setFacilities(data);
    } catch (err) {
      console.error('Error fetching facilities:', err);
    }
  };

  const fetchBookings = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user._id) return;
    try {
      const res = await fetchWithAuth(`/api/facilities/bookings/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const res = await fetchWithAuth('/api/facilities/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user._id,
          facilityId: selectedFacility._id
        }),
      });
      if (res.ok) {
        setStatus('Reservation Confirmed!');
        setTimeout(() => {
          setShowModal(false);
          setStatus('');
          fetchBookings();
        }, 2000);
      }
    } catch (err) {
      setStatus('Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 py-6 sm:py-10 animate-fade-in text-left relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-[9px] sm:text-[10px] bg-emerald-50 py-0.5 sm:py-1 px-2.5 sm:px-3 rounded-full">Club Amenities</p>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Society <span className="text-emerald-600">Facilities</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg mt-0.5 sm:mt-1">Book premium amenities for your family and guests.</p>
        </div>
        <div className="w-full md:w-auto">
           <GlassCard className="bg-white border-slate-100 p-3 sm:p-4 px-4 sm:px-6 flex items-center gap-3 shadow-sm rounded-2xl">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={18} /></div>
              <div>
                 <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                 <p className="text-xs sm:text-sm font-bold text-slate-900">All Operations Online</p>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        
        {/* Facilities Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-between items-center px-1">
             <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400">Available Amenities</h2>
             <span className="text-[9px] sm:text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest">Real-time Booking</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {facilities.map((fac, i) => (
              <GlassCard 
                key={i} 
                className="flex flex-col gap-4 sm:gap-6 p-5 sm:p-8 border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all bg-white group cursor-pointer"
                onClick={() => {
                  setSelectedFacility(fac);
                  setShowModal(true);
                }}
              >
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[2rem] bg-emerald-50 flex items-center justify-center text-3xl sm:text-4xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                      {fac.icon}
                   </div>
                   <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${fac.status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                      {fac.status}
                   </div>
                </div>
                
                <div>
                   <h3 className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{fac.name}</h3>
                   <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">{fac.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 py-3 sm:py-4 border-y border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><Users size={14} className="text-emerald-500" /> Max: {fac.capacity}</div>
                   <div className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" /> {fac.timings}</div>
                </div>

                <button className="btn bg-slate-900 group-hover:bg-emerald-600 text-white w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all">
                   Book Slot
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* User Bookings Sidebar */}
        <div className="flex flex-col gap-4 sm:gap-6">
           <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400 px-1">Your Schedule</h2>
           <GlassCard className="bg-white border-slate-100 p-0 overflow-hidden shadow-sm flex flex-col rounded-3xl">
              {bookings.length > 0 ? (
                 <div className="flex flex-col divide-y divide-slate-50">
                    {bookings.map((b, i) => (
                      <div key={i} className="p-4 sm:p-6 flex flex-col gap-3">
                         <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-sm">{b.facilityId?.name || 'Facility'}</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                         </div>
                         <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar size={12} className="text-blue-500" /> {new Date(b.bookingDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-blue-500" /> {b.timeSlot}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center gap-3 sm:gap-4">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <CreditCard size={24} className="sm:w-8 sm:h-8" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400">No Active Bookings</p>
                </div>
              )}
              <div className="p-4 sm:p-6 bg-slate-50/50 mt-auto">
                 <button className="w-full py-3 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:text-blue-600 transition-all shadow-sm">
                    View Full History
                 </button>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* Booking Modal Overlay */}
      {showModal && selectedFacility && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <GlassCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-none shadow-2xl animate-fade-in z-10 p-5 sm:p-10 rounded-3xl sm:rounded-[2.5rem] relative">
             <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Calendar size={18} />
                   </div>
                   <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{selectedFacility.name}</h3>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Facility Reservation</p>
                   </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                  <X size={18} />
                </button>
             </div>
             
             <div className="flex flex-col gap-6 mt-4 sm:mt-6">
                <form onSubmit={handleBook} className="flex flex-col gap-4 sm:gap-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Proposed Date</label>
                        <input 
                           type="date"
                           required
                           className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-bold outline-none text-sm" 
                           value={formData.bookingDate}
                           onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Total Members</label>
                        <input 
                           type="number"
                           min="1"
                           max={selectedFacility.capacity}
                           required
                           className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-bold outline-none text-sm" 
                           value={formData.members}
                           onChange={(e) => setFormData({...formData, members: parseInt(e.target.value)})}
                        />
                      </div>
                   </div>

                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Preferred Time Slot</label>
                      <select 
                         className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl sm:rounded-2xl text-slate-900 transition-all font-bold outline-none text-sm"
                         value={formData.timeSlot}
                         onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                      >
                         <option>06:00 - 08:00 (Early Morning)</option>
                         <option>08:00 - 10:00 (Morning)</option>
                         <option>10:00 - 12:00 (Late Morning)</option>
                         <option>15:00 - 17:00 (Afternoon)</option>
                         <option>18:00 - 20:00 (Evening)</option>
                         <option>20:00 - 22:00 (Night)</option>
                      </select>
                   </div>

                   <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                            <CreditCard size={18} />
                         </div>
                         <div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Booking Fee</p>
                            <p className="text-sm sm:text-base font-black text-slate-900">Included in Maintenance</p>
                         </div>
                      </div>
                      <ShieldCheck className="text-emerald-500 shrink-0" size={22} />
                   </div>

                   <button 
                      type="submit" 
                      className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 sm:py-5 text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all active:scale-95 rounded-xl sm:rounded-2xl"
                      disabled={loading}
                   >
                      {loading ? 'Confirming...' : 'Confirm Reservation'}
                   </button>
                   {status && (
                     <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold animate-fade-in text-xs uppercase tracking-widest">
                        <CheckCircle2 size={16} /> {status}
                     </div>
                   )}
                </form>
             </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
