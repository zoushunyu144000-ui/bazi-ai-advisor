"use client";

import { useEffect, useState } from "react";
import { getPublicPersonality, PUBLIC_PERSONALITY_ORDER } from "@/lib/public-personalities";
import { accentStyle } from "@/lib/personality-accent";
import type { TenGod } from "@/types/domain";

interface CharacterSlotProps {
  tenGod: TenGod;
  className?: string;
  variant?: "full" | "compact" | "minimal";
  showMeta?: boolean;
  showLoadingState?: boolean;
  /** When the formal asset URL exists, the slot will overlay it. */
  preferAssetPath?: string;
}

/**
 * Editorial asset slot for a 10-IP Public Personality.
 *
 * The formal V1 Character Master is still asset-gated (no committed binaries
 * yet). Until 10/10 + QA passes, this slot provides a clean editorial frame
 * that:
 *
 *   1. Honors the locked personality accent color;
 *   2. Clearly reads as a reserved character slot (not a placeholder character);
 *   3. Overlays the formal WebP image once the asset gate opens;
 *   4. Doesn't fake a silhouette, geometry, or AI character into the page;
 *
 * It also embeds a hidden visible-friendly "asset ready" probe so that the
 * formal asset, when committed at `/characters/v1/{ten_god}.webp`, will appear
 * on top of the frame without any code change.
 */
export function CharacterSlot({
  tenGod,
  className = "",
  variant = "full",
  showMeta = true,
  showLoadingState = true,
  preferAssetPath,
}: CharacterSlotProps) {
  const personality = getPublicPersonality(tenGod);
  const accent = accentStyle(tenGod);
  const [assetReady, setAssetReady] = useState(false);
  const [assetTried, setAssetTried] = useState(false);
  const index = PUBLIC_PERSONALITY_ORDER.indexOf(tenGod) + 1;
  const padded = String(index).padStart(2, "0");
  const accentHsl = personality.display_name;

  // Probes whether the canonical (gender-neutral) V1 asset has been committed.
  // When present, the image is layered on top of the editorial frame.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (assetTried) return;
    const probe = new Image();
    probe.onload = () => {
      setAssetTried(true);
      setAssetReady(true);
    };
    probe.onerror = () => {
      setAssetTried(true);
      setAssetReady(false);
    };
    probe.src = preferAssetPath ?? `/characters/v1/${tenGod}.webp`;
  }, [tenGod, assetTried, preferAssetPath]);

  if (variant === "minimal") {
    return (
      <div
        style={accent}
        className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[10px] bg-[var(--p-paper,var(--color-paper))] ${className}`}
        aria-label={`${personality.display_name} 角色资产位`}
      >
        {assetReady && (
          <img
            src={preferAssetPath ?? `/characters/v1/${tenGod}.webp`}
            alt={`${personality.display_name} 角色`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--p-ink,var(--color-ink-deep))] opacity-80">
          {padded}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        style={accent}
        className={`relative flex h-full w-full items-end justify-center overflow-hidden rounded-[12px] bg-[var(--p-soft,oklch(0.94_0.02_60))] ${className}`}
      >
        {assetReady && (
          <img
            src={preferAssetPath ?? `/characters/v1/${tenGod}.webp`}
            alt={`${personality.display_name} 角色`}
            className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[92%] w-auto max-w-[88%] object-contain"
            loading="lazy"
            decoding="async"
          />
        )}
        {!assetReady && (
          <div className="relative z-0 mb-3 flex flex-col items-center gap-1.5 px-3 text-center text-[var(--p-ink,var(--color-ink-deep))]">
            <span className="font-mono text-[10px] font-bold tracking-[0.24em]">
              BAZI · {padded} / 10
            </span>
            <span className="font-display text-base font-semibold leading-tight">
              {accentHsl}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full hero slot — used in Result hero, Share card preview, Homepage hero.
  return (
    <div
      style={accent}
      className={`relative isolate flex h-full w-full items-end justify-center overflow-hidden rounded-[20px] bg-[var(--p-soft,oklch(0.94_0.02_60))] ${className}`}
    >
      {/* Editorial framing — corner ticks, vertical index, accent rule */}
      <span aria-hidden className="absolute left-3 top-3 z-10 font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--p-ink,var(--color-ink-deep))]">
        {padded} / 10
      </span>
      <span aria-hidden className="absolute right-3 top-3 z-10 font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--p-ink,var(--color-ink-deep))] opacity-70">
        SLOT
      </span>
      <span aria-hidden className="absolute inset-x-5 bottom-5 z-20 h-px bg-[var(--p-hairline,var(--color-line))]" />

      {/* Layered character image (only when formal asset has shipped) */}
      {assetReady && (
        <img
          src={preferAssetPath ?? `/characters/v1/${tenGod}.webp`}
          alt={`${personality.display_name} 角色`}
          className="reveal absolute inset-x-0 bottom-0 z-[5] mx-auto h-[88%] w-auto max-w-[88%] object-contain"
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Editorial placeholder — clearly framed as a slot, not a fake character */}
      {!assetReady && (
        <div className="relative z-[1] mb-7 flex flex-col items-center gap-3 px-6 text-center text-[var(--p-ink,var(--color-ink-deep))]">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.32em] opacity-70">
            <span className="h-px w-6 bg-current" />
            BAZI · CITY OBSERVATION
            <span className="h-px w-6 bg-current" />
          </div>
          <span className="font-display text-4xl font-bold leading-[0.95] tracking-tight">
            {accentHsl}
          </span>
          {showMeta && (
            <span className="text-[11px] leading-relaxed opacity-70">
              正式角色资产尚未到位 ·
              <br />
              此位置为正式 IP 预留位
            </span>
          )}
        </div>
      )}

      {showLoadingState && !assetReady && (
        <span
          aria-hidden
          className="pulse-soft absolute bottom-2 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] tracking-[0.4em] text-[var(--p-ink,var(--color-ink-deep))] opacity-60"
        >
          · · ·
        </span>
      )}
    </div>
  );
}
