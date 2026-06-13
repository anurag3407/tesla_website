import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { FeaturedEvent } from "@/components/sections/FeaturedEvent";
import { UpcomingEventsPreview } from "@/components/sections/UpcomingEventsPreview";
import { OurImpact } from "@/components/sections/OurImpact";
import { CTA } from "@/components/sections/CTA";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      <Hero />
      <Features />
      <FeaturedEvent />
      <UpcomingEventsPreview />
      <OurImpact />
      <CTA />
      <Navbar />
    </div>
  );
}
