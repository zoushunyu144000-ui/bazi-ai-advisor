"use client";

import { useState } from "react";
import type { TenGod } from "@/types/domain";
import { characterAssetPath, getPublicPersonality, type CharacterGender } from "@/lib/public-personalities";

export function CharacterArt({
  tenGod,
  gender,
  className = "",
  priority = false,
}: {
  tenGod: TenGod;
  gender: CharacterGender;
  className?: string;
  priority?: boolean;
}) {
  const [available, setAvailable] = useState(true);
  if (!available) return null;
  const personality = getPublicPersonality(tenGod);
  return (
    <img
      src={characterAssetPath(tenGod, gender)}
      alt={`${personality.display_name} ${gender === "male" ? "男版" : "女版"}角色`}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setAvailable(false)}
      data-character-version="character-visual/1.0.0"
    />
  );
}
