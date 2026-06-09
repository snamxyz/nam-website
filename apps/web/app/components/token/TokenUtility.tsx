"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Coins, CreditCard, ArrowLeftRight, Send } from "lucide-react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const utilities = [
  {
    icon: Coins,
    title: "Earn it",
    description:
      "Upload receipts from everyday spending and mine NAM into your in-app wallet — paid out the next day.",
  },
  {
    icon: CreditCard,
    title: "Spend it",
    description:
      "Use NAM inside the app, top up with card or Apple Pay, and put your balance to work instantly.",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap it",
    description:
      "Trade NAM for USDC, ETH, and more right in the built-in wallet — no extensions, no seed phrases.",
  },
  {
    icon: Send,
    title: "Send it",
    description:
      "Move NAM to any Base address in seconds. Full self-custody — you own and control your crypto.",
  },
];

export default function TokenUtility() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".tu-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tu-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".tu-card",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tu-grid", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          className="tu-title"
          eyebrow="Utility"
          title={
            <>
              One token, <span className="text-gradient-green">four things to do.</span>
            </>
          }
          subtitle="NAM isn't a points balance locked in a silo. It's real crypto you can earn, spend, swap, and send."
        />

        <div className="tu-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {utilities.map((u, i) => (
            <div
              key={u.title}
              className="tu-card glass rounded-3xl p-6 card-hover flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-nam-green/10 flex items-center justify-center">
                  <u.icon className="w-6 h-6 text-nam-green" />
                </div>
                <span className="text-sm font-mono font-bold text-foreground/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2">{u.title}</h3>
              <p className="text-sm text-foreground/55 leading-relaxed">
                {u.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
