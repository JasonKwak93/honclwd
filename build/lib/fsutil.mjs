import { cpSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

export function copyTree(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true });
  cpSync(srcDir, dstDir, { recursive: true });
}

export function listTree(dir) {
  const out = [];
  const walk = (abs, rel) => {
    for (const name of readdirSync(abs).sort()) {
      const a = join(abs, name);
      const r = rel ? rel + "/" + name : name;
      if (statSync(a).isDirectory()) walk(a, r);
      else out.push(r);
    }
  };
  walk(dir, "");
  return out.sort();
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}
