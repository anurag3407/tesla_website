'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function UpcomingEventsPreview() {
  const events = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      date: "28 May",
      time: "10:00 AM",
      venue: "Lab 1, CSE Block",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Data Structures using Python",
      date: "05 Jun",
      time: "11:00 AM",
      venue: "Seminar Hall",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Robotics Workshop",
      date: "12 Jun",
      time: "02:00 PM",
      venue: "Robotics Lab",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Tech Talk on Cyber Security",
      date: "18 Jun",
      time: "03:00 PM",
      venue: "Seminar Hall",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Upcoming Events</h3>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Don't miss out on what's next</h2>
          </div>
          <Link href="/events" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          {/* Carousel controls - visual only for now */}
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10 hidden md:flex">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10 hidden md:flex">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar">
            {events.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass rounded-2xl overflow-hidden group min-w-[280px] snap-center flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 z-20 bg-background/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-center">
                    <div className="text-xs text-primary font-bold">{event.date.split(' ')[0]}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">{event.date.split(' ')[1]}</div>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow gap-4">
                  <h4 className="text-lg font-bold text-white line-clamp-2">{event.title}</h4>
                  
                  <div className="flex flex-col gap-2 text-xs text-gray-400 font-medium mt-auto">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      {event.venue}
                    </div>
                  </div>

                  <button className="w-full py-2.5 mt-2 rounded-lg bg-white/5 hover:bg-primary text-white text-sm font-semibold transition-colors border border-white/10 hover:border-transparent">
                    Register Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
