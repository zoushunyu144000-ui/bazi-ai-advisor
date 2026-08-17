import Link from "next/link";
import type { ReactNode } from "react";
import { personality } from "./mock-personality";

const nav = [
  ["测试", "/birth"],
  ["结果", "/result"],
  ["完整报告", "/report"],
  ["AI 顾问", "/advisor"],
] as const;

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="知序 Bazi 首页">
      <span className="brand-mark" aria-hidden="true">序</span>
      <span className="brand-name">知序 <small>BAZI</small></span>
    </Link>
  );
}

export function SiteShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="主要导航">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <Link href="/birth" className="button button-small button-ghost">免费测试</Link>
        </div>
      </header>
      <main className={compact ? "main compact-main" : "main"}>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Brand />
          <p>传统结构，现代语言。用于自我观察，不替代专业医疗、法律或财务建议。</p>
        </div>
      </footer>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function MetricBar({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="metric-row">
      <div className="metric-topline">
        <div>
          <strong>{label}</strong>
          {note ? <span>{note}</span> : null}
        </div>
        <b>{value}</b>
      </div>
      <div className="metric-track" aria-label={`${label} ${value}/100`}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ButtonLink({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <Link href={href} className={`button ${secondary ? "button-secondary" : ""} ${className}`.trim()}>{children}</Link>;
}

export function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="section-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

export function PersonalityHero({ share = false }: { share?: boolean }) {
  return (
    <section className="personality-card result-hero-card">
      <div className="result-kicker-row">
        <Eyebrow>{personality.eyebrow}</Eyebrow>
        <span className="mini-seal">BAZI · 01</span>
      </div>
      <h1>{personality.title}</h1>
      <p className="result-summary">{personality.summary}</p>
      <div className="tag-row">{personality.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
      {share ? <p className="share-hint">适合截图保存 · 不包含出生日期与敏感信息</p> : null}
    </section>
  );
}

export function LockPreview() {
  return (
    <section className="paywall-card">
      <div className="paywall-preview" aria-hidden="true">
        <span>关系模式</span>
        <h3>你需要的不是“更多陪伴”，而是被理解的空间感</h3>
        <p>当关系开始变得密集，你通常不会立刻冲突，而会先……</p>
        <div className="blur-lines"><i /><i /><i /><i /></div>
      </div>
      <div className="paywall-content">
        <span className="lock-icon" aria-hidden="true">↗</span>
        <div>
          <Eyebrow>完整人格报告</Eyebrow>
          <h3>解锁剩余 5 个深度章节</h3>
          <p>关系模式、工作方式、压力盲点、决策习惯与 30 天行动建议。</p>
          <div className="price-line"><strong>¥9.9</strong><span>一次解锁 · 等值本地价格</span></div>
        </div>
        <ButtonLink href="/report">查看完整报告</ButtonLink>
      </div>
    </section>
  );
}

export function ShareCards() {
  return (
    <div className="share-grid">
      <article className="share-card share-a">
        <span className="share-brand">知序 BAZI</span>
        <div><small>我的人格关键词</small><h3>{personality.title}</h3></div>
        <p>{personality.tags.slice(0, 3).join(" · ")}</p>
        <span className="share-code">PERSONALITY MAP / 01</span>
      </article>
      <article className="share-card share-b">
        <span className="share-index">86</span>
        <div><small>最高人格维度</small><h3>自主倾向</h3><p>比起被推动，我更需要自己认同方向。</p></div>
        <span className="share-brand">知序 BAZI</span>
      </article>
      <article className="share-card share-c">
        <span className="quote-mark">“</span>
        <h3>复杂的信息不会让我退缩，<br />反而会让我更专注。</h3>
        <p>我的免费人格图谱</p>
        <span className="share-brand">知序 BAZI</span>
      </article>
    </div>
  );
}
