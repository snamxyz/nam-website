"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Receipt, Users, BarChart3, Coins } from "lucide-react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Receipt,
    title: "Upload receipts",
    description:
      "Every dollar of verified spending you upload counts toward your share of the day's mining pool.",
  },
  {
    icon: Users,
    title: "Daily pool is tallied",
    description:
      "At the daily cutoff, total receipt volume from every user is summed to form that day's mining pool.",
  },
  {
    icon: BarChart3,
    title: "Your share is set",
    description:
      "Your cut is proportional — your receipt volume divided by the network's. More uploaded, bigger share.",
  },
  {
    icon: Coins,
    title: "Tokens distributed",
    description:
      "NAM is mined on-chain and deposited straight into your in-app wallet the next day. Real ownership.",
  },
];

export default function Mining() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mining-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".mining-step",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-steps", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".mining-example",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".mining-example", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.7,
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
      className="relative overflow-hidden px-6 lg:px-0"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] glow-radial pointer-events-none" />

      <div className="mx-auto max-w-6xl relative">
        <SectionHeading
          className="mining-title"
          eyebrow="On-chain mining"
          title={
            <>
              Mined by people, <span className="text-gradient-green">not machines.</span>
            </>
          }
          subtitle="NAM = Non-Automated Mined. No data centers, no bots. The day's tokens are split across real people based on the receipts they upload."
        />

        <div className="mining-steps grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="mining-step glass rounded-3xl p-6 card-hover flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-nam-green/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-nam-green" />
                </div>
                <span className="text-sm font-mono font-bold text-foreground/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Example calculation */}
        <div className="mining-example glass-strong rounded-3xl p-8 md:p-10 max-w-3xl mx-auto mt-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-nam-green text-center mb-6">
            Example — Day 1
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">$10</p>
              <p className="text-sm text-foreground/40 mt-1">Your receipts</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">$1,000</p>
              <p className="text-sm text-foreground/40 mt-1">Network total</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">7.2M NAM</p>
              <p className="text-sm text-foreground/40 mt-1">Daily Rewards</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">1%</p>
              <p className="text-sm text-foreground/40 mt-1">72k NAM</p>
            </div>
          </div>
          <p className="text-sm text-foreground/40 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            You upload $10 in receipts, while the entire network uploads $1,000. That gives you 1% of the day&apos;s fixed distribution, earning you 72,000 NAM. The larger your share of the network&apos;s spending, the larger your share of the daily NAM distribution.
          </p>
        </div>

        <div className="mining-example glass-strong rounded-3xl p-8 md:p-10 max-w-3xl mx-auto mt-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-nam-green text-center mb-6">
            Example — Day 100
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">$10</p>
              <p className="text-sm text-foreground/40 mt-1">Your receipts</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">$10,000</p>
              <p className="text-sm text-foreground/40 mt-1">Network total</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">7.2M NAM</p>
              <p className="text-sm text-foreground/40 mt-1">Daily Rewards</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">0.1%</p>
              <p className="text-sm text-foreground/40 mt-1">7,200 NAM</p>
            </div>
          </div>
          <p className="text-sm text-foreground/40 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            You upload the same $10 in receipts, but the network now uploads $10,000. Your share falls to 0.1% of the day&apos;s fixed distribution, earning you 7,200 NAM. Even though your spending has not changed, increased network participation means greater competition and less NAM earned. As the network grows, NAM becomes harder to mine.
          </p>
        </div>
      </div>
    </section>
  );
}
