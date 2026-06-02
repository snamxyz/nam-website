"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Apple, Smartphone } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-content", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="download"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(1,210,67,0.12) 0%, rgba(1,210,67,0.03) 40%, transparent 70%)",
        }}
      />

      <div className="cta-content relative mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Start{" "}
          <span className="text-gradient-green">Mining</span>{" "}
          Today
        </h2>
        <p className="mt-4 text-foreground/50 text-base md:text-lg max-w-lg mx-auto">
          Download NAM Rewards and turn your everyday receipts into crypto.
          Available now on iOS and Android.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <DownloadButton
            platform="ios"
            className="group relative px-8 py-3.5 bg-nam-green text-black font-semibold rounded-2xl hover:brightness-110 transition-all duration-200 text-center overflow-hidden flex items-center justify-center gap-2 glow-green"
          >
            <Apple className="w-5 h-5" />
            Download for iOS
          </DownloadButton>
          <DownloadButton
            platform="android"
            className="px-8 py-3.5 border border-nam-border text-foreground/70 font-medium rounded-2xl hover:border-nam-green/30 hover:text-foreground hover:bg-nam-green/5 transition-all duration-200 text-center flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Download for Android
          </DownloadButton>
        </div>

        <p className="mt-4 text-xs text-foreground/30">
          Free to download. No investment required to start earning.
        </p>
      </div>
    </section>
  );
}
