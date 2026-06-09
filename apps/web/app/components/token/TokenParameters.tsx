"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const params = [
  { label: "Token name", value: "NAM" },
  { label: "Ticker", value: "$NAM" },
  { label: "Blockchain", value: "Base" },
  { label: "Token standard", value: "ERC-20" },
  { label: "Decimals", value: "18" },
  { label: "Max supply", value: "Uncapped" },
  { label: "Daily emission", value: "14.4M" },
  { label: "Mining model", value: "Receipt-based" },
];

export default function TokenParameters() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".tp-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tp-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".tp-row",
        { y: 24, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tp-grid", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          className="tp-title"
          eyebrow="Parameters"
          title={
            <>
              The numbers behind{" "}
              <span className="text-gradient-green">$NAM.</span>
            </>
          }
          subtitle="A transparent, on-chain asset on Base. Inflationary by design — modeled on Dogecoin — so the supply keeps rewarding the people who power the network."
        />

        <div className="tp-grid mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {params.map((p) => (
            <div
              key={p.label}
              className="tp-row glass rounded-2xl p-5 card-hover flex flex-col justify-between min-h-[112px]"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
                {p.label}
              </p>
              <p className="text-xl md:text-2xl font-bold font-mono text-foreground mt-3">
                {p.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
