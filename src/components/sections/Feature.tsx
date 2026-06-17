'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Highlighter,
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Events',
    description: 'Participate in exciting workshops, hackathons and tech talks.',
    icon: Calendar,
    number: '01',
    bgIcon: Calendar
  },
  {
    title: 'Blogs',
    description: 'Share your knowledge and explore technical articles.',
    icon: Highlighter,
    number: '02',
    bgIcon: Highlighter
  },
  {
    title: 'Resources',
    description: 'Access notes, PYQs, manuals and study materials.',
    icon: BookOpen,
    number: '03',
    bgIcon: BookOpen
  },
  {
    title: 'Alumni',
    description: 'Connect with alumni and get mentorship opportunities.',
    icon: GraduationCap,
    number: '04',
    bgIcon: GraduationCap
  },
  {
    title: 'Achievements',
    description: 'Showcase your success and celebrate milestones.',
    icon: Trophy,
    number: '05',
    bgIcon: Trophy
  },
  {
    title: 'Community',
    description: 'Be a part of a vibrant community of innovators.',
    icon: Users,
    number: '06',
    bgIcon: Users
  }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function Feature() {
  return (
    <section className="mx-6 lg:mx-24 py-20">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

        <div>
          <h6 className="text-muted-foreground tracking-[.25rem] uppercase mb-4">
            02 Our Features
          </h6>

          <h2 className="text-4xl lg:text-5xl font-bold">
            Everything you need to
            <br />
            <span className="text-primary text-5xl">
              Grow & Excel
            </span>
          </h2>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          const BgIcon = feature.bgIcon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
              variants={itemVariants}
              className="glass group relative aspect-square p-8 overflow-hidden border-white/5  hover:bg-card hover:border-t-primary  hover:border-t-4 transition-all duration-500 cursor-pointer
              ">

              <div className="flex justify-between mb-10">
                <div className="w-12 h-12 flex items-center justify-center bg-[#0e1425] border border-primary/30 rounded-md">
                  <Icon size={24} className="text-primary"/>
                </div>

                <span className="text-muted-foreground text-2xl font-bold">
                  {feature.number}
                </span>
              </div>

              <div>
                <h3
                  className="text-3xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground  leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <ArrowRight size={20} className="absolute left-8 bottom-8 transition-all group-hover:text-primary group-hover:translate-x-3"/>

              <BgIcon className="absolute -right-4 -bottom-4 w-50 h-50 text-primary opacity-[0.05] transition-all duration-500 group-hover:scale-125"/>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}