// 人格卡 hero: 顶部标签 + 大标题 + 描述 + 人物插画 SVG
import type { FiveElement } from "@/types/domain";
import type { Archetype, ElementMeta } from "@/lib/personality-archetypes";

interface Props {
  archetype: Archetype;
  elementMeta: ElementMeta;
  dayMasterStem: string;
  dayMasterElement: FiveElement;
}

function ElementMark({ element, accent }: { element: FiveElement; accent: string }) {
  switch (element) {
    case "fire": return (<g><path d="M0 6 q-4 -8 0 -16 q4 8 0 16z M-6 6 q-3 -6 0 -12 q3 6 0 12z" fill={accent} /></g>);
    case "wood": return (<g><path d="M0 -10 q-8 6 0 18 q8 -12 0 -18z" fill={accent} /></g>);
    case "earth": return (<g><path d="M-10 6 L10 6 L4 -6 L-4 -6z" fill={accent} /></g>);
    case "metal": return (<g><path d="M-2 -10 L2 -10 L2 8 L-2 8z M-1 -10 L1 -10" fill="none" stroke={accent} strokeWidth="2" /></g>);
    case "water": return (<g><path d="M-10 -2 q5 -6 10 0 q-5 6 -10 0z M-10 4 q5 -6 10 0 q-5 6 -10 0z" fill="none" stroke={accent} strokeWidth="1.5" /></g>);
  }
}

export function PersonalityHero({ archetype, elementMeta, dayMasterStem, dayMasterElement }: Props) {
  const accent = elementMeta.accent;
  return (
    <header className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-cinnabar">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cinnabar" />
          八字人格 IP · 设定提案
        </p>
        <h2 className="display-xl mt-4 text-balance leading-[1.02]">{archetype.nickname}</h2>
        <p className="mt-3 text-base font-medium text-soft">「{archetype.tagline}」</p>
        <p className="mt-5 max-w-lg leading-relaxed text-soft">{archetype.description}</p>
      </div>
      <figure className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
        <svg viewBox="0 0 400 460" className="h-auto w-full" aria-hidden>
          <defs>
            <clipPath id="art-clip"><rect width="400" height="460" /></clipPath>
          </defs>
          <g clipPath="url(#art-clip)">
            {/* Sun circles */}
            <circle cx="70" cy="120" r="60" fill="#E6452E" opacity="0.18" />
            <circle cx="330" cy="100" r="48" fill="#E6452E" opacity="0.22" />
            <circle cx="200" cy="80" r="8" fill="#E6452E" />

            {/* Element accent ribbon */}
            <path d="M30 200 Q200 160 370 210" stroke={accent} strokeWidth="2.5" fill="none" opacity="0.5" />

            {/* Male figure (left) */}
            <g transform="translate(120 0)">
              {/* Head */}
              <circle cx="0" cy="60" r="22" fill="#F7F3EE" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Hair */}
              <path d="M-22 55 Q-20 32 0 30 Q20 32 22 55 Q14 40 0 38 Q-14 40 -22 55z" fill="#1A1A1A" />
              {/* Robe */}
              <path d="M-30 90 L30 90 L50 280 L40 430 L-40 430 L-50 280z" fill="#E6452E" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Inner robe (cream) */}
              <path d="M-18 100 L18 100 L26 200 L-26 200z" fill="#F7F3EE" />
              {/* Belt */}
              <rect x="-30" y="220" width="60" height="8" fill="#1A1A1A" />
              {/* Element mark on chest */}
              <g transform="translate(0 160)"><ElementMark element={dayMasterElement} accent="#F7F3EE" /></g>
              {/* "男型" label */}
              <text x="-44" y="380" fontSize="16" fill="#1A1A1A" fontWeight="600">男型</text>
            </g>

            {/* Female figure (right) */}
            <g transform="translate(280 0)">
              {/* Hair bun */}
              <circle cx="0" cy="32" r="12" fill="#1A1A1A" />
              <circle cx="0" cy="68" r="24" fill="#F7F3EE" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Dress (cream) */}
              <path d="M-32 100 L30 100 L48 320 L36 430 L-36 430 L-48 320z" fill="#F7F3EE" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Sash (cinnabar) */}
              <path d="M-30 200 L30 200 L36 230 L-36 230z" fill="#E6452E" />
              {/* Sleeves with cinnabar accent */}
              <path d="M-32 100 L-60 200 L-44 220z" fill="#E6452E" stroke="#1A1A1A" strokeWidth="1.5" />
              <path d="M30 100 L60 200 L44 220z" fill="#E6452E" stroke="#1A1A1A" strokeWidth="1.5" />
              {/* Element mark */}
              <g transform="translate(0 160)"><ElementMark element={dayMasterElement} accent="#E6452E" /></g>
              {/* "女型" label */}
              <text x="-44" y="380" fontSize="16" fill="#1A1A1A" fontWeight="600">女型</text>
            </g>
          </g>
        </svg>
        <figcaption className="sr-only">{archetype.nickname} 双角色</figcaption>
      </figure>
    </header>
  );
}