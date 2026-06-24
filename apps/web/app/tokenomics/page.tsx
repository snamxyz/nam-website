import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TokenomicsOverview from "../components/tokenomics/TokenomicsOverview";

export const metadata: Metadata = {
  title: "Tokenomics — NAM",
  description:
    "NAM tokenomics are inspired by Dogecoin, with similar total supply and fixed inflation, but mined through real receipts instead of automated processors.",
};

export default function TokenomicsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TokenomicsOverview />
      </main>
      <Footer />
    </>
  );
}
