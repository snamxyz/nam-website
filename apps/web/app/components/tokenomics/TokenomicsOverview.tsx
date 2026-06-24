"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Coins, Dog, ReceiptText, ServerOff, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type DistributionSlice = {
  label: string;
  percent: number;
  amount: string;
  color: string;
};

const preMinedDistribution: DistributionSlice[] = [
  { label: "MM", percent: 60, amount: "102B NAM", color: "#7bdde0" },
  { label: "Staking Rewards", percent: 10, amount: "17B NAM", color: "#5ab9cf" },
  { label: "LP", percent: 5.8, amount: "10B NAM", color: "#3d7fb6" },
  { label: "Founder", percent: 10, amount: "17B NAM", color: "#263b87" },
  { label: "Treasury", percent: 10, amount: "17B NAM", color: "#4c4594" },
  { label: "LP Incentives", percent: 4.2, amount: "7B NAM", color: "#8d53a8" },
];

const dailyInflation: DistributionSlice[] = [
  { label: "Users", percent: 50, amount: "7.2M NAM", color: "#7bdde0" },
  { label: "Treasury", percent: 50, amount: "7.2M NAM", color: "#5eb8d0" },
];

const comparisonCards = [
  {
    icon: Dog,
    title: "DOGE-inspired supply",
    description:
      "$NAM is designed to resemble $DOGE: a large total supply and a fixed inflationary schedule that becomes less aggressive as the network grows.",
  },
  {
    icon: ReceiptText,
    title: "Mined through receipts",
    description:
      "NAM enters circulation through verified receipts that show where users spent their time and money.",
  },
  {
    icon: ServerOff,
    title: "Not data-center mining",
    description:
      "The difference is the source of work: real consumer activity, not automated processors competing in data centers.",
  },
];

const toConicGradient = (slices: DistributionSlice[]) => {
  let cursor = 0;

  return `conic-gradient(${slices
    .map((slice) => {
      const start = cursor;
      cursor += slice.percent;
      return `${slice.color} ${start}% ${cursor}%`;
    })
    .join(", ")})`;
};

function PieChart({
  title,
  subtitle,
  center,
  slices,
}: {
  title: string;
  subtitle: string;
  center: string;
  slices: DistributionSlice[];
}) {
  return (
    <div className="tokenomics-chart glass-strong rounded-[2rem] p-6 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-foreground/70">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative mx-auto flex h-[260px] w-[260px] items-center justify-center rounded-full p-5 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.45)] md:h-[320px] md:w-[320px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: toConicGradient(slices) }}
          />
          <div className="relative flex h-[43%] w-[43%] items-center justify-center rounded-full bg-background/95 text-center shadow-inner">
            <p className="px-4 font-mono text-xl font-bold leading-tight text-foreground md:text-2xl">
              {center}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {slices.map((slice) => (
            <div
              key={slice.label}
              className="tokenomics-legend flex items-center justify-between gap-4 rounded-2xl border border-foreground/5 bg-white/65 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ background: slice.color }}
                />
                <div>
                  <p className="text-sm font-semibold">{slice.label}</p>
                  <p className="text-xs font-mono text-foreground/45">
                    {slice.amount}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-foreground/70">
                {slice.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TokenomicsOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.fromTo(".tokenomics-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(
          ".tokenomics-line",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
          "-=0.25"
        )
        .fromTo(
          ".tokenomics-sub",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.35"
        )
        .fromTo(
          ".tokenomics-stat",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.25"
        );

      gsap.fromTo(
        ".tokenomics-card",
        { y: 32, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tokenomics-cards", start: "top 82%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".tokenomics-chart",
        { y: 36, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tokenomics-charts", start: "top 78%" },
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".tokenomics-legend",
        { x: 18, opacity: 0 },
        {
          scrollTrigger: { trigger: ".tokenomics-charts", start: "top 76%" },
          x: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="absolute inset-0 hero-grid pointer-events-none z-0" />
      <div className="absolute inset-0 hero-grid-nodes pointer-events-none z-0" />
      <div className="absolute left-1/2 top-[10%] z-[1] h-[600px] w-[900px] -translate-x-1/2 glow-radial pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="tokenomics-badge mb-6">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-nam-green-deep">
              <Coins className="h-3.5 w-3.5" />
              $NAM Tokenomics
            </span>
          </div>

          <h1 className="overflow-hidden">
            <span className="tokenomics-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-fade">
              Tokenomics inspired
            </span>
            <span className="tokenomics-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-green">
              by Dogecoin.
            </span>
          </h1>

          <p className="tokenomics-sub mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-foreground/55">
            The tokenomics of $NAM is designed to be similar as $DOGE. Both
            tokens share similar total supply and share the same inflationary
            rate. The difference with $NAM is that the tokens are mined through
            receipts of where you spent your time and money — not through
            automated processors in data centers. This is the unique value
            proposition of Non-Automated Mined.
          </p>

          <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Pre-mined supply", "170B NAM"],
              ["Daily inflation", "14.4M NAM"],
              ["User rewards", "7.2M / day"],
            ].map(([label, value]) => (
              <div key={label} className="tokenomics-stat glass rounded-2xl px-4 py-3 text-left">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
                  {label}
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold text-nam-green">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="tokenomics-cards mt-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {comparisonCards.map((card, index) => (
            <div key={card.title} className="tokenomics-card glass rounded-3xl p-6 card-hover">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nam-green/10">
                  <card.icon className="h-6 w-6 text-nam-green" />
                </div>
                <span className="font-mono text-sm font-bold text-foreground/20">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="text-base font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="tokenomics-charts mt-20 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PieChart
            title="Pre-Mined Distribution"
            subtitle="170B NAM Coins"
            center="102B NAM"
            slices={preMinedDistribution}
          />
          <PieChart
            title="Daily Inflation"
            subtitle="14.4M NAM per Day"
            center="50 / 50"
            slices={dailyInflation}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-nam-green/15 bg-nam-green/5 p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-nam-green/10">
            <TrendingUp className="h-6 w-6 text-nam-green" />
          </div>
          <p className="mx-auto max-w-3xl text-sm md:text-base leading-relaxed text-foreground/60">
            Like DOGE, fixed daily issuance means the headline inflation rate
            declines over time as total supply grows. NAM keeps that familiar
            supply model, but redirects mining toward verified human activity.
          </p>
        </div>
      </div>
    </section>
  );
}
