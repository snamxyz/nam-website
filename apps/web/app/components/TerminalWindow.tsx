import { ReactNode } from "react";

type TerminalWindowProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A dark macOS-style terminal/console window used as the product's visual
 * signature on the otherwise-light page. Body content is monospaced; use the
 * `.t-prompt`, `.t-cmd`, `.t-ok`, `.t-val`, `.t-dim`, `.t-flag` token classes
 * for syntax coloring.
 */
export default function TerminalWindow({
  title = "nam — zsh",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div className={`term-window ${className}`}>
      <div className="term-bar">
        <span className="term-dot" style={{ background: "#ff5f57" }} />
        <span className="term-dot" style={{ background: "#febc2e" }} />
        <span className="term-dot" style={{ background: "#28c840" }} />
        <span className="term-title">{title}</span>
        {/* spacer to keep the title visually centered against the dots */}
        <span className="w-[42px]" aria-hidden />
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}
