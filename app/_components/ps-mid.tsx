// 人格卡 middle: 关键词 + 表情延展 + 色彩系统 + 元素辅助
import type { Archetype, ElementMeta } from "@/lib/personality-archetypes";

interface MidProps {
  archetype: Archetype;
  elementMeta: ElementMeta;
  outputMetaphor: string;
  familyMetaphor: string;
  familyChinese: string;
}

export function PersonalityMiddle({ archetype, elementMeta, outputMetaphor, familyMetaphor, familyChinese }: MidProps) {
  return (
    <section className="mt-10 grid gap-8 sm:grid-cols-[1fr_1fr]">
      <div>
        <h3 className="text-sm font-semibold tracking-widest text-muted">关键词</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {archetype.keywords.map((k) => (
            <span key={k} className="rounded-full border-2 px-4 py-2 text-sm font-medium" style={{ borderColor: elementMeta.accent, color: elementMeta.accent }}>{k}</span>
          ))}
        </div>
      </div>
      <div className="rounded-[var(--radius-card)] border border-line bg-paper/50 p-5">
        <h3 className="text-sm font-semibold tracking-widest text-muted">元素辅助</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: elementMeta.accent }} />
            <p className="text-soft">{elementMeta.chinese} = <span className="text-ink">{elementMeta.metaphor.replace(`${elementMeta.chinese}（`, "").replace("）", "")}</span></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-cinnabar" />
            <p className="text-soft">{familyChinese} = <span className="text-ink">{familyMetaphor}</span></p>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <h3 className="text-sm font-semibold tracking-widest text-muted">表情延展</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <FaceRow captions={archetype.expressionsMale} accent={elementMeta.accent} label="男型" />
          <FaceRow captions={archetype.expressionsFemale} accent={elementMeta.accent} label="女型" />
        </div>
      </div>
      <div className="sm:col-span-2 rounded-[var(--radius-card)] border border-line bg-surface p-5">
        <h3 className="text-sm font-semibold tracking-widest text-muted">色彩系统</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {elementMeta.palette.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-10 w-10 rounded-full ring-1 ring-line" style={{ background: c }} />
              <span className="font-mono text-xs text-muted">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaceRow({ captions, accent, label }: { captions: readonly string[]; accent: string; label: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {captions.map((cap, i) => (
          <div key={cap} className="text-center">
            <FaceAvatar variant={i} accent={accent} />
            <p className="mt-2 text-xs text-soft">{cap}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaceAvatar({ variant, accent }: { variant: number; accent: string }) {
  const eyeOpen = variant % 2 === 0;
  const mouth = variant % 4;
  return (
    <svg viewBox="0 0 60 60" className="mx-auto h-14 w-14">
      <circle cx="30" cy="30" r="26" fill="#F7F3EE" stroke="#1A1A1A" strokeWidth="1.5" />
      {eyeOpen ? (<>
        <circle cx="22" cy="26" r="1.8" fill="#1A1A1A" />
        <circle cx="38" cy="26" r="1.8" fill="#1A1A1A" />
      </>) : (
        <path d="M18 26 q4 -2 8 0 M34 26 q4 -2 8 0" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
      )}
      {mouth === 0 && <path d="M22 40 q8 6 16 0" stroke={accent} strokeWidth="2" fill="none" />}
      {mouth === 1 && <line x1="24" y1="40" x2="36" y2="40" stroke="#1A1A1A" strokeWidth="1.5" />}
      {mouth === 2 && <circle cx="30" cy="40" r="3" fill={accent} />}
      {mouth === 3 && <path d="M22 38 q8 -6 16 0" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />}
    </svg>
  );
}