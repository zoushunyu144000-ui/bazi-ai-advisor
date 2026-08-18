// Part 1: imports, 纳音, 空亡
import type {
  BaziChart,
  BaziPillar,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
} from "../../types/domain";
import { BRANCHES, STEMS } from "./constants";
import { sexagenaryIndex } from "./rules";

const NAYIN: readonly string[] = [
  "海中金", "炉中火", "大林木", "路旁土", "剑锋金",
  "山头火", "涧下水", "城头土", "白蜡金", "杨柳木",
  "泉中水", "屋上土", "霹雳火", "松柏木", "长流水",
  "沙中金", "山下火", "平地木", "壁上土", "金箔金",
  "覆灯火", "天河水", "大驿土", "钗钏金", "桑柘木",
  "大溪水", "沙中土", "天上火", "石榴木", "大海水",
];

export function nayinOf(stem: HeavenlyStem, branch: EarthlyBranch): string {
  return NAYIN[Math.floor(sexagenaryIndex({ stem, branch }) / 2)];
}

const VOID_PAIRS: ReadonlyArray<readonly [EarthlyBranch, EarthlyBranch]> = [
  ["xu", "hai"],
  ["shen", "you"],
  ["wu", "wei"],
  ["chen", "si"],
  ["yin", "mao"],
  ["zi", "chou"],
];

export function voidBranchesOf(
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch,
): [EarthlyBranch, EarthlyBranch] {
  const idx = sexagenaryIndex({ stem: dayStem, branch: dayBranch });
  const xun = Math.floor(idx / 10);
  const pair = VOID_PAIRS[xun];
  if (!pair) throw new Error(`Invalid xun index: ${xun}`);
  return [pair[0], pair[1]];
}// Part 2: 十二长生（阳顺阴逆）
type StageName =
  | "长生" | "沐浴" | "冠带" | "临官" | "帝旺" | "衰"
  | "病" | "死" | "墓" | "绝" | "胎" | "养";

const STEM_STAGES: Record<HeavenlyStem, ReadonlyArray<readonly [EarthlyBranch, StageName]>> = {
  jia:   [["hai","长生"],["zi","沐浴"],["chou","冠带"],["yin","临官"],["mao","帝旺"],["chen","衰"],["si","病"],["wu","死"],["wei","墓"],["shen","绝"],["you","胎"],["xu","养"]],
  bing:  [["yin","长生"],["mao","沐浴"],["chen","冠带"],["si","临官"],["wu","帝旺"],["wei","衰"],["shen","病"],["you","死"],["xu","墓"],["hai","绝"],["zi","胎"],["chou","养"]],
  wu:    [["yin","长生"],["mao","沐浴"],["chen","冠带"],["si","临官"],["wu","帝旺"],["wei","衰"],["shen","病"],["you","死"],["xu","墓"],["hai","绝"],["zi","胎"],["chou","养"]],
  geng:  [["si","长生"],["wu","沐浴"],["wei","冠带"],["shen","临官"],["you","帝旺"],["xu","衰"],["hai","病"],["zi","死"],["chou","墓"],["yin","绝"],["mao","胎"],["chen","养"]],
  ren:   [["shen","长生"],["you","沐浴"],["xu","冠带"],["hai","临官"],["zi","帝旺"],["chou","衰"],["yin","病"],["mao","死"],["chen","墓"],["si","绝"],["wu","胎"],["wei","养"]],
  yi:    [["wu","长生"],["si","沐浴"],["chen","冠带"],["mao","临官"],["yin","帝旺"],["chou","衰"],["zi","病"],["hai","死"],["xu","墓"],["you","绝"],["shen","胎"],["wei","养"]],
  ding:  [["you","长生"],["shen","沐浴"],["wei","冠带"],["wu","临官"],["si","帝旺"],["chen","衰"],["mao","病"],["yin","死"],["chou","墓"],["zi","绝"],["hai","胎"],["xu","养"]],
  ji:    [["you","长生"],["shen","沐浴"],["wei","冠带"],["wu","临官"],["si","帝旺"],["chen","衰"],["mao","病"],["yin","死"],["chou","墓"],["zi","绝"],["hai","胎"],["xu","养"]],
  xin:   [["zi","长生"],["hai","沐浴"],["xu","冠带"],["you","临官"],["shen","帝旺"],["wei","衰"],["wu","病"],["si","死"],["chen","墓"],["mao","绝"],["yin","胎"],["chou","养"]],
  gui:   [["mao","长生"],["yin","沐浴"],["chou","冠带"],["zi","临官"],["hai","帝旺"],["xu","衰"],["you","病"],["shen","死"],["wei","墓"],["wu","绝"],["si","胎"],["chen","养"]],
};

const STAGE_MAP: Record<HeavenlyStem, Record<EarthlyBranch, StageName>> = (() => {
  const out = {} as Record<HeavenlyStem, Record<EarthlyBranch, StageName>>;
  for (const stem of STEMS) {
    const rec = {} as Record<EarthlyBranch, StageName>;
    for (const [b, s] of STEM_STAGES[stem]) rec[b] = s;
    out[stem] = rec;
  }
  return out;
})();

export function diShiFor(dayMasterStem: HeavenlyStem, branch: EarthlyBranch): StageName {
  return STAGE_MAP[dayMasterStem][branch];
}

export function ziZuoFor(stem: HeavenlyStem, branch: EarthlyBranch): StageName {
  return STAGE_MAP[stem][branch];
}// Part 3: 神煞查表
export type StarName =
  | "桃花" | "驿马" | "将星" | "华盖" | "劫煞"
  | "禄神" | "天乙贵人" | "文昌" | "金舆"
  | "天德" | "月德"
  | "红鸾" | "天喜"
  | "太极贵人" | "国印贵人";

const SAN_HE: Record<EarthlyBranch, { peach: EarthlyBranch; horse: EarthlyBranch; general: EarthlyBranch; canopy: EarthlyBranch; robSha: EarthlyBranch }> = {
  yin:  { peach: "mao",  horse: "shen", general: "wu",   canopy: "xu",   robSha: "hai" },
  wu:   { peach: "mao",  horse: "shen", general: "wu",   canopy: "xu",   robSha: "hai" },
  xu:   { peach: "mao",  horse: "shen", general: "wu",   canopy: "xu",   robSha: "hai" },
  si:   { peach: "wu",   horse: "hai",  general: "you",  canopy: "chou", robSha: "yin" },
  you:  { peach: "wu",   horse: "hai",  general: "you",  canopy: "chou", robSha: "yin" },
  chou: { peach: "wu",   horse: "hai",  general: "you",  canopy: "chou", robSha: "yin" },
  shen: { peach: "you",  horse: "yin",  general: "zi",   canopy: "chen", robSha: "si" },
  zi:   { peach: "you",  horse: "yin",  general: "zi",   canopy: "chen", robSha: "si" },
  chen: { peach: "you",  horse: "yin",  general: "zi",   canopy: "chen", robSha: "si" },
  hai:  { peach: "zi",   horse: "si",   general: "mao",  canopy: "wei",  robSha: "shen" },
  mao:  { peach: "zi",   horse: "si",   general: "mao",  canopy: "wei",  robSha: "shen" },
  wei:  { peach: "zi",   horse: "si",   general: "mao",  canopy: "wei",  robSha: "shen" },
};

const TIAN_YI: Record<HeavenlyStem, readonly EarthlyBranch[]> = {
  jia: ["chou", "wei"], yi: ["shen", "zi"], bing: ["hai", "you"], ding: ["hai", "you"],
  wu: ["chou", "wei"], ji: ["shen", "zi"], geng: ["chou", "wei"], xin: ["yin", "wu"],
  ren: ["si", "mao"], gui: ["si", "mao"],
};

const WEN_CHANG: Record<HeavenlyStem, EarthlyBranch> = {
  jia: "si", yi: "wu", bing: "shen", ding: "you", wu: "shen", ji: "you",
  geng: "hai", xin: "zi", ren: "yin", gui: "mao",
};

const JIN_YU: Record<HeavenlyStem, EarthlyBranch> = {
  jia: "chou", yi: "yin", bing: "mao", ding: "chen", wu: "si", ji: "wu",
  geng: "wei", xin: "shen", ren: "you", gui: "xu",
};

const TAI_JI: Record<HeavenlyStem, readonly EarthlyBranch[]> = {
  jia: ["zi", "wu"], yi: ["zi", "wu"],
  bing: ["mao", "you"], ding: ["mao", "you"],
  wu: ["chen", "xu", "chou", "wei"], ji: ["chen", "xu", "chou", "wei"],
  geng: ["yin", "hai"], xin: ["yin", "hai"],
  ren: ["si", "shen"], gui: ["si", "shen"],
};

const GUO_YIN: Record<HeavenlyStem, EarthlyBranch> = {
  jia: "xu", yi: "hai", bing: "chou", ding: "yin", wu: "chou", ji: "yin",
  geng: "chen", xin: "si", ren: "wei", gui: "shen",
};

const LU_SHEN: Record<HeavenlyStem, EarthlyBranch> = {
  jia: "yin", yi: "mao", bing: "si", ding: "wu", wu: "si", ji: "wu",
  geng: "shen", xin: "you", ren: "hai", gui: "zi",
};

const TIAN_DE: Record<EarthlyBranch, HeavenlyStem> = {
  zi: "ren", chou: "geng", yin: "bing", mao: "jia", chen: "ren", si: "geng",
  wu: "bing", wei: "jia", shen: "ren", you: "geng", xu: "bing", hai: "jia",
};

const YUE_DE: Record<EarthlyBranch, HeavenlyStem> = {
  yin: "bing", wu: "bing", xu: "bing",
  shen: "ren", zi: "ren", chen: "ren",
  hai: "jia", mao: "jia", wei: "jia",
  si: "geng", you: "geng", chou: "geng",
};

const HONG_LUAN: Record<EarthlyBranch, EarthlyBranch> = {
  zi: "mao", chou: "yin", yin: "chou", mao: "zi", chen: "hai", si: "xu",
  wu: "you", wei: "shen", shen: "wei", you: "wu", xu: "si", hai: "chen",
};

const OPPOSITE: Record<EarthlyBranch, EarthlyBranch> = {
  zi: "wu", chou: "wei", yin: "shen", mao: "you", chen: "xu", si: "hai",
  wu: "zi", wei: "chou", shen: "yin", you: "mao", xu: "chen", hai: "si",
};// Part 4: 神煞计算 / 五行旺衰 / 流年 / 一站式组装
export interface StarContext {
  dayStem: HeavenlyStem;
  dayBranch: EarthlyBranch;
  monthBranch: EarthlyBranch;
  yearStem: HeavenlyStem;
  yearBranch: EarthlyBranch;
}

export function starsForPillar(
  pillarStem: HeavenlyStem | undefined,
  pillarBranch: EarthlyBranch,
  ctx: StarContext,
): StarName[] {
  const out: StarName[] = [];
  const he = SAN_HE[ctx.dayBranch];
  if (pillarBranch === he.peach) out.push("桃花");
  if (pillarBranch === he.horse) out.push("驿马");
  if (pillarBranch === he.general) out.push("将星");
  if (pillarBranch === he.canopy) out.push("华盖");
  if (pillarBranch === he.robSha) out.push("劫煞");
  if (pillarBranch === LU_SHEN[ctx.dayStem]) out.push("禄神");
  if (TIAN_YI[ctx.dayStem].includes(pillarBranch) || TIAN_YI[ctx.yearStem].includes(pillarBranch))
    out.push("天乙贵人");
  if (WEN_CHANG[ctx.dayStem] === pillarBranch || WEN_CHANG[ctx.yearStem] === pillarBranch)
    out.push("文昌");
  if (JIN_YU[ctx.dayStem] === pillarBranch || JIN_YU[ctx.yearStem] === pillarBranch)
    out.push("金舆");
  if (pillarStem && TIAN_DE[ctx.monthBranch] === pillarStem) out.push("天德");
  if (pillarStem && YUE_DE[ctx.monthBranch] === pillarStem) out.push("月德");
  if (pillarBranch === HONG_LUAN[ctx.yearBranch]) out.push("红鸾");
  if (pillarBranch === OPPOSITE[HONG_LUAN[ctx.yearBranch]]) out.push("天喜");
  if (TAI_JI[ctx.dayStem].includes(pillarBranch) || TAI_JI[ctx.yearStem].includes(pillarBranch))
    out.push("太极贵人");
  if (GUO_YIN[ctx.dayStem] === pillarBranch || GUO_YIN[ctx.yearStem] === pillarBranch)
    out.push("国印贵人");
  return out;
}

export type StrengthLabel = "旺" | "相" | "休" | "囚" | "死";

const GENERATES: Record<FiveElement, FiveElement> = {
  wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
};
const CONTROLS: Record<FiveElement, FiveElement> = {
  wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood",
};

export function seasonalStrength(monthElement: FiveElement): Record<FiveElement, StrengthLabel> {
  const sheng = GENERATES[monthElement];
  const shengWo = (Object.keys(GENERATES) as FiveElement[]).find((k) => GENERATES[k] === monthElement)!;
  const keWo = CONTROLS[monthElement];
  const beiKe = (Object.keys(CONTROLS) as FiveElement[]).find((k) => CONTROLS[k] === monthElement)!;
  return {
    [monthElement]: "旺",
    [sheng]: "相",
    [shengWo]: "休",
    [keWo]: "死",
    [beiKe]: "囚",
  } as Record<FiveElement, StrengthLabel>;
}

export function yearPillarOf(gregorianYear: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const idx = ((gregorianYear - 4) % 60 + 60) % 60;
  return { stem: STEMS[idx % 10], branch: BRANCHES[idx % 12] };
}

export function currentDaYunPillar(
  birthInstantMs: number,
  cycles: ReadonlyArray<{ startAgeYears: number; endAgeYears: number; pillar: { stem: HeavenlyStem; branch: EarthlyBranch } }>,
): { age: number; pillar: { stem: HeavenlyStem; branch: EarthlyBranch }; startAge: number; endAge: number } | null {
  if (cycles.length === 0) return null;
  const ageYears = (Date.now() - birthInstantMs) / (365.25 * 86_400_000);
  const hit = cycles.find((c) => ageYears >= c.startAgeYears && ageYears < c.endAgeYears);
  if (hit) return { age: ageYears, pillar: hit.pillar, startAge: hit.startAgeYears, endAge: hit.endAgeYears };
  const last = cycles[cycles.length - 1]!;
  return { age: ageYears, pillar: last.pillar, startAge: last.startAgeYears, endAge: last.endAgeYears };
}

export interface PillarTraditional {
  nayin: string;
  diShi: StageName;
  ziZuo: StageName;
  stars: StarName[];
}
export interface ChartTraditional {
  pillars: Record<"year" | "month" | "day" | "hour", PillarTraditional>;
  voidBranches: [EarthlyBranch, EarthlyBranch];
  seasonalStrength: Record<FiveElement, StrengthLabel>;
}

export function computeTraditional(
  chart: BaziChart,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  monthElement: FiveElement,
): ChartTraditional {
  const ctx: StarContext = {
    dayStem: chart.dayMaster.stem,
    dayBranch: chart.pillars.day.branch,
    monthBranch: chart.pillars.month.branch,
    yearStem,
    yearBranch,
  };
  const fill = (pillar: BaziPillar | null): PillarTraditional => {
    if (!pillar) return { nayin: "—", diShi: "胎", ziZuo: "胎", stars: [] };
    return {
      nayin: nayinOf(pillar.stem, pillar.branch),
      diShi: diShiFor(chart.dayMaster.stem, pillar.branch),
      ziZuo: ziZuoFor(pillar.stem, pillar.branch),
      stars: starsForPillar(pillar.stem, pillar.branch, ctx),
    };
  };
  return {
    pillars: {
      year: fill(chart.pillars.year),
      month: fill(chart.pillars.month),
      day: fill(chart.pillars.day),
      hour: fill(chart.pillars.hour),
    },
    voidBranches: voidBranchesOf(chart.dayMaster.stem, chart.pillars.day.branch),
    seasonalStrength: seasonalStrength(monthElement),
  };
}