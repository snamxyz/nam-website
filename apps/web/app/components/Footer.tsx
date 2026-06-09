"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Rewards", href: "/#rewards" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Tokenomics", href: "/tokenomics" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Download", href: "/#download" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Terms of Use", href: "/terms" }],
  },
];

export default function Footer() {
  const pathname = usePathname();

  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    const hash = href.slice(hashIndex);

    if (pathname === "/") {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", hash);
      }
    }
  };

  return (
    <footer className="relative border-t border-nam-border px-6 pt-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/assets/icon.svg"
                alt="NAM Rewards"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="text-base font-bold tracking-tight">NAM Rewards</span>
            </Link>
            <p className="mt-4 text-sm text-foreground/40 leading-relaxed">
              Turning everyday receipts into crypto you actually own. The rewards
              layer for real-world spending.
            </p>
            <a
              href="mailto:support@nam.xyz"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-nam-green transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@nam.xyz
            </a>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) =>
                  link.href.includes("#") ? (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={(e) => handleHashClick(e, link.href)}
                        className="text-sm text-foreground/55 hover:text-nam-green transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/55 hover:text-nam-green transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-nam-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground/30">
            &copy; {new Date().getFullYear()} NAM Rewards. All rights reserved.
          </p>
          <p className="text-xs text-foreground/25">
            NAM — Non-Automated Mined tokens on Base.
          </p>
        </div>
      </div>
    </footer>
  );
}
