"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Zap, Infinity as InfinityIcon, Banknote, ArrowLeftRight } from "lucide-react";
import PhoneMockup from "@/app/components/PhoneMockup";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Zap,
    title: "Paid daily",
    description:
      "Upload a receipt today and NAM Coin lands in your wallet tomorrow. No statements, no waiting weeks for a payout.",
  },
  {
    icon: InfinityIcon,
    title: "Rewards that never expire",
    description:
      "Your NAM Coin is a real on-chain asset you own outright. It can't be clawed back, timed out, or quietly devalued.",
  },
  {
    icon: Banknote,
    title: "Cash out anytime — no minimums",
    description:
      "There's no threshold to clear and no delay. Swap to USDC or ETH and withdraw the moment you earn it.",
  },
  {
    icon: ArrowLeftRight,
    title: "Yours to hold, send, or trade",
    description:
      "Keep it, send it to any wallet, or exchange it for other tokens. Real freedom, not store credit.",
  },
];

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".benefit-head", {
        scrollTrigger: { trigger: ".benefit-head", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".benefit-row", {
        scrollTrigger: { trigger: ".benefit-list", start: "top 82%" },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".benefit-phone", {
        scrollTrigger: { trigger: ".benefit-phones", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="rewards"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] glow-radial pointer-events-none" />

      <div className="mx-auto max-w-6xl relative grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left — copy + benefit list */}
        <div>
          <div className="benefit-head max-w-xl">
            <span className="eyebrow mb-4">Rewards that belong to you</span>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-balance">
              Real rewards you{" "}
              <span className="text-gradient-green">actually own.</span>
            </h2>
            <p className="mt-4 text-foreground/50 text-base md:text-lg leading-relaxed">
              NAM isn&apos;t a point balance with an expiry date. It&apos;s
              an asset in your wallet — and the value is determined by the market of everyday people.
            </p>
          </div>

          <div className="benefit-list mt-10 flex flex-col gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="benefit-row flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-nam-green/10 border border-nam-green/20 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-nam-green" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm text-foreground/50 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phone mockups */}
        <div className="benefit-phones relative flex justify-center items-center min-h-[480px]">
          <div className="benefit-phone relative z-10 -rotate-3">
            <PhoneMockup
              src="/assets/app-token-nam.png"
              alt="NAM Coin price chart and balance in the app"
              className="w-[230px] md:w-[250px]"
            />
          </div>
          <div className="benefit-phone absolute right-2 md:right-8 bottom-0 z-20 rotate-3">
            <PhoneMockup
              src="/assets/app-wallet.png"
              alt="In-app crypto wallet with NAM, USDC and ETH balances"
              className="w-[200px] md:w-[220px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
