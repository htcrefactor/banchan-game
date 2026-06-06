import test from "node:test";
import assert from "node:assert/strict";
import { requests, steps } from "../src/game-data.js";
import { buildDish } from "../src/game-logic.js";
import {
  defaultLocale,
  dishTitle,
  languages,
  normalizeLocale,
  optionText,
  requestText,
  scoreLine,
  statLabel,
  stepText
} from "../src/i18n.js";

function option(stepId, optionId) {
  return steps
    .find((step) => step.id === stepId)
    .options.find((item) => item.id === optionId);
}

test("uses Korean as the default locale", () => {
  assert.equal(defaultLocale, "ko");
  assert.equal(normalizeLocale("missing"), "ko");
});

test("supports Korean, English, Japanese, and Chinese locales", () => {
  assert.deepEqual(languages.map((language) => language.code), ["ko", "en", "ja", "zh"]);
});

test("localizes request, step, option, stat, score, and dish text", () => {
  const choices = {
    base: option("base", "cucumber"),
    prep: option("prep", "salt-squeeze"),
    seasoning: option("seasoning", "gochugaru-vinegar"),
    finish: option("finish", "sesame")
  };
  const dish = buildDish(choices, requests.find((request) => request.id === "lunch-crunch"));

  assert.equal(requestText("ko", requests[0]).title, "도시락의 한 입");
  assert.equal(stepText("ja", steps[0]).track, "材料");
  assert.equal(optionText("zh", choices.base).name, "黄瓜");
  assert.equal(statLabel("en", "umami"), "Umami");
  assert.equal(scoreLine("ko", 83), "83/100 밥상 점수");
  assert.equal(dishTitle("ko", dish, choices.base), "오이무침");
});
