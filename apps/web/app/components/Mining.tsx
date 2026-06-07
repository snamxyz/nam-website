"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Receipt, Users, Coins, BarChart3, Link2, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Receipt,
    title: "Upload Receipts",
    description:
      "Snap a photo of any receipt — coffee, groceries, gas, online orders. Every dollar spent counts toward your daily mining share.",
  },
  {
    icon: Users,
    title: "Daily Pool Calculated",
    description:
      "At the end of each day, the total receipt volume from all users is tallied to form the daily mining pool.",
  },
  {
    icon: BarChart3,
    title: "Your Share Is Determined",
    description:
      "Your share of daily tokens is proportional to your receipt volume vs. the total. More spending uploaded = more mining.",
  },
  {
    icon: Coins,
    title: "Tokens Distributed",
    description:
      "NAM Coins are mined on-chain and deposited directly into your in-app wallet. Real crypto, real ownership — from money you already spent.",
  },
];

const highlights = [
  {
    icon: Link2,
    title: "On-Chain Mining",
    description:
      "Every receipt triggers a real on-chain mining event. You become part of decentralized finance without spending your own money.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-Free Crypto",
    description:
      "No investment required. No trading knowledge needed. Just upload receipts from purchases you're already making and earn NAM Coins.",
  },
];

export default function Mining() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".mining-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      gsap.fromTo(".mining-step",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-steps", start: "top 80%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      gsap.fromTo(".mining-example",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-example", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        }
      );

      gsap.fromTo(".mining-highlight",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-highlights", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="mining"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(1,210,67,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mining-title text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            How{" "}
            <span className="text-gradient-green">Mining</span>{" "}
            Works
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-2xl mx-auto">
            Users mine NAM Coins by scanning receipts from everyday purchases.
            Mining occurs on-chain — your daily receipt spending determines your
            proportional share of token distribution.
          </p>
        </div>

        {/* Steps */}
        <div className="mining-steps grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="mining-step glass rounded-2xl p-6 md:p-8 hover:bg-white/[0.06] transition-all duration-300 group relative"
            >
              <div className="absolute top-4 right-4 text-xs font-mono text-foreground/15 font-bold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-12 h-12 rounded-xl bg-nam-green/10 flex items-center justify-center mb-5 group-hover:bg-nam-green/20 transition-colors">
                <step.icon className="w-6 h-6 text-nam-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example calculation */}
        <div className="mining-example glass rounded-2xl p-8 md:p-10 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Example: Daily Mining
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">$10</p>
              <p className="text-sm text-foreground/40 mt-1">
                Your receipt uploads
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">
                $1,000
              </p>
              <p className="text-sm text-foreground/40 mt-1">
                Total uploads that day
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">1%</p>
              <p className="text-sm text-foreground/40 mt-1">
                Your share of daily tokens
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground/40 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            If you uploaded $10 in receipts and the total network uploaded
            $1,000 that day, you&apos;d receive 1% of the daily token
            distribution. The more you spend and upload, the larger your share.
          </p>
        </div>

        {/* Highlights */}
        <div className="mining-highlights grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 max-w-3xl mx-auto">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="mining-highlight glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-nam-green/10 flex items-center justify-center mb-4 group-hover:bg-nam-green/20 transition-colors">
                <item.icon className="w-5 h-5 text-nam-green" />
              </div>
              <h4 className="text-base font-semibold mb-1">{item.title}</h4>
              <p className="text-sm text-foreground/45 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
