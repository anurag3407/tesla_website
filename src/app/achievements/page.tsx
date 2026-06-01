'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Award, Medal, ExternalLink } from 'lucide-react';

export default function AchievementsPage() {
  const achievements = [
    { id: 1, title: '1st Prize - Smart India Hackathon', category: 'Hackathon', year: '2024', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop', icon: Trophy, color: 'text-yellow-400' },
    { id: 2, title: 'Winner - CodeChase 2024', category: 'Coding', year: '2024', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop', icon: Star, color: 'text-blue-400' },
    { id: 3, title: '2nd Prize - Robotics Championship', category: 'Robotics', year: '2024', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', icon: Medal, color: 'text-pink-400' },
    { id: 4, title: 'Best Project Award', category: 'Project', year: '2023', image: 'https://images.unsplash.com/photo-1496469888073-80de7e952517?q=80&w=600&auto=format&fit=crop', icon: Award, color: 'text-purple-400' }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Proud <span className="text-gradient">Moments</span></h1>
        <p className="text-gray-400 text-lg">Celebrating the victories, milestones, and hard work of our club members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((ach, idx) => (
          <motion.div 
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border-white/5"
          >
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10" />
              <img src={ach.image} alt={ach.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 z-20">
                <div className={`p-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10 ${ach.color}`}>
                  <ach.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{ach.category}</span>
                <span className="text-xs text-gray-500 font-mono">{ach.year}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight mb-4">{ach.title}</h3>
              
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm">
                View Details <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
