import { ButtonLink, Eyebrow, SiteShell } from "@/app/_components/design-system";

export default function BirthPage() {
  return (
    <SiteShell compact>
      <section className="container narrow-page birth-layout">
        <div className="form-intro">
          <Eyebrow>01 / 生成你的图谱</Eyebrow>
          <h1>先从出生信息开始。</h1>
          <p>我们只用这些信息完成排盘与人格映射。结果页不会公开展示你的具体生日。</p>
          <div className="privacy-note"><span>✓</span><p><strong>更像心理测评，而不是算命登记。</strong><br />页面尽量减少术语，也不会要求你先理解天干地支。</p></div>
        </div>
        <form className="birth-form">
          <label><span>出生日期</span><input type="date" defaultValue="2001-08-24" /></label>
          <label><span>出生时间</span><input type="time" defaultValue="14:30" /><small>越准确越好；如果不确定，可先选择大概时间。</small></label>
          <label><span>出生城市</span><input type="text" defaultValue="槟城, 马来西亚" placeholder="输入城市，例如：武汉 / Penang" /><small>系统会自动处理时区与夏令时信息。</small></label>
          <fieldset>
            <legend>时间准确度</legend>
            <div className="choice-grid"><label className="choice active"><input type="radio" name="accuracy" defaultChecked />准确</label><label className="choice"><input type="radio" name="accuracy" />大概</label><label className="choice"><input type="radio" name="accuracy" />不确定</label></div>
          </fieldset>
          <div className="form-divider" />
          <ButtonLink href="/result" className="full-button">生成免费人格图谱 <span>→</span></ButtonLink>
          <p className="form-footnote">继续即表示你理解：本产品用于文化与自我观察体验，不提供确定性人生预测。</p>
        </form>
      </section>
    </SiteShell>
  );
}
