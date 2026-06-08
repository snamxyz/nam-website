"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, X } from "lucide-react";
import Image from "next/image";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  { feature: "Rewards that never expire", nam: true, old: false },
  { feature: "Paid out the next day", nam: true, old: false },
  { feature: "No minimum to cash out", nam: true, old: false },
  { feature: "You own the asset on-chain", nam: true, old: false },
  { feature: "Swap or trade for other tokens", nam: true, old: false },
  { feature: "Free — no spending required", nam: true, old: true },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cmp-title", {
        scrollTrigger: { trigger: ".cmp-title", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".cmp-table", {
        scrollTrigger: { trigger: ".cmp-table", start: "top 82%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".cmp-row", {
        scrollTrigger: { trigger: ".cmp-table", start: "top 78%" },
        opacity: 0,
        x: -16,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          className="cmp-title"
          eyebrow="The difference"
          title={
            <>
              How NAM compares to{" "}
              <span className="text-gradient-green">old-school rewards.</span>
            </>
          }
          subtitle="Same receipts. A fundamentally better deal for the person doing the spending."
        />

        <div className="cmp-table mt-14 glass-strong rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] items-center gap-2 px-5 sm:px-8 py-5 border-b border-nam-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Feature
            </span>
            <div className="flex flex-col items-center gap-1">
              <Image
                src="/assets/icon.svg"
                alt="NAM Rewards"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xs font-bold text-nam-green">NAM</span>
            </div>
            <span className="text-xs font-semibold text-center text-foreground/40 leading-tight">
              Typical
              <br />
              rewards app
            </span>
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div
              key={row.feature}
              className="cmp-row grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] items-center gap-2 px-5 sm:px-8 py-4 border-b border-nam-border last:border-b-0"
            >
              <span className="text-sm md:text-base text-foreground/75 pr-3">
                {row.feature}
              </span>
              <div className="flex justify-center">
                {row.nam ? (
                  <span className="w-7 h-7 rounded-full bg-nam-green/15 flex items-center justify-center">
                    <Check className="w-4 h-4 text-nam-green" strokeWidth={3} />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-black/[0.05] flex items-center justify-center">
                    <X className="w-4 h-4 text-foreground/25" strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div className="flex justify-center">
                {row.old ? (
                  <span className="w-7 h-7 rounded-full bg-black/[0.05] flex items-center justify-center">
                    <Check className="w-4 h-4 text-foreground/40" strokeWidth={2.5} />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-black/[0.05] flex items-center justify-center">
                    <X className="w-4 h-4 text-foreground/25" strokeWidth={2.5} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
