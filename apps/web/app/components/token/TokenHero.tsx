"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame, Coins, ArrowRight } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";

const NAM_TOKEN_CONTRACT_ADDRESS = "0xd7C767DeF449C0C7ce76Af96AB4B5b3C518B80d4";
const DEXSCREENER_TOKEN_URL = `https://api.dexscreener.com/latest/dex/tokens/${NAM_TOKEN_CONTRACT_ADDRESS}`;
const BASE_RPC_URL = "https://mainnet.base.org";
const FALLBACK_NAM_TOKEN_PRICE_USD = 0.000003756;
const NAM_DAILY_EMISSION = 14_400_000;
const NAM_LAUNCH_DATE_UTC = Date.UTC(2026, 1, 17);
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TOKEN_REFRESH_MS = 60_000;

type DexscreenerPair = {
  priceUsd?: string;
  liquidity?: {
    usd?: number;
  };
};

type DexscreenerTokenResponse = {
  pairs?: DexscreenerPair[];
};

const getEstimatedTotalSupply = () => {
  const daysSinceLaunch = Math.max(
    0,
    Math.floor((Date.now() - NAM_LAUNCH_DATE_UTC) / MS_PER_DAY)
  );

  return daysSinceLaunch * NAM_DAILY_EMISSION;
};

const fetchNamTokenPriceUsd = async (signal: AbortSignal) => {
  const response = await fetch(DEXSCREENER_TOKEN_URL, { signal });

  if (!response.ok) {
    throw new Error("Unable to fetch NAM token price");
  }

  const data = (await response.json()) as DexscreenerTokenResponse;
  const bestPair = data.pairs
    ?.map((pair) => ({
      priceUsd: Number(pair.priceUsd),
      liquidityUsd: pair.liquidity?.usd ?? 0,
    }))
    .filter((pair) => Number.isFinite(pair.priceUsd) && pair.priceUsd > 0)
    .sort((a, b) => b.liquidityUsd - a.liquidityUsd)[0];

  return bestPair?.priceUsd;
};

const fetchNamTotalSupply = async (signal: AbortSignal) => {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          to: NAM_TOKEN_CONTRACT_ADDRESS,
          data: "0x18160ddd",
        },
        "latest",
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to fetch NAM total supply");
  }

  const data = (await response.json()) as { result?: string; error?: unknown };

  if (!data.result || data.error) {
    throw new Error("Invalid NAM total supply response");
  }

  return Number(BigInt(data.result)) / 1e18;
};

const formatSupply = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B NAM`;
  }

  return `${(value / 1_000_000).toFixed(1)}M NAM`;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);

const specs = [
  { label: "Token", value: "NAM" },
  { label: "Ticker", value: "$NAM" },
  { label: "Network", value: "Base" },
  { label: "Standard", value: "ERC-20" },
];

export default function TokenHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [totalSupply, setTotalSupply] = useState(getEstimatedTotalSupply);
  const [tokenPriceUsd, setTokenPriceUsd] = useState(FALLBACK_NAM_TOKEN_PRICE_USD);

  useEffect(() => {
    const controller = new AbortController();

    const refreshLiveStats = async () => {
      const [priceResult, supplyResult] = await Promise.allSettled([
        fetchNamTokenPriceUsd(controller.signal),
        fetchNamTotalSupply(controller.signal),
      ]);

      if (controller.signal.aborted) {
        return;
      }

      if (priceResult.status === "fulfilled" && priceResult.value) {
        setTokenPriceUsd(priceResult.value);
      }

      if (supplyResult.status === "fulfilled" && Number.isFinite(supplyResult.value)) {
        setTotalSupply(supplyResult.value);
      } else {
        setTotalSupply(getEstimatedTotalSupply());
      }
    };

    void refreshLiveStats();
    const intervalId = window.setInterval(() => {
      void refreshLiveStats();
    }, TOKEN_REFRESH_MS);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.fromTo(".th-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          ".th-line",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          "-=0.3"
        )
        .fromTo(".th-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .fromTo(".th-chip", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .fromTo(".th-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(
          ".th-spec",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        )
        .fromTo(
          ".th-stat",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.15"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pt-36 pb-20 md:pt-44 md:pb-28"
    >
      {/* Background */}
      <div className="absolute inset-0 hero-grid pointer-events-none z-0" />
      <div className="absolute inset-0 hero-grid-nodes pointer-events-none z-0" />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] glow-radial pointer-events-none z-[1]" />

      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center">
        <div className="th-badge mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wide" style={{ color: "var(--nam-green-deep)" }}>
            <Coins className="w-3.5 h-3.5" />
            The $NAM token
          </span>
        </div>

        <h1 className="overflow-hidden">
          <span className="th-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-fade">
            A token earned from
          </span>
          <span className="th-line block text-[2.75rem] sm:text-6xl md:text-[4.25rem] font-bold leading-[1.04] tracking-tight text-gradient-green">
            real spending.
          </span>
        </h1>

        <p className="th-sub mt-6 text-base md:text-lg text-foreground/55 max-w-xl leading-relaxed">
          <span className="text-nam-green font-medium">NAM</span> — Non-Automated Mined — is crypto that&apos;s earned by real people through verified everyday purchases. Instead of being mined by computer rigs in data centers, NAM enters circulation through real-world spending, rewarding people for where they choose to spend their time and money.  
        </p>

        {/* Trust chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <span className="th-chip float-chip text-nam-green-deep">
            <Coins className="w-4 h-4 text-nam-green" />
            Earned Daily
          </span>
          <span className="th-chip float-chip text-nam-green-deep">
            <Flame className="w-4 h-4 text-nam-green" />
            Backed by Data
          </span>
        </div>

        <div className="th-cta mt-8">
          <DownloadButton platform="ios" className="btn-primary text-base group">
            Start Earning NAM
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </DownloadButton>
        </div>

        {/* Spec chips */}
        <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="th-spec glass rounded-2xl px-4 py-3 text-left">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
                {s.label}
              </p>
              <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="th-stat glass rounded-2xl px-4 py-3 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
              Current Supply
            </p>
            <p className="text-lg font-bold font-mono text-nam-green mt-0.5">
              {formatSupply(totalSupply)}
            </p>
          </div>
          <div className="th-stat glass rounded-2xl px-4 py-3 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
              Current Price
            </p>
            <p className="text-lg font-bold font-mono text-nam-green mt-0.5">
              {formatPrice(tokenPriceUsd)}
            </p>
          </div>
          <div className="th-stat glass rounded-2xl px-4 py-3 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
              Daily Inflation
            </p>
            <p className="text-lg font-bold font-mono text-foreground mt-0.5">
              14.4M NAM
            </p>
          </div>
          <div className="th-stat glass rounded-2xl px-4 py-3 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/35">
              Mining Model
            </p>
            <p className="text-lg font-bold font-mono text-foreground mt-0.5">
              Receipt-Based
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
