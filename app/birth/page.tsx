"use client";
import { useMemo, useState } from "react";
import { calculateBazi } from "@/modules/bazi";
import {
  BRANCH_CHINESE,
  BRANCH_ELEMENT,
  ELEMENTS,
  STEM_CHINESE,
  STEM_ELEMENT,
} from "@/modules/bazi/constants";
import type { BaziCalculationResult, BaziPillar, BirthProfile, FiveElement, HeavenlyStem, TenGod } from "@/types/domain";
import { interpretBaziChart } from "@/modules/interpretation";
import { selectArchetypeCandidate } from "@/modules/interpretation/archetypes";
import type { ArchetypeCandidate, InterpretationResult } from "@/modules/interpretation";
import type { ArchetypePatternFamily } from "@/modules/interpretation/archetypes";
import { computeTraditional, currentDaYunPillar, yearPillarOf, nayinOf } from "@/modules/bazi/traditional";
import { TEN_GOD_CHINESE, ELEMENT_COLOR, DAY_MASTER_STRENGTH } from "@/lib/bazi-labels";
import { ChartTable } from "@/app/_components/chart-table";
import { PersonalitySheet } from "@/app/_components/personality-sheet";
import { ELEMENT_META, FAMILY_META, ARCHETYPES } from "@/lib/personality-archetypes";

const TIMEZONES = [
  { value: "Asia/Shanghai", label: "中国 · 北京 (UTC+8)" },
  { value: "Asia/Taipei", label: "中国台湾 · 台北 (UTC+8)" },
  { value: "Asia/Hong_Kong", label: "中国香港 (UTC+8)" },
  { value: "Asia/Macau", label: "中国澳门 (UTC+8)" },
  { value: "Asia/Singapore", label: "新加坡 (UTC+8)" },
  { value: "Asia/Tokyo", label: "日本 · 东京 (UTC+9)" },
  { value: "Asia/Seoul", label: "韩国 · 首尔 (UTC+9)" },
  { value: "America/Los_Angeles", label: "美国 · 洛杉矶 (UTC-8)" },
  { value: "America/New_York", label: "美国 · 纽约 (UTC-5)" },
  { value: "Europe/London", label: "英国 · 伦敦 (UTC+0)" },
  { value: "Europe/Paris", label: "法国 · 巴黎 (UTC+1)" },
  { value: "Australia/Sydney", label: "澳大利亚 · 悉尼 (UTC+10)" },
  { value: "UTC", label: "UTC 协调世界时" },
];

function familyToOurFamily(f: ArchetypePatternFamily): "peer" | "output" | "wealth" | "authority" | "resource" {
  return f;
}

function jieqiLabel(profile: BirthProfile, chart: BaziCalculationResult["chart"]): string {
  // Simplified: use month branch + bazi year context
  return `${BRANCH_CHINESE[chart.pillars.month.branch]}月 · 节气排盘`;
}

export default function BirthPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [timeKnown, setTimeKnown] = useState(true);
  const [birthTime, setBirthTime] = useState("12:00");
  const [approx, setApprox] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [sex, setSex] = useState<"male" | "female" | "unspecified">("male");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    result: BaziCalculationResult;
    interpretation: InterpretationResult;
    archetype: ArchetypeCandidate;
    traditional: ReturnType<typeof computeTraditional>;
    profile: BirthProfile;
  } | null>(null);

  const canSubmit = useMemo(() => birthDate.trim().length > 0, [birthDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    try {
      const profile: BirthProfile = {
        id: crypto.randomUUID(),
        label: name.trim() || "我的命盘",
        calendar: "gregorian",
        birthDate,
        birthTime: timeKnown ? birthTime : null,
        birthTimePrecision: !timeKnown ? "unknown" : approx ? "approximate" : "exact",
        timezone,
        sexForTraditionalRules: sex,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = calculateBazi(profile);
      const interpretation = interpretBaziChart(result.chart, result.derivedFeatures);
      const archetype = selectArchetypeCandidate(result.chart, result.derivedFeatures, interpretation.signals, interpretation.dimensionDetails);
      const monthElement = result.chart.pillars.month.branchElement;
      const traditional = computeTraditional(result.chart, result.chart.pillars.year.stem, result.chart.pillars.year.branch, monthElement);
      const bundle = { result, interpretation, archetype, traditional, profile };
      setData(bundle);
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("bazi:last", JSON.stringify({ profile }));
        } catch {}
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(err instanceof Error ? `排盘失败：${err.message}` : "排盘失败，请检查输入后重试。");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">免费排盘</p>
        <h1 className="display-lg mt-3">录入出生信息</h1>
        <p className="mt-4 leading-relaxed text-soft">填写阳历生日与出生时间（时间未知也可排年、月、日三柱）。信息仅在本机浏览器内计算，不会上传。</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form onSubmit={handleSubmit} className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
          <div className="space-y-5">
            <div>
              <label className="field-label" htmlFor="name">称呼（可选）</label>
              <input id="name" className="input-base" placeholder="例如：小明" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="birthDate">出生日期（阳历）</label>
              <input id="birthDate" type="date" className="input-base" value={birthDate} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            <fieldset>
              <legend className="field-label">出生时间</legend>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTimeKnown(true)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${timeKnown ? "border-cinnabar bg-cinnabar-soft text-cinnabar" : "border-line-strong text-soft"}`}>知道</button>
                <button type="button" onClick={() => setTimeKnown(false)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${!timeKnown ? "border-cinnabar bg-cinnabar-soft text-cinnabar" : "border-line-strong text-soft"}`}>不知道</button>
              </div>
              {timeKnown && (
                <div className="mt-3 space-y-3">
                  <input type="time" className="input-base" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
                  <label className="flex items-center gap-2 text-sm text-soft">
                    <input type="checkbox" checked={approx} onChange={(e) => setApprox(e.target.checked)} className="h-4 w-4 accent-[var(--color-cinnabar)]" />
                    时间大概记得，非精确
                  </label>
                </div>
              )}
            </fieldset>
            <div>
              <label className="field-label" htmlFor="timezone">出生时区</label>
              <select id="timezone" className="input-base" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="sex">性别（用于推算大运顺逆）</label>
              <select id="sex" className="input-base" value={sex} onChange={(e) => setSex(e.target.value as "male" | "female" | "unspecified")}>
                <option value="male">男</option><option value="female">女</option><option value="unspecified">不愿透露</option>
              </select>
            </div>
            {error && <p className="rounded-lg bg-cinnabar-soft px-3 py-2 text-sm text-cinnabar">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={!canSubmit} style={!canSubmit ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>生成我的命盘</button>
          </div>
        </form>
        <section>
          {data ? <BaziFullResult data={data} /> : (
            <div className="grid h-full min-h-[20rem] place-items-center rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface/50 p-10 text-center">
              <div><div className="font-display text-5xl text-line-strong">命</div><p className="mt-4 text-sm text-muted">填写左侧信息并提交，命盘将在此呈现。</p></div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function BaziFullResult({ data }: { data: { result: BaziCalculationResult; interpretation: InterpretationResult; archetype: ArchetypeCandidate; traditional: ReturnType<typeof computeTraditional>; profile: BirthProfile } }) {
  const { result, interpretation, archetype, traditional, profile } = data;
  const dmStrength = DAY_MASTER_STRENGTH[interpretation.signals.dayMasterStrength];
  const element = archetype.archetype_seed.day_master_element;
  const family = familyToOurFamily(archetype.archetype_seed.dominant_family);
  const archetypeData = ARCHETYPES[`${element}_${family}` as keyof typeof ARCHETYPES];
  const elementMeta = ELEMENT_META[element];
  const cycles = result.luck.cycles.map((c) => ({ startAgeYears: c.startAgeYears, endAgeYears: c.endAgeYears, pillar: c.pillar }));
  const currentYun = currentDaYunPillar(Date.parse(profile.birthDate + "T" + (profile.birthTime ?? "12:00") + ":00"), cycles);
  const yearP = yearPillarOf(new Date().getFullYear());
  const jieqi = jieqiLabel(profile, result.chart);

  return (
    <div key={result.chart.id} className="reveal space-y-8">
      {/* Day master hero */}
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cinnabar">日主 · 命盘核心</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-6xl font-bold" style={{ color: ELEMENT_COLOR[result.chart.dayMaster.element] }}>{STEM_CHINESE[result.chart.dayMaster.stem]}</span>
              <span className="text-lg text-soft">{ELEMENT_META[result.chart.dayMaster.element].chinese} · {result.chart.dayMaster.polarity === "yang" ? "阳" : "阴"}</span>
            </div>
          </div>
          <div className="rounded-full border border-jade/40 bg-jade-soft px-4 py-2 text-center">
            <p className="text-xs text-jade">日主强弱</p><p className="font-display text-xl font-bold text-jade">{dmStrength.label}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{dmStrength.hint}</p>
      </div>

      <ChartTable chart={result.chart} traditional={traditional} relations={result.relations} jieqiLabel={jieqi} />

      {/* Current 大运 / 流年 */}
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h3 className="text-sm font-semibold tracking-widest text-muted">当前运势</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-4 text-center">
            <p className="text-xs text-muted">所行大运</p>
            <p className="mt-2 font-display text-3xl font-bold">{currentYun ? `${STEM_CHINESE[currentYun.pillar.stem]}${BRANCH_CHINESE[currentYun.pillar.branch]}` : "—"}</p>
            <p className="mt-1 text-xs text-muted">{currentYun ? `${currentYun.startAge}–${currentYun.endAge} 岁 · ${result.luck.direction === "forward" ? "顺行" : result.luck.direction === "reverse" ? "逆行" : "未知"}` : "—"}</p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-4 text-center">
            <p className="text-xs text-muted">流年 · {new Date().getFullYear()}</p>
            <p className="mt-2 font-display text-3xl font-bold">{STEM_CHINESE[yearP.stem]}{BRANCH_CHINESE[yearP.branch]}</p>
            <p className="mt-1 text-xs text-muted">{nayinOf(yearP.stem, yearP.branch)}</p>
          </div>
        </div>
      </div>

      {archetypeData && (
        <PersonalitySheet
          archetype={archetypeData}
          elementMeta={elementMeta}
          element={element}
          dayMasterStem={result.chart.dayMaster.stem}
          family={family}
        />
      )}

      <p className="text-xs text-muted">引擎 {result.derivedFeatures.engine_version} · 解释 {interpretation.mapping_version} · 原型 {archetype.mapping_version}</p>
    </div>
  );
}