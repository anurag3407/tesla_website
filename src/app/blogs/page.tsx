'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Clock, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";
import Link from 'next/link';

export default function BlogsPage() {
  const [search, setSearch] = useState('');
  
  const blogs = [
    {
      id: 1,
      title: "Building Scalable Web Applications with Next.js",
      category: "Web Development",
      author: "Aarav Mehta",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      date: "May 20, 2026"
    },
    {
      id: 2,
      title: "Getting Started with Machine Learning in Python",
      category: "AI/ML",
      author: "Diya Sharma",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop",
      date: "May 15, 2026"
    },
    {
      id: 3,
      title: "Top 10 Cyber Security Practices for Developers",
      category: "Cyber Security",
      author: "Rohan Verma",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      date: "May 10, 2026"
    }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Latest <span className="text-gradient">Blogs</span></h1>
          <p className="text-gray-400 text-lg max-w-xl">Read articles written by our club members on the latest technologies and tutorials.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search blogs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, idx) => (
          <motion.div 
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary border border-primary/20">
                {blog.category}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2">
                A deep dive into {blog.category.toLowerCase()} concepts and how you can apply them in real-world scenarios.
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary border border-primary/30">
                    {blog.author[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{blog.author}</span>
                    <span className="text-xs text-gray-500">{blog.date}</span>
                  </div>
                </div>
                <div className="flex gap-3 text-gray-400">
                  <span className="flex items-center gap-1 text-xs hover:text-white cursor-pointer"><ThumbsUp className="w-4 h-4" /></span>
                  <span className="flex items-center gap-1 text-xs hover:text-white cursor-pointer"><Bookmark className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}
