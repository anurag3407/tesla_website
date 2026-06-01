'use client';

import { Calendar, Download, Bell, BellOff } from 'lucide-react';

export default function DashboardEvents() {
  const registeredEvents = [
    { id: 1, title: 'Web Development Bootcamp', date: '28 May 2026', time: '10:00 AM', venue: 'Lab 1', status: 'Upcoming', reminder: true },
    { id: 2, title: 'AI/ML Hackathon', date: '15 Jun 2026', time: '09:00 AM', venue: 'Main Hall', status: 'Upcoming', reminder: false },
    { id: 3, title: 'Cyber Security 101', date: '10 Jan 2026', time: '02:00 PM', venue: 'Seminar Hall', status: 'Past', reminder: false },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
        <p className="text-gray-400">Manage your event registrations and download certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registeredEvents.map(event => (
          <div key={event.id} className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                event.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {event.status}
              </span>
              {event.status === 'Upcoming' && (
                <button className="text-gray-400 hover:text-primary transition-colors">
                  {event.reminder ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5" />}
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <div className="flex flex-col gap-1 mt-3 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {event.date} • {event.time}</div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
              {event.status === 'Upcoming' ? (
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10 text-sm">
                  Add to Calendar
                </button>
              ) : (
                <button className="flex-1 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-colors border border-primary/20 hover:border-transparent flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Certificate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
