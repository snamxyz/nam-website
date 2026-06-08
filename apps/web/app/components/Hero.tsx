"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Star, ArrowRight } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";
import HeroFloaters from "@/app/components/HeroFloaters";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".hero-headline-line",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          "-=0.3"
        )
        .fromTo(
          ".hero-sub",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".hero-trust",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center px-6 pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none z-0" />
      <div className="absolute inset-0 hero-grid-nodes pointer-events-none z-0" />

      {/* Radial glow + bottom fade */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] glow-radial" />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        />
      </div>

      {/* Floating parallax items */}
      <HeroFloaters />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full mx-auto">
        {/* Badge */}
        <div className="hero-badge mb-7">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wide" style={{ color: "var(--nam-green-deep)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-nam-green opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-nam-green" />
            </span>
            Live on iOS &amp; Android
          </span>
        </div>

        {/* Headline */}
        <h1 className="overflow-hidden">
          <span className="hero-headline-line block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold leading-[1.02] tracking-tight text-gradient-fade">
            Get paid
          </span>
          <span className="hero-headline-line block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold leading-[1.02] tracking-tight text-gradient-green">
            for your receipts.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub mt-7 text-base sm:text-lg md:text-xl text-foreground/55 max-w-2xl leading-relaxed">
        Scan everyday receipts and earn <span className="text-nam-green font-medium">NAM</span> — real crypto paid to your wallet the very next day. Redeem instantly.{" "}
          <span className="text-nam-green font-medium">No minimums and your rewards never expire.</span>
        </p>  

        {/* CTAs */}
        <div className="hero-cta-wrap mt-9 flex flex-col sm:flex-row gap-3.5">
          <DownloadButton platform="ios" className="hero-cta btn-primary text-base group">
            Start earning — it&apos;s free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </DownloadButton>
          <DownloadButton platform="android" className="hero-cta btn-secondary text-base">
            Get it on Android
          </DownloadButton>
        </div>

        {/* Trust row */}
        <div className="hero-trust mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/40">
          <span>Daily Payouts</span>
          <span className="hidden sm:inline w-px h-4 bg-nam-border" />
          <span>Free & Easy to Earn</span>
        </div>
      </div>
    </section>

 
  );
}
