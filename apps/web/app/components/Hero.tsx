"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Star, ArrowRight } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";
import TerminalWindow from "@/app/components/TerminalWindow";

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

        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        const influence = Math.max(0, 1 - dist / maxDist);

        const alpha = p.alpha + pulseFactor * 0.08 + influence * 0.4;
        const size = p.size + influence * 2;

        p.x = p.baseX + Math.sin(time * 0.0005 + p.pulse) * 2;
        p.y = p.baseY + Math.cos(time * 0.0005 + p.pulse) * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1, 210, 67, ${alpha})`;
        ctx.fill();

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
        delay: 0.15,
      });

      tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".hero-headline-line",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
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
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".hero-trust",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          ".hero-term",
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.1"
        )
        .fromTo(
          ".term-line",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.22, stagger: 0.11 },
          "-=0.4"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center px-6 pt-36 pb-20 md:pt-40 md:pb-24 overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Dotted grid + radial glow */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] glow-radial" />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full mx-auto">
        {/* Badge */}
        <div className="hero-badge mb-7">
          <span
            className="mono-chip inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg glass"
            style={{ color: "var(--nam-green-deep)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-nam-green opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-nam-green" />
            </span>
            status: live · ios &amp; android
          </span>
        </div>

        {/* Headline */}
        <h1 className="overflow-hidden">
          <span className="hero-headline-line block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold leading-[1.02] tracking-tight text-gradient-fade">
            Get paid for the
          </span>
          <span className="hero-headline-line block text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold leading-[1.02] tracking-tight text-gradient-green">
            receipts you already have.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub mt-7 text-base sm:text-lg md:text-xl text-foreground/55 max-w-2xl leading-relaxed">
          Scan everyday receipts and mine{" "}
          <span className="text-nam-green font-medium">NAM Coin</span> — real crypto
          paid to your wallet the <span className="text-foreground font-medium">very next day</span>.
          No spending. No minimums. Rewards that never expire.
        </p>

        {/* CTAs */}
        <div className="hero-cta-wrap mt-9 flex flex-col sm:flex-row gap-3.5">
          <DownloadButton platform="ios" className="hero-cta btn-primary text-base group">
            Start earning — it&apos;s free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </DownloadButton>
          <DownloadButton platform="android" className="hero-cta btn-secondary text-base">
            Get it on Android
          </DownloadButton>
        </div>

        {/* Trust row */}
        <div className="hero-trust mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/40">
          <span className="flex items-center gap-1.5">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-nam-green text-nam-green" />
              ))}
            </span>
            <span className="text-foreground/60 font-medium">5.0</span> on the App Store
          </span>
          <span className="hidden sm:inline w-px h-4 bg-nam-border" />
          <span>Next-day payouts</span>
          <span className="hidden sm:inline w-px h-4 bg-nam-border" />
          <span>$0 to start</span>
        </div>

        {/* Terminal demo — the product's techy signature */}
        <div className="hero-term mt-14 md:mt-16 w-full max-w-2xl text-left">
          <TerminalWindow title="nam-rewards — zsh">
            <div className="term-line">
              <span className="t-prompt">$</span>{" "}
              <span className="t-cmd">nam scan</span>{" "}
              <span className="t-flag">./receipt-coffee.jpg</span>
            </div>
            <div className="term-line t-dim">  verifying receipt…</div>
            <div className="term-line">
              <span className="t-ok">  ✓ verified</span>{" "}
              <span className="t-dim">· merchant: Daily Grind ·</span>{" "}
              <span className="t-val">$6.82</span>
            </div>
            <div className="term-line">
              <span className="t-ok">  + mined</span>{" "}
              <span className="t-val">1,204.50 NAM</span>{" "}
              <span className="t-dim">→ wallet · settles tomorrow</span>
            </div>
            <div className="term-line">&nbsp;</div>
            <div className="term-line">
              <span className="t-prompt">$</span>{" "}
              <span className="t-cmd">nam balance</span>{" "}
              <span className="t-flag">--usd</span>
            </div>
            <div className="term-line">
              <span className="t-val">  54,926,510.71 NAM</span>{" "}
              <span className="t-dim">≈</span> <span className="t-ok">$805.45</span>
            </div>
            <div className="term-line">
              <span className="t-prompt">$</span>
              <span className="cursor-blink">▋</span>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
