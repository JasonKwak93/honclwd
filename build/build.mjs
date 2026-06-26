import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildClaude } from "./adapters/claude.mjs";
import { buildCodex } from "./adapters/codex.mjs";
import { listTree } from "./lib/fsutil.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");

buildClaude(SRC, join(DIST, "claude"));
buildCodex(SRC, join(DIST, "codex"));
console.log(`빌드 완료: dist/claude (${listTree(join(DIST,"claude")).length}개), dist/codex (${listTree(join(DIST,"codex")).length}개)`);
