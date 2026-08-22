"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CharacterSlot } from "@/app/_components/character-slot";
import { BRANCH_CHINESE, STEM_CHINESE } from "@/modules/bazi/constants";
import { TEN_GOD_CHINESE, DAY_MASTER_STRENGTH } from "@/lib/bazi-labels";
import {
  PUBLIC_PERSONALITY_VERSION,
  PUBLIC_PERSONALITY_ORDER,
  PUBLIC_PERSONALITIES,
  getPublicPersonality,
} from "@/lib/public-personalities";
import { loadPublicResult, type PublicResultBundle } from "@/lib/public-result";
import { accentStyle } from "@/lib/personality-accent";
import type { PersonalityDimensionKey } from "@/modules/interpretation";

const DIMENSION_LABELS: Partial<Record<PersonalityDimensionKey, string>> = {
  autonomy: "自己做主",
  structure_need: "秩序需求",
  expression_drive: "表达欲",
  risk_tolerance: "敢不敢赌",
  emotional_sensitivity: "情绪雷达",
  social_adaptation: "社交适配",
  competition_drive: "胜负欲",
  novelty_seeking: "新鲜感需求",
  decision_speed: "拍板速度",
  control_need: "掌控需求",
  planning_orientation: "计划倾向",
  conflict_style: "正面开团",
  external_validation_need: "在意评价",
  energy_variability: "状态波动",
  learning_orientation: "学习驱动",
};

const RESULT_URL = "https://bazi-ai-advisor.vercel.app";

type CardFormat = "feed" | "story";

function loadCardImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("share_card_asset_missing"));
    image.src = src;
  });
}

async function renderShareCard(bundle: PublicResultBundle, format: CardFormat): Promise<Blob> {
  const dominantKey = bundle.archetype.archetype_seed.dominant_ten_god;
  const secondaryKey = bundle.archetype.archetype_seed.secondary_ten_god;
  const dominant = getPublicPersonality(dominantKey);
  const secondary = getPublicPersonality(secondaryKey);
  const width = 1080;
  const height = format === "story" ? 1920 : 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器无法生成分享图片。");

  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#15130f";
  ctx.font = "600 28px 'Noto Sans SC', sans-serif";
  ctx.fillText("BAZI PERSONALITY · 八字版 SBTI", 72, 86);
  ctx.fillStyle = "#a6332b";
  ctx.fillRect(72, 112, 88, 8);
  ctx.fillStyle = "#15130f";
  ctx.font = "500 28px 'Noto Sans SC', sans-serif";
  ctx.fillText("我的八字人格是", 72, 190);
  ctx.font = "700 92px 'Noto Serif SC', serif";
  ctx.fillText(dominant.display_name, 72, 300);
  ctx.fillStyle = "#a6332b";
  ctx.font = "600 32px 'Noto Sans SC', sans-serif";
  ctx.fillText(dominant.traditional_label.split(" · ")[0], 76, 352);

  // Share card draw — character asset is intentionally loaded only if the
  // formal V1 binary exists. Per docs/public/characters/v1/README.md, share
  // card rendering MUST fail visibly when the asset is missing rather than
  // silently substituting a geometric placeholder.
  const asset = await loadCardImage(`/characters/v1/${dominantKey}.webp`);
  const imageTop = format === "story" ? 430 : 390;
  const imageHeight = format === "story" ? 720 : 520;
  const scale = Math.min(620 / asset.width, imageHeight / asset.height);
  const drawWidth = asset.width * scale;
  const drawHeight = asset.height * scale;
  ctx.drawImage(asset, width - 72 - drawWidth, imageTop + imageHeight - drawHeight, drawWidth, drawHeight);

  ctx.fillStyle = "#15130f";
  ctx.font = "700 44px 'Noto Serif SC', serif";
  ctx.fillText(`“${dominant.anchor_quote.replace(/[“”]/g, "")}”`, 72, imageTop + 90);
  ctx.fillStyle = "#57524a";
  ctx.font = "500 28px 'Noto Sans SC', sans-serif";
  drawWrappedText(ctx, dominant.share_card_copy, 72, imageTop + 150, 480, 46, 5);

  const tagTop = imageTop + imageHeight + 70;
  ctx.fillStyle = "#15130f";
  ctx.font = "600 24px 'Noto Sans SC', sans-serif";
  dominant.tags.slice(0, 4).forEach((tag, index) => {
    ctx.fillText(`# ${tag}`, 72 + (index % 2) * 230, tagTop + Math.floor(index / 2) * 46);
  });
  ctx.fillStyle = "#57524a";
  ctx.font = "500 25px 'Noto Sans SC', sans-serif";
  drawWrappedText(ctx, `第二人格：${secondary.display_name} · ${secondary.anchor_quote}`, 72, tagTop + 128, 760, 42, 2);

  const footerTop = height - 154;
  ctx.strokeStyle = "#d8d0c3";
  ctx.beginPath();
  ctx.moveTo(72, footerTop);
  ctx.lineTo(width - 72, footerTop);
  ctx.stroke();
  ctx.fillStyle = "#15130f";
  ctx.font = "600 24px 'Noto Sans SC', sans-serif";
  ctx.fillText("测测你是什么东西", 72, footerTop + 42);
  ctx.fillStyle = "#777066";
  ctx.font = "400 20px sans-serif";
  ctx.fillText(RESULT_URL.replace("https://", ""), 72, footerTop + 76);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("分享图片生成失败。"))),
      "image/png",
      0.94,
    );
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 6,
) {
  let line = "";
  let lineNumber = 0;
  for (const char of Array.from(text)) {
    const next = line + char;
    if (line && ctx.measureText(next).width > maxWidth) {
      ctx.fillText(line, x, y + lineNumber * lineHeight);
      line = char;
      lineNumber += 1;
      if (lineNumber >= maxLines) return;
    } else {
      line = next;
    }
  }
  if (line && lineNumber < maxLines) ctx.fillText(line, x, y + lineNumber * lineHeight);
}

// MIX_BLOCKS removed: the engine only emits two tiers (dominant + secondary).
// A fabricated third "辅助" tier would violate docs/13 §4 + docs/18 §2.

export default function ResultPage() {
  const [bundle, setBundle] = useState<PublicResultBundle | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBundle(loadPublicResult());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const sortedDimensions = useMemo(
    () =>
      bundle
        ? [...bundle.interpretation.dimensionDetails].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
        : [],
    [bundle],
  );

  if (!loaded) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-6 py-20 text-center text-soft">
        <p className="font-display text-lg">正在打开你的人格档案…</p>
      </main>
    );
  }

  if (!bundle) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow text-cinnabar">还没有结果</p>
        <h1 className="mt-4 display-lg text-ink">先去出生页认真算一次。</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-soft">
          结果只保存在当前浏览器 Session，没有登录，也不会伪造一份 Mock 给你看。
        </p>
        <Link href="/birth" className="btn-primary mt-8 inline-flex">去测测我是什么 →</Link>
      </main>
    );
  }

  const dominantKey = bundle.archetype.archetype_seed.dominant_ten_god;
  const secondaryKey = bundle.archetype.archetype_seed.secondary_ten_god;
  const dominant = getPublicPersonality(dominantKey);
  const secondary = getPublicPersonality(secondaryKey);
  const chart = bundle.calculation.chart;
  const pillars = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour] as const;
  const pillarNames = ["年柱", "月柱", "日柱", "时柱"] as const;
  const topDimension = sortedDimensions[0];
  const dominantStyle = accentStyle(dominantKey);
  const secondaryStyle = accentStyle(secondaryKey);

  const modeEntries: Array<readonly [string, string, string]> = [
    ["07", "工作中的你", dominant.work_mode],
    ["08", "学习中的你", dominant.learning_mode],
    ["09", "关系里的你", dominant.relationship_mode],
    ["10", "冲突中的你", dominant.conflict_mode],
    ["11", "压力下的你", dominant.stress_mode],
    ["12", "你的回血方式", dominant.recovery_mode],
    ["13", "你的决策方式", dominant.decision_mode],
    ["14", "你的金钱模式", dominant.money_mode],
  ];

  async function copyResult() {
    const text = `我的八字人格：${dominant.display_name}（${dominant.traditional_label.split(" · ")[0]}）\n${dominant.anchor_quote}\n${dominant.share_card_copy}\n第二人格：${secondary.display_name}\n\n测测你是什么东西：${RESULT_URL}`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("结果已复制，可以直接发给朋友。");
    } catch {
      setShareStatus("当前浏览器不允许自动复制，请长按选择页面文字复制。");
    }
  }

  async function saveCard(format: CardFormat) {
    const currentBundle = bundle;
    if (!currentBundle) {
      setShareStatus("结果已失效，请重新测试。");
      return;
    }
    try {
      setShareStatus("正在生成人格卡…");
      const blob = await renderShareCard(currentBundle, format);
      const file = new File([blob], `bazi-${dominantKey}-${format}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `我的八字人格：${dominant.display_name}`,
          text: dominant.share_card_copy,
          files: [file],
        });
        setShareStatus("分享面板已打开。");
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setShareStatus(format === "story" ? "Story / 小红书版已保存。" : "人格卡已保存。");
    } catch (error) {
      if (error instanceof Error && error.message === "share_card_asset_missing") {
        setShareStatus("正式角色资产尚未到位，分享卡暂不可生成。先去 / 首页看看其他人的样子，或者再测一次。");
      } else {
        setShareStatus(error instanceof Error ? error.message : "生成失败，请稍后再试。");
      }
    }
  }

  return (
    <main className="pb-24">
      {/* HERO — RESULT IS THE BRAND PERSONALITY EXPERIENCE CORE */}
      <section className="relative overflow-hidden" style={dominantStyle}>
        <div aria-hidden className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-[var(--p-soft,oklch(0.94_0.04_60))] blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--p-hairline,var(--color-line))]" />
        <div className="mx-auto grid max-w-6xl gap-7 px-5 pb-12 pt-10 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:items-end md:pb-16 md:pt-16">
          <div className="reveal">
            <p className="eyebrow text-[var(--p-ink,var(--color-ink-deep))]">01 · 你到底是什么东西</p>
            <p className="mt-7 text-base text-soft">你的八字人格是</p>
            <h1 className="mt-2 display-xl text-ink-deep">{dominant.display_name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="accent-chip">{dominant.traditional_label.split(" · ")[0]}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-3 py-1.5 text-sm font-semibold text-soft">
                第二人格 · {secondary.display_name}
              </span>
            </div>
            <p className="mt-7 max-w-xl font-display text-2xl font-semibold leading-tight text-ink-deep sm:text-[1.75rem]">
              「{dominant.anchor_quote.replace(/[“”]/g, "")}」
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-soft">{dominant.one_line_roast}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {dominant.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--p-hairline,var(--color-line))] bg-paper px-3 py-1.5 text-[13px] font-semibold tracking-wide text-ink-deep">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="reveal min-h-[22rem] sm:min-h-[26rem]">
            <CharacterSlot tenGod={dominantKey} className="h-full w-full" />
          </div>
        </div>
        {/* Mix summary bar — ONLY the two tiers the engine actually emits.
            A third "辅助" tier must NOT be fabricated here: per
            docs/18 §2 engineering ranking may not enter the authoritative
            path, and per docs/13 §4 every tier needs traditional-rule
            evidence. Until TraditionalPatternResult lands, two tiers only. */}
        <div className="border-y border-line bg-paper/60 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-4 text-sm sm:px-8">
            {[
              { label: "主导", key: dominantKey, accent: dominantStyle },
              { label: "明显副倾向", key: secondaryKey, accent: secondaryStyle },
            ].map(({ label, key, accent }) => {
              const personality = PUBLIC_PERSONALITIES[key];
              return (
                <div key={label} className="flex items-center gap-3" style={accent}>
                  <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[var(--p-ink,var(--color-muted))]">
                    {label}
                  </span>
                  <span className="font-display text-lg font-bold leading-tight text-[var(--p-ink,var(--color-ink-deep))]">
                    {personality.display_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Quote anchor — large editorial pull-quote */}
        <section className="reveal py-14">
          <p className="eyebrow text-cinnabar">02 · anchor quote</p>
          <p className="mt-5 max-w-3xl font-display text-[1.7rem] font-semibold leading-[1.2] text-ink-deep sm:text-[2.4rem]">
            「{dominant.anchor_quote.replace(/[“”]/g, "")}」
          </p>
          <p className="mt-4 text-base leading-7 text-soft">{dominant.short_description}</p>
        </section>

        {/* Friend view + Secondary personality — asymmetric double */}
        <section className="grid gap-5 py-10 md:grid-cols-[1.4fr_1fr]">
          <article className="rounded-[1.5rem] border border-line bg-paper p-7">
            <p className="eyebrow text-cinnabar">03 · 朋友眼里的你</p>
            <p className="mt-5 font-display text-xl font-semibold leading-snug text-ink-deep">
              {dominant.friend_view}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.18em] text-muted">
              <span className="h-px w-8 bg-muted/40" />
              来自熟人记忆
            </div>
          </article>
          <article
            className="relative overflow-hidden rounded-[1.5rem] p-7 text-ink-deep"
            style={secondaryStyle}
          >
            <p className="eyebrow text-[var(--p-ink,var(--color-cinnabar))]">04 · 你的副倾向</p>
            <p className="mt-4 display-md">{secondary.display_name}</p>
            <p className="mt-2 font-display text-base font-semibold leading-snug">
              「{secondary.anchor_quote.replace(/[“”]/g, "")}」
            </p>
            <p className="mt-3 text-sm leading-6 text-soft">你不是只有一层。<br />{secondary.secondary_personality_copy}</p>
            <div className="mt-5 h-24 overflow-hidden rounded-2xl">
              <CharacterSlot tenGod={secondaryKey} variant="compact" showMeta={false} />
            </div>
          </article>
        </section>

        {/* A 面 / 翻车面 — strong color contrast pair */}
        <section className="grid gap-5 py-10 md:grid-cols-2">
          <article className="dark-block rounded-[1.5rem] p-7">
            <p className="eyebrow text-paper/55">05 · 你的 A 面</p>
            <p className="mt-5 font-display text-xl font-semibold leading-snug text-paper">
              {dominant.positive_mode}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.18em] text-paper/55">
              <span className="h-px w-8 bg-paper/40" />
              {dominant.traditional_label.split(" · ")[0]} · 能量加载
            </div>
          </article>
          <article
            className="rounded-[1.5rem] border border-[var(--p-hairline,var(--color-cinnabar)/0.2)] p-7"
            style={dominantStyle}
          >
            <p className="eyebrow text-[var(--p-ink,var(--color-cinnabar))]">06 · 你的翻车面</p>
            <p className="mt-5 font-display text-xl font-semibold leading-snug text-[var(--p-ink,var(--color-ink-deep))]">
              {dominant.flip_mode}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.18em] text-[var(--p-ink,var(--color-ink-deep))] opacity-70">
              <span className="h-px w-8 bg-current" />
              强项开过头的下场
            </div>
          </article>
        </section>

        {/* Personality Dimensions — magazine-style chart block */}
        <section className="border-y border-line py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-cinnabar">07 · personality dimensions</p>
              <h2 className="mt-3 display-md">标签是名字，分数才是你的细节。</h2>
            </div>
            <span className="font-mono text-xs text-muted">
              mapping · {bundle.interpretation.mapping_version}
            </span>
          </div>
          <div className="mt-9 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {sortedDimensions.slice(0, 8).map((dimension) => (
              <div key={dimension.key}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-ink-deep">{DIMENSION_LABELS[dimension.key] ?? dimension.label}</span>
                  <span className="font-mono text-base font-bold tabular-nums text-ink-deep">{dimension.score}</span>
                </div>
                <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-dust">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-line-strong/70" aria-hidden />
                  <div
                    className="absolute top-0 h-full rounded-full bg-cinnabar"
                    style={{
                      width: `${dimension.score}%`,
                      left: dimension.score >= 50 ? "50%" : `${dimension.score}%`,
                      transform: dimension.score >= 50 ? "none" : "translateX(0)",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {dimension.score >= 50 ? dimension.positiveExpression : dimension.stressExpression}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mode cards — magazine-style asymmetric tile */}
        <section className="py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-cinnabar">08–15 · 你在真实生活里怎么运转</p>
              <h2 className="mt-3 display-md">不是所有人都用同一套剧本活着。</h2>
            </div>
            <span className="text-xs text-muted">每张卡只说一件事 · 滑动看全部</span>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {modeEntries.map(([id, title, body], index) => {
              const accentRow = index % 2 === 0 ? dominantStyle : secondaryStyle;
              return (
                <article
                  key={id + title}
                  className="relative rounded-[1.25rem] border border-line bg-paper p-5 pl-7"
                  style={accentRow}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full"
                    style={{ background: "var(--p-ink, var(--color-cinnabar))" }}
                  />
                  <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--p-ink,var(--color-cinnabar))]">
                    {id}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink-deep">{title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-soft">{body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Card-stuck / Growth advice — twin essays */}
        <section className="grid gap-6 border-y border-line py-14 md:grid-cols-2">
          <article>
            <p className="eyebrow text-cinnabar">16 · 你最容易卡在哪里</p>
            <h2 className="mt-3 display-md">优势开太久，也会变成 bug。</h2>
            <p className="mt-4 leading-8 text-soft">
              {dominant.flip_mode}
              {topDimension ? ` 你当前最突出的压力维度之一是「${DIMENSION_LABELS[topDimension.key] ?? topDimension.label}」：${topDimension.stressExpression}` : ""}
            </p>
          </article>
          <article>
            <p className="eyebrow text-cinnabar">17 · 成长建议</p>
            <h2 className="mt-3 display-md">不是把你改成另一种人。</h2>
            <p className="mt-4 leading-8 text-soft">{dominant.growth_advice}</p>
          </article>
        </section>

        {/* Why this result — evidence preview */}
        <section className="py-14">
          <p className="eyebrow text-cinnabar">18 · 为什么会得到这个结果</p>
          <h2 className="mt-3 max-w-3xl display-md">
            不是因为生日碰巧抽中了“{dominant.display_name}”。
          </h2>
          <p className="mt-5 max-w-3xl leading-8 text-soft">
            V1 由确定性八字引擎得到 canonical 十神分布与日主信息，再由 Interpretation 计算 15 项行为维度，最后由 selectArchetypeCandidate 对十种 Ten-God candidate 排序。你当前的第一候选是 {TEN_GOD_CHINESE[dominantKey]}，第二候选是 {TEN_GOD_CHINESE[secondaryKey]}。
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["主人格十神分", bundle.archetype.dominant_pattern.canonical_ten_god_score],
              ["主人格候选分", bundle.archetype.dominant_pattern.candidate_score],
              ["第二人格十神分", bundle.archetype.secondary_pattern.canonical_ten_god_score],
              ["映射支持度", `${Math.round(bundle.archetype.confidence * 100)}%`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 font-display text-3xl font-bold tabular-nums text-ink-deep">{String(value)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">
            “映射支持度”只表示当前规则 Profile 对这个分类的支持程度，不是科学心理诊断置信度，也不是人生成功率。
          </p>
        </section>

        {/* Professional chart evidence — foldable */}
        <details className="reveal rounded-[1.5rem] border border-line bg-paper p-5 sm:p-6">
          <summary className="flex cursor-pointer items-center gap-3 text-base font-bold text-ink-deep">
            <span className="font-mono text-[11px] tracking-[0.3em] text-cinnabar">19</span>
            <span>想看专业八字依据</span>
            <span className="ml-auto text-xs text-muted">展开</span>
          </summary>
          <div className="mt-6 space-y-6 text-sm leading-7 text-soft">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pillars.map((pillar, index) => (
                <div key={pillarNames[index]} className="rounded-2xl bg-canvas p-4">
                  <p className="text-xs text-muted">{pillarNames[index]}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-ink-deep">
                    {pillar ? `${STEM_CHINESE[pillar.stem]}${BRANCH_CHINESE[pillar.branch]}` : "未知"}
                  </p>
                </div>
              ))}
            </div>
            <p>
              日主：{STEM_CHINESE[chart.dayMaster.stem]} · {chart.dayMaster.element}；日主强弱：
              {DAY_MASTER_STRENGTH[bundle.calculation.derivedFeatures.dayMasterStrength]?.label ?? "待定"}。出生地标准化：
              {bundle.profile.birthPlace?.label ?? "—"}；时区：{bundle.profile.timezone}。
            </p>
            <p>
              引擎版本：{bundle.calculation.derivedFeatures.engine_version} · Interpretation：
              {bundle.interpretation.mapping_version} · Public Registry：{PUBLIC_PERSONALITY_VERSION}。
            </p>
            <p>
              <strong className="text-ink-deep">工程边界：</strong>当前完整 TraditionalPatternResult 尚未进入 Production，所以 bi_jian → 犟种（建禄代理）、jie_cai → 撒币（月劫代理）只属于 Presentation Proxy Mapping。这里没有伪造正式建禄/月劫格局判定。
            </p>
            {bundle.normalization.warnings.length > 0 && (
              <div>
                <p className="font-semibold text-ink-deep">出生信息不确定性</p>
                <ul className="mt-2 list-disc pl-5">
                  {bundle.normalization.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>

        {/* Personality carousel — preview the other 9 neighbors */}
        <section className="py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-cinnabar">personality neighbors</p>
              <h2 className="mt-3 display-md">其他 9 种怪人长什么样。</h2>
            </div>
            <span className="text-xs text-muted">横向滑动 · 每个都有一张正式 IP 预留位</span>
          </div>
          <div className="no-scrollbar mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
            {PUBLIC_PERSONALITY_ORDER.filter((key) => key !== dominantKey).map((key) => {
              const item = PUBLIC_PERSONALITIES[key];
              const itemStyle = accentStyle(key);
              return (
                <article
                  key={key}
                  className="flex w-[60%] shrink-0 snap-start flex-col gap-3"
                  style={itemStyle}
                >
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
                    <CharacterSlot tenGod={key} variant="full" showMeta={false} />
                  </div>
                  <p className="px-1 font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--p-ink,var(--color-ink-deep))]">
                    {TEN_GOD_CHINESE[key]} · {PUBLIC_PERSONALITY_ORDER.indexOf(key) + 1} / 10
                  </p>
                  <h3 className="px-1 font-display text-xl font-bold leading-tight text-[var(--p-ink,var(--color-ink-deep))]">
                    {item.display_name}
                  </h3>
                  <p className="px-1 text-sm leading-6 text-soft">「{item.anchor_quote.replace(/[“”]/g, "")}」</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Share card preview — dark editorial block */}
        <section className="py-14">
          <p className="eyebrow text-cinnabar">share card preview</p>
          <div className="mt-5 dark-block overflow-hidden rounded-[1.8rem] p-7 sm:p-10" style={dominantStyle}>
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr] md:items-end">
              <div>
                <p className="text-sm text-paper/55">我的八字人格</p>
                <h2 className="mt-2 display-lg text-paper">{dominant.display_name}</h2>
                <p className="mt-3 font-display text-xl">「{dominant.anchor_quote.replace(/[“”]/g, "")}」</p>
                <p className="mt-5 max-w-md text-sm leading-7 text-paper/70">{dominant.share_card_copy}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {dominant.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full border border-paper/20 px-3 py-1.5 text-xs text-paper/80">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <CharacterSlot tenGod={dominantKey} variant="full" showMeta={false} />
              </div>
            </div>
            <div className="mt-8 border-t border-paper/15 pt-4 text-xs text-paper/45">
              测测你是什么东西 · {RESULT_URL.replace("https://", "")}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn-accent" onClick={() => saveCard("feed")}>
              生成 / 保存人格卡
            </button>
            <button type="button" className="btn-ghost" onClick={() => saveCard("story")}>
              Story / 小红书版
            </button>
            <button type="button" className="btn-ghost" onClick={copyResult}>
              复制结果
            </button>
          </div>
          {shareStatus && (
            <p className="mt-3 text-sm text-soft" aria-live="polite">
              {shareStatus}
            </p>
          )}
        </section>

        {/* Other-character back-link CTA */}
        <section className="rounded-[1.6rem] border border-line bg-paper p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
          <div>
            <p className="eyebrow text-cinnabar">深度报告 · 即将开放</p>
            <h2 className="mt-3 display-md">免费结果先给完整。</h2>
            <p className="mt-3 max-w-2xl leading-7 text-soft">
              {dominant.paid_report_teaser} 正式支付系统尚未接入，今晚不会伪造付款成功。
            </p>
          </div>
          <div className="mt-5 flex shrink-0 flex-col gap-2 sm:mt-0 sm:items-end">
            <Link href="/birth" className="btn-ghost">再测一个人</Link>
            <Link href="/" className="text-xs tracking-[0.16em] text-muted underline-offset-4 hover:text-ink-deep hover:underline">
              回首页看其他怪人 ↗
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
