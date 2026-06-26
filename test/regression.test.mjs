import { test, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { diffTrees } from "./helpers.mjs";
import { readJson } from "../build/lib/fsutil.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GOLD = join(ROOT, "test", "golden", "claude");
const DIST = join(ROOT, "dist", "claude");
// plugin.json은 재직렬화로 바이트가 달라질 수 있어 의미 비교(아래 별도 테스트). 트리 비교에선 제외.
const MANIFEST = ".claude-plugin/plugin.json";

before(() => {
  execFileSync("node", ["build/build.mjs"], { cwd: ROOT });
});

test("dist/claude 콘텐츠는 golden과 바이트 동일(매니페스트 제외)", () => {
  const { onlyA, onlyB, changed } = diffTrees(GOLD, DIST, { ignore: [MANIFEST] });
  assert.deepEqual(onlyA, [], "golden에만 있는 파일(누락): " + onlyA);
  assert.deepEqual(onlyB, [], "dist에만 있는 파일(추가): " + onlyB);
  assert.deepEqual(changed, [], "내용이 바뀐 파일: " + changed);
});

test("plugin.json은 golden과 의미 동일(deep-equal)", () => {
  assert.deepEqual(readJson(join(DIST, MANIFEST)), readJson(join(GOLD, MANIFEST)));
});
