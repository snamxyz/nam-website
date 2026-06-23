"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import DownloadButton from "@/app/components/DownloadButton";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Features", href: "/#problems" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Tokenomics", href: "/tokenomics" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

function isRouteLink(href: string) {
  return href.startsWith("/") && !href.includes("#");
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useGSAP(() => {
    const showAnim = gsap
      .from(navRef.current, {
        yPercent: -120,
        paused: true,
        duration: 0.2,
        ease: "power2.out",
      })
      .progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === -1) {
          showAnim.play();
        } else {
          showAnim.reverse();
        }
      },
    });
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    const hash = href.slice(hashIndex);
    setMobileOpen(false);

    if (pathname === "/") {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", hash);
      }
    }
  };

  const linkClassName =
    "text-sm text-foreground/65 hover:text-nam-green transition-colors duration-200";
  const mobileLinkClassName =
    "text-2xl font-medium text-foreground/80 hover:text-nam-green transition-colors";

  const renderNavLink = (link: (typeof navLinks)[number], mobile = false) => {
    const className = mobile ? mobileLinkClassName : linkClassName;

    if (isRouteLink(link.href)) {
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setMobileOpen(false)}
          className={className}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={(e) => handleHashClick(e, link.href)}
        className={className}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-full w-[calc(100%-2rem)] max-w-3xl"
      >
        <div className="px-3 pl-5 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/assets/SVG.svg"
              alt="NAM Rewards"
              width={28}
              height={28}
              className="w-7 h-7 rounded-lg"
            />
            <span className="text-base font-bold tracking-tight">NAM Rewards</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => renderNavLink(link))}
          </div>

          <div className="hidden md:block">
            <DownloadButton
              platform="ios"
              className="text-sm font-semibold bg-nam-green text-black px-5 py-2.5 rounded-full hover:brightness-110 transition-all duration-200"
            >
              Download
            </DownloadButton>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground p-1.5"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => renderNavLink(link, true))}
          <Link
            href="/terms"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-medium text-foreground/80 hover:text-nam-green transition-colors"
          >
            Terms
          </Link>
          <DownloadButton
            platform="ios"
            className="mt-2 text-lg font-semibold bg-nam-green text-black px-8 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Download App
          </DownloadButton>
        </div>
      )}
    </>
  );
}
