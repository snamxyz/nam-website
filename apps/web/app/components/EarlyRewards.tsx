"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Coins, Users } from "lucide-react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const rewardFlow = [
  {
    icon: Coins,
    label: "Fixed daily NAM pool",
  },
  {
    icon: Users,
    label: "Shared by receipt uploaders",
  },
  {
    icon: Clock,
    label: "Earlier users get more room to earn",
  },
];

export default function EarlyRewards() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".early-rewards-copy",
        { y: 36, opacity: 0 },
        {
          scrollTrigger: { trigger: ".early-rewards-card", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".early-rewards-step",
        { y: 28, opacity: 0 },
        {
          scrollTrigger: { trigger: ".early-rewards-flow", start: "top 84%" },
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-8 md:py-12"
    >
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 glow-radial pointer-events-none" />

      <div className="early-rewards-card relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] glass-strong px-6 py-10 md:px-10 md:py-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_70%_50%,rgba(1,210,67,0.16),transparent_55%)] md:block" />
        <div className="absolute right-10 top-10 hidden h-24 w-24 rounded-full border border-nam-green/20 md:block" />
        <div className="absolute bottom-8 right-28 hidden h-12 w-12 rounded-full bg-nam-green/10 md:block" />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="early-rewards-copy max-w-2xl">
            <span className="eyebrow mb-4">Early advantage</span>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-balance">
              Earn more by{" "}
              <span className="text-gradient-green">being early.</span>
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-foreground/55">
              NAM Rewards gives early users a bigger opportunity to earn. Every
              day, the same amount of NAM is distributed to receipt uploaders.
              As more people join, the rewards are split across more users,
              which makes accumulating NAM harder over time.
            </p>
          </div>

          <div className="early-rewards-flow relative">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-nam-green/0 via-nam-green/35 to-nam-green/0 md:left-1/2 md:top-1/2 md:h-px md:w-full md:-translate-x-1/2 md:-translate-y-1/2 md:bg-gradient-to-r" />

            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
              {rewardFlow.map((item, index) => (
                <div
                  key={item.label}
                  className="early-rewards-step relative rounded-3xl border border-nam-green/15 bg-white/70 p-5 shadow-[0_14px_34px_-24px_rgba(1,158,54,0.55)] backdrop-blur"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nam-green/10">
                      <item.icon className="h-6 w-6 text-nam-green" />
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-foreground/75">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
