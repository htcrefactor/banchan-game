import test from "node:test";
import assert from "node:assert/strict";
import { requests, steps } from "../src/game-data.js";
import { buildDish, combineChoices, findClashes, findRecipeMatch, scoreStatFit } from "../src/game-logic.js";

function option(stepId, optionId) {
  return steps
    .find((step) => step.id === stepId)
    .options.find((item) => item.id === optionId);
}

test("combines choice stats and clamps to the game range", () => {
  const choices = {
    base: option("base", "spinach"),
    prep: option("prep", "blanch"),
    seasoning: option("seasoning", "perilla-creamy"),
    finish: option("finish", "sesame")
  };

  const { stats, tags } = combineChoices(choices);

  assert.equal(stats.heat, 0);
  assert.equal(stats.comfort, 9);
  assert(tags.includes("mellow"));
  assert(tags.includes("nutty"));
});

test("recognizes a classic cucumber muchim combination", () => {
  const choices = {
    base: option("base", "cucumber"),
    prep: option("prep", "salt-squeeze"),
    seasoning: option("seasoning", "gochugaru-vinegar"),
    finish: option("finish", "sesame")
  };

  assert.equal(findRecipeMatch(choices).id, "oi-muchim");
});

test("applies clash rules to mismatched combinations", () => {
  const choices = {
    base: option("base", "anchovy"),
    prep: option("prep", "quick-pickle"),
    seasoning: option("seasoning", "kimchi-brine"),
    finish: option("finish", "seaweed")
  };

  assert.equal(findClashes(choices)[0].penalty, -9);
});

test("scores a matching spinach namul as a strong quiet rice dish", () => {
  const request = requests.find((item) => item.id === "quiet-rice");
  const choices = {
    base: option("base", "spinach"),
    prep: option("prep", "blanch"),
    seasoning: option("seasoning", "soy-sesame"),
    finish: option("finish", "sesame")
  };

  const dish = buildDish(choices, request);

  assert.equal(dish.recipe.id, "sigeumchi-namul");
  assert(dish.score >= 80);
});

test("stat fit rewards close balances more than distant ones", () => {
  const target = { crunch: 8, heat: 6, umami: 5, tang: 4, comfort: 3 };
  const close = scoreStatFit({ crunch: 8, heat: 5, umami: 5, tang: 4, comfort: 4 }, target);
  const distant = scoreStatFit({ crunch: 0, heat: 0, umami: 10, tang: 0, comfort: 10 }, target);

  assert(close > distant);
});
