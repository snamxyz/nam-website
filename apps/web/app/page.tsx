import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBand from "./components/StatsBand";
import Problem from "./components/Problem";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import Mining from "./components/Mining";
import CryptoFeatures from "./components/CryptoFeatures";
import Comparison from "./components/Comparison";
import Tokenomics from "./components/Tokenomics";
import Community from "./components/Community";
import FAQ from "./components/FAQ";
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
        <Mining />
        <CryptoFeatures />
        <Comparison />
        <Tokenomics />
        <Community />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
