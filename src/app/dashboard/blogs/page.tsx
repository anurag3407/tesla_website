'use client';

import { Edit2, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardBlogs() {
  const myBlogs = [
    { id: 1, title: 'Introduction to GraphQL APIs', status: 'Published', views: 342, likes: 45, date: 'May 10, 2026' },
    { id: 2, title: 'Understanding Docker Containers', status: 'Pending Review', views: 0, likes: 0, date: 'Jun 01, 2026' },
    { id: 3, title: 'CSS Grid Layout Guide', status: 'Draft', views: 0, likes: 0, date: 'Jun 02, 2026' },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Blogs</h1>
          <p className="text-gray-400">Write, edit, and track the analytics of your published articles.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Plus className="w-5 h-5" /> Write New Blog
        </button>
      </div>

      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Analytics</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Last Updated</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs block">{blog.title}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      blog.status === 'Published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      blog.status === 'Pending Review' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-300 font-medium">{blog.views} Views</span>
                      <span className="text-xs text-gray-500">{blog.likes} Likes</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400 text-right">{blog.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white/5 rounded-lg" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myBlogs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              You haven't written any blogs yet. Share your knowledge!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
