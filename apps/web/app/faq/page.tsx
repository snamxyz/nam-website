import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

export const metadata: Metadata = {
  title: "FAQ — NAM Rewards",
  description:
    "Frequently asked questions about NAM Rewards, mining receipts, earning NAM, and using the built-in crypto wallet.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
