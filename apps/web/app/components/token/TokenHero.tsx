"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame, Coins, ArrowRight } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";

const specs = [
  { label: "Token", value: "NAM" },
  { label: "Ticker", value: "$NAM" },
  { label: "Network", value: "Base" },
  { label: "Standard", value: "ERC-20" },
];

export default function TokenHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.fromTo(".th-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".th-line",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          "-=0.3"
        )
        .fromTo(".th-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .fromTo(".th-chip", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .fromTo(".th-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(
          ".th-spec",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pt-36 pb-20 md:pt-44 md:pb-28"
    >
      {/* Background */}
      <div className="absolute inset-0 hero-grid pointer-events-none z-0" />
      <div className="absolute inset-0 hero-grid-nodes pointer-events-none z-0" />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] glow-radial pointer-events-none z-[1]" />

      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center">
        <div className="th-badge mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wide" style={{ color: "var(--nam-green-deep)" }}>
            <Coins className="w-3.5 h-3.5" />
            The $NAM token
          </span>
        </div>

        <h1 className="overflow-hidden">
          <span className="th-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-fade">
            A token built on
          </span>
          <span className="th-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-green">
            real spending.
          </span>
        </h1>

        <p className="th-sub mt-6 text-base md:text-lg text-foreground/55 max-w-xl leading-relaxed">
          <span className="text-nam-green font-medium">NAM</span> — Non-Automated
          Mined — is the native asset of the network. It isn&apos;t minted by
          rigs in a data center. It&apos;s mined by real people, from the
          receipts of everyday spending.
        </p>

        {/* Trust chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <span className="th-chip float-chip text-nam-green-deep">
            <Coins className="w-4 h-4 text-nam-green" />
            Mined daily
          </span>
          <span className="th-chip float-chip text-nam-green-deep">
            <Flame className="w-4 h-4 text-nam-green" />
            Backed by demand
          </span>
        </div>

        <div className="th-cta mt-8">
          <DownloadButton platform="ios" className="btn-primary text-base group">
            Start mining NAM
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </DownloadButton>
        </div>

        {/* Spec chips */}
        <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="th-spec glass rounded-2xl px-4 py-3 text-left">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
                {s.label}
              </p>
              <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
