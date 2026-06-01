'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Rocket, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    { title: 'Innovation', icon: Zap, desc: 'Pushing boundaries with cutting-edge tech.', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Collaboration', icon: Target, desc: 'Building together to solve real problems.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Excellence', icon: Rocket, desc: 'Striving for the highest quality in everything.', color: 'text-purple-400', bg: 'bg-purple-400/10' }
  ];

  return (
    <div className="pt-24 pb-20 flex flex-col gap-20">
      
      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our <span className="text-gradient">Origin Story</span></h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Founded in 2020, TESLA Technical Club started with a vision to bridge the gap between academic learning and industry expectations. What began as a small group of passionate coders has now grown into the largest technical community on campus.
          </p>
        </motion.div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl text-center flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform"
            >
              <div className={`p-4 rounded-2xl ${pillar.bg}`}>
                <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
              <p className="text-gray-400">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline (Simplified) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          {[2020, 2021, 2023, 2026].map((year, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-black text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {idx + 1}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-xl">Milestone {idx + 1}</h3>
                  <time className="font-mono text-primary">{year}</time>
                </div>
                <div className="text-gray-400 text-sm">Major achievement or event that shaped the club's history in {year}.</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass rounded-3xl p-10 md:p-16 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Why Join TESLA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Exclusive access to premium resources',
              '1-on-1 mentorship from alumni',
              'Hands-on project building experience',
              'Networking with industry professionals',
              'Priority registration for hackathons',
              'Leadership opportunities'
            ].map((reason, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary w-6 h-6 shrink-0" />
                <span className="text-gray-300 text-lg">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
