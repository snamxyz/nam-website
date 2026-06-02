"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import DownloadButton from "@/app/components/DownloadButton";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      alpha: number;
      pulse: number;
      speed: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const spacing = 80;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing,
            y: j * spacing,
            baseX: i * spacing,
            baseY: j * spacing,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.15 + 0.03,
            pulse: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.005 + 0.002,
          });
        }
      }
    };

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now();

      for (const p of particles) {
        p.pulse += p.speed;
        const pulseFactor = Math.sin(p.pulse) * 0.5 + 0.5;

        // Mouse proximity glow
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        const influence = Math.max(0, 1 - dist / maxDist);

        const alpha = p.alpha + pulseFactor * 0.08 + influence * 0.4;
        const size = p.size + influence * 2;

        // Subtle drift
        p.x = p.baseX + Math.sin(time * 0.0005 + p.pulse) * 2;
        p.y = p.baseY + Math.cos(time * 0.0005 + p.pulse) * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1, 210, 67, ${alpha})`;
        ctx.fill();

        // Connection lines to nearby particles on mouse proximity
        if (influence > 0.1) {
          for (const other of particles) {
            const odx = p.x - other.x;
            const ody = p.y - other.y;
            const oDist = Math.sqrt(odx * odx + ody * ody);
            if (oDist < 100 && oDist > 0) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(1, 210, 67, ${influence * 0.08})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // GSAP entrance animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.2,
      });

      tl.fromTo(".hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          ".hero-headline-line",
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.3"
        )
        .fromTo(
          ".hero-sub",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.3"
        )
        .fromTo(
          ".hero-stats > div",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.2"
        )
        .fromTo(
          ".hero-image",
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.1"
        );

      // Subtle floating on product image
      gsap.to(".hero-image", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(1,210,67,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, var(--background), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to top, var(--background), transparent)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-16 max-w-7xl w-full mx-auto">
        {/* Left: Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
          {/* Badge */}
          <div className="hero-badge mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl glass text-xs font-medium text-nam-green tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-2xl bg-nam-green animate-pulse" />
              Live on iOS &amp; Android
            </span>
          </div>

          {/* Headline */}
          <h1 className="overflow-hidden">
            <span className="hero-headline-line block text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[1.05] tracking-tight">
              Mine Crypto From
            </span>
            <span className="hero-headline-line block text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[1.05] tracking-tight text-gradient-green">
              Your Receipts
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-sub mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-foreground/50 max-w-2xl leading-relaxed">
            Upload everyday receipts. Earn{" "}
            <span className="text-nam-green font-medium">NAM Coins</span>{" "}
            through on-chain mining. Get a powerful crypto wallet.
            
            <br className="hidden sm:block" />
            Zero risk. Zero investment. Real crypto.
          </p>

          {/* CTAs */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
            <DownloadButton
              platform="ios"
              className="hero-cta group relative px-8 py-3.5 bg-nam-green text-black font-semibold rounded-2xl hover:brightness-110 transition-all duration-200 text-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Download for iOS
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </DownloadButton>
            <DownloadButton
              platform="android"
              className="hero-cta px-8 py-3.5 border border-nam-border text-foreground/70 font-medium rounded-2xl hover:border-nam-green/30 hover:text-foreground hover:bg-nam-green/5 transition-all duration-200 text-center"
            >
              Download for Android
            </DownloadButton>
          </div>

          {/* Stats strip */}
          <div className="hero-stats mt-14 md:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12">
            {[
              { value: "On-Chain", label: "Mining" },
              { value: "Zero", label: "Investment" },
              { value: "Real-Time", label: "Insights" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center lg:items-start">
                <span className="text-lg md:text-xl font-bold text-nam-green font-mono">
                  {stat.value}
                </span>
                <span className="text-xs text-foreground/30 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product demo image */}
        <div className="hero-image flex-shrink-0 w-full max-w-sm lg:max-w-md xl:max-w-lg">
          <Image
            src="/assets/product_demo.png"
            alt="NAM Rewards app showing wallet and earnings dashboard"
            width={1200}
            height={1200}
            className="w-full h-auto drop-shadow-[0_0_60px_rgba(1,210,67,0.15)]"
            priority
          />
        </div>
      </div>

    </section>
  );
}
