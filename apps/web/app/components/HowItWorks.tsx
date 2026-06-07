"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScanLine, CloudUpload, Coins } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: ScanLine,
    number: "01",
    title: "Scan",
    description:
      "Snap a photo of any receipt from your everyday purchases. Coffee, groceries, gas — everything counts.",
    detail: "AI-powered OCR reads your receipt instantly",
  },
  {
    icon: CloudUpload,
    number: "02",
    title: "Upload",
    description:
      "Your receipt is securely uploaded and verified. Spending data is parsed, categorized, and added to your personal finance dashboard.",
    detail: "End-to-end encrypted and privacy-first",
  },
  {
    icon: Coins,
    number: "03",
    title: "Earn",
    description:
      "NAM Coins are mined on-chain and deposited into your wallet. Real crypto, real ownership — from money you already spent.",
    detail: "On-chain mining with every verified receipt",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title reveal
      gsap.from(".hw-title", {
        scrollTrigger: { trigger: ".hw-title", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      const mm = gsap.matchMedia();

      // Desktop: pin the grid container, use a single scrubbed timeline
      mm.add("(min-width: 768px)", () => {
        const cols = gsap.utils.toArray<HTMLElement>(".hw-col");
        const connectors = gsap.utils.toArray<HTMLElement>(".hw-connector");
        const numbers = gsap.utils.toArray<HTMLElement>(".hw-number");
        const progressFill = document.querySelector(".hw-progress-fill");

        // Initial state — everything hidden
        cols.forEach((col) => gsap.set(col, { opacity: 0, y: 50 }));
        connectors.forEach((c) =>
          gsap.set(c, { scaleX: 0, transformOrigin: "left center" })
        );
        numbers.forEach((n) => gsap.set(n, { scale: 0, opacity: 0 }));
        if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });

        // Build one timeline for the whole sequence
        const tl = gsap.timeline();

        cols.forEach((col, i) => {
          // Number badge pops in
          tl.to(numbers[i], {
            scale: 1,
            opacity: 1,
            duration: 0.15,
            ease: "back.out(2)",
          });

          // Column slides up + fades in
          tl.to(
            col,
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: "power3.out",
            },
            "<"
          );

          // Connector draws in toward next column (except after last)
          if (i < connectors.length) {
            tl.to(connectors[i], {
              scaleX: 1,
              duration: 0.15,
              ease: "power2.out",
            });
          }

          // Small pause between steps
          if (i < cols.length - 1) {
            tl.to({}, { duration: 0.1 });
          }
        });

        // Scrub the timeline with the scroll, pinning the container
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 35%",
          end: "+=900",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          animation: tl,
        });

        // Progress bar tracks the same scroll range
        if (progressFill) {
          gsap.to(progressFill, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 35%",
              end: "+=900",
              scrub: 0.3,
            },
          });
        }
      });

      // Mobile: stagger reveal on scroll (no pin)
      mm.add("(max-width: 767px)", () => {
        gsap.from(".hw-col", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.25,
          ease: "power3.out",
        });
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
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(1,210,67,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl relative">
        {/* Title */}
        <div className="hw-title text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            How It <span className="text-gradient-green">Works</span>
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-xl mx-auto">
            Three simple steps to start mining crypto from your everyday
            purchases.
          </p>
        </div>

        {/* 3-column layout */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 relative"
        >
          {/* Progress bar (desktop only) — sits above columns */}
          <div className="hidden md:block absolute -top-8 left-[16.666%] right-[16.666%] z-0">
            <div className="h-[2px] rounded-2xl bg-white/5 overflow-hidden">
              <div className="hw-progress-fill h-full bg-nam-green/50 w-full rounded-2xl" />
            </div>
          </div>

          

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="hw-col relative flex flex-col items-center text-center px-4 md:px-8"
            >
              {/* Step number badge */}
              <div className="hw-number w-10 h-10 rounded-2xl bg-nam-green/10 border border-nam-green/20 flex items-center justify-center mb-5">
                <span className="text-xs font-mono font-bold text-nam-green">
                  {step.number}
                </span>
              </div>

              {/* Icon card */}
              <div className="relative group mb-6">
                <div className="w-[88px] h-[88px] md:w-24 md:h-24 rounded-2xl glass flex items-center justify-center transition-all duration-300 group-hover:border-nam-green/20">
                  <step.icon className="w-9 h-9 md:w-10 md:h-10 text-nam-green transition-transform duration-300 group-hover:scale-110" />
                </div>
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: "0 0 40px rgba(1,210,67,0.15)",
                  }}
                />
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-foreground/45 leading-relaxed max-w-[280px]">
                {step.description}
              </p>

              {/* Detail chip */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-nam-green/5 border border-nam-green/10">
                <div className="w-1 h-1 rounded-2xl bg-nam-green" />
                <span className="text-[11px] text-nam-green/70 font-medium">
                  {step.detail}
                </span>
              </div>

              {/* Mobile arrow (between steps) */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    className="text-nam-green/30"
                  >
                    <path
                      d="M10 4v12m0 0l-4-4m4 4l4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
