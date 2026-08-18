"use client";

import { useState } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, sizes, priority }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--shop-cream)] to-[var(--shop-line)]/60">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--shop-gold)]/40 bg-white/70">
          <Wrench className="h-5 w-5 text-[var(--shop-forest)]" aria-hidden="true" />
        </div>
        <span className="px-4 text-center text-[11px] font-medium leading-snug text-[var(--shop-mist)]">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
      priority={priority}
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
