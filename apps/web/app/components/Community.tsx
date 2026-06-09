"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Trophy, Clock, Users } from "lucide-react";
import PhoneMockup from "@/app/components/PhoneMockup";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Trophy,
    title: "Climb the leaderboard",
    description:
      "Daily, weekly, monthly and all-time rankings. The more you upload, the higher you rise.",
  },
  {
    icon: Clock,
    title: "A fresh pool every day",
    description:
      "Receipts are tallied at the daily cutoff and distributed at 1:00 AM EDT — every single day.",
  },
  {
    icon: Users,
    title: "Earn alongside real people",
    description:
      "Every token is mined by a community member uploading a real receipt. No bots in the pool.",
  },
];

export default function Community() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".comm-text",
        { x: -30, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".comm-row",
        { y: 24, opacity: 0 },
        {
          scrollTrigger: { trigger: ".comm-list", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".comm-phone",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] glow-radial pointer-events-none" />

      <div className="mx-auto max-w-6xl relative grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left — copy */}
        <div className="comm-text">
          <span className="eyebrow mb-4">The community</span>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-balance">
            Mine more, <span className="text-gradient-green">rank higher.</span>
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg leading-relaxed max-w-md">
            Every receipt is a play in a daily competition. Watch your share grow
            and your name climb the board.
          </p>

          <div className="comm-list mt-9 flex flex-col gap-5">
            {highlights.map((h) => (
              <div key={h.title} className="comm-row flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-nam-green/10 border border-nam-green/20 flex items-center justify-center">
                  <h.icon className="w-5 h-5 text-nam-green" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{h.title}</h3>
                  <p className="mt-1 text-sm text-foreground/50 leading-relaxed">
                    {h.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phone */}
        <div className="flex justify-center">
          <div className="comm-phone">
            <PhoneMockup
              src="/assets/app-leaderboard.png"
              alt="Monthly leaderboard ranking NAM Rewards users by tokens earned"
              className="w-[250px] md:w-[280px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
