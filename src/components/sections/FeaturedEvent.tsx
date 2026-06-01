'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FeaturedEvent() {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, minutes: 31, seconds: 45 });

  // Dummy countdown effect for visual purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl overflow-hidden relative border border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f17] via-[#0d0f17]/90 to-transparent z-10" />
          
          {/* Background image placeholder */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center z-0 opacity-50 mix-blend-screen" />
          
          <div className="relative z-20 p-8 sm:p-12 lg:w-2/3 flex flex-col gap-6">
            <div>
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">
                Featured Event
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white">AI/ML Workshop 2026</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Learn, build and deploy real-world AI models with industry experts and advance your skills.
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                24 May 2026
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                10:00 AM
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Seminar Hall, CSE Block
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-4">
              <button className="px-8 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                Register Now
              </button>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Event starts in</span>
                <div className="flex gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl font-bold text-white">
                        {unit.value.toString().padStart(2, '0')}
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
