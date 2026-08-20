"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CharacterArt } from "@/app/_components/character-art";
import { BRANCH_CHINESE, STEM_CHINESE } from "@/modules/bazi/constants";
import { TEN_GOD_CHINESE } from "@/lib/bazi-labels";
import { loadPublicResult, type PublicResultBundle } from "@/lib/public-result";
import {
  PUBLIC_PERSONALITY_VERSION,
  characterAssetPath,
  getPublicPersonality,
} from "@/lib/public-personalities";
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

function loadCardImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("正式角色资产尚未加载完成。"));
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

  const character = await loadCardImage(characterAssetPath(dominantKey, bundle.characterGender));
  const imageTop = format === "story" ? 430 : 390;
  const imageHeight = format === "story" ? 720 : 520;
  const scale = Math.min(620 / character.width, imageHeight / character.height);
  const drawWidth = character.width * scale;
  const drawHeight = character.height * scale;
  ctx.drawImage(character, width - 72 - drawWidth, imageTop + imageHeight - drawHeight, drawWidth, drawHeight);

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
    () => bundle
      ? [...bundle.interpretation.dimensionDetails].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
      : [],
    [bundle],
  );

  if (!loaded) {
    return <main className="mx-auto max-w-4xl px-5 py-20 text-center text-soft">正在打开你的人格档案…</main>;
  }

  if (!bundle) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-sm font-semibold text-cinnabar">还没有结果</p>
        <h1 className="mt-3 font-display text-4xl font-bold">先去出生页认真算一次。</h1>
        <p className="mt-4 leading-7 text-soft">结果只保存在当前浏览器 Session，没有登录也不会伪造一份 Mock 给你看。</p>
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
  const modeCards = [
    ["07 · 工作中的你", dominant.work_mode],
    ["08 · 学习中的你", dominant.learning_mode],
    ["09 · 关系里的你", dominant.relationship_mode],
    ["10 · 冲突中的你", dominant.conflict_mode],
    ["11 · 压力大的你", dominant.stress_mode],
    ["12 · 你的回血方式", dominant.recovery_mode],
    ["13 · 你的决策方式", dominant.decision_mode],
    ["14 · 你的金钱模式", dominant.money_mode],
  ] as const;

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
    try {
      setShareStatus("正在生成人格卡…");
      const blob = await renderShareCard(bundle, format);
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
      setShareStatus(error instanceof Error ? error.message : "生成失败，请稍后再试。");
    }
  }

  return (
    <main className="pb-24">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 md:grid-cols-[1.08fr_.92fr] md:items-end md:py-16">
          <div>
            <p className="text-xs font-bold tracking-[.24em] text-cinnabar">01 · 你到底是什么东西</p>
            <p className="mt-6 text-sm text-soft">你的八字人格是</p>
            <h1 className="mt-2 font-display text-6xl font-bold tracking-[-.04em] sm:text-7xl">{dominant.display_name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cinnabar-soft px-3 py-1.5 text-sm font-semibold text-cinnabar">{dominant.traditional_label}</span>
              <span className="rounded-full border border-line px-3 py-1.5 text-sm">第二人格 · {secondary.display_name}</span>
            </div>
            <p className="mt-7 font-display text-3xl font-bold">“{dominant.anchor_quote.replace(/[“”]/g, "")}”</p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-soft">{dominant.one_line_roast}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {dominant.tags.map((tag) => <span key={tag} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">{tag}</span>)}
            </div>
          </div>
          <div className="flex min-h-[24rem] items-end justify-center overflow-hidden rounded-[2rem] bg-cinnabar-soft/55">
            <CharacterArt tenGod={dominantKey} gender={bundle.characterGender} className="max-h-[34rem] w-full object-contain object-bottom" priority />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <section className="grid gap-4 py-12 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-line bg-surface p-6">
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">02 · 朋友眼里的你</p>
            <p className="mt-4 text-lg leading-8">{dominant.friend_view}</p>
          </article>
          <article className="rounded-[1.5rem] border border-line bg-surface p-6">
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">05 · 你的第二人格</p>
            <h2 className="mt-4 font-display text-3xl font-bold">{secondary.display_name}</h2>
            <p className="mt-2 font-semibold">“{secondary.anchor_quote.replace(/[“”]/g, "")}”</p>
            <p className="mt-4 leading-7 text-soft">你不是只有一层。{secondary.secondary_personality_copy}</p>
          </article>
        </section>

        <section className="grid gap-4 pb-12 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-line bg-ink p-6 text-paper">
            <p className="text-xs font-bold tracking-[.2em] text-paper/55">03 · 你的 A 面</p>
            <p className="mt-4 text-lg leading-8">{dominant.positive_mode}</p>
          </article>
          <article className="rounded-[1.5rem] border border-cinnabar/20 bg-cinnabar-soft p-6">
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">04 · 你的翻车面</p>
            <p className="mt-4 text-lg leading-8">{dominant.flip_mode}</p>
          </article>
        </section>

        <section className="border-y border-line py-12">
          <p className="text-xs font-bold tracking-[.2em] text-cinnabar">06 · Personality Dimensions</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl font-bold">标签是名字，分数才是你的细节。</h2>
            <span className="text-xs text-muted">来自 {bundle.interpretation.mapping_version}</span>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {sortedDimensions.map((dimension) => (
              <div key={dimension.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{DIMENSION_LABELS[dimension.key] ?? dimension.label}</span>
                  <span className="font-bold tabular-nums">{dimension.score}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-cinnabar" style={{ width: `${dimension.score}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{dimension.score >= 50 ? dimension.positiveExpression : dimension.stressExpression}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <p className="text-xs font-bold tracking-[.2em] text-cinnabar">07–14 · 你在真实生活里怎么运转</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {modeCards.map(([title, copy]) => (
              <article key={title} className="rounded-[1.35rem] border border-line bg-surface p-5">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-soft">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-7 border-y border-line py-12 md:grid-cols-2">
          <article>
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">15 · 你最容易卡在哪里</p>
            <h2 className="mt-3 font-display text-2xl font-bold">优势开太久，也会变成 bug。</h2>
            <p className="mt-4 leading-8 text-soft">{dominant.flip_mode}{topDimension ? ` 你当前最突出的压力维度之一是「${DIMENSION_LABELS[topDimension.key] ?? topDimension.label}」：${topDimension.stressExpression}` : ""}</p>
          </article>
          <article>
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">16 · 成长建议</p>
            <h2 className="mt-3 font-display text-2xl font-bold">不是把你改成另一种人。</h2>
            <p className="mt-4 leading-8 text-soft">{dominant.growth_advice}</p>
          </article>
        </section>

        <section className="py-12">
          <p className="text-xs font-bold tracking-[.2em] text-cinnabar">17 · 为什么会得到这个结果</p>
          <h2 className="mt-3 font-display text-3xl font-bold">不是因为生日碰巧抽中了“{dominant.display_name}”。</h2>
          <p className="mt-4 max-w-3xl leading-8 text-soft">
            当前 V1 先由确定性八字引擎得到 canonical 十神分布与日主信息，再由 Interpretation 计算连续行为维度，最后由 selectArchetypeCandidate 对十种 Ten-God candidate 排序。你当前的第一候选是 {TEN_GOD_CHINESE[dominantKey]}，第二候选是 {TEN_GOD_CHINESE[secondaryKey]}。
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["主人格十神分", bundle.archetype.dominant_pattern.canonical_ten_god_score],
              ["主人格候选分", bundle.archetype.dominant_pattern.candidate_score],
              ["第二人格十神分", bundle.archetype.secondary_pattern.canonical_ten_god_score],
              ["映射支持度", `${Math.round(bundle.archetype.confidence * 100)}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">“映射支持度”只表示当前规则 Profile 对这个分类的支持程度，不是科学心理诊断置信度，也不是人生成功率。</p>
        </section>

        <details className="rounded-[1.5rem] border border-line bg-surface p-5 sm:p-6">
          <summary className="cursor-pointer font-bold">18 · 想看专业八字依据</summary>
          <div className="mt-6 space-y-6 text-sm leading-7 text-soft">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pillars.map((pillar, index) => (
                <div key={pillarNames[index]} className="rounded-xl bg-paper p-4">
                  <p className="text-xs text-muted">{pillarNames[index]}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-ink">{pillar ? `${STEM_CHINESE[pillar.stem]}${BRANCH_CHINESE[pillar.branch]}` : "未知"}</p>
                </div>
              ))}
            </div>
            <p>日主：{STEM_CHINESE[chart.dayMaster.stem]} · {chart.dayMaster.element}；日主强弱：{bundle.calculation.derivedFeatures.dayMasterStrength}。出生地标准化：{bundle.profile.birthPlace?.label ?? "—"}；时区：{bundle.profile.timezone}。</p>
            <p>引擎版本：{bundle.calculation.derivedFeatures.engine_version} · Interpretation：{bundle.interpretation.mapping_version} · Public Registry：{PUBLIC_PERSONALITY_VERSION}。</p>
            <p><strong className="text-ink">工程边界：</strong> 当前完整 TraditionalPatternResult 尚未进入 Production，所以 bi_jian → 犟种（建禄代理）、jie_cai → 撒币（月劫代理）只属于 Presentation Proxy Mapping。这里没有伪造正式建禄/月劫格局判定。</p>
            {bundle.normalization.warnings.length > 0 && (
              <div><p className="font-semibold text-ink">出生信息不确定性</p><ul className="mt-2 list-disc pl-5">{bundle.normalization.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>
            )}
          </div>
        </details>

        <section className="py-14">
          <div className="rounded-[1.8rem] border border-line bg-ink p-6 text-paper sm:p-8">
            <p className="text-xs font-bold tracking-[.22em] text-paper/55">PERSONALITY SHARE CARD V1</p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.8fr] md:items-end">
              <div>
                <p className="text-sm text-paper/55">我的八字人格</p>
                <h2 className="mt-2 font-display text-5xl font-bold sm:text-6xl">{dominant.display_name}</h2>
                <p className="mt-3 text-2xl">“{dominant.anchor_quote.replace(/[“”]/g, "")}”</p>
                <p className="mt-6 max-w-lg leading-7 text-paper/70">{dominant.share_card_copy}</p>
                <div className="mt-5 flex flex-wrap gap-2">{dominant.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-paper/20 px-3 py-1.5 text-xs">{tag}</span>)}</div>
              </div>
              <div className="flex min-h-52 items-end justify-center overflow-hidden rounded-2xl bg-paper/5">
                <CharacterArt tenGod={dominantKey} gender={bundle.characterGender} className="max-h-64 w-full object-contain object-bottom" />
              </div>
            </div>
            <div className="mt-8 border-t border-paper/15 pt-5 text-xs text-paper/45">测测你是什么东西 · {RESULT_URL.replace("https://", "")}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => saveCard("feed")}>生成 / 保存人格卡</button>
            <button type="button" className="btn-ghost" onClick={() => saveCard("story")}>Story / 小红书版</button>
            <button type="button" className="btn-ghost" onClick={copyResult}>复制结果</button>
          </div>
          {shareStatus && <p className="mt-3 text-sm text-soft" aria-live="polite">{shareStatus}</p>}
        </section>

        <section className="rounded-[1.6rem] border border-line bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-cinnabar">深度报告 · 即将开放</p>
            <h2 className="mt-2 font-display text-2xl font-bold">免费结果先给完整，不拿残缺体验逼你付钱。</h2>
            <p className="mt-3 max-w-2xl leading-7 text-soft">{dominant.paid_report_teaser} 正式支付系统尚未接入，今晚不会伪造付款成功。</p>
          </div>
          <Link href="/birth" className="btn-ghost mt-5 shrink-0 sm:mt-0">再测一个人</Link>
        </section>
      </div>
    </main>
  );
}
