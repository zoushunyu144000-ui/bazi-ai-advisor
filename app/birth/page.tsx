"use client";

import { useMemo, useState } from "react";
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
import type { CharacterGender } from "@/lib/public-personalities";

function friendlyError(error: unknown): string {
  if (!(error instanceof BirthNormalizationError)) return error instanceof Error ? error.message : "计算失败，请检查输入后再试。";
  if (error.code === "AMBIGUOUS_LOCAL_TIME") return "这个时间正好落在夏令时回拨的重复时段。请确认当时 UTC offset 后再使用“其他城市”高级输入，或把出生时间设为不知道。";
  if (error.code === "NONEXISTENT_LOCAL_TIME") return "这个当地时间因夏令时跳时并不存在。请检查出生时间。";
  if (error.code === "BIRTH_DATE_IN_FUTURE") return "出生日期不能晚于今天。";
  if (error.code === "INVALID_TIMEZONE") return "IANA 时区格式不正确，例如 Asia/Shanghai、Europe/London。";
  if (error.code === "INVALID_LOCATION_RESULT") return "出生地信息不完整，请检查国家代码和经纬度。";
  return `出生信息校验失败：${error.message}`;
}

export default function BirthPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [timeKnown, setTimeKnown] = useState(true);
  const [birthTime, setBirthTime] = useState("12:00");
  const [approximate, setApproximate] = useState(false);
  const [gender, setGender] = useState<CharacterGender>("male");
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
  const preset = useMemo(() => custom ? undefined : getBirthplacePreset(placeId), [custom, placeId]);
  const canSubmit = Boolean(birthDate && (preset || (city.trim() && country.trim() && countryCode.trim() && latitude.trim() && longitude.trim() && timezone.trim())));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || pending) return;
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

  return (
    <main data-page="birth-intake" className="editorial-frame grid lg:grid-cols-[.68fr_1.32fr]">
      <header className="border-b border-line bg-navy px-5 py-12 text-paper sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:py-20">
        <p className="text-xs font-black tracking-[.2em] text-mustard">BIRTH INPUT / 认真算的部分</p>
        <h1 className="display-lg mt-6">先交代一下，<br />你什么时候掉到地球上的。</h1>
        <p className="mt-7 max-w-md leading-8 text-paper/75">这些信息会进入确定性 Birth → Bazi → Interpretation 链路。不是抽签，也不会把出生日期丢给 AI 猜人格。</p>
        <ol className="mt-10 border-y border-paper/20 text-sm">
          {["输入出生信息", "本机完成排盘", "认领固定人格 IP"].map((item, index) => <li key={item} className="flex items-center gap-4 border-b border-paper/20 py-4 last:border-b-0"><span className="font-display text-xl font-black text-mustard">0{index + 1}</span><span className="font-bold">{item}</span></li>)}
        </ol>
      </header>

      <form onSubmit={handleSubmit} className="bg-surface px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-9 border-b border-line pb-5">
          <p className="editorial-kicker">YOUR DETAILS</p>
          <h2 className="display-md mt-4">出生信息登记表</h2>
          <p className="mt-3 text-sm leading-6 text-muted">标有阳历与传统规则的字段会参与计算；人格角色形象始终使用固定 IP。</p>
        </div>
        <div className="space-y-7">
          <div>
            <label htmlFor="name" className="field-label">怎么称呼你 <span className="font-normal text-muted">· 可选</span></label>
            <input id="name" className="input-base" value={name} onChange={(e)=>setName(e.target.value)} placeholder="例如：阿邹" autoComplete="nickname" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="birthDate" className="field-label">出生日期 · 阳历</label><input id="birthDate" type="date" className="input-base" value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} required /></div>
            <div>
              <span className="field-label">传统排盘所需性别</span>
              <div className="grid grid-cols-2 gap-2">
                {(["male","female"] as CharacterGender[]).map((item)=><button key={item} type="button" aria-pressed={gender===item} onClick={()=>setGender(item)} className={`border px-4 py-3 text-sm font-semibold transition ${gender===item?"border-ink bg-mustard text-ink":"border-line-strong bg-paper text-soft"}`}>{item==="male"?"男":"女"}</button>)}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">仅供传统大运顺逆规则使用；固定 IP 不会随此选择改变。</p>
            </div>
          </div>

          <fieldset>
            <legend className="field-label">出生时间</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={timeKnown} onClick={()=>setTimeKnown(true)} className={`border px-4 py-3 text-sm font-semibold ${timeKnown?"border-ink bg-mustard text-ink":"border-line-strong bg-paper text-soft"}`}>知道时间</button>
              <button type="button" aria-pressed={!timeKnown} onClick={()=>setTimeKnown(false)} className={`border px-4 py-3 text-sm font-semibold ${!timeKnown?"border-ink bg-mustard text-ink":"border-line-strong bg-paper text-soft"}`}>真的不知道</button>
            </div>
            {timeKnown ? <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"><input type="time" className="input-base" value={birthTime} onChange={(e)=>setBirthTime(e.target.value)} /><label className="flex items-center gap-2 border border-line bg-paper px-4 py-3 text-sm text-soft"><input type="checkbox" checked={approximate} onChange={(e)=>setApproximate(e.target.checked)} className="accent-[var(--color-cinnabar)]" />大概记得</label></div> : <p className="mt-3 border border-line bg-paper px-4 py-3 text-sm leading-6 text-soft">可以继续测，但系统会诚实保留“时柱未知”的不确定性，不会擅自补一个中午 12 点。</p>}
          </fieldset>

          <div>
            <label htmlFor="place" className="field-label">出生地</label>
            <select id="place" className="input-base" value={placeId} onChange={(e)=>setPlaceId(e.target.value)}>
              {BIRTHPLACE_PRESETS.map((item)=><option key={item.providerLocationId} value={item.providerLocationId}>{item.label}</option>)}
              <option value="custom">其他城市 · 手动输入</option>
            </select>
            {preset && <p className="mt-2 text-xs text-muted">时区：{preset.timezone} · 经纬度来自当前 V1 静态城市表。不会调用假定位服务。</p>}
          </div>

          {custom && <div className="border border-line bg-paper p-4 sm:p-5">
            <p className="text-sm font-semibold">手动出生地</p>
            <p className="mt-1 text-xs leading-5 text-muted">为了不伪造定位，V1 需要你明确提供城市、国家代码、经纬度与 IANA 时区。未来可无缝换回 Live Location Provider。</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="input-base" placeholder="城市，如 Penang" value={city} onChange={(e)=>setCity(e.target.value)} />
              <input className="input-base" placeholder="国家/地区，如 Malaysia" value={country} onChange={(e)=>setCountry(e.target.value)} />
              <input className="input-base" placeholder="国家代码，如 MY" maxLength={2} value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} />
              <input className="input-base" placeholder="IANA 时区，如 Asia/Kuala_Lumpur" value={timezone} onChange={(e)=>setTimezone(e.target.value)} />
              <input className="input-base" inputMode="decimal" placeholder="纬度 latitude" value={latitude} onChange={(e)=>setLatitude(e.target.value)} />
              <input className="input-base" inputMode="decimal" placeholder="经度 longitude" value={longitude} onChange={(e)=>setLongitude(e.target.value)} />
            </div>
          </div>}

          {error && <div role="alert" className="border border-cinnabar/25 bg-cinnabar-soft px-4 py-3 text-sm leading-6 text-cinnabar">{error}</div>}

          <button type="submit" disabled={!canSubmit || pending} className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-50">{pending ? "正在认真算…" : "看看我到底是什么人格 →"}</button>
          <p className="text-center text-xs leading-5 text-muted">免费结果保存在当前浏览器 Session。本版本不依赖登录、Supabase、AI Secret 或支付系统。</p>
        </div>
      </form>
    </main>
  );
}
