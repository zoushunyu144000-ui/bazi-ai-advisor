// chart-table rows part 1: 类型 + helpers + 5 上行（十神/天干/地支/藏干/支神）
import { BRANCH_CHINESE, STEM_CHINESE, STEM_ELEMENT } from "@/modules/bazi/constants";
import { TEN_GOD_CHINESE, ELEMENT_COLOR } from "@/lib/bazi-labels";
import type { BaziPillar, FiveElement, TenGod } from "@/types/domain";
import type { PillarTraditional } from "@/modules/bazi/traditional";

export type RowCell = { pillar: BaziPillar | null; trad: PillarTraditional };
export interface RowDef { label: string; render: (c: RowCell) => React.ReactNode; fullRow?: boolean; fullRowRender?: () => React.ReactNode }

export const elColor = (el: FiveElement) => ELEMENT_COLOR[el];

export const ROWS_TOP: RowDef[] = [
  { label: "十神", render: (c) => c.pillar?.tenGod ? <span style={{ color: elColor(c.pillar.stemElement) }}>{TEN_GOD_CHINESE[c.pillar.tenGod]}</span> : <span className="text-muted">—</span> },
  { label: "天干", render: (c) => c.pillar ? <span className="font-display text-2xl font-bold" style={{ color: elColor(c.pillar.stemElement) }}>{STEM_CHINESE[c.pillar.stem]}</span> : <span className="text-muted">—</span> },
  { label: "地支", render: (c) => c.pillar ? <span className="font-display text-2xl font-bold" style={{ color: elColor(c.pillar.branchElement) }}>{BRANCH_CHINESE[c.pillar.branch]}</span> : <span className="text-muted">—</span> },
  { label: "藏干", render: (c) => c.pillar ? <div className="flex flex-col gap-0.5 text-xs">{c.pillar.hiddenStems.map((h, i) => <span key={i} style={{ color: elColor(STEM_ELEMENT[h.stem]) }}>{STEM_CHINESE[h.stem]}</span>)}</div> : <span className="text-muted">—</span> },
  { label: "支神", render: (c) => c.pillar ? <div className="flex flex-col gap-0.5 text-xs">{c.pillar.hiddenStems.map((h, i) => h.tenGod && <span key={i} style={{ color: elColor(STEM_ELEMENT[h.stem]) }}>{TEN_GOD_CHINESE[h.tenGod as TenGod]}</span>)}</div> : <span className="text-muted">—</span> },
];