import CTA from "@/app/components/client/cta";
import Features from "@/app/components/client/features";
import Hero from "@/app/components/client/hero";
import Testimonials from "@/app/components/client/testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
}
