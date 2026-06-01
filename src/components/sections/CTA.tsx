'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden glass border border-primary/30 p-10 sm:p-16 flex flex-col items-center text-center gap-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 z-0" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Ready to start your journey with TESLA?
            </h2>
            <p className="text-lg text-gray-300">
              Join our community of innovators and build the future together. Get access to exclusive resources, mentorship, and opportunities.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Link href="/contact" className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Apply Now
              </Link>
              <Link href="/about" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Know More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
