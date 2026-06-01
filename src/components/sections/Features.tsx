'use client';

import { motion } from 'framer-motion';
import { Calendar, FileText, BookOpen, GraduationCap, Trophy, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      title: 'Events',
      description: 'Participate in exciting workshops, hackathons and tech talks.',
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Blogs',
      description: 'Share your knowledge and explore technical articles.',
      icon: FileText,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
    {
      title: 'Resources',
      description: 'Access notes, PYQs, manuals and study materials.',
      icon: BookOpen,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      title: 'Alumni',
      description: 'Connect with alumni and get mentorship opportunities.',
      icon: GraduationCap,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Achievements',
      description: 'Showcase your success and celebrate milestones.',
      icon: Trophy,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10'
    },
    {
      title: 'Community',
      description: 'Be a part of a vibrant community of innovators.',
      icon: Users,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Our Features</h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl">
            Everything you need to grow and excel
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="glass rounded-2xl p-6 group hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${feature.bg} shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
