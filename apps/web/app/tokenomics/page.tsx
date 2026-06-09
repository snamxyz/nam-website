import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Mining from "../components/Mining";
import TokenHero from "../components/token/TokenHero";
import TokenEarning from "../components/token/TokenEarning";
import TokenParameters from "../components/token/TokenParameters";
import TokenAllocation from "../components/token/TokenAllocation";
import TokenSupply from "../components/token/TokenSupply";
import TokenUtility from "../components/token/TokenUtility";

export const metadata: Metadata = {
  title: "Tokenomics — NAM",
  description:
    "$NAM is the native token of the NAM network — mined from real receipts on Base. See the supply model, daily allocation, emission curve, and what you can do with it.",
};

export default function TokenomicsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TokenHero />
        <Mining />
        <TokenEarning />
        {/* <TokenParameters /> */}
        
        <TokenAllocation />
        <TokenSupply />
        <TokenUtility />
      </main>
      <Footer />
    </>
  );
}
