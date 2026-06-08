import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@nam/core/constants";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "NAM Rewards — Mine Crypto From Your Receipts",
  description:
    "Upload receipts, earn NAM on-chain, and get a powerful crypto wallet.",
  keywords: [
    "NAM Rewards",
    "crypto rewards",
    "receipt mining",
    "NAM Coin",
    "decentralized finance",
  ],
  icons: {
    icon: "/assets/icon.svg",
    apple: "/assets/icon.png",
  },
  openGraph: {
    title: "NAM Rewards — Mine Crypto From Your Receipts",
    description:
      "Upload receipts, earn NAM on-chain, and get a powerful crypto wallet.",
    images: [{ url: "/assets/icon_with_text.png" }],
  },
  twitter: {
    card: "summary",
    title: "NAM Rewards — Mine Crypto From Your Receipts",
    description:
      "Upload receipts, earn NAM on-chain, and get a powerful crypto wallet.",
    images: ["/assets/icon_with_text.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
