'use client';

import { useEffect, useState } from 'react';
import { Camera, Edit2 } from 'lucide-react';

export default function DashboardProfile() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

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
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">{ user?.name || 'Not Set' }</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Email</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">{user?.email || 'Not Set'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Roll Number</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">{user?.rollNo || 'Not Set'} </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Branch / Year</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10">{user?.branch || 'Not Set'} / {user?.year || 'Not Set'} </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Bio</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 min-h-[100px]">
                
              {user?.bio || 'No bio added yet'}

              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Skills / Tags</label>
              <div className="flex flex-wrap gap-2">
                
              {user?.skills?.length > 0
                ? user.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))
                : <span className="text-gray-400">No skills added</span>}

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
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">
              
              {user?.socialLinks?.linkedin ? (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.socialLinks.linkedin}
                </a>
              ) : (
                <span className="text-gray-400">Not Added</span>
              )}

              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">GitHub</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">
              {user?.socialLinks?.github ? (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.socialLinks.github}
                </a>
              ) : (
                <span className="text-gray-400">Not Added</span>
              )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Instagram</label>
              <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">
              {user?.socialLinks?.instagram ? (
                <a
                  href={user.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.socialLinks.instagram}
                </a>
              ) : (
                <span className="text-gray-400">Not Added</span>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
