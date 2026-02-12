import AboutSection from "@/components/LandingPage/AboutSection";
import Eligibility from "@/components/LandingPage/Eligibility";
import FAQ from "@/components/LandingPage/FAQ";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import HowItWorks from "@/components/LandingPage/HowItWorks";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <AboutSection />
      <HowItWorks />
      <Eligibility />
      <FAQ />
      <Footer />
    </main>
  );
}
