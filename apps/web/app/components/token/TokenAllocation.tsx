"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

type Slice = {
  label: string;
  percent: number;
  amount: string;
  color: string;
  note: string;
};

const allocation: Slice[] = [
  {
    label: "Miners (you)",
    percent: 50,
    amount: "7.2M / day",
    color: "#01d243",
    note: "Split across everyone who uploads verified receipts, every single day.",
  },
  {
    label: "Liquidity",
    percent: 20,
    amount: "2.88M / day",
    color: "#019e36",
    note: "Seeds deep on-chain liquidity so NAM stays easy to buy, sell, and swap.",
  },
  {
    label: "Treasury & ops",
    percent: 15,
    amount: "2.16M / day",
    color: "#0a8a32",
    note: "Funds infrastructure, receipt verification, and ongoing development.",
  },
  {
    label: "Team",
    percent: 10,
    amount: "1.44M / day",
    color: "#15ff5e",
    note: "Vested over time to keep the team aligned with the network long term.",
  },
  {
    label: "Ecosystem",
    percent: 5,
    amount: "0.72M / day",
    color: "#7af2a3",
    note: "Partnerships, marketing, and grants that grow the network of earners.",
  },
];

// Donut geometry
const R = 70;
const STROKE = 26;
const C = 2 * Math.PI * R;

export default function TokenAllocation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ta-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".ta-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      const arcEls = gsap.utils.toArray<SVGCircleElement>(".ta-arc");
      arcEls.forEach((el, i) => {
        const len = parseFloat(el.getAttribute("data-len") || "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: len,
          duration: 1.2,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ta-chart", start: "top 80%" },
          onUpdate: () =>
            el.setAttribute("stroke-dasharray", `${obj.v} ${C - obj.v}`),
        });
      });

      gsap.fromTo(
        ".ta-legend-item",
        { x: 20, opacity: 0 },
        {
          scrollTrigger: { trigger: ".ta-legend", start: "top 82%" },
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  // Cumulative offsets so arcs sit head-to-tail around the circle
  let cumulative = 0;
  const arcs = allocation.map((s) => {
    const len = (s.percent / 100) * C;
    const rotation = (cumulative / 100) * 360 - 90; // start at top
    cumulative += s.percent;
    return { ...s, len, rotation };
  });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[600px] h-[600px] glow-radial pointer-events-none" />

      <div className="mx-auto max-w-6xl relative">
        <SectionHeading
          className="ta-title"
          eyebrow="Allocation"
          title={
            <>
              Half of every coin goes{" "}
              <span className="text-gradient-green">straight to you.</span>
            </>
          }
          subtitle="The daily mining pool — 14.4M NAM — is allocated the same way every day. Miners always take the largest share."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Donut */}
          <div className="ta-chart relative flex justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] -rotate-0"
            >
              {/* track */}
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke="rgba(16,24,40,0.06)"
                strokeWidth={STROKE}
              />
              {arcs.map((a) => (
                <circle
                  key={a.label}
                  className="ta-arc"
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`0 ${C}`}
                  strokeDashoffset={0}
                  data-len={a.len}
                  strokeLinecap="butt"
                  transform={`rotate(${a.rotation} 100 100)`}
                />
              ))}
            </svg>
            {/* center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl md:text-4xl font-bold font-mono text-nam-green">14.4M</p>
              <p className="text-xs text-foreground/40 mt-1">NAM mined / day</p>
            </div>
          </div>

          {/* Legend */}
          <div className="ta-legend space-y-3">
            {allocation.map((s) => (
              <div
                key={s.label}
                className="ta-legend-item glass rounded-2xl p-4 flex items-start gap-4 card-hover"
              >
                <span
                  className="mt-1 w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{s.label}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-foreground/40">
                        {s.amount}
                      </span>
                      <span className="text-sm font-mono font-bold text-nam-green">
                        {s.percent}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/45 leading-relaxed mt-1">
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
