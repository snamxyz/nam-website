"use client";

import { useState } from "react";

const termsSections = [
  {
    id: "introduction",
    number: "01",
    heading: "Introduction",
    content:
      'These Terms of Use ("Terms") govern your access to and use of the website, mobile application ("App"), and services (collectively, the "Services") provided by NAM Rewards Inc., a Delaware corporation ("Company," "we," "us," or "our"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services. We may update these Terms at any time, and your continued use constitutes acceptance of changes.',
  },
  {
    id: "eligibility",
    number: "02",
    heading: "Eligibility",
    content:
      "You must be at least 18 years old and capable of forming a binding contract to use the Services. By using the Services, you represent that you meet these requirements and are not located in a jurisdiction where use of the Services is prohibited.",
  },
  {
    id: "account",
    number: "03",
    heading: "Account Registration",
    content:
      "To use certain features, you must create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use.",
  },
  {
    id: "user-content",
    number: "04",
    heading: "User Content & Receipt Uploads",
    content:
      'You may upload receipts or other content ("User Content") to earn NAM Coins. You represent that User Content is accurate, lawful, and does not infringe third-party rights. By uploading, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, modify, store, and analyze User Content for any purpose, including improving our Services and deriving insights.',
  },
  {
    id: "nam-coins",
    number: "05",
    heading: "NAM Coins",
    paragraphs: [
      "NAM Coins are digital collectibles existing on a blockchain and earned solely through uploading qualifying receipts for purchases you already make. No purchase of NAM Coins is required or permitted through our Services. NAM Coins do not represent equity, ownership, or any interest in the Company or its assets. They are highly speculative, carry significant risk of total loss in value, and are not intended as investments.",
      "NAM Coins are inflationary, with new tokens created daily based on user activity and platform needs, which may dilute value over time. We make no representations about the future value, utility, or liquidity of NAM Coins.",
      "NAM Coins are delivered directly to your non-custodial wallet. We do not control or have access to your wallet or private keys. If you lose access to your wallet, we cannot recover your NAM Coins or provide any assistance. You assume all risks associated with blockchain technology, including hacks, forks, or network failures.",
    ],
  },
  {
    id: "data-ownership",
    number: "06",
    heading: "Data Ownership",
    content:
      "All data collected through the Services, including but not limited to receipt data, purchase details, user behavior, app usage patterns, and derived analytics, is owned exclusively by the Company. You have no ownership or rights to such data beyond your personal use of the Services.",
  },
  {
    id: "intellectual-property",
    number: "07",
    heading: "Intellectual Property",
    content:
      "The Services, including software, trademarks, and content (excluding User Content), are owned by us or our licensors. You are granted a limited, non-exclusive license to use the Services for personal purposes only.",
  },
  {
    id: "prohibited-conduct",
    number: "08",
    heading: "Prohibited Conduct",
    content:
      "You agree not to: (a) upload false, fraudulent, or manipulated receipts; (b) use the Services for illegal purposes; (c) reverse engineer the App; (d) harass others; (e) introduce viruses; or (f) violate any laws, including anti-money laundering or securities regulations.",
  },
  {
    id: "termination",
    number: "09",
    heading: "Termination",
    content:
      "We may suspend or terminate your access at any time for any reason, without liability. Upon termination, your right to use the Services ends, but these Terms' survival provisions remain.",
  },
  {
    id: "disclaimers",
    number: "10",
    heading: "Disclaimers",
    content:
      'THE SERVICES AND NAM COINS ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DISCLAIM ANY RESPONSIBILITY FOR THE ACCURACY OF USER CONTENT, BLOCKCHAIN OPERATIONS, OR THIRD-PARTY SERVICES. NAM COINS ARE NOT SECURITIES AND ARE NOT REGISTERED UNDER U.S. SECURITIES LAWS.',
    isLegal: true,
  },
  {
    id: "liability",
    number: "11",
    heading: "Limitation of Liability",
    content:
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR VALUE OF NAM COINS, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL LIABILITY SHALL NOT EXCEED $100.",
    isLegal: true,
  },
  {
    id: "indemnification",
    number: "12",
    heading: "Indemnification",
    content:
      "You agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees, and agents from any claims, losses, or damages arising from your use of the Services, violation of these Terms, or infringement of rights.",
  },
  {
    id: "dispute-resolution",
    number: "13",
    heading: "Dispute Resolution",
    content:
      "Any disputes arising from these Terms shall be resolved through binding arbitration in Delaware under the American Arbitration Association rules, on an individual basis only (no class actions). You waive any right to jury trial or class proceedings.",
  },
  {
    id: "governing-law",
    number: "14",
    heading: "Governing Law",
    content:
      "These Terms are governed by Delaware law, without regard to conflict of laws principles.",
  },
  {
    id: "miscellaneous",
    number: "15",
    heading: "Miscellaneous",
    content:
      "These Terms constitute the entire agreement. If any provision is invalid, the remainder remains enforceable. No waiver of any term is effective unless in writing.",
  },
];

const privacySections = [
  {
    id: "privacy-intro",
    number: "01",
    heading: "Introduction",
    content:
      'This Privacy Policy describes how NAM Rewards Inc. ("we," "us," or "our") collects, uses, and discloses information through our website, App, and Services. By using the Services, you consent to these practices. We may update this Policy; check back periodically.',
  },
  {
    id: "information-collected",
    number: "02",
    heading: "Information We Collect",
    bullets: [
      "Personal Information: Name, email, phone, wallet address, and other details you provide.",
      "Receipt and Transaction Data: Purchase details, items, amounts, and merchants from uploaded receipts.",
      "Usage Data: App interactions, device info, IP address, location (if enabled), and behavioral patterns.",
      "Automatically Collected Data: Cookies, logs, and analytics from third-party tools.",
    ],
  },
  {
    id: "how-we-use",
    number: "03",
    heading: "How We Use Information",
    content:
      "We use information to: provide Services; award NAM Coins; analyze trends; improve the App; comply with laws; and for marketing (with opt-out options). We own all data and may use it for any business purpose, including aggregation and sale of anonymized insights.",
  },
  {
    id: "sharing",
    number: "04",
    heading: "Sharing Information",
    content:
      "We may share data with: service providers (e.g., cloud storage, analytics); affiliates; in mergers/acquisitions; or as required by law. We do not sell personal information without consent, except as anonymized data.",
  },
  {
    id: "data-retention",
    number: "05",
    heading: "Data Ownership & Retention",
    content:
      "We own all collected data perpetually. We retain data as long as needed for business purposes or legal requirements.",
  },
  {
    id: "security",
    number: "06",
    heading: "Security",
    content:
      "We use reasonable measures to protect data, but no system is foolproof. You are responsible for securing your wallet and device.",
  },
  {
    id: "your-rights",
    number: "07",
    heading: "Your Rights",
    content:
      "You may access, update, or delete your personal information via your account. California residents have rights under CCPA (e.g., opt-out of sales). Contact us for requests.",
  },
  {
    id: "childrens-privacy",
    number: "08",
    heading: "Children's Privacy",
    content:
      "The Services are not for children under 13. We do not knowingly collect their data.",
  },
  {
    id: "international",
    number: "09",
    heading: "International Transfers",
    content:
      "Data may be transferred to the U.S. or other countries with varying privacy laws.",
  },
  {
    id: "contact",
    number: "10",
    heading: "Contact Us",
    content: "For questions, email support@nam.xyz",
    isContact: true,
  },
];

type Section = {
  id: string;
  number: string;
  heading: string;
  content?: string;
  paragraphs?: string[];
  bullets?: string[];
  isLegal?: boolean;
  isContact?: boolean;
};

function SectionRow({ section }: { section: Section }) {
  const { number, heading, content, paragraphs, bullets, isLegal, isContact } =
    section;

  return (
    <div className="group relative flex gap-6 md:gap-10 py-8 border-b border-nam-border last:border-0">
      {/* Number */}
      <div className="hidden sm:flex flex-col items-center pt-1 flex-shrink-0 w-10">
        <span className="text-xs font-mono text-foreground/20 group-hover:text-nam-green/40 transition-colors duration-300 select-none">
          {number}
        </span>
        <div className="mt-3 w-px flex-1 bg-gradient-to-b from-nam-border to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground mb-3 group-hover:text-nam-green transition-colors duration-300">
          {heading}
        </h3>

        {isLegal && content && (
          <div className="rounded-xl border border-nam-border bg-black/[0.02] p-4">
            <p className="text-xs font-mono text-foreground/45 leading-relaxed tracking-wide">
              {content}
            </p>
          </div>
        )}

        {isContact && content && (
          <p className="text-sm text-foreground/60 leading-relaxed">
            For questions, email{" "}
            <a
              href="mailto:support@nam.xyz"
              className="text-nam-green hover:brightness-125 transition-all"
            >
              support@nam.xyz
            </a>
          </p>
        )}

        {!isLegal && !isContact && content && (
          <p className="text-sm text-foreground/60 leading-relaxed">{content}</p>
        )}

        {paragraphs && (
          <div className="space-y-3">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-foreground/60 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        )}

        {bullets && (
          <ul className="space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/60">
                <span className="mt-2 w-1 h-1 rounded-full bg-nam-green flex-shrink-0" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function TermsClient() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  const sections = activeTab === "terms" ? termsSections : privacySections;
  const sectionCount = sections.length;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(1,210,67,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-nam-green tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-nam-green" />
            Legal
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Terms &amp;{" "}
            <span className="text-gradient-green">Privacy</span>
          </h1>

          <p className="text-sm text-foreground/40">
            Effective Date: November 25, 2025 &nbsp;&middot;&nbsp; NAM Rewards
            Inc., Delaware
          </p>

          {/* Green divider line */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-nam-green/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-nam-green/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-nam-green/40" />
          </div>
        </div>
      </section>

      {/* Tab switcher + content */}
      <div className="px-6 pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Tabs */}
          <div className="flex items-center gap-1 glass rounded-2xl p-1.5 mb-10 w-fit mx-auto">
            {(["terms", "privacy"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-nam-green text-black shadow-lg"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {tab === "terms" ? "Terms of Use" : "Privacy Policy"}
              </button>
            ))}
          </div>

          {/* Section count pill */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-foreground/30 font-mono">
              {sectionCount} sections
            </span>
            <div className="h-px flex-1 bg-nam-border" />
          </div>

          {/* Sections */}
          <div>
            {sections.map((section) => (
              <SectionRow key={section.id} section={section as Section} />
            ))}
          </div>

          {/* Contact footer */}
          <div className="mt-16 rounded-2xl border border-nam-border bg-black/[0.02] p-8 text-center relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(1,210,67,0.06) 0%, transparent 70%)",
              }}
            />
            <p className="text-xs text-foreground/30 uppercase tracking-widest mb-3">
              Questions about these policies?
            </p>
            <a
              href="mailto:support@nam.xyz"
              className="text-lg font-semibold text-nam-green hover:brightness-125 transition-all duration-200"
            >
              support@nam.xyz
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
