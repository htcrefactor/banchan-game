import { clashRules, recipeMatches, statKeys, tiers } from "./game-data.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function emptyStats() {
  return Object.fromEntries(statKeys.map((key) => [key, 0]));
}

export function normalizeStats(stats) {
  return Object.fromEntries(
    statKeys.map((key) => [key, clamp(Math.round(stats[key] ?? 0), 0, 10)])
  );
}

export function combineChoices(choices) {
  const totals = emptyStats();
  const tags = new Map();

  Object.values(choices).forEach((choice) => {
    if (!choice) {
      return;
    }

    statKeys.forEach((key) => {
      totals[key] += choice.stats?.[key] ?? 0;
    });

    choice.tags?.forEach((tag) => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    });
  });

  return {
    stats: normalizeStats(totals),
    tags: Array.from(tags.keys())
  };
}

export function findRecipeMatch(choices) {
  const ids = {
    base: choices.base?.id,
    prep: choices.prep?.id,
    seasoning: choices.seasoning?.id,
    finish: choices.finish?.id
  };

  return recipeMatches.find((recipe) =>
    recipe.base.includes(ids.base) &&
    recipe.prep.includes(ids.prep) &&
    recipe.seasoning.includes(ids.seasoning) &&
    recipe.finish.includes(ids.finish)
  ) ?? null;
}

export function findClashes(choices) {
  const choiceIds = new Set(Object.values(choices).filter(Boolean).map((choice) => choice.id));

  return clashRules.filter((rule) => rule.ids.every((id) => choiceIds.has(id)));
}

export function scoreStatFit(stats, target) {
  const distance = statKeys.reduce((sum, key) => sum + Math.abs((target[key] ?? 0) - stats[key]), 0);
  return clamp(Math.round(72 - distance * 2.4), 0, 72);
}

export function scoreTagFit(tags, requestTags) {
  const selectedTags = new Set(tags);
  const matches = requestTags.filter((tag) => selectedTags.has(tag)).length;
  return matches * 4;
}

export function chooseTier(score) {
  return tiers.find((tier) => score >= tier.min) ?? tiers.at(-1);
}

export function buildDish(choices, request) {
  const composition = combineChoices(choices);
  const recipe = findRecipeMatch(choices);
  const clashes = findClashes(choices);
  const clashPenalty = clashes.reduce((sum, clash) => sum + clash.penalty, 0);
  const statScore = scoreStatFit(composition.stats, request.target);
  const tagScore = scoreTagFit(composition.tags, request.tags);
  const recipeBonus = recipe?.bonus ?? 0;
  const score = clamp(statScore + tagScore + recipeBonus + clashPenalty, 0, 100);
  const tier = chooseTier(score);
  const tags = Array.from(new Set([...(recipe?.tags ?? []), ...composition.tags])).slice(0, 5);

  return {
    score,
    tier,
    stats: composition.stats,
    tags,
    recipe,
    clashes,
    title: recipe
      ? `${recipe.name} (${recipe.korean})`
      : `Improvised ${choices.base.name} Banchan`,
    judgeLine: buildJudgeLine({ recipe, tier, clashes })
  };
}

function buildJudgeLine({ recipe, tier, clashes }) {
  if (clashes.length > 0) {
    return clashes[0].line;
  }

  if (recipe) {
    return `${recipe.line} ${tier.line}`;
  }

  return tier.line;
}
