'use client';

import { motion } from 'framer-motion';
import { Navbar } from "@/components/layout/Navbar";

export default function GalleryPage() {
  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-8', rowSpan: 'row-span-2' },
    { id: 2, url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-4', rowSpan: 'row-span-1' },
    { id: 3, url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-4', rowSpan: 'row-span-1' },
    { id: 4, url: 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?q=80&w=600&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-4', rowSpan: 'row-span-1' },
    { id: 5, url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-8', rowSpan: 'row-span-1' }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Glimpses of Our <span className="text-gradient">Journey</span></h1>
        <p className="text-gray-400 text-lg">Memories from workshops, hackathons, and fun events.</p>
      </div>

      <div className="grid grid-cols-12 gap-4 auto-rows-[250px]">
        {images.map((img, idx) => (
          <motion.div 
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative rounded-2xl overflow-hidden group cursor-pointer ${img.colSpan} ${img.rowSpan}`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-end p-6">
              <span className="text-white font-bold tracking-wide">View Image</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
