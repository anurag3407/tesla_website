'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact <span className="text-gradient">Us</span></h1>
        <p className="text-gray-400 text-lg">
          Have a question or want to join the club? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="glass p-8 rounded-3xl border-primary/20">
            <h3 className="text-2xl font-bold text-white mb-6">Get in touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0"><MapPin className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-gray-400 text-sm mt-1">CSE Block, College Campus,<br/>India 400001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0"><Mail className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400 text-sm mt-1">teslaclub@college.edu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0"><Phone className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-gray-400 text-sm mt-1">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Discord</h3>
            <p className="text-gray-400 mb-6">Be a part of our thriving online community of developers and designers.</p>
            <button className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-colors">
              Join Discord Server
            </button>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form className="glass p-8 rounded-3xl flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                <option value="general">General Inquiry</option>
                <option value="join">Membership Request</option>
                <option value="sponsor">Sponsorship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="How can we help you?"></textarea>
            </div>
            
            <button type="button" className="w-full py-4 mt-2 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
