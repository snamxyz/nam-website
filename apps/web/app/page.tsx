import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Mining from "./components/Mining";
import CryptoFeatures from "./components/CryptoFeatures";
import Tokenomics from "./components/Tokenomics";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-10 max-lg:pt-28">
        <Hero />
        <HowItWorks />
        <Mining />
        <CryptoFeatures />
        <Tokenomics />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
