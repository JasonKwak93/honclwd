import { test, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildClaude } from "../build/adapters/claude.mjs";
import { buildCodex } from "../build/adapters/codex.mjs";
import { listTree } from "../build/lib/fsutil.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let TMP;
before(() => {
  TMP = mkdtempSync(join(tmpdir(), "distchk-"));
  buildClaude(join(ROOT, "src"), join(TMP, "claude"));
  buildCodex(join(ROOT, "src"), join(TMP, "codex"));
});

for (const plat of ["claude", "codex"]) {
  test(`커밋된 dist/${plat}는 build(src)와 일치`, () => {
    const committed = join(ROOT, "dist", plat);
    const fresh = join(TMP, plat);
    const a = listTree(committed), b = listTree(fresh);
    assert.deepEqual(a, b, `${plat} 파일목록 불일치`);
    for (const f of a)
      assert.ok(readFileSync(join(committed, f)).equals(readFileSync(join(fresh, f))), `${plat}/${f} 내용 불일치 — npm run build 후 커밋 필요`);
  });
}
