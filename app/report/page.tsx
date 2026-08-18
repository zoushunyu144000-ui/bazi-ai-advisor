"use client";
import { useEffect, useState } from "react";
import { calculateBazi } from "@/modules/bazi";
import { interpretBaziChart } from "@/modules/interpretation";
import { selectArchetypeCandidate } from "@/modules/interpretation/archetypes";
import type { ArchetypeCandidate, InterpretationResult } from "@/modules/interpretation";
import type { ArchetypePatternFamily } from "@/modules/interpretation/archetypes";
import { computeTraditional } from "@/modules/bazi/traditional";
import type { BaziCalculationResult, BirthProfile } from "@/types/domain";
import { PersonalitySheet } from "@/app/_components/personality-sheet";
import { ELEMENT_META, ARCHETYPES } from "@/lib/personality-archetypes";
import Link from "next/link";

interface Bundle {
  result: BaziCalculationResult;
  interpretation: InterpretationResult;
  archetype: ArchetypeCandidate;
  traditional: ReturnType<typeof computeTraditional>;
}

export default function ReportPage() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      try {
        const raw = window.sessionStorage.getItem("bazi:last");
        if (!raw) { setError("没有找到上次的排盘记录"); return; }
        const { profile } = JSON.parse(raw) as { profile: BirthProfile };
        const result = calculateBazi(profile);
        const interpretation = interpretBaziChart(result.chart, result.derivedFeatures);
        const archetype = selectArchetypeCandidate(result.chart, result.derivedFeatures, interpretation.signals, interpretation.dimensionDetails);
        const monthElement = result.chart.pillars.month.branchElement;
        const traditional = computeTraditional(result.chart, result.chart.pillars.year.stem, result.chart.pillars.year.branch, monthElement);
        setBundle({ result, interpretation, archetype, traditional });
      } catch (err) {
        setError(err instanceof Error ? err.message : "读取失败");
      }
  }, []);

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">人格报告</p>
        <h1 className="display-lg mt-3">需要先排盘</h1>
        <p className="mt-4 leading-relaxed text-soft">{error}。请先在排盘页录入出生信息。</p>
        <Link href="/birth" className="btn-primary mt-8 inline-flex">去排盘 →</Link>
      </main>
    );
  }

  if (!bundle) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-sm text-muted">加载中…</p>
      </main>
    );
  }

  const element = bundle.archetype.archetype_seed.day_master_element;
  const family = bundle.archetype.archetype_seed.dominant_family as ArchetypePatternFamily;
  const archetypeData = ARCHETYPES[`${element}_${family}` as keyof typeof ARCHETYPES];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <header>
        <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">人格报告</p>
        <h1 className="display-lg mt-3">你的人格 IP 设定卡</h1>
        <p className="mt-4 leading-relaxed text-soft">基于上次的排盘结果，自动生成属于你的人格原型。</p>
      </header>
      <div className="mt-10">
        {archetypeData ? (
          <PersonalitySheet
            archetype={archetypeData}
            elementMeta={ELEMENT_META[element]}
            element={element}
            dayMasterStem={bundle.result.chart.dayMaster.stem}
            family={family}
          />
        ) : (
          <p className="text-muted">未找到匹配的原型。</p>
        )}
      </div>
      <div className="mt-10 text-center">
        <Link href="/birth" className="btn-ghost">返回排盘重新生成</Link>
      </div>
    </main>
  );
}