"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Coins, Wallet, Receipt, CheckCircle2, Zap, Gift } from "lucide-react";

const green = { color: "var(--nam-green-deep)" } as CSSProperties;

type Floater = { pos: CSSProperties; depth: number; node: ReactNode };

const floaters: Floater[] = [
  {
    pos: { top: "16%", left: "5%" },
    depth: 0.55,
    node: (
      <span className="float-chip" style={green}>
        <Coins className="w-4 h-4" /> +1,204 NAM earned
      </span>
    ),
  },
  {
    pos: { top: "12%", right: "7%" },
    depth: 0.8,
    node: (
      <span className="float-chip text-foreground/75">
        <CheckCircle2 className="w-4 h-4 text-nam-green" /> Receipt verified
      </span>
    ),
  },
  {
    pos: { top: "30%", right: "4%" },
    depth: 0.35,
    node: <div className="float-tile"><Wallet className="w-5 h-5 text-nam-green" /></div>,
  },
  {
    pos: { top: "44%", left: "7%" },
    depth: 0.9,
    node: (
      <span className="float-chip text-foreground/75">
        <span style={green} className="font-semibold">$6.82</span> back today
      </span>
    ),
  },
  {
    pos: { top: "62%", left: "4%" },
    depth: 0.45,
    node: <div className="float-tile"><Receipt className="w-5 h-5 text-nam-green" /></div>,
  },
  {
    pos: { bottom: "18%", right: "6%" },
    depth: 0.7,
    node: (
      <span className="float-chip" style={green}>
        <Zap className="w-4 h-4" /> Paid next day
      </span>
    ),
  },
  {
    pos: { bottom: "26%", right: "17%" },
    depth: 0.5,
    node: (
      <span className="float-chip text-foreground/75">
        <Gift className="w-4 h-4 text-nam-green" /> Free to start
      </span>
    ),
  },
  {
    pos: { top: "24%", left: "19%" },
    depth: 0.3,
    node: <div className="float-tile"><Coins className="w-5 h-5 text-nam-green" /></div>,
  },
  {
    pos: { bottom: "30%", left: "17%" },
    depth: 0.4,
    node: (
      <span className="float-chip text-foreground/75">
        <CheckCircle2 className="w-4 h-4 text-nam-green" /> Never expires
      </span>
    ),
  },
];

export default function HeroFloaters() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".float-item");

      // entrance
      gsap.from(items, {
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        delay: 0.55,
        ease: "power3.out",
      });

      // idle float on the inner element (keeps outer transform free for parallax)
      items.forEach((it) => {
        const inner = it.querySelector(".float-inner");
        gsap.to(inner, {
          y: gsap.utils.random(-12, 12),
          x: gsap.utils.random(-6, 6),
          rotation: gsap.utils.random(-4, 4),
          duration: gsap.utils.random(3, 5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });
      });

      // mouse parallax on the outer element
      const setters = items.map((it) => ({
        x: gsap.quickTo(it, "x", { duration: 0.6, ease: "power3" }),
        y: gsap.quickTo(it, "y", { duration: 0.6, ease: "power3" }),
        depth: parseFloat(it.dataset.depth || "0.4"),
      }));

      const onMove = (e: MouseEvent) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        setters.forEach((s) => {
          s.x(-dx * s.depth * 42);
          s.y(-dy * s.depth * 42);
        });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-[2] pointer-events-none hidden xl:block"
      aria-hidden
    >
      {floaters.map((f, i) => (
        <div key={i} className="float-item" data-depth={f.depth} style={f.pos}>
          <div className="float-inner">{f.node}</div>
        </div>
      ))}
    </div>
  );
}
