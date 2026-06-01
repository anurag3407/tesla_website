'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Hash, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass p-8 rounded-3xl border-primary/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Join TESLA</h1>
            <p className="text-gray-400 text-sm">Create your club member account</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" placeholder="John Doe" />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Roll Number</label>
                <div className="relative">
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" placeholder="23CS01001" />
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">College Email</label>
              <div className="relative">
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" placeholder="name@college.edu" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" placeholder="••••••••" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50" placeholder="••••••••" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            <button type="button" className="w-full py-3 mt-4 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Create Account <UserPlus className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
