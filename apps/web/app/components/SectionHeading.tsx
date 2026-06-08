import { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

/**
 * Consistent section header: small green eyebrow, bold headline, muted subtitle.
 * `className` is the GSAP hook the parent animates (e.g. "hw-title").
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div
      className={`${className} ${
        isCenter ? "text-center mx-auto" : "text-left"
      } max-w-2xl`}
    >
      {eyebrow && (
        <span className={`eyebrow mb-4 ${isCenter ? "justify-center" : ""}`}>
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-foreground/50 text-base md:text-lg leading-relaxed ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
