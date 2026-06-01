'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Briefcase, Award, FileText } from 'lucide-react';

export function OurImpact() {
  const impacts = [
    { icon: Lightbulb, value: '50+', label: 'Placements', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { icon: Briefcase, value: '80+', label: 'Internships', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: Award, value: '25+', label: 'Competitions Won', color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { icon: FileText, value: '15+', label: 'Research Papers', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase">Our Impact</h3>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Creating impact that matters
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe in continuous learning and creating opportunities that help students grow and achieve their dreams. Through mentorship, projects, and hackathons, we're building a culture of excellence.
            </p>
            <div className="mt-4">
              <button className="px-8 py-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all rounded-full font-semibold">
                Know More About Us
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {impacts.map((impact, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-primary/30 transition-colors"
              >
                <div className={`p-4 rounded-xl ${impact.bg}`}>
                  <impact.icon className={`w-8 h-8 ${impact.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{impact.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{impact.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
