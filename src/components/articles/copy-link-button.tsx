"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

export function CopyLinkButton({ url, label, copiedLabel }: { url: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch {
            window.prompt(label, url);
          }
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-control border-2 border-navy-200 px-4 font-semibold hover:border-navy"
      >
        <Icon name={copied ? "check" : "copy"} size={18} />
        {copied ? copiedLabel : label}
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
