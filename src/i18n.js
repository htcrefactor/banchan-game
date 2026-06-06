export const defaultLocale = "ko";

export const languages = [
  { code: "ko", label: "한국어", htmlLang: "ko" },
  { code: "en", label: "English", htmlLang: "en" },
  { code: "ja", label: "日本語", htmlLang: "ja" },
  { code: "zh", label: "简体中文", htmlLang: "zh-Hans" }
];

const languageCodes = new Set(languages.map((language) => language.code));

export function normalizeLocale(locale) {
  return languageCodes.has(locale) ? locale : defaultLocale;
}

export function languageMeta(locale) {
  return languages.find((language) => language.code === normalizeLocale(locale));
}

export function t(locale, key) {
  return readPath(dictionary[normalizeLocale(locale)].ui, key) ?? readPath(dictionary.en.ui, key) ?? key;
}

export function requestText(locale, request) {
  return byId(dictionary[normalizeLocale(locale)].requests, request.id, {
    title: request.title,
    text: request.text
  });
}

export function stepText(locale, step) {
  return byId(dictionary[normalizeLocale(locale)].steps, step.id, {
    label: step.label,
    prompt: step.prompt,
    track: step.id
  });
}

export function optionText(locale, option) {
  return byId(dictionary[normalizeLocale(locale)].options, option.id, {
    name: option.name,
    secondary: option.korean,
    caption: option.caption
  });
}

export function recipeText(locale, recipe) {
  if (!recipe) {
    return null;
  }

  return byId(dictionary[normalizeLocale(locale)].recipes, recipe.id, {
    name: `${recipe.name} (${recipe.korean})`,
    line: recipe.line
  });
}

export function clashText(locale, clash) {
  return byId(dictionary[normalizeLocale(locale)].clashes, clash.id, {
    line: clash.line
  });
}

export function tierText(locale, tier) {
  return byId(dictionary[normalizeLocale(locale)].tiers, tier.id, {
    rank: tier.rank,
    line: tier.line
  });
}

export function statLabel(locale, statKey) {
  return dictionary[normalizeLocale(locale)].stats[statKey] ?? dictionary.en.stats[statKey] ?? statKey;
}

export function tagLabel(locale, tag) {
  return dictionary[normalizeLocale(locale)].tags[tag] ?? dictionary.en.tags[tag] ?? tag;
}

export function dishTitle(locale, dish, baseChoice) {
  const recipe = recipeText(locale, dish.recipe);

  if (recipe) {
    return recipe.name;
  }

  const base = optionText(locale, baseChoice).name;
  return t(locale, "improvisedDish").replace("{base}", base);
}

export function discoveryTitle(locale, discovery) {
  if (discovery.recipeId) {
    return dictionary[normalizeLocale(locale)].recipes[discovery.recipeId]?.name ??
      dictionary.en.recipes[discovery.recipeId]?.name ??
      discovery.title;
  }

  if (discovery.baseId) {
    const base = dictionary[normalizeLocale(locale)].options[discovery.baseId]?.name ??
      dictionary.en.options[discovery.baseId]?.name ??
      discovery.title;
    return t(locale, "improvisedDish").replace("{base}", base);
  }

  return discovery.title;
}

export function judgeLine(locale, dish) {
  if (dish.clashes.length > 0) {
    return clashText(locale, dish.clashes[0]).line;
  }

  const tier = tierText(locale, dish.tier);
  const recipe = recipeText(locale, dish.recipe);

  if (recipe) {
    return `${recipe.line} ${tier.line}`;
  }

  return tier.line;
}

export function scoreLine(locale, score) {
  return t(locale, "scoreLine").replace("{score}", score);
}

function byId(collection, id, fallback) {
  return collection[id] ?? fallback;
}

function readPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

const dictionary = {
  ko: {
    ui: {
      documentTitle: "반찬 만들기",
      metaDescription: "한국 반찬을 만드는 작은 웹 게임입니다.",
      brandEyebrow: "작은 주방 게임",
      gameTitle: "반찬 만들기",
      language: "언어",
      languageAria: "언어 선택",
      dishesFound: "발견한 반찬",
      gameAria: "반찬 게임",
      todayTable: "오늘의 밥상",
      statBoard: "현재 반찬 밸런스",
      cookingSteps: "조리 단계",
      nextStep: "다음 단계",
      serveBanchan: "반찬 내기",
      back: "이전",
      sameTable: "같은 밥상",
      newTable: "새 밥상",
      recipeBook: "레시피 노트",
      discoveredBanchan: "발견한 반찬",
      emptyCookbook: "반찬을 내면 노트가 채워져요.",
      scoreLine: "{score}/100 밥상 점수",
      improvisedDish: "즉흥 {base} 반찬"
    },
    stats: {
      crunch: "아삭함",
      heat: "매콤함",
      umami: "감칠맛",
      tang: "새콤함",
      comfort: "편안함"
    },
    requests: {
      "lunch-crunch": {
        title: "도시락의 한 입",
        text: "흰밥이 금방 사라질 만큼 아삭하고 매콤하고 산뜻한 반찬."
      },
      "quiet-rice": {
        title: "조용한 밥친구",
        text: "천천히 먹는 밥 한 그릇에 어울리는 부드럽고 짭조름한 맛."
      },
      "picnic-box": {
        title: "소풍 도시락",
        text: "공원까지 걸어가도 또렷한 새콤함과 아삭함이 살아 있는 반찬."
      },
      "market-night": {
        title: "시장 밤 간식",
        text: "윤기 있고 감칠맛이 깊고, 살짝 매워 집어 먹기 좋은 반찬."
      },
      "rain-window": {
        title: "비 오는 창가 밥상",
        text: "빗소리를 들으며 먹기 좋은 따뜻하고 순한 집밥 맛."
      }
    },
    steps: {
      base: { label: "1단계", prompt: "주재료를 고르세요", track: "재료" },
      prep: { label: "2단계", prompt: "손질 방법을 고르세요", track: "손질" },
      seasoning: { label: "3단계", prompt: "양념을 고르세요", track: "양념" },
      finish: { label: "4단계", prompt: "마무리를 고르세요", track: "마무리" }
    },
    options: {
      cucumber: { name: "오이", secondary: "Oi", caption: "시원하게 아삭" },
      spinach: { name: "시금치", secondary: "Sigeumchi", caption: "부드러운 초록 맛" },
      potato: { name: "감자", secondary: "Gamja", caption: "포근한 한입" },
      anchovy: { name: "멸치", secondary: "Myeolchi", caption: "작지만 고소한 바삭함" },
      tofu: { name: "두부", secondary: "Dubu", caption: "부드러운 네모" },
      radish: { name: "무", secondary: "Mu", caption: "시원한 채 썰기" },
      "salt-squeeze": { name: "소금 절여 짜기", secondary: "Jeorim prep", caption: "더 또렷한 아삭함" },
      blanch: { name: "살짝 데치기", secondary: "Namul prep", caption: "초록빛을 부드럽게" },
      "pan-toast": { name: "팬에 볶기", secondary: "Bokkeum prep", caption: "지글지글 윤기" },
      simmer: { name: "은근히 조리기", secondary: "Jorim prep", caption: "양념이 천천히 배어듦" },
      "quick-pickle": { name: "빠른 절임", secondary: "Jangajji mood", caption: "밝은 새콤함" },
      "cold-toss": { name: "차갑게 무치기", secondary: "Muchim prep", caption: "빠르고 생생하게" },
      "soy-sesame": { name: "간장 참기름", secondary: "Ganjang chamgireum", caption: "고소하고 차분함" },
      "gochugaru-vinegar": { name: "고춧가루 식초", secondary: "Maekom saekom", caption: "빨갛고 산뜻함" },
      "garlic-doenjang": { name: "마늘 된장", secondary: "Doenjang muchim", caption: "구수한 깊이" },
      "perilla-creamy": { name: "들깨 양념", secondary: "Deulkkae", caption: "부드러운 고소함" },
      "honey-soy": { name: "달콤 간장", secondary: "Daljjan jorim", caption: "달짝한 윤기" },
      "kimchi-brine": { name: "김치 국물", secondary: "Gimchi gungmul", caption: "발효된 산뜻함" },
      sesame: { name: "깨 솔솔", secondary: "Kkae", caption: "작은 고소함" },
      scallion: { name: "파채", secondary: "Pa", caption: "초록 향 더하기" },
      "chile-thread": { name: "실고추", secondary: "Silgochu", caption: "마지막 매운빛" },
      seaweed: { name: "김가루", secondary: "Gim", caption: "바다 향 한 꼬집" },
      "pear-sliver": { name: "배채", secondary: "Bae", caption: "시원한 단맛" },
      lunchbox: { name: "도시락 통", secondary: "Dosirak", caption: "정성껏 담기" }
    },
    recipes: {
      "oi-muchim": { name: "오이무침", line: "오이는 아직 아삭하고 양념은 딱 알맞게 붙었어요." },
      "sigeumchi-namul": { name: "시금치나물", line: "부드러운 초록 맛에 양념이 둥글게 감겼어요." },
      "gamja-jorim": { name: "감자조림", line: "감자가 윤기 나게 익어 조용히 밥을 부르네요." },
      "myeolchi-bokkeum": { name: "멸치볶음", line: "작고 윤기 있고 손이 계속 가는 바삭함이에요." },
      "dubu-jorim": { name: "두부조림", line: "두부가 부서지지 않고 양념을 잘 머금었어요." },
      "mu-saengchae": { name: "무생채", line: "무가 밥상 사이를 빨갛고 시원하게 깨워요." }
    },
    clashes: {
      "anchovy-quick-pickle": { line: "빠른 절임 때문에 멸치 맛이 생각보다 날카로워졌어요." },
      "potato-quick-pickle": { line: "감자는 따뜻함을 원했는데 절임이 방향을 갈랐어요." },
      "spinach-simmer": { line: "오래 조리며 시금치의 산뜻함이 사라졌어요." },
      "tofu-salt-squeeze": { line: "두부가 양념을 품기도 전에 힘을 잃었어요." }
    },
    tiers: {
      legend: { rank: "밥상 전설", line: "심사위원이 말하기 전에 밥을 한 숟갈 더 떠요." },
      vanisher: { rank: "밥도둑", line: "균형 좋고 자신감 있어 금방 사라질 맛이에요." },
      winner: { rank: "평일 저녁 우승", line: "또렷한 개성이 있는 든든한 반찬이에요." },
      pinch: { rank: "한 꼬집 더", line: "좋은 생각은 보이지만 밥상이 아직 기다리고 있어요." },
      mystery: { rank: "수수께끼 반찬", line: "대담한 선택이에요. 밥이 조금 긴장했네요." }
    },
    tags: {
      crisp: "아삭",
      spicy: "매콤",
      fresh: "산뜻",
      mellow: "순한맛",
      savory: "감칠맛",
      homey: "집밥",
      tangy: "새콤",
      glossy: "윤기",
      cool: "시원",
      namul: "나물",
      sturdy: "든든",
      snack: "간식",
      soft: "부드러움",
      clean: "깔끔",
      gentle: "순함",
      earthy: "구수함",
      nutty: "고소함",
      pretty: "고명"
    }
  },
  en: {
    ui: {
      documentTitle: "Banchan Maker",
      metaDescription: "A tiny web game about making Korean banchan side dishes.",
      brandEyebrow: "Mini Kitchen Game",
      gameTitle: "Banchan Maker",
      language: "Language",
      languageAria: "Choose language",
      dishesFound: "Dishes Found",
      gameAria: "Banchan game",
      todayTable: "Today's Table",
      statBoard: "Current banchan balance",
      cookingSteps: "Cooking steps",
      nextStep: "Next Step",
      serveBanchan: "Serve Banchan",
      back: "Back",
      sameTable: "Same Table",
      newTable: "New Table",
      recipeBook: "Recipe Book",
      discoveredBanchan: "Discovered Banchan",
      emptyCookbook: "Serve a dish to start the book.",
      scoreLine: "{score}/100 table score",
      improvisedDish: "Improvised {base} Banchan"
    },
    stats: {
      crunch: "Crunch",
      heat: "Heat",
      umami: "Umami",
      tang: "Tang",
      comfort: "Comfort"
    },
    requests: {
      "lunch-crunch": {
        title: "Lunch Tray Spark",
        text: "Crisp, spicy, bright enough to make plain rice vanish."
      },
      "quiet-rice": {
        title: "Quiet Rice Friend",
        text: "Soft, savory, and mellow for a slow bowl of rice."
      },
      "picnic-box": {
        title: "Picnic Box Lift",
        text: "Clean, tangy, and sturdy after a walk to the park."
      },
      "market-night": {
        title: "Market Night Bite",
        text: "Glossy, savory, a little fiery, with enough texture to snack on."
      },
      "rain-window": {
        title: "Rainy Window Table",
        text: "Warm, gentle, and deeply seasoned while the weather drums outside."
      }
    },
    steps: {
      base: { label: "Step 1", prompt: "Choose the main banchan", track: "Base" },
      prep: { label: "Step 2", prompt: "Pick the prep", track: "Prep" },
      seasoning: { label: "Step 3", prompt: "Choose the sauce", track: "Seasoning" },
      finish: { label: "Step 4", prompt: "Finish the dish", track: "Finish" }
    },
    options: {
      cucumber: { name: "Cucumber", secondary: "Oi", caption: "Cool snap" },
      spinach: { name: "Spinach", secondary: "Sigeumchi", caption: "Soft greens" },
      potato: { name: "Potato", secondary: "Gamja", caption: "Cozy cubes" },
      anchovy: { name: "Anchovy", secondary: "Myeolchi", caption: "Tiny crunch" },
      tofu: { name: "Tofu", secondary: "Dubu", caption: "Tender squares" },
      radish: { name: "Radish", secondary: "Mu", caption: "Peppery strips" },
      "salt-squeeze": { name: "Salt & Squeeze", secondary: "Jeorim prep", caption: "Sharper crunch" },
      blanch: { name: "Quick Blanch", secondary: "Namul prep", caption: "Soft and green" },
      "pan-toast": { name: "Pan Toast", secondary: "Bokkeum prep", caption: "Sizzle and gloss" },
      simmer: { name: "Gentle Simmer", secondary: "Jorim prep", caption: "Slow seasoning" },
      "quick-pickle": { name: "Quick Pickle", secondary: "Jangajji mood", caption: "Bright snap" },
      "cold-toss": { name: "Cold Toss", secondary: "Muchim prep", caption: "Fast and lively" },
      "soy-sesame": { name: "Soy Sesame", secondary: "Ganjang chamgireum", caption: "Nutty and calm" },
      "gochugaru-vinegar": { name: "Gochugaru Vinegar", secondary: "Maekom saekom", caption: "Red and bright" },
      "garlic-doenjang": { name: "Garlic Doenjang", secondary: "Doenjang muchim", caption: "Earthy depth" },
      "perilla-creamy": { name: "Perilla Seed", secondary: "Deulkkae", caption: "Soft nutty coat" },
      "honey-soy": { name: "Honey Soy", secondary: "Daljjan jorim", caption: "Sweet gloss" },
      "kimchi-brine": { name: "Kimchi Brine", secondary: "Gimchi gungmul", caption: "Fermented lift" },
      sesame: { name: "Sesame Shower", secondary: "Kkae", caption: "Tiny toast" },
      scallion: { name: "Scallion Curls", secondary: "Pa", caption: "Green lift" },
      "chile-thread": { name: "Chile Threads", secondary: "Silgochu", caption: "A final spark" },
      seaweed: { name: "Seaweed Flakes", secondary: "Gim", caption: "Sea breeze" },
      "pear-sliver": { name: "Pear Slivers", secondary: "Bae", caption: "Cool sweetness" },
      lunchbox: { name: "Lunchbox Tin", secondary: "Dosirak", caption: "Packed with care" }
    },
    recipes: {
      "oi-muchim": { name: "Oi Muchim (오이무침)", line: "The cucumber still snaps, and the sauce clings just enough." },
      "sigeumchi-namul": { name: "Sigeumchi Namul (시금치나물)", line: "Soft greens, rounded seasoning, and a clean finish." },
      "gamja-jorim": { name: "Gamja Jorim (감자조림)", line: "The potatoes turned glossy, tender, and quietly persuasive." },
      "myeolchi-bokkeum": { name: "Myeolchi Bokkeum (멸치볶음)", line: "Tiny, glossy, and ready to disappear by the pinch." },
      "dubu-jorim": { name: "Dubu Jorim (두부조림)", line: "Tender tofu caught the seasoning without falling apart." },
      "mu-saengchae": { name: "Mu Saengchae (무생채)", line: "The radish cuts through the table with a clean red crunch." }
    },
    clashes: {
      "anchovy-quick-pickle": { line: "The quick pickle made the anchovies taste sharper than intended." },
      "potato-quick-pickle": { line: "The potato wanted warmth, but the pickle pulled it in two directions." },
      "spinach-simmer": { line: "The greens lost their spring in the long simmer." },
      "tofu-salt-squeeze": { line: "The tofu gave up before the seasoning settled." }
    },
    tiers: {
      legend: { rank: "Table Legend", line: "The judge reaches for more rice before speaking." },
      vanisher: { rank: "Rice Vanisher", line: "Balanced, confident, and gone faster than expected." },
      winner: { rank: "Weeknight Winner", line: "A dependable banchan with one clear personality." },
      pinch: { rank: "Needs Another Pinch", line: "There is a good idea here, but the table is still waiting." },
      mystery: { rank: "Mystery Side Dish", line: "Bold choices. The rice looks concerned." }
    },
    tags: {
      crisp: "crisp",
      spicy: "spicy",
      fresh: "fresh",
      mellow: "mellow",
      savory: "savory",
      homey: "homey",
      tangy: "tangy",
      glossy: "glossy",
      cool: "cool",
      namul: "namul",
      sturdy: "sturdy",
      snack: "snack",
      soft: "soft",
      clean: "clean",
      gentle: "gentle",
      earthy: "earthy",
      nutty: "nutty",
      pretty: "pretty"
    }
  },
  ja: {
    ui: {
      documentTitle: "パンチャン作り",
      metaDescription: "韓国のおかず、パンチャンを作る小さなウェブゲームです。",
      brandEyebrow: "小さな台所ゲーム",
      gameTitle: "パンチャン作り",
      language: "言語",
      languageAria: "言語を選択",
      dishesFound: "見つけたおかず",
      gameAria: "パンチャンゲーム",
      todayTable: "今日の食卓",
      statBoard: "現在の味バランス",
      cookingSteps: "調理ステップ",
      nextStep: "次の手順",
      serveBanchan: "出す",
      back: "戻る",
      sameTable: "同じ食卓",
      newTable: "新しい食卓",
      recipeBook: "レシピ帳",
      discoveredBanchan: "見つけたパンチャン",
      emptyCookbook: "一品出すとレシピ帳に記録されます。",
      scoreLine: "食卓スコア {score}/100",
      improvisedDish: "即興{base}パンチャン"
    },
    stats: {
      crunch: "歯ごたえ",
      heat: "辛さ",
      umami: "旨み",
      tang: "酸味",
      comfort: "ほっと感"
    },
    requests: {
      "lunch-crunch": {
        title: "お弁当のきらめき",
        text: "白いご飯が進む、歯ごたえがあって辛く明るい一品。"
      },
      "quiet-rice": {
        title: "静かなご飯の友",
        text: "ゆっくり食べるご飯に合う、やわらかく旨みのある味。"
      },
      "picnic-box": {
        title: "ピクニック弁当",
        text: "公園まで歩いても酸味と歯ごたえが残る、すっきりした一品。"
      },
      "market-night": {
        title: "市場の夜のつまみ",
        text: "つややかで旨みが深く、少し辛くてつまみやすい味。"
      },
      "rain-window": {
        title: "雨の日の食卓",
        text: "雨音を聞きながら食べたい、温かくやさしい家庭の味。"
      }
    },
    steps: {
      base: { label: "手順1", prompt: "主役の材料を選んでください", track: "材料" },
      prep: { label: "手順2", prompt: "下ごしらえを選んでください", track: "下準備" },
      seasoning: { label: "手順3", prompt: "味付けを選んでください", track: "味付け" },
      finish: { label: "手順4", prompt: "仕上げを選んでください", track: "仕上げ" }
    },
    options: {
      cucumber: { name: "きゅうり", secondary: "Oi", caption: "涼しい歯ごたえ" },
      spinach: { name: "ほうれん草", secondary: "Sigeumchi", caption: "やわらかな青菜" },
      potato: { name: "じゃがいも", secondary: "Gamja", caption: "ほくほくの一口" },
      anchovy: { name: "煮干し", secondary: "Myeolchi", caption: "小さな香ばしさ" },
      tofu: { name: "豆腐", secondary: "Dubu", caption: "やさしい四角" },
      radish: { name: "大根", secondary: "Mu", caption: "すっきり細切り" },
      "salt-squeeze": { name: "塩もみ", secondary: "Jeorim prep", caption: "はっきりした歯ごたえ" },
      blanch: { name: "さっと茹でる", secondary: "Namul prep", caption: "青さをやわらかく" },
      "pan-toast": { name: "フライパン炒め", secondary: "Bokkeum prep", caption: "香ばしいつや" },
      simmer: { name: "ゆっくり煮る", secondary: "Jorim prep", caption: "味を染み込ませる" },
      "quick-pickle": { name: "浅漬け", secondary: "Jangajji mood", caption: "明るい酸味" },
      "cold-toss": { name: "冷たく和える", secondary: "Muchim prep", caption: "すばやく生き生き" },
      "soy-sesame": { name: "醤油ごま油", secondary: "Ganjang chamgireum", caption: "香ばしく穏やか" },
      "gochugaru-vinegar": { name: "唐辛子酢", secondary: "Maekom saekom", caption: "赤くさわやか" },
      "garlic-doenjang": { name: "にんにく味噌", secondary: "Doenjang muchim", caption: "深いコク" },
      "perilla-creamy": { name: "えごま和え", secondary: "Deulkkae", caption: "やわらかな香ばしさ" },
      "honey-soy": { name: "甘醤油", secondary: "Daljjan jorim", caption: "甘いつや" },
      "kimchi-brine": { name: "キムチ汁", secondary: "Gimchi gungmul", caption: "発酵の明るさ" },
      sesame: { name: "ごまを振る", secondary: "Kkae", caption: "小さな香ばしさ" },
      scallion: { name: "ねぎ", secondary: "Pa", caption: "青い香り" },
      "chile-thread": { name: "糸唐辛子", secondary: "Silgochu", caption: "最後の赤い刺激" },
      seaweed: { name: "海苔ふりかけ", secondary: "Gim", caption: "海の香り" },
      "pear-sliver": { name: "梨の細切り", secondary: "Bae", caption: "涼しい甘み" },
      lunchbox: { name: "弁当箱", secondary: "Dosirak", caption: "丁寧に詰める" }
    },
    recipes: {
      "oi-muchim": { name: "きゅうりの和え物（オイムチム）", line: "きゅうりはまだ歯ごたえがあり、たれもちょうどよく絡んでいます。" },
      "sigeumchi-namul": { name: "ほうれん草ナムル", line: "やわらかな青菜に、丸い味付けがきれいにまとまりました。" },
      "gamja-jorim": { name: "じゃがいもの煮物（カムジャジョリム）", line: "じゃがいもがつやよく煮えて、ご飯を静かに呼んでいます。" },
      "myeolchi-bokkeum": { name: "煮干し炒め（ミョルチポックム）", line: "小さくつややかで、つまむ手が止まらない歯ごたえです。" },
      "dubu-jorim": { name: "豆腐の煮付け（トゥブジョリム）", line: "豆腐が崩れず、味をしっかり含みました。" },
      "mu-saengchae": { name: "大根の辛味和え（ムセンチェ）", line: "大根が赤くすっきりと食卓を起こしてくれます。" }
    },
    clashes: {
      "anchovy-quick-pickle": { line: "浅漬けで煮干しの味が少し鋭くなりすぎました。" },
      "potato-quick-pickle": { line: "じゃがいもは温かさを求めていたのに、酸味が方向を分けました。" },
      "spinach-simmer": { line: "長く煮すぎて、ほうれん草の軽さが消えてしまいました。" },
      "tofu-salt-squeeze": { line: "豆腐が味を抱える前に力を失ってしまいました。" }
    },
    tiers: {
      legend: { rank: "食卓の伝説", line: "審査員は話す前にご飯をもう一口すくいます。" },
      vanisher: { rank: "ご飯泥棒", line: "バランスがよく、自信があって、すぐになくなる味です。" },
      winner: { rank: "平日夜の勝者", line: "はっきりした個性のある頼れる一品です。" },
      pinch: { rank: "もうひとつまみ", line: "いい考えは見えますが、食卓はまだ待っています。" },
      mystery: { rank: "謎のおかず", line: "大胆な選択です。ご飯が少し緊張しています。" }
    },
    tags: {
      crisp: "歯ごたえ",
      spicy: "辛い",
      fresh: "さわやか",
      mellow: "まろやか",
      savory: "旨み",
      homey: "家庭味",
      tangy: "酸味",
      glossy: "つや",
      cool: "涼しい",
      namul: "ナムル",
      sturdy: "しっかり",
      snack: "つまみ",
      soft: "やわらか",
      clean: "すっきり",
      gentle: "やさしい",
      earthy: "深いコク",
      nutty: "香ばしい",
      pretty: "彩り"
    }
  },
  zh: {
    ui: {
      documentTitle: "制作韩式小菜",
      metaDescription: "一个制作韩式小菜 banchan 的小型网页游戏。",
      brandEyebrow: "小厨房游戏",
      gameTitle: "制作韩式小菜",
      language: "语言",
      languageAria: "选择语言",
      dishesFound: "已发现小菜",
      gameAria: "韩式小菜游戏",
      todayTable: "今日餐桌",
      statBoard: "当前小菜平衡",
      cookingSteps: "烹饪步骤",
      nextStep: "下一步",
      serveBanchan: "端上小菜",
      back: "返回",
      sameTable: "同一餐桌",
      newTable: "新餐桌",
      recipeBook: "食谱本",
      discoveredBanchan: "已发现的小菜",
      emptyCookbook: "端上一道菜后，食谱本就会记录它。",
      scoreLine: "{score}/100 餐桌分数",
      improvisedDish: "即兴{base}小菜"
    },
    stats: {
      crunch: "爽脆",
      heat: "辣味",
      umami: "鲜味",
      tang: "酸爽",
      comfort: "温暖感"
    },
    requests: {
      "lunch-crunch": {
        title: "便当里的亮点",
        text: "爽脆、微辣又清新，让白饭很快消失的一道小菜。"
      },
      "quiet-rice": {
        title: "安静的米饭朋友",
        text: "适合慢慢吃一碗饭的柔和咸香味。"
      },
      "picnic-box": {
        title: "野餐便当",
        text: "走到公园后依旧清爽、酸香、结实的小菜。"
      },
      "market-night": {
        title: "夜市小口",
        text: "油亮、咸鲜、带一点辣，还要有能一直夹着吃的口感。"
      },
      "rain-window": {
        title: "雨窗边的餐桌",
        text: "听着雨声时想吃的温和、暖心、入味家常味。"
      }
    },
    steps: {
      base: { label: "步骤 1", prompt: "选择主材料", track: "材料" },
      prep: { label: "步骤 2", prompt: "选择处理方式", track: "处理" },
      seasoning: { label: "步骤 3", prompt: "选择调味", track: "调味" },
      finish: { label: "步骤 4", prompt: "选择收尾", track: "收尾" }
    },
    options: {
      cucumber: { name: "黄瓜", secondary: "Oi", caption: "清爽脆感" },
      spinach: { name: "菠菜", secondary: "Sigeumchi", caption: "柔软青菜" },
      potato: { name: "土豆", secondary: "Gamja", caption: "温和小块" },
      anchovy: { name: "小鱼干", secondary: "Myeolchi", caption: "小小的酥脆" },
      tofu: { name: "豆腐", secondary: "Dubu", caption: "嫩嫩方块" },
      radish: { name: "萝卜", secondary: "Mu", caption: "清爽细丝" },
      "salt-squeeze": { name: "盐腌挤干", secondary: "Jeorim prep", caption: "更鲜明的脆感" },
      blanch: { name: "快速焯烫", secondary: "Namul prep", caption: "柔软又翠绿" },
      "pan-toast": { name: "平底锅炒香", secondary: "Bokkeum prep", caption: "滋滋作响的光泽" },
      simmer: { name: "小火炖煮", secondary: "Jorim prep", caption: "慢慢入味" },
      "quick-pickle": { name: "快速腌渍", secondary: "Jangajji mood", caption: "明亮酸香" },
      "cold-toss": { name: "冷拌", secondary: "Muchim prep", caption: "快速鲜活" },
      "soy-sesame": { name: "酱油芝麻油", secondary: "Ganjang chamgireum", caption: "坚果香又平和" },
      "gochugaru-vinegar": { name: "辣椒粉醋汁", secondary: "Maekom saekom", caption: "红亮清爽" },
      "garlic-doenjang": { name: "蒜香大酱", secondary: "Doenjang muchim", caption: "质朴深味" },
      "perilla-creamy": { name: "紫苏籽调味", secondary: "Deulkkae", caption: "柔和坚果香" },
      "honey-soy": { name: "蜂蜜酱油", secondary: "Daljjan jorim", caption: "甜甜光泽" },
      "kimchi-brine": { name: "泡菜汁", secondary: "Gimchi gungmul", caption: "发酵的提亮感" },
      sesame: { name: "撒芝麻", secondary: "Kkae", caption: "细小焦香" },
      scallion: { name: "葱丝", secondary: "Pa", caption: "绿色提香" },
      "chile-thread": { name: "辣椒丝", secondary: "Silgochu", caption: "最后一点火光" },
      seaweed: { name: "海苔碎", secondary: "Gim", caption: "海风一撮" },
      "pear-sliver": { name: "梨丝", secondary: "Bae", caption: "清凉甜味" },
      lunchbox: { name: "便当盒", secondary: "Dosirak", caption: "细心装好" }
    },
    recipes: {
      "oi-muchim": { name: "凉拌黄瓜（오이무침）", line: "黄瓜依然爽脆，酱汁也刚好挂住。" },
      "sigeumchi-namul": { name: "菠菜拌菜（시금치나물）", line: "柔软青菜和圆润调味收得很干净。" },
      "gamja-jorim": { name: "酱炖土豆（감자조림）", line: "土豆炖得油亮柔软，悄悄把米饭叫来。" },
      "myeolchi-bokkeum": { name: "炒小鱼干（멸치볶음）", line: "小巧、油亮，酥脆得让人一直想夹。" },
      "dubu-jorim": { name: "酱炖豆腐（두부조림）", line: "豆腐没有散开，把调味稳稳吸住了。" },
      "mu-saengchae": { name: "辣拌萝卜丝（무생채）", line: "萝卜用红亮清爽的脆感唤醒整桌菜。" }
    },
    clashes: {
      "anchovy-quick-pickle": { line: "快速腌渍让小鱼干的味道比预想更尖锐。" },
      "potato-quick-pickle": { line: "土豆想要温暖，腌渍的酸味却把方向拉开了。" },
      "spinach-simmer": { line: "久炖让菠菜失去了清新的弹性。" },
      "tofu-salt-squeeze": { line: "豆腐还没来得及吸收调味就先松散了。" }
    },
    tiers: {
      legend: { rank: "餐桌传说", line: "评审还没开口，就先添了一口饭。" },
      vanisher: { rank: "米饭小偷", line: "平衡、自信，很快就会被吃光。" },
      winner: { rank: "平日晚餐赢家", line: "这是一道个性清楚又可靠的小菜。" },
      pinch: { rank: "还差一撮", line: "好想法已经出现了，但餐桌还在等待。" },
      mystery: { rank: "神秘小菜", line: "选择很大胆。米饭看起来有点紧张。" }
    },
    tags: {
      crisp: "爽脆",
      spicy: "微辣",
      fresh: "清新",
      mellow: "柔和",
      savory: "咸鲜",
      homey: "家常",
      tangy: "酸爽",
      glossy: "油亮",
      cool: "清凉",
      namul: "拌菜",
      sturdy: "扎实",
      snack: "小食",
      soft: "柔软",
      clean: "干净",
      gentle: "温和",
      earthy: "质朴",
      nutty: "坚果香",
      pretty: "点缀"
    }
  }
};
