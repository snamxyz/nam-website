import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Mining from "../components/Mining";
import TokenHero from "../components/token/TokenHero";
import TokenEarning from "../components/token/TokenEarning";
import TokenAllocation from "../components/token/TokenAllocation";
import TokenSupply from "../components/token/TokenSupply";
import TokenUtility from "../components/token/TokenUtility";

export const metadata: Metadata = {
  title: "Token — NAM",
  description:
    "$NAM is the native token of the NAM network — mined from real receipts on Base. See live supply, daily rewards, emissions, and what you can do with it.",
};

export default function TokenPage() {
  return (
    <>
      <Navbar />
      <main>
        <TokenHero />
        <Mining />
        <TokenEarning />
        <TokenAllocation />
        <TokenSupply />
        <TokenUtility />
      </main>
      <Footer />
    </>
  );
}
