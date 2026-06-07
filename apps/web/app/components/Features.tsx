"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Pickaxe,
  ShieldCheck,
  Link2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Pickaxe,
    title: "Mine Crypto",
    description:
      "Scan receipts from everyday purchases and earn NAM Coins on-chain. Zero investment required.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-Free Onboarding",
    description:
      "No money needed to start mining. Just your everyday purchases introduce you to crypto.",
  },
  {
    icon: Link2,
    title: "On-Chain Mining",
    description:
      "Real decentralized finance powered by verified real-world spending data.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".feature-title", {
        scrollTrigger: {
          trigger: ".feature-title",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="feature-title text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Why <span className="text-gradient-green">NAM Rewards</span>?
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-2xl mx-auto">
            A powerful combination of crypto rewards and financial utility that
            keeps you coming back.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card glass rounded-2xl p-6 md:p-8 hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-nam-green/10 flex items-center justify-center mb-5 group-hover:bg-nam-green/20 transition-colors">
                <feature.icon className="w-6 h-6 text-nam-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
