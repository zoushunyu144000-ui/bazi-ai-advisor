"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateBazi } from "@/modules/bazi";
import {
  BirthNormalizationError,
  IanaHintTimezoneResolver,
  StaticLocationProvider,
  normalizeBirthProfile,
  type StaticLocationRecord,
} from "@/modules/birth";
import { interpretBaziChart, selectArchetypeCandidate } from "@/modules/interpretation";
import { BIRTHPLACE_PRESETS, getBirthplacePreset } from "@/lib/birth-presets";
import {
  PUBLIC_RESULT_SCHEMA_VERSION,
  savePublicResult,
  type PublicResultBundle,
} from "@/lib/public-result";
import { CharacterSlot } from "@/app/_components/character-slot";
import { CityPicker } from "@/app/_components/city-picker";
import { DatePicker } from "@/app/_components/date-picker";
import { TimeWheel } from "@/app/_components/time-wheel";
import { accentStyle } from "@/lib/personality-accent";
import { getPublicPersonality, PUBLIC_PERSONALITY_ORDER, type CharacterGender } from "@/lib/public-personalities";

function friendlyError(error: unknown): string {
  if (!(error instanceof BirthNormalizationError)) return error instanceof Error ? error.message : "计算失败，请检查输入后再试。";
  if (error.code === "AMBIGUOUS_LOCAL_TIME") return "这个时间正好落在夏令时回拨的重复时段。请确认当时 UTC offset 后再使用「其他城市」高级输入，或把出生时间设为不知道。";
  if (error.code === "NONEXISTENT_LOCAL_TIME") return "这个当地时间因夏令时跳时并不存在。请检查出生时间。";
  if (error.code === "BIRTH_DATE_IN_FUTURE") return "出生日期不能晚于今天。";
  if (error.code === "INVALID_TIMEZONE") return "IANA 时区格式不正确，例如 Asia/Shanghai、Europe/London。";
  if (error.code === "INVALID_LOCATION_RESULT") return "出生地信息不完整，请检查国家代码和经纬度。";
  return `出生信息校验失败：${error.message}`;
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const STEPS = ["date", "time", "place", "verify"] as const;
type StepKey = (typeof STEPS)[number];

const STEP_META: Record<StepKey, { eyebrow: string; title: string; helper?: string }> = {
  date: {
    eyebrow: "Step 01 / 04 · Date",
    title: "你什么时候掉到地球上的？",
    helper: "阳历生日。八字排盘只看阳历，农历换算由引擎自动处理。",
  },
  time: {
    eyebrow: "Step 02 / 04 · Time",
    title: "那一刻大概是几点？",
    helper: "不知道也能继续。我们不会假装帮你补一个中午 12 点。",
  },
  place: {
    eyebrow: "Step 03 / 04 · Place",
    title: "你出生在哪座城？",
    helper: "为了不伪造定位，V1 用静态城市表 + IANA 时区。",
  },
  verify: {
    eyebrow: "Step 04 / 04 · Verify",
    title: "最后核对一遍，然后认真算。",
    helper: "点确认后会进入确定性八字 → 解释层 → 人格档案。",
  },
};

export default function BirthPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>("date");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [timeKnown, setTimeKnown] = useState(true);
  const [birthTime, setBirthTime] = useState("12:00");
  const [approximate, setApproximate] = useState(false);
  const [gender, setGender] = useState<CharacterGender>("female");
  const [placeId, setPlaceId] = useState("cn-wuhan");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const custom = placeId === "custom";
  const preset = useMemo(() => (custom ? undefined : getBirthplacePreset(placeId)), [custom, placeId]);

  const dateStepValid = Boolean(birthDate);
  const timeStepValid = !timeKnown || /^\d{2}:\d{2}$/.test(birthTime);
  const placeStepValid = Boolean(preset || (city.trim() && country.trim() && countryCode.trim() && latitude.trim() && longitude.trim() && timezone.trim()));
  const verifyStepValid = dateStepValid && timeStepValid && placeStepValid;

  const stepOrder: Record<StepKey, number> = { date: 0, time: 1, place: 2, verify: 3 };
  const currentStepIndex = stepOrder[step];

  function next() {
    const idx = stepOrder[step];
    const nextStep = STEPS[idx + 1];
    if (!nextStep) return;
    if (step === "date" && !dateStepValid) return;
    if (step === "time" && !timeStepValid) return;
    if (step === "place" && !placeStepValid) return;
    setStep(nextStep);
  }

  function back() {
    const idx = stepOrder[step];
    const prevStep = STEPS[idx - 1];
    if (prevStep) setStep(prevStep);
  }

  // Lock body scroll while on the form view so the sticky bottom action bar
  // feels native; release once the user submits and we navigate to /result.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!verifyStepValid || pending) return;
    setPending(true);
    setError(null);
    try {
      let record: StaticLocationRecord;
      if (preset) {
        record = preset;
      } else {
        const lat = Number(latitude);
        const lon = Number(longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("经纬度必须是有效数字。");
        record = {
          providerLocationId: "manual-custom",
          city: { zhHans: city.trim(), en: city.trim() },
          country: { zhHans: country.trim(), en: country.trim() },
          countryCode: countryCode.trim().toUpperCase(),
          coordinates: { latitude: lat, longitude: lon },
          timezone: timezone.trim(),
        };
      }
      const cityName = record.city.zhHans ?? record.city.en ?? "";
      const countryName = record.country.zhHans ?? record.country.en ?? "";
      const normalized = await normalizeBirthProfile(
        {
          label: name.trim() || "我的八字人格",
          birthDate,
          birthTime: timeKnown ? birthTime : null,
          birthTimePrecision: timeKnown ? (approximate ? "approximate" : "exact") : "unknown",
          city: cityName,
          country: countryName,
          countryCode: record.countryCode,
          locationId: record.providerLocationId,
          sexForTraditionalRules: gender,
        },
        {
          locationProvider: new StaticLocationProvider([record], "manual-v1-birthplace"),
          timezoneResolver: new IanaHintTimezoneResolver(),
        },
      );
      const calculation = calculateBazi(normalized.profile);
      const interpretation = interpretBaziChart(calculation.chart, calculation.derivedFeatures);
      const archetype = selectArchetypeCandidate(
        calculation.chart,
        calculation.derivedFeatures,
        interpretation.signals,
        interpretation.dimensionDetails,
      );
      const bundle: PublicResultBundle = {
        schemaVersion: PUBLIC_RESULT_SCHEMA_VERSION,
        createdAt: new Date().toISOString(),
        profile: normalized.profile,
        characterGender: gender,
        calculation,
        interpretation,
        archetype,
        normalization: {
          locationProvider: normalized.metadata.locationProvider,
          timezoneResolver: normalized.metadata.timezoneResolver,
          warnings: normalized.metadata.warnings,
        },
      };
      savePublicResult(bundle);
      router.push("/result");
    } catch (cause) {
      setError(friendlyError(cause));
      setPending(false);
    }
  }

  const stepMeta = STEP_META[step];
  const stepContent: Record<StepKey, React.ReactNode> = {
    date: (
      <DateStep
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
      />
    ),
    time: (
      <TimeStep
        birthTime={birthTime}
        setBirthTime={setBirthTime}
        timeKnown={timeKnown}
        setTimeKnown={setTimeKnown}
        approximate={approximate}
        setApproximate={setApproximate}
      />
    ),
    place: (
      <PlaceStep
        placeId={placeId}
        setPlaceId={setPlaceId}
        preset={preset}
        custom={custom}
        city={city}
        setCity={setCity}
        country={country}
        setCountry={setCountry}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
        timezone={timezone}
        setTimezone={setTimezone}
      />
    ),
    verify: (
      <VerifyStep
        name={name}
        birthDate={birthDate}
        birthTime={birthTime}
        timeKnown={timeKnown}
        approximate={approximate}
        placeLabel={preset ? preset.label : `${city || "—"} · ${country || "—"}`}
        gender={gender}
      />
    ),
  };

  const nextEnabled =
    (step === "date" && dateStepValid) ||
    (step === "time" && timeStepValid) ||
    (step === "place" && placeStepValid) ||
    step === "verify";

  const isLastStep = step === "verify";

  return (
    <main className="relative mx-auto max-w-3xl px-5 sm:px-8">
      <ProgressRail currentIndex={currentStepIndex} />

      <header className="reveal pt-10 sm:pt-14">
        <p className="eyebrow text-cinnabar">{stepMeta.eyebrow}</p>
        <h1 className="mt-4 display-lg text-ink-deep">{stepMeta.title}</h1>
        {stepMeta.helper && <p className="mt-3 max-w-xl text-base leading-7 text-soft">{stepMeta.helper}</p>}
      </header>

      <form onSubmit={handleSubmit} className="reveal mt-8 space-y-8 pb-32">
        <section className="min-h-[40vh]">{stepContent[step]}</section>

        {error && (
          <div role="alert" className="rounded-2xl border border-cinnabar/25 bg-cinnabar-soft px-4 py-3 text-sm leading-6 text-cinnabar">
            {error}
          </div>
        )}

        <div className="sticky-bottom sticky bottom-0 left-0 right-0 z-20 -mx-5 mt-10 border-t border-line bg-paper/95 px-5 pb-5 pt-4 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={currentStepIndex === 0}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← 上一步
            </button>
            {isLastStep ? (
              <button
                type="submit"
                disabled={!verifyStepValid || pending}
                className="btn-primary"
              >
                {pending ? "正在认真算…" : "看看我到底是什么人格 →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={!nextEnabled}
                className="btn-primary"
              >
                下一步 →
              </button>
            )}
          </div>
          <p className="pt-3 text-center text-[11px] tracking-[0.15em] text-muted">
            免费 · 本机计算 · 不需要登录
          </p>
        </div>
      </form>
    </main>
  );
}

function ProgressRail({ currentIndex }: { currentIndex: number }) {
  const labels = ["日期", "时间", "地点", "确认"];
  return (
    <div className="sticky top-0 z-10 -mx-5 border-b border-line bg-paper/85 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div className="flex items-center gap-2">
        {labels.map((label, index) => {
          const isCurrent = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition ${
                  isCurrent
                    ? "border-ink-deep bg-ink-deep text-paper"
                    : isComplete
                    ? "border-ink-deep text-ink-deep"
                    : "border-line text-muted"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <span className={`text-xs font-bold tracking-[0.18em] ${isCurrent ? "text-ink-deep" : isComplete ? "text-soft" : "text-muted"}`}>
                {label}
              </span>
              {index < labels.length - 1 && (
                <span aria-hidden className={`mx-2 h-px flex-1 ${isComplete ? "bg-ink-deep" : "bg-line"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DateStep({
  birthDate,
  setBirthDate,
  name,
  setName,
  gender,
  setGender,
}: {
  birthDate: string;
  setBirthDate: (next: string) => void;
  name: string;
  setName: (next: string) => void;
  gender: CharacterGender;
  setGender: (next: CharacterGender) => void;
}) {
  const previewDominantKey = PUBLIC_PERSONALITY_ORDER[5];
  const previewPersonality = getPublicPersonality(previewDominantKey);
  return (
    <div className="grid gap-7 md:grid-cols-[1.1fr_.9fr] md:items-start">
      <div className="space-y-5">
        <div>
          <label htmlFor="birth-name" className="field-label">怎么称呼你 <span className="font-normal text-muted">· 可选</span></label>
          <input
            id="birth-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="例如：阿邹"
            autoComplete="nickname"
            className="input-base"
          />
        </div>
        <div>
          <label htmlFor="birth-date" className="field-label">出生日期 · 阳历</label>
          <DatePicker value={birthDate} onChange={setBirthDate} max={todayIso()} />
        </div>
        <fieldset>
          <legend className="field-label">大运性别参考 <span className="font-normal text-muted">· 仅用于排盘</span></legend>
          <div className="grid grid-cols-2 gap-2">
            {(["female", "male"] as CharacterGender[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGender(item)}
                aria-pressed={gender === item}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  gender === item
                    ? "border-ink-deep bg-ink-deep text-paper"
                    : "border-line bg-paper text-soft hover:border-ink-deep hover:text-ink-deep"
                }`}
              >
                {item === "female" ? "女性 · 大运顺行" : "男性 · 大运顺逆"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            这一项只影响八字排盘中的大运走向，不影响「你是哪种怪人」的角色选择。
          </p>
        </fieldset>
      </div>
      <aside
        className="rounded-3xl border border-line-strong bg-paper p-6"
        style={accentStyle(previewDominantKey)}
      >
        <p className="eyebrow text-[var(--p-ink,var(--color-ink-deep))]">预览</p>
        <p className="mt-4 font-display text-xl font-bold leading-snug text-[var(--p-ink,var(--color-ink-deep))]">
          你的字格里，可能住着「{previewPersonality.display_name}」。
        </p>
        <p className="mt-2 text-sm leading-6 text-soft">
          完整档案里会有锚点句、A 面、翻车面、专业八字依据，以及一张能发出去的卡。
        </p>
        <div className="mt-5 h-44">
          <CharacterSlot tenGod={previewDominantKey} variant="compact" showMeta={false} />
        </div>
      </aside>
    </div>
  );
}

function TimeStep({
  birthTime,
  setBirthTime,
  timeKnown,
  setTimeKnown,
  approximate,
  setApproximate,
}: {
  birthTime: string;
  setBirthTime: (next: string) => void;
  timeKnown: boolean;
  setTimeKnown: (next: boolean) => void;
  approximate: boolean;
  setApproximate: (next: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTimeKnown(true)}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
            timeKnown ? "border-ink-deep bg-ink-deep text-paper" : "border-line bg-paper text-soft hover:border-ink-deep hover:text-ink-deep"
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] opacity-70">A</span>
          <span className="mt-1 font-display text-lg font-bold">知道大概时间</span>
          <span className="mt-1 text-xs leading-5 opacity-80">可以用下面的轮盘选到 5 分钟精度</span>
        </button>
        <button
          type="button"
          onClick={() => setTimeKnown(false)}
          className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
            !timeKnown ? "border-ink-deep bg-ink-deep text-paper" : "border-line bg-paper text-soft hover:border-ink-deep hover:text-ink-deep"
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] opacity-70">B</span>
          <span className="mt-1 font-display text-lg font-bold">真的不知道</span>
          <span className="mt-1 text-xs leading-5 opacity-80">我们会诚实保留「时柱未知」</span>
        </button>
      </div>

      {timeKnown ? (
        <>
          <TimeWheel value={birthTime} onChange={setBirthTime} />
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-4 text-sm text-soft">
            <input
              type="checkbox"
              checked={approximate}
              onChange={(event) => setApproximate(event.target.checked)}
              className="h-5 w-5 accent-cinnabar"
            />
            <span>
              只能精确到半小时左右，标记为「大概记得」。
              <span className="ml-1 text-muted">系统会把不确定性带到结果里。</span>
            </span>
          </label>
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-canvas p-5 text-sm leading-7 text-soft">
          我们不会假装帮你补一个中午 12 点。结果里会明确标记「时柱未知」，仍然能给出主标签与副倾向，但命盘依据区会少一柱。
        </div>
      )}
    </div>
  );
}

function PlaceStep({
  placeId,
  setPlaceId,
  preset,
  custom,
  city,
  setCity,
  country,
  setCountry,
  countryCode,
  setCountryCode,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  timezone,
  setTimezone,
}: {
  placeId: string;
  setPlaceId: (next: string) => void;
  preset: ReturnType<typeof getBirthplacePreset>;
  custom: boolean;
  city: string;
  setCity: (next: string) => void;
  country: string;
  setCountry: (next: string) => void;
  countryCode: string;
  setCountryCode: (next: string) => void;
  latitude: string;
  setLatitude: (next: string) => void;
  longitude: string;
  setLongitude: (next: string) => void;
  timezone: string;
  setTimezone: (next: string) => void;
}) {
  return (
    <div className="space-y-5">
      {!custom && (
        <CityPicker value={placeId} onChange={setPlaceId} />
      )}
      <button
        type="button"
        onClick={() => setPlaceId(custom ? "cn-wuhan" : "custom")}
        className="btn-ghost text-sm"
      >
        {custom ? "← 返回预设城市" : "其他城市 · 手动输入"}
      </button>

      {preset && !custom && (
        <div className="rounded-2xl border border-line bg-canvas p-4 text-sm leading-6 text-soft">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink-deep">{preset.label}</span>
            <span className="font-mono text-xs text-muted">{preset.timezone}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {preset.coordinates.latitude.toFixed(3)}, {preset.coordinates.longitude.toFixed(3)} · V1 静态城市表
          </p>
        </div>
      )}

      {custom && (
        <div className="space-y-3 rounded-3xl border border-line-strong bg-canvas p-5">
          <p className="text-sm font-semibold text-ink-deep">手动出生地</p>
          <p className="text-xs leading-5 text-soft">
            为了不伪造定位，V1 需要你明确提供城市、国家代码、经纬度与 IANA 时区。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-base" placeholder="城市，如 Penang" value={city} onChange={(e) => setCity(e.target.value)} />
            <input className="input-base" placeholder="国家/地区，如 Malaysia" value={country} onChange={(e) => setCountry(e.target.value)} />
            <input className="input-base" placeholder="国家代码，如 MY" maxLength={2} value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} />
            <input className="input-base" placeholder="IANA 时区，如 Asia/Kuala_Lumpur" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            <input className="input-base" inputMode="decimal" placeholder="纬度 latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            <input className="input-base" inputMode="decimal" placeholder="经度 longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
          <p className="text-xs text-muted">
            不在表里的常见城市：{BIRTHPLACE_PRESETS.length > 0 ? `${BIRTHPLACE_PRESETS.length} 个预设已收录。` : ""}其他国家不在预设里也能用上方的手动输入。
          </p>
        </div>
      )}
    </div>
  );
}

function VerifyStep({
  name,
  birthDate,
  birthTime,
  timeKnown,
  approximate,
  placeLabel,
  gender,
}: {
  name: string;
  birthDate: string;
  birthTime: string;
  timeKnown: boolean;
  approximate: boolean;
  placeLabel: string;
  gender: CharacterGender;
}) {
  const previewKey = PUBLIC_PERSONALITY_ORDER[6];
  return (
    <div className="space-y-5">
      <article
        className="relative overflow-hidden rounded-[1.5rem] border border-line-strong bg-canvas p-6"
        style={accentStyle(previewKey)}
      >
        <p className="eyebrow text-[var(--p-ink,var(--color-ink-deep))]">BIRTH PROFILE</p>
        <p className="mt-3 display-md text-[var(--p-ink,var(--color-ink-deep))]">
          {name.trim() || "我的八字人格"}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
          <Row label="日期" value={birthDate || "—"} />
          <Row label="时间" value={timeKnown ? `${birthTime}${approximate ? " · 大概" : ""}` : "时柱未知"} />
          <Row label="出生地" value={placeLabel} />
          <Row label="大运性别" value={gender === "female" ? "女 · 顺行" : "男 · 逆行"} />
        </dl>
        <p className="mt-5 text-xs leading-5 text-muted">
          点确认后，系统会进入 deterministic Birth → Bazi → Interpretation 链路，不会把出生信息丢给 AI 猜人格。
        </p>
      </article>

      <div
        className="relative h-56 overflow-hidden rounded-[1.5rem]"
        style={accentStyle(previewKey)}
      >
        <CharacterSlot tenGod={previewKey} variant="compact" showMeta={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--p-soft,oklch(0.94_0.02_60))] via-transparent to-transparent opacity-30" />
      </div>

      <p className="rounded-2xl border border-line bg-paper p-4 text-xs leading-6 text-muted">
        结果只保存在当前浏览器 Session，不依赖登录、Supabase、AI Secret 或支付系统。
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-bold text-ink-deep">{value}</dd>
    </>
  );
}
