"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Apple, Smartphone } from "lucide-react";
import Image from "next/image";
import DownloadButton from "@/app/components/DownloadButton";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-card",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
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
    <section id="download" ref={sectionRef} className="relative py-20 md:py-28 px-6">
      <div className="cta-card relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-nam-border glass-strong px-6 py-16 md:py-20 text-center">
        {/* Glow + grid */}
       
        <div className="relative">
          <Image
            src="/assets/icon.svg"
            alt="NAM Rewards"
            width={56}
            height={56}
            className="w-14 h-14 mx-auto mb-7 drop-shadow-[0_0_30px_rgba(1,210,67,0.4)]"
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-balance">
            Your next receipt is
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient-green">worth something.</span>
          </h2>
          <p className="mt-5 text-foreground/55 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Download NAM Rewards, scan a receipt, and watch real earnings land in your wallet daily. Free to earn — no in-app spending required.  
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
            <DownloadButton platform="ios" className="btn-primary text-base glow-green">
              <Apple className="w-5 h-5" />
              Download for iOS
            </DownloadButton>
            <DownloadButton platform="android" className="btn-secondary text-base">
              <Smartphone className="w-5 h-5" />
              Download for Android
            </DownloadButton>
          </div>

          <p className="mt-5 text-xs text-foreground/30">
            Free to download · Next-day payouts · Rewards never expire
          </p>
        </div>
      </div>
    </section>
  );
}
