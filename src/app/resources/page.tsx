'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Download, FileText, Filter } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";

export default function ResourcesPage() {
  const [semester, setSemester] = useState('All');
  
  const resources = [
    { id: 1, title: 'Data Structures Notes', type: 'Notes', subject: 'CS201', semester: 'Sem 3', downloads: 142 },
    { id: 2, title: 'Operating Systems PYQ 2025', type: 'PYQs', subject: 'CS301', semester: 'Sem 5', downloads: 89 },
    { id: 3, title: 'Database Management Lab Manual', type: 'Lab Manual', subject: 'CS302', semester: 'Sem 5', downloads: 256 },
    { id: 4, title: 'Machine Learning Basics', type: 'Presentations', subject: 'CS401', semester: 'Sem 7', downloads: 67 }
  ];

  const filteredResources = semester === 'All' ? resources : resources.filter(r => r.semester === semester);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Resources <span className="text-gradient">Hub</span></h1>
          <p className="text-gray-400 text-lg max-w-xl">Access high-quality study materials, notes, PYQs, and lab manuals curated by seniors.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Search resources..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 text-gray-400 mr-2"><Filter className="w-4 h-4"/> Filter by Semester:</div>
        {['All', 'Sem 1', 'Sem 3', 'Sem 5', 'Sem 7'].map(sem => (
          <button 
            key={sem} 
            onClick={() => setSemester(sem)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${semester === sem ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {sem}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">File Name</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Subject / Sem</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Downloads</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={res.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText className="w-5 h-5" /></div>
                      <span className="font-semibold text-white">{res.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/10">{res.type}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{res.subject} • {res.semester}</td>
                  <td className="p-4 text-sm text-gray-400 text-right">{res.downloads}</td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors rounded-lg font-medium text-sm border border-primary/20 hover:border-transparent">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-gray-400">No resources found for this semester.</div>
          )}
        </div>
      </div>
    </div>
  );
}
