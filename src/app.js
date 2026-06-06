import { requests, statKeys, steps } from "./game-data.js";
import { buildDish, combineChoices } from "./game-logic.js";
import {
  defaultLocale,
  discoveryTitle,
  dishTitle,
  judgeLine,
  languageMeta,
  languages,
  normalizeLocale,
  optionText,
  requestText,
  scoreLine,
  statLabel,
  stepText,
  tagLabel,
  tierText,
  t
} from "./i18n.js";

const storageKey = "banchan-maker-discoveries";
const localeStorageKey = "banchan-maker-locale";

const els = {
  metaDescription: document.querySelector('meta[name="description"]'),
  brandEyebrow: document.querySelector("#brandEyebrow"),
  gameTitle: document.querySelector("#gameTitle"),
  languageLabel: document.querySelector("#languageLabel"),
  languageSelect: document.querySelector("#languageSelect"),
  dishCountLabel: document.querySelector("#dishCountLabel"),
  gameGrid: document.querySelector("#gameGrid"),
  requestTitle: document.querySelector("#requestTitle"),
  requestText: document.querySelector("#requestText"),
  compactRequestTitle: document.querySelector("#compactRequestTitle"),
  compactRequestText: document.querySelector("#compactRequestText"),
  stepTrack: document.querySelector("#stepTrack"),
  stepLabel: document.querySelector("#stepLabel"),
  stepPrompt: document.querySelector("#stepPrompt"),
  choiceGrid: document.querySelector("#choiceGrid"),
  backBtn: document.querySelector("#backBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  resultPanel: document.querySelector("#resultPanel"),
  resultRank: document.querySelector("#resultRank"),
  resultDish: document.querySelector("#resultDish"),
  resultScore: document.querySelector("#resultScore"),
  resultJudge: document.querySelector("#resultJudge"),
  resultTags: document.querySelector("#resultTags"),
  sameRequestBtn: document.querySelector("#sameRequestBtn"),
  newRoundBtn: document.querySelector("#newRoundBtn"),
  dishVisual: document.querySelector("#dishVisual"),
  discoveryList: document.querySelector("#discoveryList"),
  dishCount: document.querySelector("#dishCount"),
  statBoard: document.querySelector("#statBoard"),
  cookbookTitle: document.querySelector("#cookbookTitle")
};

const meters = {
  crunch: document.querySelector("#statCrunch"),
  heat: document.querySelector("#statHeat"),
  umami: document.querySelector("#statUmami"),
  tang: document.querySelector("#statTang"),
  comfort: document.querySelector("#statComfort")
};

const state = {
  locale: loadLocale(),
  request: requests[0],
  stepIndex: 0,
  choices: {},
  discoveries: loadDiscoveries(),
  lastDish: null
};

function init() {
  state.request = randomRequest();
  bindEvents();
  renderAll();
}

function bindEvents() {
  els.languageSelect.addEventListener("change", () => {
    state.locale = normalizeLocale(els.languageSelect.value);
    localStorage.setItem(localeStorageKey, state.locale);
    renderAll();
  });

  els.backBtn.addEventListener("click", () => {
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
      state.lastDish = null;
      renderAll();
    }
  });

  els.nextBtn.addEventListener("click", () => {
    if (!state.choices[currentStep().id]) {
      pulseChoiceGrid();
      return;
    }

    if (state.stepIndex === steps.length - 1) {
      finishRound();
      return;
    }

    state.stepIndex += 1;
    state.lastDish = null;
    renderAll();
  });

  els.sameRequestBtn.addEventListener("click", () => resetRound(state.request));
  els.newRoundBtn.addEventListener("click", () => resetRound(randomRequest(state.request.id)));
}

function currentStep() {
  return steps[state.stepIndex];
}

function randomRequest(exceptId) {
  const pool = exceptId ? requests.filter((request) => request.id !== exceptId) : requests;
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderAll() {
  renderChrome();
  renderRequest();
  renderStepTrack();
  renderChoices();
  renderStats();
  renderVisual();
  renderCookbook();

  if (state.lastDish) {
    showResult(state.lastDish, { scroll: false });
  } else {
    hideResult();
  }
}

function renderChrome() {
  const meta = languageMeta(state.locale);

  document.documentElement.lang = meta.htmlLang;
  document.title = t(state.locale, "documentTitle");
  els.metaDescription.setAttribute("content", t(state.locale, "metaDescription"));
  els.brandEyebrow.textContent = t(state.locale, "brandEyebrow");
  els.gameTitle.textContent = t(state.locale, "gameTitle");
  els.languageLabel.textContent = t(state.locale, "language");
  els.languageSelect.setAttribute("aria-label", t(state.locale, "languageAria"));
  els.languageSelect.innerHTML = languages.map((language) => `
    <option value="${language.code}" ${language.code === state.locale ? "selected" : ""}>
      ${language.label}
    </option>
  `).join("");
  els.dishCountLabel.textContent = t(state.locale, "dishesFound");
  els.gameGrid.setAttribute("aria-label", t(state.locale, "gameAria"));
  els.statBoard.setAttribute("aria-label", t(state.locale, "statBoard"));
  els.stepTrack.setAttribute("aria-label", t(state.locale, "cookingSteps"));
  els.backBtn.setAttribute("aria-label", t(state.locale, "back"));
  els.backBtn.setAttribute("title", t(state.locale, "back"));
  els.sameRequestBtn.textContent = t(state.locale, "sameTable");
  els.newRoundBtn.textContent = t(state.locale, "newTable");
  els.cookbookTitle.textContent = t(state.locale, "discoveredBanchan");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(state.locale, node.dataset.i18n);
  });
  document.querySelectorAll("[data-stat-label]").forEach((node) => {
    node.textContent = statLabel(state.locale, node.dataset.statLabel);
  });
}

function renderRequest() {
  const text = requestText(state.locale, state.request);
  els.requestTitle.textContent = text.title;
  els.requestText.textContent = text.text;
  els.compactRequestTitle.textContent = text.title;
  els.compactRequestText.textContent = text.text;
}

function renderStepTrack() {
  els.stepTrack.innerHTML = steps.map((step, index) => {
    const status = index < state.stepIndex ? "complete" : index === state.stepIndex ? "current" : "waiting";
    const label = stepText(state.locale, step).track;
    return `<li class="${status}"><span>${index + 1}</span>${label}</li>`;
  }).join("");
}

function renderChoices() {
  const step = currentStep();
  const selected = state.choices[step.id]?.id;
  const text = stepText(state.locale, step);

  els.stepLabel.textContent = text.label;
  els.stepPrompt.textContent = text.prompt;
  els.nextBtn.textContent = state.stepIndex === steps.length - 1
    ? t(state.locale, "serveBanchan")
    : t(state.locale, "nextStep");
  els.backBtn.disabled = state.stepIndex === 0;

  els.choiceGrid.innerHTML = step.options.map((option) => {
    const label = optionText(state.locale, option);

    return `
      <button
        class="choice-card ${selected === option.id ? "is-selected" : ""}"
        type="button"
        data-option-id="${option.id}"
        aria-pressed="${selected === option.id}"
        style="--choice-color: ${option.color};"
      >
        <span class="choice-swatch" aria-hidden="true"></span>
        <span class="choice-name">${label.name}</span>
        <span class="choice-korean">${label.secondary}</span>
        <span class="choice-caption">${label.caption}</span>
      </button>
    `;
  }).join("");

  els.choiceGrid.querySelectorAll(".choice-card").forEach((button) => {
    button.addEventListener("click", () => {
      const option = step.options.find((item) => item.id === button.dataset.optionId);
      state.choices[step.id] = option;
      state.lastDish = null;
      renderAll();
    });
  });
}

function renderStats() {
  const { stats } = combineChoices(state.choices);
  statKeys.forEach((key) => {
    meters[key].value = stats[key];
  });
}

function renderVisual() {
  const base = state.choices.base;
  const seasoning = state.choices.seasoning;
  const finish = state.choices.finish;

  els.dishVisual.dataset.shape = base?.shape ?? "rounds";
  els.dishVisual.style.setProperty("--dish-color", base?.color ?? "#5fb879");
  els.dishVisual.style.setProperty("--dish-accent", base?.accent ?? "#e7f6cd");
  els.dishVisual.style.setProperty("--sauce-color", seasoning?.color ?? "#b74336");
  els.dishVisual.style.setProperty("--finish-color", finish?.color ?? "#f4e0a7");
}

function finishRound() {
  const dish = buildDish(state.choices, state.request);
  state.lastDish = dish;
  saveDiscovery(dish);
  renderStats();
  renderVisual();
  renderCookbook();
  showResult(dish);
}

function showResult(dish, options = { scroll: true }) {
  els.resultRank.textContent = tierText(state.locale, dish.tier).rank;
  els.resultDish.textContent = dishTitle(state.locale, dish, state.choices.base);
  els.resultScore.textContent = scoreLine(state.locale, dish.score);
  els.resultJudge.textContent = judgeLine(state.locale, dish);
  els.resultTags.innerHTML = dish.tags.map((tag) => `<span>${tagLabel(state.locale, tag)}</span>`).join("");
  els.resultPanel.classList.remove("is-hidden");
  els.nextBtn.disabled = true;

  if (options.scroll && window.matchMedia("(max-width: 1100px)").matches) {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      els.resultPanel.scrollIntoView({
        behavior: motionPreference ? "auto" : "smooth",
        block: "nearest"
      });
    });
  }
}

function hideResult() {
  els.resultPanel.classList.add("is-hidden");
  els.nextBtn.disabled = false;
}

function resetRound(request) {
  state.request = request;
  state.stepIndex = 0;
  state.choices = {};
  state.lastDish = null;
  renderAll();
}

function saveDiscovery(dish) {
  const id = dish.recipe?.id ?? `improv-${state.choices.base.id}`;
  state.discoveries[id] = {
    id,
    title: dish.title,
    recipeId: dish.recipe?.id ?? null,
    baseId: state.choices.base.id,
    score: Math.max(dish.score, state.discoveries[id]?.score ?? 0)
  };
  localStorage.setItem(storageKey, JSON.stringify(state.discoveries));
}

function loadLocale() {
  return normalizeLocale(localStorage.getItem(localeStorageKey) ?? defaultLocale);
}

function loadDiscoveries() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? {};
  } catch {
    return {};
  }
}

function renderCookbook() {
  const discoveries = Object.values(state.discoveries).sort((a, b) => b.score - a.score);
  els.dishCount.textContent = discoveries.length;

  if (discoveries.length === 0) {
    els.discoveryList.innerHTML = `<li>${t(state.locale, "emptyCookbook")}</li>`;
    return;
  }

  els.discoveryList.innerHTML = discoveries.map((dish) => `
    <li>
      <span>${discoveryTitle(state.locale, dish)}</span>
      <strong>${dish.score}</strong>
    </li>
  `).join("");
}

function pulseChoiceGrid() {
  els.choiceGrid.classList.remove("needs-choice");
  requestAnimationFrame(() => {
    els.choiceGrid.classList.add("needs-choice");
  });
}

init();
