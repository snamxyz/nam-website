"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Hourglass, Lock, TrendingDown } from "lucide-react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: Hourglass,
    title: "Points built to expire",
    description:
      "Miss a redemption window and the points you worked for quietly vanish. Traditional programs profit when you forget.",
  },
  {
    icon: Lock,
    title: "Locked behind minimums",
    description:
      "Wait months to scrape past a $25 cash-out threshold before you can touch a single cent of what you earned.",
  },
  {
    icon: TrendingDown,
    title: "Devalued whenever they want",
    description:
      "The rules change without notice. A point worth a cent today can be worth half that tomorrow — and you have no say.",
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".problem-title", {
        scrollTrigger: { trigger: ".problem-title", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".problem-card", {
        scrollTrigger: { trigger: ".problem-grid", start: "top 82%" },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          className="problem-title"
          eyebrow="The problem"
          title={
            <>
              Everyone else&apos;s points are{" "}
              <span className="text-foreground/40">designed to disappear.</span>
            </>
          }
          subtitle="Loyalty programs are built around expiry, friction, and fine print. You do the spending — they keep the leverage."
        />

        <div className="problem-grid grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-16">
          {problems.map((p) => (
            <div
              key={p.title}
              className="problem-card glass rounded-3xl p-7 md:p-8 card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <p.icon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
