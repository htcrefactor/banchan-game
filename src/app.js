import { requests, statKeys, steps } from "./game-data.js";
import { buildDish, combineChoices } from "./game-logic.js";

const storageKey = "banchan-maker-discoveries";

const els = {
  requestTitle: document.querySelector("#requestTitle"),
  requestText: document.querySelector("#requestText"),
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
  dishCount: document.querySelector("#dishCount")
};

const meters = {
  crunch: document.querySelector("#statCrunch"),
  heat: document.querySelector("#statHeat"),
  umami: document.querySelector("#statUmami"),
  tang: document.querySelector("#statTang"),
  comfort: document.querySelector("#statComfort")
};

const state = {
  request: requests[0],
  stepIndex: 0,
  choices: {},
  discoveries: loadDiscoveries()
};

function init() {
  state.request = randomRequest();
  bindEvents();
  renderAll();
}

function bindEvents() {
  els.backBtn.addEventListener("click", () => {
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
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
  renderRequest();
  renderStepTrack();
  renderChoices();
  renderStats();
  renderVisual();
  renderCookbook();
  els.resultPanel.classList.add("is-hidden");
  els.nextBtn.disabled = false;
}

function renderRequest() {
  els.requestTitle.textContent = state.request.title;
  els.requestText.textContent = state.request.text;
}

function renderStepTrack() {
  els.stepTrack.innerHTML = steps.map((step, index) => {
    const status = index < state.stepIndex ? "complete" : index === state.stepIndex ? "current" : "waiting";
    const label = step.id.charAt(0).toUpperCase() + step.id.slice(1);
    return `<li class="${status}"><span>${index + 1}</span>${label}</li>`;
  }).join("");
}

function renderChoices() {
  const step = currentStep();
  const selected = state.choices[step.id]?.id;

  els.stepLabel.textContent = step.label;
  els.stepPrompt.textContent = step.prompt;
  els.nextBtn.textContent = state.stepIndex === steps.length - 1 ? "Serve Banchan" : "Next Step";
  els.backBtn.disabled = state.stepIndex === 0;

  els.choiceGrid.innerHTML = step.options.map((option) => `
    <button
      class="choice-card ${selected === option.id ? "is-selected" : ""}"
      type="button"
      data-option-id="${option.id}"
      aria-pressed="${selected === option.id}"
      style="--choice-color: ${option.color};"
    >
      <span class="choice-swatch" aria-hidden="true"></span>
      <span class="choice-name">${option.name}</span>
      <span class="choice-korean">${option.korean}</span>
      <span class="choice-caption">${option.caption}</span>
    </button>
  `).join("");

  els.choiceGrid.querySelectorAll(".choice-card").forEach((button) => {
    button.addEventListener("click", () => {
      const option = step.options.find((item) => item.id === button.dataset.optionId);
      state.choices[step.id] = option;
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
  saveDiscovery(dish);
  renderStats();
  renderVisual();
  renderCookbook();
  showResult(dish);
}

function showResult(dish) {
  els.resultRank.textContent = dish.tier.rank;
  els.resultDish.textContent = dish.title;
  els.resultScore.textContent = `${dish.score}/100 table score`;
  els.resultJudge.textContent = dish.judgeLine;
  els.resultTags.innerHTML = dish.tags.map((tag) => `<span>${tag}</span>`).join("");
  els.resultPanel.classList.remove("is-hidden");
  els.nextBtn.disabled = true;
}

function resetRound(request) {
  state.request = request;
  state.stepIndex = 0;
  state.choices = {};
  renderAll();
}

function saveDiscovery(dish) {
  const id = dish.recipe?.id ?? `improv-${state.choices.base.id}`;
  state.discoveries[id] = {
    id,
    title: dish.title,
    score: Math.max(dish.score, state.discoveries[id]?.score ?? 0)
  };
  localStorage.setItem(storageKey, JSON.stringify(state.discoveries));
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
    els.discoveryList.innerHTML = "<li>Serve a dish to start the book.</li>";
    return;
  }

  els.discoveryList.innerHTML = discoveries.map((dish) => `
    <li>
      <span>${dish.title}</span>
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
