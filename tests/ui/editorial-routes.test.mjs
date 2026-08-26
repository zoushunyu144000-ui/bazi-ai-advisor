import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

function source(path) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

test("global CSS freezes the City Observation Editorial system", () => {
  const css = source("app/globals.css");
  for (const token of [
    "--color-brick",
    "--color-orange",
    "--color-mustard",
    "--color-cobalt",
    "--color-sage",
    "--color-teal",
    "--color-navy",
    "--color-maroon",
    "--color-dusty-pink",
    "--color-dusty-purple",
  ]) assert.match(css, new RegExp(token), `missing ${token}`);
  assert.match(css, /\.paper-grain/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("navigation exposes the complete public journey", () => {
  const nav = source("app/_components/site-nav.tsx");
  for (const href of ["/", "/birth", "/result", "/report", "/advisor", "/account"]) {
    assert.match(nav, new RegExp(`href: "${href.replace("/", "\\/")}"`));
  }
  assert.match(nav, /aria-label="主导航"/);
});

test("homepage is an editorial club directory powered by all ten canonical IPs", () => {
  const home = source("app/page.tsx");
  assert.match(home, /data-page="club-directory"/);
  assert.match(home, /PUBLIC_PERSONALITY_ORDER/);
  assert.match(home, /CharacterArt/);
  assert.match(home, /十怪人格俱乐部/);
  assert.match(home, /确定性八字/);
});

test("birth page separates calculation sex from canonical character identity", () => {
  const birth = source("app/birth/page.tsx");
  assert.match(birth, /传统排盘所需性别/);
  assert.match(birth, /固定 IP 不会随此选择改变/);
  assert.doesNotMatch(birth, /角色版本/);
  assert.match(birth, /aria-pressed=/);
});

test("result, report, advisor and account expose honest product states", () => {
  assert.match(source("app/result/page.tsx"), /data-result-dossier/);
  assert.match(source("app/report/page.tsx"), /data-report-state="preview"/);
  assert.match(source("app/advisor/page.tsx"), /data-provider-state="not-configured"/);
  assert.match(source("app/account/page.tsx"), /data-auth-state="local-only"/);
});

test("canonical character requests honor the deployment base path", () => {
  const config = source("next.config.ts");
  const art = source("app/_components/character-art.tsx");
  const result = source("app/result/page.tsx");
  assert.match(config, /NEXT_PUBLIC_BASE_PATH: publicBasePath/);
  assert.match(art, /process\.env\.NEXT_PUBLIC_BASE_PATH/);
  assert.match(result, /process\.env\.NEXT_PUBLIC_BASE_PATH/);
});
