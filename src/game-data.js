export const statKeys = ["crunch", "heat", "umami", "tang", "comfort"];

export const requests = [
  {
    id: "lunch-crunch",
    title: "Lunch Tray Spark",
    text: "Crisp, spicy, bright enough to make plain rice vanish.",
    target: { crunch: 8, heat: 6, umami: 5, tang: 4, comfort: 3 },
    tags: ["crisp", "spicy", "fresh"]
  },
  {
    id: "quiet-rice",
    title: "Quiet Rice Friend",
    text: "Soft, savory, and mellow for a slow bowl of rice.",
    target: { crunch: 2, heat: 1, umami: 7, tang: 2, comfort: 8 },
    tags: ["mellow", "savory", "homey"]
  },
  {
    id: "picnic-box",
    title: "Picnic Box Lift",
    text: "Clean, tangy, and sturdy after a walk to the park.",
    target: { crunch: 7, heat: 3, umami: 4, tang: 7, comfort: 3 },
    tags: ["fresh", "tangy", "crisp"]
  },
  {
    id: "market-night",
    title: "Market Night Bite",
    text: "Glossy, savory, a little fiery, with enough texture to snack on.",
    target: { crunch: 6, heat: 5, umami: 8, tang: 2, comfort: 5 },
    tags: ["savory", "spicy", "glossy"]
  },
  {
    id: "rain-window",
    title: "Rainy Window Table",
    text: "Warm, gentle, and deeply seasoned while the weather drums outside.",
    target: { crunch: 2, heat: 2, umami: 6, tang: 1, comfort: 9 },
    tags: ["homey", "mellow", "savory"]
  }
];

export const steps = [
  {
    id: "base",
    label: "Step 1",
    prompt: "Choose the main banchan",
    options: [
      {
        id: "cucumber",
        name: "Cucumber",
        korean: "Oi",
        caption: "Cool snap",
        color: "#5fb879",
        accent: "#e7f6cd",
        shape: "rounds",
        stats: { crunch: 4, heat: 0, umami: 0, tang: 1, comfort: 1 },
        tags: ["fresh", "crisp", "cool"]
      },
      {
        id: "spinach",
        name: "Spinach",
        korean: "Sigeumchi",
        caption: "Soft greens",
        color: "#287c55",
        accent: "#8ed1a3",
        shape: "ribbons",
        stats: { crunch: 0, heat: 0, umami: 1, tang: 0, comfort: 3 },
        tags: ["mellow", "namul", "fresh"]
      },
      {
        id: "potato",
        name: "Potato",
        korean: "Gamja",
        caption: "Cozy cubes",
        color: "#d8ad42",
        accent: "#fff3b5",
        shape: "cubes",
        stats: { crunch: 0, heat: 0, umami: 1, tang: 0, comfort: 4 },
        tags: ["homey", "mellow", "sturdy"]
      },
      {
        id: "anchovy",
        name: "Anchovy",
        korean: "Myeolchi",
        caption: "Tiny crunch",
        color: "#a8b6bd",
        accent: "#f3f5f2",
        shape: "slivers",
        stats: { crunch: 3, heat: 0, umami: 4, tang: 0, comfort: 1 },
        tags: ["savory", "crisp", "snack"]
      },
      {
        id: "tofu",
        name: "Tofu",
        korean: "Dubu",
        caption: "Tender squares",
        color: "#eee4c8",
        accent: "#fff8df",
        shape: "slabs",
        stats: { crunch: 0, heat: 0, umami: 2, tang: 0, comfort: 3 },
        tags: ["mellow", "savory", "soft"]
      },
      {
        id: "radish",
        name: "Radish",
        korean: "Mu",
        caption: "Peppery strips",
        color: "#f4f0df",
        accent: "#bde2c5",
        shape: "sticks",
        stats: { crunch: 3, heat: 0, umami: 0, tang: 2, comfort: 1 },
        tags: ["fresh", "crisp", "tangy"]
      }
    ]
  },
  {
    id: "prep",
    label: "Step 2",
    prompt: "Pick the prep",
    options: [
      {
        id: "salt-squeeze",
        name: "Salt & Squeeze",
        korean: "Jeorim prep",
        caption: "Sharper crunch",
        color: "#7fb9b2",
        stats: { crunch: 2, heat: 0, umami: 0, tang: 1, comfort: 0 },
        tags: ["crisp", "fresh", "clean"]
      },
      {
        id: "blanch",
        name: "Quick Blanch",
        korean: "Namul prep",
        caption: "Soft and green",
        color: "#4d9b67",
        stats: { crunch: -1, heat: 0, umami: 1, tang: 0, comfort: 2 },
        tags: ["mellow", "namul", "gentle"]
      },
      {
        id: "pan-toast",
        name: "Pan Toast",
        korean: "Bokkeum prep",
        caption: "Sizzle and gloss",
        color: "#c87433",
        stats: { crunch: 2, heat: 1, umami: 2, tang: 0, comfort: 1 },
        tags: ["crisp", "savory", "glossy"]
      },
      {
        id: "simmer",
        name: "Gentle Simmer",
        korean: "Jorim prep",
        caption: "Slow seasoning",
        color: "#93613f",
        stats: { crunch: -2, heat: 0, umami: 2, tang: 0, comfort: 3 },
        tags: ["homey", "savory", "glossy"]
      },
      {
        id: "quick-pickle",
        name: "Quick Pickle",
        korean: "Jangajji mood",
        caption: "Bright snap",
        color: "#d5b536",
        stats: { crunch: 1, heat: 0, umami: 0, tang: 3, comfort: -1 },
        tags: ["tangy", "fresh", "crisp"]
      },
      {
        id: "cold-toss",
        name: "Cold Toss",
        korean: "Muchim prep",
        caption: "Fast and lively",
        color: "#df715f",
        stats: { crunch: 1, heat: 1, umami: 0, tang: 1, comfort: 0 },
        tags: ["fresh", "spicy", "tangy"]
      }
    ]
  },
  {
    id: "seasoning",
    label: "Step 3",
    prompt: "Choose the sauce",
    options: [
      {
        id: "soy-sesame",
        name: "Soy Sesame",
        korean: "Ganjang chamgireum",
        caption: "Nutty and calm",
        color: "#5b3829",
        stats: { crunch: 0, heat: 0, umami: 3, tang: 0, comfort: 2 },
        tags: ["savory", "mellow", "nutty"]
      },
      {
        id: "gochugaru-vinegar",
        name: "Gochugaru Vinegar",
        korean: "Maekom saekom",
        caption: "Red and bright",
        color: "#c7352f",
        stats: { crunch: 1, heat: 4, umami: 1, tang: 2, comfort: 0 },
        tags: ["spicy", "tangy", "fresh"]
      },
      {
        id: "garlic-doenjang",
        name: "Garlic Doenjang",
        korean: "Doenjang muchim",
        caption: "Earthy depth",
        color: "#8d6a32",
        stats: { crunch: 0, heat: 1, umami: 4, tang: 0, comfort: 2 },
        tags: ["savory", "homey", "earthy"]
      },
      {
        id: "perilla-creamy",
        name: "Perilla Seed",
        korean: "Deulkkae",
        caption: "Soft nutty coat",
        color: "#b7ad8a",
        stats: { crunch: 0, heat: -1, umami: 2, tang: 0, comfort: 3 },
        tags: ["mellow", "nutty", "homey"]
      },
      {
        id: "honey-soy",
        name: "Honey Soy",
        korean: "Daljjan jorim",
        caption: "Sweet gloss",
        color: "#b8791c",
        stats: { crunch: 1, heat: 0, umami: 2, tang: 0, comfort: 2 },
        tags: ["glossy", "savory", "homey"]
      },
      {
        id: "kimchi-brine",
        name: "Kimchi Brine",
        korean: "Gimchi gungmul",
        caption: "Fermented lift",
        color: "#d74b3f",
        stats: { crunch: 0, heat: 2, umami: 2, tang: 3, comfort: 0 },
        tags: ["spicy", "tangy", "savory"]
      }
    ]
  },
  {
    id: "finish",
    label: "Step 4",
    prompt: "Finish the dish",
    options: [
      {
        id: "sesame",
        name: "Sesame Shower",
        korean: "Kkae",
        caption: "Tiny toast",
        color: "#f4e0a7",
        stats: { crunch: 1, heat: 0, umami: 1, tang: 0, comfort: 1 },
        tags: ["nutty", "savory", "homey"]
      },
      {
        id: "scallion",
        name: "Scallion Curls",
        korean: "Pa",
        caption: "Green lift",
        color: "#3b9e5f",
        stats: { crunch: 1, heat: 0, umami: 0, tang: 1, comfort: 0 },
        tags: ["fresh", "crisp", "clean"]
      },
      {
        id: "chile-thread",
        name: "Chile Threads",
        korean: "Silgochu",
        caption: "A final spark",
        color: "#d8342f",
        stats: { crunch: 0, heat: 2, umami: 0, tang: 0, comfort: 0 },
        tags: ["spicy", "pretty", "fresh"]
      },
      {
        id: "seaweed",
        name: "Seaweed Flakes",
        korean: "Gim",
        caption: "Sea breeze",
        color: "#253b35",
        stats: { crunch: 1, heat: 0, umami: 2, tang: 0, comfort: 0 },
        tags: ["savory", "crisp", "snack"]
      },
      {
        id: "pear-sliver",
        name: "Pear Slivers",
        korean: "Bae",
        caption: "Cool sweetness",
        color: "#f2efb9",
        stats: { crunch: 2, heat: 0, umami: 0, tang: 1, comfort: 1 },
        tags: ["fresh", "crisp", "mellow"]
      },
      {
        id: "lunchbox",
        name: "Lunchbox Tin",
        korean: "Dosirak",
        caption: "Packed with care",
        color: "#7d91a8",
        stats: { crunch: 0, heat: 0, umami: 0, tang: 0, comfort: 2 },
        tags: ["homey", "sturdy", "mellow"]
      }
    ]
  }
];

export const recipeMatches = [
  {
    id: "oi-muchim",
    name: "Oi Muchim",
    korean: "오이무침",
    base: ["cucumber"],
    prep: ["salt-squeeze", "cold-toss", "quick-pickle"],
    seasoning: ["gochugaru-vinegar", "soy-sesame", "kimchi-brine"],
    finish: ["sesame", "scallion", "chile-thread"],
    bonus: 13,
    tags: ["fresh", "crisp", "spicy"],
    line: "The cucumber still snaps, and the sauce clings just enough."
  },
  {
    id: "sigeumchi-namul",
    name: "Sigeumchi Namul",
    korean: "시금치나물",
    base: ["spinach"],
    prep: ["blanch"],
    seasoning: ["soy-sesame", "garlic-doenjang", "perilla-creamy"],
    finish: ["sesame", "scallion"],
    bonus: 14,
    tags: ["mellow", "savory", "homey"],
    line: "Soft greens, rounded seasoning, and a clean finish."
  },
  {
    id: "gamja-jorim",
    name: "Gamja Jorim",
    korean: "감자조림",
    base: ["potato"],
    prep: ["simmer"],
    seasoning: ["soy-sesame", "honey-soy", "garlic-doenjang"],
    finish: ["sesame", "lunchbox"],
    bonus: 13,
    tags: ["homey", "glossy", "savory"],
    line: "The potatoes turned glossy, tender, and quietly persuasive."
  },
  {
    id: "myeolchi-bokkeum",
    name: "Myeolchi Bokkeum",
    korean: "멸치볶음",
    base: ["anchovy"],
    prep: ["pan-toast"],
    seasoning: ["honey-soy", "soy-sesame", "gochugaru-vinegar"],
    finish: ["sesame", "seaweed", "chile-thread"],
    bonus: 15,
    tags: ["crisp", "savory", "snack"],
    line: "Tiny, glossy, and ready to disappear by the pinch."
  },
  {
    id: "dubu-jorim",
    name: "Dubu Jorim",
    korean: "두부조림",
    base: ["tofu"],
    prep: ["simmer", "pan-toast"],
    seasoning: ["soy-sesame", "gochugaru-vinegar", "garlic-doenjang"],
    finish: ["scallion", "chile-thread", "sesame"],
    bonus: 12,
    tags: ["savory", "homey", "spicy"],
    line: "Tender tofu caught the seasoning without falling apart."
  },
  {
    id: "mu-saengchae",
    name: "Mu Saengchae",
    korean: "무생채",
    base: ["radish"],
    prep: ["salt-squeeze", "cold-toss", "quick-pickle"],
    seasoning: ["gochugaru-vinegar", "kimchi-brine"],
    finish: ["scallion", "sesame", "pear-sliver"],
    bonus: 14,
    tags: ["crisp", "tangy", "spicy"],
    line: "The radish cuts through the table with a clean red crunch."
  }
];

export const clashRules = [
  {
    ids: ["anchovy", "quick-pickle"],
    penalty: -9,
    line: "The quick pickle made the anchovies taste sharper than intended."
  },
  {
    ids: ["potato", "quick-pickle"],
    penalty: -7,
    line: "The potato wanted warmth, but the pickle pulled it in two directions."
  },
  {
    ids: ["spinach", "simmer"],
    penalty: -6,
    line: "The greens lost their spring in the long simmer."
  },
  {
    ids: ["tofu", "salt-squeeze"],
    penalty: -5,
    line: "The tofu gave up before the seasoning settled."
  }
];

export const tiers = [
  {
    min: 90,
    rank: "Table Legend",
    line: "The judge reaches for more rice before speaking."
  },
  {
    min: 76,
    rank: "Rice Vanisher",
    line: "Balanced, confident, and gone faster than expected."
  },
  {
    min: 61,
    rank: "Weeknight Winner",
    line: "A dependable banchan with one clear personality."
  },
  {
    min: 43,
    rank: "Needs Another Pinch",
    line: "There is a good idea here, but the table is still waiting."
  },
  {
    min: 0,
    rank: "Mystery Side Dish",
    line: "Bold choices. The rice looks concerned."
  }
];
