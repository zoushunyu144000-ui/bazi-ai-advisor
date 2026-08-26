import Link from "next/link";

const LOCAL_ITEMS = [
  ["人格结果", "当前浏览器 Session", "可用"],
  ["出生档案", "仅用于本机排盘", "临时"],
  ["云端同步", "需要身份与数据库服务", "未接入"],
  ["订单 / 顾问次数", "需要支付与账本服务", "未接入"],
] as const;

export default function AccountPage() {
  return (
    <main data-auth-state="local-only" className="editorial-frame">
      <section className="grid border-b border-line lg:grid-cols-[.7fr_1.3fr]">
        <div className="border-b border-line px-5 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:py-20">
          <p className="editorial-kicker">ACCOUNT / LOCAL ONLY</p>
          <h1 className="display-lg mt-6">现在没有账户，<br />只有这台浏览器。</h1>
          <p className="mt-6 max-w-lg leading-8 text-soft">免费排盘无需注册。结果暂存在当前浏览器 Session；关闭会话、清理网站数据或换设备后，可能无法恢复。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/birth" className="btn-primary">开始一次本地排盘</Link>
            <Link href="/result" className="btn-ghost">查看本机结果</Link>
          </div>
        </div>

        <div className="bg-surface p-5 sm:p-8 lg:p-12">
          <div className="border border-ink bg-paper">
            <header className="flex items-center justify-between border-b border-ink p-5">
              <div><p className="text-xs font-black tracking-[.14em] text-muted">SESSION STATUS</p><h2 className="mt-2 text-2xl font-black">访客 · 本地模式</h2></div>
              <span className="h-3 w-3 bg-sage" aria-label="本地模式可用" />
            </header>
            <div>
              {LOCAL_ITEMS.map(([title, copy, status]) => <div key={title} className="grid gap-2 border-b border-line p-5 last:border-b-0 sm:grid-cols-[.7fr_1fr_auto] sm:items-center"><p className="font-black">{title}</p><p className="text-sm text-soft">{copy}</p><span className={`w-fit border px-2.5 py-1 text-[10px] font-black ${status === "可用" ? "border-sage bg-jade-soft text-sage" : "border-line text-muted"}`}>{status}</span></div>)}
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-muted">不会伪造登录、云同步或订单记录。等身份、Supabase 与支付系统真实接入后，这里再升级为正式账户中心。</p>
        </div>
      </section>

      <section className="grid lg:grid-cols-3">
        {["隐私优先", "结果可追溯", "服务可替换"].map((title, index) => <article key={title} className="border-b border-line p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 sm:p-8"><p className="font-display text-3xl font-black text-maroon">0{index + 1}</p><h2 className="mt-6 text-lg font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-soft">{index === 0 ? "敏感出生信息默认在本机处理，云端只应保存必要数据。" : index === 1 ? "命盘、解释与展示版本分别记录，升级 UI 不偷偷改结果。" : "身份、支付和模型都通过边界接入，不把供应商写死在排盘核心里。"}</p></article>)}
      </section>
    </main>
  );
}
