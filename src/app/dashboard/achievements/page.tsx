'use client';

import { Trophy, Plus, CheckCircle, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';

export default function DashboardAchievements() {
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Smart India Hackathon - 1st Prize', category: 'Hackathon', status: 'Verified', isPublic: true },
    { id: 2, title: 'Google Summer of Code 2025', category: 'Internship', status: 'Pending Verification', isPublic: false },
  ]);

  const toggleVisibility = (id: number) => {
    setAchievements(prev => prev.map(ach => ach.id === id ? { ...ach, isPublic: !ach.isPublic } : ach));
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Achievements</h1>
          <p className="text-gray-400">Add your placements, internships, and competition wins.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Plus className="w-5 h-5" /> Add Achievement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div key={ach.id} className="glass rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Trophy className="w-6 h-6" /></div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{ach.category}</span>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white leading-tight mb-2">{ach.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                {ach.status === 'Verified' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <div className="w-2 h-2 rounded-full bg-orange-400" />}
                <span className={ach.status === 'Verified' ? 'text-green-400' : 'text-orange-400'}>{ach.status}</span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
              <button 
                onClick={() => toggleVisibility(ach.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {ach.isPublic ? <><Unlock className="w-4 h-4" /> Public</> : <><Lock className="w-4 h-4" /> Private</>}
              </button>
              
              {ach.status === 'Verified' && ach.isPublic && (
                <button className="text-sm font-semibold text-[#0a66c2] hover:underline flex items-center gap-1">
                  Share to LinkedIn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
