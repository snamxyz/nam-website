"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 14.4, suffix: "M", decimals: 1, label: "NAM mined every day" },
  { value: 50, suffix: "%", decimals: 0, label: "Goes straight to users" },
  { value: 0, prefix: "$", suffix: "", decimals: 0, label: "Minimum to cash out" },
  { value: 5.0, suffix: "★", decimals: 1, label: "Rated on the App Store" },
];

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".stat-item", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });

      stats.forEach((stat, i) => {
        const el = document.querySelector(`.stat-value-${i}`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.4,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${stat.prefix ?? ""}${obj.val.toFixed(
              stat.decimals
            )}${stat.suffix}`;
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative px-6">
      <div className="mx-auto max-w-5xl glass-strong rounded-3xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              <p
                className={`stat-value-${i} text-3xl md:text-4xl font-bold font-mono text-nam-green tracking-tight`}
              >
                {stat.prefix ?? ""}
                {stat.value.toFixed(stat.decimals)}
                {stat.suffix}
              </p>
              <p className="mt-2 font-mono lowercase text-xs md:text-sm text-foreground/45 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
