"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function TokenEarning() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".te-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".te-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          className="te-title"
          title={
            <>
              $NAM becomes harder to{" "}
              <span className="text-gradient-green">earn.</span>
            </>
          }
          subtitle="Only 7.2 million NAM is available to earn each day. Every eligible receipt uploader competes for a share of that fixed daily allocation. As participation grows, NAM is distributed across more users, reducing the amount each person can earn from the same level of spending."
        />
      </div>

       {/* Example calculation */}
       <div className="mining-example glass-strong rounded-3xl p-8 md:p-10 max-w-3xl mx-auto mt-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-nam-green text-center mb-6">
            Example — Day 1
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">$10</p>
              <p className="text-sm text-foreground/40 mt-1">Your receipts</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">$1,000</p>
              <p className="text-sm text-foreground/40 mt-1">Network total</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">7.2M NAM</p>
              <p className="text-sm text-foreground/40 mt-1">Daily Rewards</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">1%</p>
              <p className="text-sm text-foreground/40 mt-1">72k NAM</p>
            </div>
          </div>
          <p className="text-sm text-foreground/40 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            You upload $10 in receipts, while the entire network uploads $1,000. That gives you 1% of the day&apos;s fixed distribution, earning you 72,000 NAM. The larger your share of the network&apos;s spending, the larger your share of the daily NAM distribution.
          </p>
        </div>

        <div className="mining-example glass-strong rounded-3xl p-8 md:p-10 max-w-3xl mx-auto mt-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-nam-green text-center mb-6">
            Example — Day 100
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">$10</p>
              <p className="text-sm text-foreground/40 mt-1">Your receipts</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">$10,000</p>
              <p className="text-sm text-foreground/40 mt-1">Network total</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-foreground/60">7.2M NAM</p>
              <p className="text-sm text-foreground/40 mt-1">Daily Rewards</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-mono text-nam-green">0.1%</p>
              <p className="text-sm text-foreground/40 mt-1">7,200 NAM</p>
            </div>
          </div>
          <p className="text-sm text-foreground/40 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            You upload the same $10 in receipts, but the network now uploads $10,000. Your share falls to 0.1% of the day&apos;s fixed distribution, earning you 7,200 NAM. Even though your spending has not changed, increased network participation means greater competition and less NAM earned. As the network grows, NAM becomes harder to mine.
          </p>
        </div>
    </section>
  );
}
