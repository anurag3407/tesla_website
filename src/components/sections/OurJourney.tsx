'use client';

import { motion } from 'framer-motion';

const milestones = [
  {
    year: '2021',
    title: 'Milestone 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
  },
  {
    year: '2022',
    title: 'Milestone 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
  },
  {
    year: '2023',
    title: 'Milestone 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
  },
  {
    year: '2024',
    title: 'Milestone 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
  },
  {
    year: '2025',
    title: 'Milestone 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
  }
];

export function OurJourney() {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background Glow */}

      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{background:'repeating-radial-gradient(circle at right center,#111e37 0%,#080808 10%,#111e37 20%,#080808 30%,#111e37 40%,transparent 50%,transparent 100%)'}}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">

          <div className=" lg:w-[40%] flex flex-col justify-center lg:min-h-screen">

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .7 }}
              className="text-6xl md:text-8xl font-bold text-primary">
              Our Journey
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: .3 }}
              className="mt-6 p-5 rounded-2xl glass max-w-lg text-muted-foreground leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            </motion.p>

          </div>

          {/* Timeline */}

          <div className="lg:w-[60%]">

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial={{opacity: 0,x: index % 2 === 0 ? -40 : 40}}
                whileInView={{opacity: 1,x: 0}}
                viewport={{ once: true }}
                transition={{duration: .5, delay: index * .1}}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-10`}>
                <div className="w-full md:w-[70%] flex">

                  {/* timeline Line */}

                  <div className="mr-5 flex flex-col items-center">
                    <div className="border-[3px] border-primary p-2">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#3b82f6]"/></div>

                    {index !== milestones.length && (
                      <div className="w-[2px] flex-1 min-h-[120px] bg-gradient-to-b from-primary to-transparent"/>
                    )}
                  </div>

                  {/* content */}

                  <div>

                    <div className="inline-block px-3 py-2 rounded-lg bg-card mb-4">
                      {milestone.year}
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">
                      {milestone.title}
                    </h3>

                    <div className="glass p-5 border-2 border-dashed border-primary rounded-2xl text-muted-foreground">
                      {milestone.description}
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}