import { HeroSection } from "./_components/HeroSection";
import { ServicesSection } from "./_components/ServicesSection";
import { StorySection } from "./_components/StorySection";
import { ContactSection } from "./_components/ContactSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <ServicesSection />
        <StorySection />
        <ContactSection />
      </main>
    </>
  );
}
