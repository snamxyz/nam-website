"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const distribution = [
  { label: "Users", percent: 50, amount: "7.2M", color: "#01D243" },
  { label: "Treasury", percent: 50, amount: "7.2M", color: "#01D24355" },
];

const figures = [
  { value: "14.4M", label: "Daily mined supply" },
  { value: "7.2M", label: "Allocated to users" },
  { value: "7.2M", label: "Allocated to treasury" },
  { value: "50/50", label: "User / treasury split" },
];

export default function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".token-title", {
        scrollTrigger: { trigger: ".token-title", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".dist-bar-fill", {
        scrollTrigger: { trigger: ".dist-bars", start: "top 80%" },
        width: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

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
        scrollTrigger: { trigger: ".token-stats", start: "top 82%" },
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
    <section id="tokenomics" ref={sectionRef} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          className="token-title"
          eyebrow="Tokenomics"
          title={
            <>
              Modeled on Dogecoin —{" "}
              <span className="text-gradient-green">mined by you.</span>
            </>
          }
          subtitle="The supply model mirrors Dogecoin. The difference is how it's mined: not by automated rigs in data centers, but through where real people choose to spend their time and money."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-16">
          {/* Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-7">Daily distribution</h3>
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
                  <div className="w-full h-3 rounded-full bg-black/[0.06] overflow-hidden">
                    <div
                      className="dist-bar-fill h-full rounded-full"
                      style={{ width: `${item.percent}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-2xl p-5">
              <p className="text-sm text-foreground/55 leading-relaxed">
                <span className="text-nam-green font-semibold">NAM</span> =
                Non-Automated Mined. Every receipt verifies real-world spending and
                mints coins on-chain. No bots, no automation — just real people
                earning real crypto.
              </p>
            </div>
          </div>

          {/* Key figures */}
          <div>
            <h3 className="text-lg font-semibold mb-7">Key figures</h3>
            <div className="token-stats grid grid-cols-2 gap-4">
              {figures.map((f) => (
                <div key={f.label} className="token-stat-card glass rounded-2xl p-6 card-hover">
                  <p className="text-2xl md:text-3xl font-bold font-mono text-nam-green">
                    {f.value}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1.5">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
