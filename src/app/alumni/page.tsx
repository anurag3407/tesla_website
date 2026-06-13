'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";

export default function AlumniPage() {
  const alumni = [
    { id: 1, name: 'Nikhil Patel', role: 'Software Engineer', company: 'Google', batch: '2020', city: 'Bengaluru', image: 'https://i.pravatar.cc/150?u=10' },
    { id: 2, name: 'Kritika Joshi', role: 'Data Scientist', company: 'Microsoft', batch: '2021', city: 'Hyderabad', image: 'https://i.pravatar.cc/150?u=20' },
    { id: 3, name: 'Rishabh Jain', role: 'Product Manager', company: 'Amazon', batch: '2020', city: 'Seattle', image: 'https://i.pravatar.cc/150?u=30' },
    { id: 4, name: 'Sneha Reddy', role: 'SDE', company: 'Adobe', batch: '2022', city: 'Noida', image: 'https://i.pravatar.cc/150?u=40' }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Alumni <span className="text-gradient">Network</span></h1>
        <p className="text-gray-400 text-lg">Connect with our successful alumni working at top tech companies worldwide.</p>
      </div>

      <div className="glass p-6 rounded-2xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border-white/5">
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Search by name, company..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none w-full md:w-auto appearance-none">
            <option>All Batches</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
          </select>
          <button className="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all shrink-0">
            Join Network
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alumni.map((alum, idx) => (
          <motion.div 
            key={alum.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 flex flex-col items-center text-center border-white/5 hover:border-primary/30 transition-all group"
          >
            <div className="w-24 h-24 rounded-full border-2 border-primary/20 mb-4 overflow-hidden group-hover:scale-105 transition-transform">
              <img src={alum.image} alt={alum.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white">{alum.name}</h3>
            <p className="text-primary text-sm font-medium mt-1 mb-4">{alum.role} @ {alum.company}</p>
            
            <div className="w-full space-y-2 mb-6 text-sm text-gray-400 flex flex-col items-center">
              <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Batch {alum.batch}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {alum.city}</div>
            </div>
            
            <div className="flex gap-3 w-full mt-auto">
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect
              </button>
              <button className="flex-1 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-colors border border-primary/20 hover:border-transparent text-sm">
                Request Mentor
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
