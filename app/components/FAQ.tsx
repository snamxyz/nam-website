"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What is NAM Rewards?",
    answer:
      "NAM Rewards is an app that lets you earn cryptocurrency (NAM Coins) just by uploading photos of your everyday receipts. You spend money like normal — on groceries, coffee, gas, online shopping — then snap your receipt and earn crypto.",
  },
  {
    question: "What is NAM Coin?",
    answer:
      "NAM stands for Non-Automated Mined. NAM Coin is a cryptocurrency token on the Base blockchain. It's mined by real people uploading real receipts — no bots, no automated farming. There are 14.4 million tokens created daily, split 50/50 between users and the treasury.",
  },
  {
    question: "How does mining work?",
    answer:
      "Each day, NAM Coins are distributed to users based on their share of total receipt uploads. For example, if you uploaded $10 in receipts and the total network uploaded $1,000 that day, you'd receive 1% of the daily token distribution. The more you spend and upload, the more you earn.",
  },
  {
    question: "Do I need to invest any money to start?",
    answer:
      "No. NAM Rewards is completely free to download and use. You earn NAM Coins just from receipts of purchases you're already making. There's zero investment required — it's a risk-free way to get into crypto.",
  },
  {
    question: "What is a crypto wallet?",
    answer:
      "A crypto wallet is like a digital bank account for cryptocurrency. NAM Rewards has a wallet built right into the app — it's created automatically when you sign up. Your NAM Coins go directly into this wallet. You can also use it to buy, sell, or send crypto.",
  },
  {
    question: "What is a blockchain?",
    answer:
      "A blockchain is a public, digital ledger that records transactions. Think of it as a shared spreadsheet that no single person controls. NAM Coin lives on the Base blockchain, which means every transaction is transparent and verifiable. You don't need to understand blockchain to use NAM Rewards — the app handles everything for you.",
  },
  {
    question: "Can I buy or sell NAM Coins?",
    answer:
      "Yes! The app has full buy and sell functionality built in. You can purchase NAM Coins using Apple Pay or bank transfer (fiat onramp), and sell them whenever you want.",
  },
  {
    question: "Can I send NAM Coins to someone else?",
    answer:
      "Absolutely. You can send NAM Coins (or other tokens) to any Base wallet address directly from the app. Full self-custody means you have complete control over your tokens.",
  },
  {
    question: "What receipts count?",
    answer:
      "Any receipt from a real purchase counts — groceries, restaurants, gas stations, online orders, subscriptions, and more. Our AI-powered system reads and verifies your receipts automatically.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Receipt data is securely processed with your privacy in mind.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-nam-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm md:text-base font-medium text-foreground/80 group-hover:text-foreground transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-foreground/30 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-nam-green" : ""
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 200}px` : "0px",
        }}
      >
        <p className="pb-5 text-sm text-foreground/45 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      gsap.from(".faq-title", {
        scrollTrigger: { trigger: ".faq-title", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".faq-list", {
        scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="mx-auto max-w-3xl">
        <div className="faq-title text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Frequently Asked{" "}
            <span className="text-gradient-green">Questions</span>
          </h2>
          <p className="mt-4 text-foreground/50 text-base md:text-lg">
            New to crypto? No worries. We&apos;ve got you covered.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
