import Image from "next/image";

type PhoneMockupProps = {
  src: string;
  alt: string;
  /** Tailwind width classes for the frame, e.g. "w-[260px]" */
  className?: string;
  priority?: boolean;
};

/**
 * Renders an app screenshot inside a realistic phone bezel.
 * The screenshots are full-bleed iOS captures, so the frame just adds
 * the rounded bezel + glow that matches the NAM dark/green brand.
 */
export default function PhoneMockup({
  src,
  alt,
  className = "w-[260px]",
  priority = false,
}: PhoneMockupProps) {
  return (
    <div className={`phone-frame ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={720}
        height={1560}
        className="w-full h-auto"
        priority={priority}
        sizes="(max-width: 768px) 60vw, 320px"
      />
    </div>
  );
}
