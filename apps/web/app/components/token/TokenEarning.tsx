"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/app/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function TokenEarning() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".te-title",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: ".te-title", start: "top 85%" },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          className="te-title"
          title={
            <>
              $NAM becomes harder to{" "}
              <span className="text-gradient-green">earn.</span>
            </>
          }
          subtitle="Only 7.2 million NAM is available to earn each day. Every eligible receipt uploader competes for a share of that fixed daily allocation. As participation grows, NAM is distributed across more users, reducing the amount each person can earn from the same level of spending."
        />
      </div>
    </section>
  );
}
