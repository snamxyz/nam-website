"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Smartphone, ScanLine, Wallet } from "lucide-react";
import PhoneMockup from "@/app/components/PhoneMockup";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Smartphone,
    number: "01",
    title: "Sign up with your number",
    description:
      "Enter your mobile number and a secure crypto wallet is created for you in seconds, powered by Privy. No seed phrases, no jargon, no crypto experience required.",
    chip: " Ready to earn in under a minute",
    image: "/assets/app-wallet.png",
    alt: "NAM Rewards home screen with balance and daily rewards",
  },
  {
    icon: ScanLine,
    number: "02",
    title: "Scan receipts you already have",
    description:
      "Snap a photo of any receipt from purchases you already make — coffee, groceries, gas, takeout. Our system reads and verifies it automatically.",
    chip: "Free to earn — upload receipts on money you already spent",
    image: "/assets/app-scan.png",
    alt: "Receipt scanner framing a receipt inside the app",
  },
  {
    icon: Wallet,
    number: "03",
    title: "Get paid the next day",
    description:
      "NAM is mined to your wallet the very next day. Hold it, send it, swap it for USDC or ETH, or cash out — there are no minimums and nothing ever expires.",
    chip: "Hold, trade, or redeem instantly",
    image: "/assets/home-page.png",
    alt: "Deposit and cash-out options in the app",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".hw-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".hw-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      gsap.utils.toArray<HTMLElement>(".hw-row").forEach((row) => {
        const text = row.querySelector(".hw-text");
        const phone = row.querySelector(".hw-phone");
        gsap.fromTo(
          text,
          { x: -30, opacity: 0 },
          {
            scrollTrigger: { trigger: row, start: "top 78%" },
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          }
        );
        gsap.fromTo(
          phone,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: row, start: "top 78%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          className="hw-title"
          eyebrow="How it works"
          title={
            <>
              Three steps. <span className="text-gradient-green">That&apos;s it.</span>
            </>
          }
          subtitle="From signup to your first payout — earning has never been this simple."
        />

        <div className="mt-16 md:mt-24 flex flex-col gap-20 md:gap-28">
          {steps.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={step.number}
                className="hw-row grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Text */}
                <div className="hw-text">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-5xl md:text-6xl font-bold font-mono text-nam-green/20 leading-none">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-nam-green/10 border border-nam-green/20 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-nam-green" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base text-foreground/55 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-nam-green/5 border border-nam-green/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-nam-green animate-pulse" />
                    <span className="text-xs font-medium text-nam-green/80">
                      {step.chip}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div
                  className={`hw-phone flex justify-center ${
                    reversed ? "lg:order-first" : ""
                  }`}
                >
                  <PhoneMockup
                    src={step.image}
                    alt={step.alt}
                    className="w-[240px] md:w-[270px]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
