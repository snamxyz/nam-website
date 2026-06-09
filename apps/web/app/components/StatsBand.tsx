"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const NAM_DAILY_DISTRIBUTION = 7_200_000;
const NAM_LAUNCH_DATE_UTC = Date.UTC(2026, 1, 17);
const BASE_TOTAL_NAM_EARNED = 799_200_000;
const NAM_TOKEN_CONTRACT_ADDRESS = "0xd7C767DeF449C0C7ce76Af96AB4B5b3C518B80d4";
const DEXSCREENER_TOKEN_URL = `https://api.dexscreener.com/latest/dex/tokens/${NAM_TOKEN_CONTRACT_ADDRESS}`;
const FALLBACK_NAM_TOKEN_PRICE_USD = 0.000003756;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type DexscreenerPair = {
  priceUsd?: string;
  liquidity?: {
    usd?: number;
  };
};

type DexscreenerTokenResponse = {
  pairs?: DexscreenerPair[];
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
});

const formatNamMillions = (value: number) =>
  `${Math.round(value / 1_000_000).toLocaleString("en-US")}M`;

const formatDailyNam = (value: number) =>
  `${(value / 1_000_000).toFixed(1)}M NAM`;

const getTotalNamEarned = () => {
  const daysSinceLaunch = Math.max(
    0,
    Math.floor((Date.now() - NAM_LAUNCH_DATE_UTC) / MS_PER_DAY)
  );

  return daysSinceLaunch * NAM_DAILY_DISTRIBUTION;
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

const buildStats = (totalNamEarned: number, tokenPriceUsd: number) => [
  {
    value: totalNamEarned,
    label: "Total NAM Paid",
    format: formatNamMillions,
  },
  {
    value: totalNamEarned * tokenPriceUsd,
    label: "Value Paid Out",
    format: (value: number) => usdFormatter.format(value),
  },
  {
    value: NAM_DAILY_DISTRIBUTION,
    label: "Paid Daily to Users",
    format: formatDailyNam,
  },
  {
    value: 0,
    label: "Minimum to cash out",
    format: (value: number) => usdFormatter.format(value),
  },
];

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [totalNamEarned, setTotalNamEarned] = useState(BASE_TOTAL_NAM_EARNED);
  const [tokenPriceUsd, setTokenPriceUsd] = useState(FALLBACK_NAM_TOKEN_PRICE_USD);

  const stats = useMemo(
    () => buildStats(totalNamEarned, tokenPriceUsd),
    [tokenPriceUsd, totalNamEarned]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchNamTokenPriceUsd(controller.signal)
      .then((priceUsd) => {
        setTotalNamEarned(getTotalNamEarned());

        if (priceUsd) {
          setTokenPriceUsd(priceUsd);
        }
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setTotalNamEarned(getTotalNamEarned());
        // Keep the fallback price if Dexscreener is unavailable.
      });

    return () => controller.abort();
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".stat-item",
        { y: 24, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      stats.forEach((stat, i) => {
        const el = sectionRef.current?.querySelector(`.stat-value-${i}`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.4,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          onUpdate: () => {
            el.textContent = stat.format(obj.val);
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [stats], revertOnUpdate: true }
  );

  return (
    <section ref={sectionRef} className="relative px-6">
      <div className="mx-auto max-w-6xl glass-strong rounded-3xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              <p
                className={`stat-value-${i} text-3xl md:text-4xl font-bold font-mono text-nam-green tracking-tight`}
              >
                {stat.format(stat.value)}
              </p>
              <p className="mt-2 text-xs md:text-sm text-foreground/45 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
