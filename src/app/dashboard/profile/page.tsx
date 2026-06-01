'use client';

import { Camera, Edit2 } from 'lucide-react';

export default function DashboardProfile() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your personal information and social links.</p>
      </div>

      <div className="glass rounded-2xl border-white/5 p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden group">
            <img src="https://i.pravatar.cc/150?u=current_user" alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="text-xs text-primary font-medium hover:underline">Remove Photo</button>
        </div>

        {/* Form */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Basic Info</h2>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Full Name</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">John Doe</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Email</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">johndoe@college.edu</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Roll Number</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">23CS01001</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Branch / Year</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">CSE / 3rd Year</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Bio</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 min-h-[100px]">
                Passionate software developer focusing on building scalable web apps with React and Node.js. Open to open-source contributions!
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Skills / Tags</label>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'MongoDB', 'TailwindCSS'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 mt-12">
            <h2 className="text-xl font-bold text-white">Social Links</h2>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">LinkedIn</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">linkedin.com/in/johndoe</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">GitHub</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">github.com/johndoe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
