"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Receipt, Flame, TrendingUp } from "lucide-react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Receipt,
    title: "Minted by demand",
    description:
      "New NAM is only created when real receipts are verified. No spending, no new supply — emission tracks actual usage.",
  },
  {
    icon: Flame,
    title: "Pressure from buybacks",
    description:
      "A slice of network revenue is used to buy NAM from the open market and route it back into the rewards pool.",
  },
  {
    icon: TrendingUp,
    title: "Inflationary, then balanced",
    description:
      "Like Dogecoin, a fixed daily emission means inflation falls every year as the circulating base grows.",
  },
];

// Emission curve points (decreasing inflation rate over time), as % per year
const emission = [
  { year: "Y1", rate: 100 },
  { year: "Y2", rate: 52 },
  { year: "Y3", rate: 34 },
  { year: "Y4", rate: 26 },
  { year: "Y5", rate: 21 },
  { year: "Y6", rate: 17 },
];

// Build an SVG area path from the emission points
const W = 520;
const H = 220;
const PAD = 16;
const maxRate = 100;
const stepX = (W - PAD * 2) / (emission.length - 1);
const points = emission.map((d, i) => ({
  x: PAD + i * stepX,
  y: PAD + (1 - d.rate / maxRate) * (H - PAD * 2),
}));
const linePath = points
  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
  .join(" ");
const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)} ${H - PAD} L${points[0].x.toFixed(1)} ${H - PAD} Z`;

export default function TokenSupply() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ts-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".ts-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".ts-pillar",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".ts-pillars", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      const line = sectionRef.current?.querySelector(".ts-line") as SVGPathElement | null;
      if (line) {
        const length = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            scrollTrigger: { trigger: ".ts-chart", start: "top 80%" },
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.out",
          }
        );
      }

      gsap.fromTo(
        ".ts-area",
        { opacity: 0 },
        {
          scrollTrigger: { trigger: ".ts-chart", start: "top 80%" },
          opacity: 1,
          duration: 1,
          delay: 0.5,
        }
      );

      gsap.fromTo(
        ".ts-dot",
        { scale: 0, opacity: 0 },
        {
          scrollTrigger: { trigger: ".ts-chart", start: "top 80%" },
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.15,
          delay: 0.6,
          ease: "back.out(2)",
          transformOrigin: "center",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          className="ts-title"
          eyebrow="Supply model"
          title={
            <>
              Inflationary early,{" "}
              <span className="text-gradient-green">balanced at scale.</span>
            </>
          }
          subtitle="A fixed daily emission means the inflation rate falls year after year as the circulating supply grows — the same curve that made Dogecoin sustainable."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Chart */}
          <div className="lg:col-span-3 ts-chart glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold">Annual inflation rate</p>
              <span className="text-xs font-mono text-foreground/40">
                relative to Y1
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
              <defs>
                <linearGradient id="ts-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#01d243" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#01d243" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                <line
                  key={g}
                  x1={PAD}
                  x2={W - PAD}
                  y1={PAD + g * (H - PAD * 2)}
                  y2={PAD + g * (H - PAD * 2)}
                  stroke="rgba(16,24,40,0.06)"
                  strokeWidth="1"
                />
              ))}

              <path className="ts-area" d={areaPath} fill="url(#ts-fill)" />
              <path
                className="ts-line"
                d={linePath}
                fill="none"
                stroke="#01d243"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((p, i) => (
                <circle
                  key={emission[i].year}
                  className="ts-dot"
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill="#fff"
                  stroke="#01d243"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            <div className="flex justify-between mt-3 px-1">
              {emission.map((d) => (
                <span key={d.year} className="text-xs font-mono text-foreground/35">
                  {d.year}
                </span>
              ))}
            </div>
          </div>

          {/* Pillars */}
          <div className="lg:col-span-2 ts-pillars space-y-4">
            {pillars.map((p) => (
              <div key={p.title} className="ts-pillar glass rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-nam-green/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-nam-green" />
                  </div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
