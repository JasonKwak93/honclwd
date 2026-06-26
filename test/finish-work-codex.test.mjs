import { test } from "node:test";
import assert from "node:assert/strict";
import { decide } from "../src/hooks/finish-work-codex.js";

test("stop_hook_active면 통과(재귀가드)", () => {
  assert.equal(decide({ stop_hook_active: true, last_assistant_message: "이제 구현하겠습니다" }).block, false);
});
test("대기 신호(질문)면 통과", () => {
  assert.equal(decide({ last_assistant_message: "이대로 진행할까요?" }).block, false);
});
test("미래형 작업 약속만 있고 끝나면 차단", () => {
  const r = decide({ last_assistant_message: "이제 로그인 폼을 구현하겠습니다." });
  assert.equal(r.block, true);
  assert.match(r.reason, /지금/);
});
test("빈/일반 메시지는 통과(보수적)", () => {
  assert.equal(decide({ last_assistant_message: "완료했습니다." }).block, false);
});
