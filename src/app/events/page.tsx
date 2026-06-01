'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filter, setFilter] = useState('all');

  const events = [
    { id: 1, title: "Web Dev Bootcamp", category: "workshop", date: "28 May 2026", time: "10:00 AM", status: "upcoming" },
    { id: 2, title: "AI/ML Hackathon", category: "hackathon", date: "15 Jun 2026", time: "09:00 AM", status: "upcoming" },
    { id: 3, title: "Cyber Security 101", category: "talk", date: "10 Jan 2026", time: "02:00 PM", status: "past" }
  ];

  const filteredEvents = events.filter(e => e.status === activeTab && (filter === 'all' || e.category === filter));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Events</h1>
          <p className="text-gray-400 text-lg max-w-xl">Discover and register for upcoming workshops, hackathons, and guest lectures.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl glass">
          <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'upcoming' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('past')} className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'past' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>Past</button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {['all', 'workshop', 'hackathon', 'talk'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${filter === cat ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, idx) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl overflow-hidden flex flex-col group"
          >
            <div className="h-48 bg-white/5 relative overflow-hidden flex items-center justify-center">
              <span className="text-white/20 font-bold text-2xl">POSTER</span>
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary uppercase border border-primary/20">
                {event.category}
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4 flex-grow">
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {event.date}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {event.time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Campus</div>
              </div>
              {activeTab === 'upcoming' && (
                <button className="w-full mt-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-lg font-semibold transition-all">
                  Register Now
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            No events found for this category.
          </div>
        )}
      </div>

    </div>
  );
}
