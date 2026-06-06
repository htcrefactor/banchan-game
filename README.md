# Banchan Maker

Banchan Maker is a small web-based cooking game about making Korean side dishes. Pick a main ingredient, prep style, sauce, and finishing touch, then a judge scores the banchan for crunch, heat, umami, tang, and comfort.

## Game Concept

- The game borrows the classic staged cooking rhythm of old Korean Flash recipe games without using their names, art, story, or assets.
- Each round starts with a different table request, such as crunchy and spicy or quiet and comforting.
- The player makes one banchan through four choices: main ingredient, prep, sauce, and finish.
- The scoring engine rewards stat balance, request tag matches, and recognizable banchan combinations like oi muchim, sigeumchi namul, gamja jorim, myeolchi bokkeum, dubu jorim, and mu saengchae.
- Discovered dishes are saved in local storage as a tiny recipe book.

## Implementation

- Static HTML, CSS, and JavaScript modules.
- No build step or runtime dependencies.
- `src/game-data.js` contains ingredients, requests, recipe matches, and tier text.
- `src/game-logic.js` contains stat combining, recipe matching, scoring, and judge output.
- `src/app.js` renders the playable UI and saves discovered dishes.
- GitHub Pages deploys the repository root through `.github/workflows/pages.yml`.

## Local Development

```bash
npm test
npm start
```

Then open `http://localhost:4173`.
