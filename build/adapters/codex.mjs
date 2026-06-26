import { rmSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadManifest, codexPluginJson } from "../lib/manifest.mjs";
import { copyTree, writeJson } from "../lib/fsutil.mjs";

export function buildCodex(srcDir, outDir) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const m = loadManifest(srcDir);

  writeJson(join(outDir, ".codex-plugin", "plugin.json"), codexPluginJson(m));

  // 훅 (Codex)
  mkdirSync(join(outDir, "hooks"), { recursive: true });
  for (const f of ["hooks-codex.json", "activate-codex.mjs", "finish-work-codex.mjs"])
    cpSync(join(srcDir, "hooks", f), join(outDir, "hooks", f));

  // 공유 콘텐츠(미수정 복사)
  for (const d of ["skills", "rules", "assets", "codex"]) copyTree(join(srcDir, d), join(outDir, d));

  // README: Codex 설치 섹션 덧붙이기
  const readme = readFileSync(join(srcDir, "README.md"), "utf8");
  const codexInstall = "\n\n## Codex CLI에서 설치\n\n```\ncodex plugin marketplace add chacheum/chageun\n```\n그다음 `/plugins`에서 `chageun` 설치 → `/reload-plugins`.\n\n게이트 에이전트를 분리 실행하려면 `~/.codex/config.toml`에 `[features]\\nmulti_agent = true`. 없어도 인라인으로 동작합니다.\n";
  writeFileSync(join(outDir, "README.md"), readme + codexInstall);

  cpSync(join(srcDir, "LICENSE"), join(outDir, "LICENSE"));
}
