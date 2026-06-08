"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Send,
  ShieldCheck,
  Coins,
} from "lucide-react";
import PhoneMockup from "@/app/components/PhoneMockup";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Wallet,
    title: "Built-in crypto wallet",
    description:
      "A full wallet lives inside the app. Your NAM Coin lands here — no extensions or external apps.",
  },
  {
    icon: CreditCard,
    title: "Buy with card or Apple Pay",
    description:
      "Top up with card, Apple Pay, or bank transfer via Coinbase Pay. Dollars to tokens in seconds.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap & trade tokens",
    description:
      "Trade NAM, USDC, and ETH right inside the app. A simple interface built for everyone.",
  },
  {
    icon: Send,
    title: "Send to any wallet",
    description:
      "Send tokens to any Base address. Full self-custody — you own and control your crypto.",
  },
  {
    icon: Coins,
    title: "Multiple tokens, one hub",
    description:
      "Hold NAM Coin, USDC, ETH and more together. Your single crypto home.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-risk onboarding",
    description:
      "No money or trading knowledge needed. Everyday receipts ease you into crypto, risk-free.",
  },
];

export default function CryptoFeatures() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cf-head", {
        scrollTrigger: { trigger: ".cf-head", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".cf-phone", {
        scrollTrigger: { trigger: ".cf-phones", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
      gsap.from(".cf-card", {
        scrollTrigger: { trigger: ".cf-grid", start: "top 82%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="wallet"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl relative grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left — phones */}
        <div className="cf-phones relative flex justify-center items-center min-h-[480px] order-last lg:order-first">
          <div className="cf-phone relative z-10 -rotate-3">
            <PhoneMockup
              src="/assets/app-send.png"
              alt="Send tokens screen with token selector and amount input"
              className="w-[225px] md:w-[245px]"
            />
          </div>
          <div className="cf-phone absolute right-0 md:right-6 bottom-2 z-20 rotate-3">
            <PhoneMockup
              src="/assets/app-token-eth.png"
              alt="Ethereum price detail with buy and sell actions"
              className="w-[200px] md:w-[215px]"
            />
          </div>
        </div>

        {/* Right — copy + feature grid */}
        <div>
          <div className="cf-head max-w-xl">
            <span className="eyebrow mb-4">More than rewards</span>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-balance">
              A full crypto wallet,{" "}
              <span className="text-gradient-green">built right in.</span>
            </h2>
            <p className="mt-4 text-foreground/50 text-base md:text-lg leading-relaxed">
              Buy, sell, send, swap, and earn — all from one app. No browser
              extensions, no seed phrases, no second account.
            </p>
          </div>

          <div className="cf-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-9">
            {features.map((f) => (
              <div key={f.title} className="cf-card glass rounded-2xl p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-nam-green/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-nam-green" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-foreground/45 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
