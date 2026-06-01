'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, FileText, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { title: 'Total Members', value: '1,248', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-400' },
    { title: 'Active Events', value: '4', change: 'Same', trend: 'neutral', icon: Calendar, color: 'text-purple-400' },
    { title: 'Pending Blogs', value: '12', change: '+5', trend: 'up', icon: FileText, color: 'text-orange-400' },
    { title: 'Daily Visits', value: '3,422', change: '-2%', trend: 'down', icon: Activity, color: 'text-green-400' },
  ];

  const recentActivities = [
    { user: 'Aarav Mehta', action: 'submitted a new blog', time: '2 hours ago', status: 'pending' },
    { user: 'Diya Sharma', action: 'registered for AI Workshop', time: '5 hours ago', status: 'success' },
    { user: 'System', action: 'Server backup completed', time: '12 hours ago', status: 'info' },
    { user: 'Rohan Verma', action: 'updated event details', time: '1 day ago', status: 'warning' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl flex flex-col gap-4 border-white/5"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'text-green-400 bg-green-400/10' : 
                stat.trend === 'down' ? 'text-red-400 bg-red-400/10' : 
                'text-gray-400 bg-gray-400/10'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : stat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                {stat.change}
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart placeholder */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border-white/5 min-h-[400px] flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Site Traffic & Activity</h2>
          <div className="flex-1 bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
            <span className="text-gray-500 font-medium">Analytics Chart (Integration pending)</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass rounded-2xl p-6 border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-white/10" />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-background z-10 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-orange-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col pt-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-bold text-white">{activity.user}</span> {activity.action}
                  </p>
                  <span className="text-xs text-gray-500 mt-1">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
