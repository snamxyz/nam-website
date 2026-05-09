import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Use & Privacy Policy — NAM Rewards",
  description:
    "Read the Terms of Use and Privacy Policy for NAM Rewards Inc.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <TermsClient />
      <Footer />
    </>
  );
}
