// 人格卡底部：印鉴 + 性格关键词 + 适配领域
import type { Archetype, ElementMeta } from "@/lib/personality-archetypes";

interface FootProps {
  archetype: Archetype;
  elementMeta: ElementMeta;
  dayMasterChinese: string;
  elementChinese: string;
}

export function PersonalityFooter({ archetype, elementMeta, dayMasterChinese, elementChinese }: FootProps) {
  return (
    <footer className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-[auto_1fr_1fr]">
      <Stamp dayMasterChinese={dayMasterChinese} elementChinese={elementChinese} />
      <div>
        <h3 className="text-sm font-semibold tracking-widest text-muted">性格关键词</h3>
        <p className="mt-3 text-sm leading-relaxed text-soft">{archetype.keywords.join("，")}，{archetype.tagline}。</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-widest text-muted">适配领域</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {archetype.fields.map((f) => (
            <span key={f} className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-ink">{f}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Stamp({ dayMasterChinese, elementChinese }: { dayMasterChinese: string; elementChinese: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 place-items-center rounded-lg border-2 border-cinnabar bg-cinnabar-soft">
        <span className="font-display text-5xl font-bold text-cinnabar">{dayMasterChinese}</span>
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-cinnabar">{elementChinese}日主</p>
        <p className="text-xs text-muted">Bazi IP Seal</p>
      </div>
    </div>
  );
}