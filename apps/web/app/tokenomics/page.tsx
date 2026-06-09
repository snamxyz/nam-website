import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Mining from "../components/Mining";
import Tokenomics from "../components/Tokenomics";
import CryptoFeatures from "../components/CryptoFeatures";

export const metadata: Metadata = {
  title: "Token & Tokenomics — NAM Rewards",
  description:
    "How NAM is mined from receipts, daily supply and distribution, and the built-in crypto wallet for buying, sending, and swapping tokens.",
};

export default function TokenomicsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        <Mining />
        <Tokenomics />
        <CryptoFeatures />
      </main>
      <Footer />
    </>
  );
}