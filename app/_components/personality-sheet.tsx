"use client";
import type { Archetype, ElementMeta, Family } from "@/lib/personality-archetypes";
import { FAMILY_META, OUTPUT_METAPHOR } from "@/lib/personality-archetypes";
import type { FiveElement, HeavenlyStem } from "@/types/domain";
import { STEM_CHINESE } from "@/modules/bazi/constants";
import { PersonalityHero } from "./ps-hero";
import { PersonalityMiddle } from "./ps-mid";
import { PersonalityFooter } from "./ps-foot";

interface Props {
  archetype: Archetype;
  elementMeta: ElementMeta;
  element: FiveElement;
  dayMasterStem: HeavenlyStem;
  family: Family;
}

export function PersonalitySheet({ archetype, elementMeta, element, dayMasterStem, family }: Props) {
  const elementChinese = elementMeta.chinese;
  const dayMasterChinese = STEM_CHINESE[dayMasterStem];
  const familyChinese = FAMILY_META[family].chinese;
  const familyMetaphor = family === "output" ? OUTPUT_METAPHOR[element] : FAMILY_META[family].metaphor;
  return (
    <article className="rounded-[var(--radius-card)] border-2 border-cinnabar/20 bg-surface p-6 sm:p-10">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-cinnabar">八字人格 IP</p>
        <p className="text-xs font-semibold tracking-[0.2em] text-muted">{elementChinese} · {familyChinese.toUpperCase()}</p>
      </div>
      <div className="mt-6">
        <PersonalityHero archetype={archetype} elementMeta={elementMeta} dayMasterStem={dayMasterChinese} dayMasterElement={element} />
      </div>
      <PersonalityMiddle archetype={archetype} elementMeta={elementMeta} outputMetaphor={OUTPUT_METAPHOR[element]} familyMetaphor={familyMetaphor} familyChinese={familyChinese} />
      <PersonalityFooter archetype={archetype} elementMeta={elementMeta} dayMasterChinese={dayMasterChinese} elementChinese={elementChinese} />
      <p className="mt-8 text-center text-xs text-muted">{dayMasterChinese}{elementChinese}日主 · {familyChinese}型 · {archetype.tagline}</p>
    </article>
  );
}