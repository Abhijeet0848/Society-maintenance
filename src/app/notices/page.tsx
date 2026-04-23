import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Calendar, User, ChevronRight, Pin } from 'lucide-react';

export default function NoticesPage() {
  const notices = [
    { 
      id: 1, 
      title: 'Annual General Meeting 2023', 
      content: 'The AGM for the current fiscal year will be held in the clubhouse. All members are requested to attend with their identity cards.', 
      date: 'Oct 25, 2023', 
      pinned: true,
      sender: 'Secretary'
    },
    { 
      id: 2, 
      title: 'Elevator Maintenance Schedule', 
      content: 'Wing A elevators will be shut down for preventive maintenance from 10:00 AM to 4:00 PM on Tuesday.', 
      date: 'Oct 12, 2023', 
      pinned: false,
      sender: 'Manager'
    },
    { 
      id: 3, 
      title: 'New Security Guidelines', 
      content: 'From next month, all delivery personnel must register at the gate using the QR code system.', 
      date: 'Oct 08, 2023', 
      pinned: false,
      sender: 'Admin'
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Notice Board</h1>
        <p className="text-muted-foreground">Stay updated with the latest society announcements</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notices.map(notice => (
          <GlassCard key={notice.id} className={`p-8 flex flex-col gap-4 relative transition-all hover:bg-white/10 ${notice.pinned ? 'border-primary/40 bg-primary/5' : ''}`}>
            {notice.pinned && (
              <div className="absolute top-4 right-4 text-primary">
                <Pin size={20} style={{ transform: 'rotate(45deg)' }} />
              </div>
            )}
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-primary mb-2">
              <span className="flex items-center gap-1"><Calendar size={14} /> {notice.date}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--glass-border)' }}></span>
              <span className="flex items-center gap-1"><User size={14} /> {notice.sender}</span>
            </div>
            <h2 className="text-2xl font-bold">{notice.title}</h2>
            <p className="text-muted-foreground line-height-relaxed max-w-4xl">
              {notice.content}
            </p>
            <div className="flex justify-between items-center mt-4">
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                View Details <ChevronRight size={16} />
              </button>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  +12
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
