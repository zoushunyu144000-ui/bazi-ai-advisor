"use client";
import { BRANCH_CHINESE } from "@/modules/bazi/constants";
import type { BaziChart, BaziRelation } from "@/types/domain";
import type { ChartTraditional } from "@/modules/bazi/traditional";
import { ROWS_TOP, type RowDef } from "./ct-rows1";
import { ROWS_BOTTOM, RelationsBlock, StrengthRow } from "./ct-rows2";

const POSITIONS = ["year", "month", "day", "hour"] as const;
const POS_LABEL: Record<typeof POSITIONS[number], string> = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };

interface Props {
  chart: BaziChart;
  traditional: ChartTraditional;
  relations: BaziRelation[];
  jieqiLabel: string;
}

export function ChartTable({ chart, traditional, relations, jieqiLabel }: Props) {
  const cells = POSITIONS.map((pos) => ({ pos, pillar: chart.pillars[pos], trad: traditional.pillars[pos] }));
  const allRows: RowDef[] = [...ROWS_TOP, ...ROWS_BOTTOM];
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:p-6">
      <p className="mb-4 text-xs text-muted">出生节气 · {jieqiLabel}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              <th className="w-16 py-2 text-left text-xs font-semibold text-muted"></th>
              {cells.map(({ pos }) => <th key={pos} className="py-2 text-center text-xs font-semibold text-muted">{POS_LABEL[pos]}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allRows.map((row) => row.label === "空亡" ? (
              <tr key={row.label}>
                <td className="py-2 pr-3 text-left text-xs font-medium text-muted align-top">空亡</td>
                <td colSpan={4} className="py-2 text-center text-xs text-muted">
                  {BRANCH_CHINESE[traditional.voidBranches[0]]} {BRANCH_CHINESE[traditional.voidBranches[1]]}
                </td>
              </tr>
            ) : (
              <tr key={row.label}>
                <td className="py-2 pr-3 text-left text-xs font-medium text-muted align-top">{row.label}</td>
                {cells.map(({ pillar, trad, pos }) => <td key={pos} className="py-2 text-center">{row.render({ pillar, trad })}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RelationsBlock relations={relations} />
      <StrengthRow strength={traditional.seasonalStrength} />
    </section>
  );
}