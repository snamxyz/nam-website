"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-nam-border px-3 py-1.5 text-sm transition hover:bg-black/[0.04]"
    >
      {copied ? <Check className="h-4 w-4 text-nam-green" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
