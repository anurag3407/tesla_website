'use client';

import { Upload, FileText, CheckCircle, Clock } from 'lucide-react';

export default function DashboardResources() {
  const myResources = [
    { id: 1, title: 'Data Structures Notes', subject: 'CS201', type: 'Notes', status: 'Approved', downloads: 142 },
    { id: 2, title: 'OS Lab Manual', subject: 'CS301', type: 'Lab Manual', status: 'Pending', downloads: 0 },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Resources</h1>
          <p className="text-gray-400">Upload study materials and track their usage among peers.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Upload className="w-5 h-5" /> Upload Resource
        </button>
      </div>

      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">Resource Details</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Downloads</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {myResources.map((res) => (
                <tr key={res.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText className="w-5 h-5" /></div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{res.title}</span>
                        <span className="text-xs text-gray-500">{res.subject}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10">{res.type}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 text-right">{res.downloads}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {res.status === 'Approved' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-orange-400" />}
                      <span className={`text-sm ${res.status === 'Approved' ? 'text-green-400' : 'text-orange-400'}`}>
                        {res.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myResources.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              You haven't uploaded any resources yet. Help the community by sharing notes!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
