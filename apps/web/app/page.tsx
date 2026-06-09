import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBand from "./components/StatsBand";
import Problem from "./components/Problem";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import Comparison from "./components/Comparison";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <Problem />
        <Benefits />
        <HowItWorks />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
