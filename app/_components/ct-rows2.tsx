// chart-table rows part 2: 5 下行（纳音/空亡/地势/自坐/神煞）+ relations + strength
import { BRANCH_CHINESE, STEM_CHINESE } from "@/modules/bazi/constants";
import { ELEMENT_COLOR } from "@/lib/bazi-labels";
import type { BaziRelation, EarthlyBranch, FiveElement } from "@/types/domain";
import type { ChartTraditional, StrengthLabel } from "@/modules/bazi/traditional";
import { elColor, type RowDef } from "./ct-rows1";

export const ROWS_BOTTOM: RowDef[] = [
  { label: "纳音", render: (c) => <span className="text-xs">{c.trad.nayin}</span> },
  { label: "空亡", render: () => <span className="text-xs text-muted">—</span>, fullRow: true, fullRowRender: function VoidRender(this: { voidBranches: [EarthlyBranch, EarthlyBranch] }) {
    // placeholder; real render receives context via closure in caller
    return null as never;
  } as unknown as () => React.ReactNode },
  { label: "地势", render: (c) => <span className="text-xs">{c.trad.diShi}</span> },
  { label: "自坐", render: (c) => <span className="text-xs">{c.trad.ziZuo}</span> },
  { label: "神煞", render: (c) => c.trad.stars.length ? <div className="flex flex-wrap justify-center gap-1">{c.trad.stars.map((s) => <span key={s} className="rounded bg-cinnabar-soft px-1.5 py-0.5 text-[10px] font-medium text-cinnabar">{s}</span>)}</div> : <span className="text-xs text-muted">—</span> },
];

export function RelationsBlock({ relations }: { relations: BaziRelation[] }) {
  const tianGan = relations.filter((r) => r.kind === "stem_combination");
  const diZhi = relations.filter((r) => r.kind !== "stem_combination");
  const fmtTG = (r: BaziRelation) => r.kind === "stem_combination" ? `${STEM_CHINESE[r.left as keyof typeof STEM_CHINESE]}${STEM_CHINESE[r.right as keyof typeof STEM_CHINESE]}合` : "";
  const fmtDZ = (r: BaziRelation) => `${BRANCH_CHINESE[r.left as keyof typeof BRANCH_CHINESE]}${BRANCH_CHINESE[r.right as keyof typeof BRANCH_CHINESE]}${r.kind === "branch_combination" ? "合" : r.kind === "branch_clash" ? "冲" : "害"}`;
  return (
    <div className="mt-5 grid gap-2 border-t border-line pt-4 text-xs sm:grid-cols-2">
      <div><span className="font-semibold text-soft">天干：</span>{tianGan.length ? tianGan.map(fmtTG).join("、") : "—"}</div>
      <div><span className="font-semibold text-soft">地支：</span>{diZhi.length ? diZhi.map(fmtDZ).join("、") : "—"}</div>
    </div>
  );
}

export function StrengthRow({ strength }: { strength: Record<FiveElement, StrengthLabel> }) {
  const order: [FiveElement, string][] = [["wood","木"],["fire","火"],["earth","土"],["metal","金"],["water","水"]];
  return (
    <div className="mt-4 flex items-center justify-around rounded-lg border border-line bg-paper py-3 text-center">
      {order.map(([el, ch]) => (
        <div key={el}>
          <div className="font-display text-lg font-bold" style={{ color: elColor(el) }}>{ch}</div>
          <div className="text-xs font-medium" style={{ color: elColor(el) }}>{strength[el]}</div>
        </div>
      ))}
    </div>
  );
}