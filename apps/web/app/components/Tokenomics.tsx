"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const distribution = [
  { label: "Users", percent: 50, amount: "7.2M", color: "#01D243" },
  { label: "Treasury", percent: 50, amount: "7.2M", color: "#01D24380" },
];

export default function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".token-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".token-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Animate distribution bars
      gsap.from(".dist-bar-fill", {
        scrollTrigger: { trigger: ".dist-bars", start: "top 80%" },
        width: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Count up percentages
      distribution.forEach((item, i) => {
        const el = document.querySelector(`.dist-percent-${i}`);
        if (el) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: item.percent,
            duration: 1.2,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: ".dist-bars", start: "top 80%" },
            onUpdate: () => {
              el.textContent = `${Math.round(obj.val)}%`;
            },
          });
        }
      });

      gsap.from(".token-stat-card", {
        scrollTrigger: { trigger: ".token-stats", start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="tokenomics"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="token-title text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            NAM Coin{" "}
            <span className="text-gradient-green">Tokenomics</span>
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-2xl mx-auto">
          The tokenomics are modeled after Dogecoin. The only difference is the way they&apos;re mined — it&apos;s
not through automated processors in data centers. Instead, Non-Automated Mined (NAM)
tokens are different. They&apos;re mined through your consciousness and where you choose to
spend your time and money.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Distribution */}
          <div>
            <h3 className="text-xl font-semibold mb-8">Token Distribution</h3>
            <div className="dist-bars space-y-6">
              {distribution.map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground/70">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-foreground/40">
                        {item.amount}
                      </span>
                      <span
                        className={`dist-percent-${i} text-sm font-mono font-semibold text-nam-green`}
                      >
                        0%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-2xl bg-white/5 overflow-hidden">
                    <div
                      className="dist-bar-fill h-full rounded-2xl"
                      style={{
                        width: `${item.percent}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-xl p-5">
              <p className="text-sm text-foreground/50 leading-relaxed">
                <span className="text-nam-green font-semibold">NAM</span> =
                Non-Automated Mined tokens. Each receipt uploaded verifies
                real-world spending and generates coins through on-chain mining.
                No bots. No automation. Just real people earning real crypto.
              </p>
            </div>
          </div>

          {/* Token Stats */}
          <div>
            <h3 className="text-xl font-semibold mb-8">Key Figures</h3>
            <div className="token-stats grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="token-stat-card glass rounded-xl p-5">
                <p className="text-2xl font-bold font-mono text-nam-green">14.4M</p>
                <p className="text-xs text-foreground/40 mt-1">Daily Mined Supply</p>
              </div>
              <div className="token-stat-card glass rounded-xl p-5">
                <p className="text-2xl font-bold font-mono text-nam-green">7.2M</p>
                <p className="text-xs text-foreground/40 mt-1">Allocated to Users</p>
              </div>
              <div className="token-stat-card glass rounded-xl p-5">
                <p className="text-2xl font-bold font-mono text-nam-green">7.2M</p>
                <p className="text-xs text-foreground/40 mt-1">Allocated to Treasury</p>
              </div>
              <div className="token-stat-card glass rounded-xl p-5">
                <p className="text-2xl font-bold font-mono text-nam-green">50/50</p>
                <p className="text-xs text-foreground/40 mt-1">User / Treasury Split</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
