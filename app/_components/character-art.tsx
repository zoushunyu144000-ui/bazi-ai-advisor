import Image from "next/image";
import type { TenGod } from "@/types/domain";
import {
  CHARACTER_VISUAL_VERSION,
  characterAssetPath,
  getPublicPersonality,
} from "@/lib/public-personalities";

export function CharacterArt({
  tenGod,
  className = "",
  priority = false,
}: {
  tenGod: TenGod;
  className?: string;
  priority?: boolean;
}) {
  const personality = getPublicPersonality(tenGod);
  return (
    <Image
      src={characterAssetPath(tenGod)}
      alt={`${personality.display_name}固定${personality.canonicalGender === "male" ? "男性" : "女性"}角色`}
      width={1200}
      height={1500}
      className={className}
      priority={priority}
      data-character-version={CHARACTER_VISUAL_VERSION}
    />
  );
}
