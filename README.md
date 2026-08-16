# gmx-funding-arbitrage

Parent repository that stores both halves of the GMX funding-rate arbitrage stack:

| Directory | Role | Source |
| --- | --- | --- |
| [`funding-rate-arbitrage/`](funding-rate-arbitrage) | Delta-neutral funding-rate searcher (Python) | [PrabodhGyawali/funding-rate-arbitrage](https://github.com/PrabodhGyawali/funding-rate-arbitrage) |
| [`GMX-Arb-UI/`](GMX-Arb-UI) | Dashboard and landing page (TypeScript, Vite) | [PrabodhGyawali/GMX-Arb-UI](https://github.com/PrabodhGyawali/GMX-Arb-UI) |

Both trees were imported with `git subtree`, so this repo contains the files **and** the original commit history.

Imported tips:

- `funding-rate-arbitrage` @ [`a107dff`](https://github.com/PrabodhGyawali/funding-rate-arbitrage/commit/a107dff10197f277bd8f4d384c71b9e3877cc695) (2025-04-07)
- `GMX-Arb-UI` @ [`81d7871`](https://github.com/PrabodhGyawali/GMX-Arb-UI/commit/81d7871848a5073793f7d324217f6d10edff28a1) (2025-01-27)

## Layout

```
.
├── funding-rate-arbitrage/   # bot / backend
└── GMX-Arb-UI/               # frontend
```

## Run each project

### Bot (`funding-rate-arbitrage`)

```bash
cd funding-rate-arbitrage
pip install -r requirements.txt && pip install -e .
cp example.env .env   # fill in keys
project-run-demo
```

See [`funding-rate-arbitrage/README.md`](funding-rate-arbitrage/README.md) and [`funding-rate-arbitrage/docs/`](funding-rate-arbitrage/docs).

### UI (`GMX-Arb-UI`)

```bash
cd GMX-Arb-UI
npm install
npm run dev
```

See [`GMX-Arb-UI/README.md`](GMX-Arb-UI/README.md).

## Pull updates from the source repos

```bash
git subtree pull --prefix=funding-rate-arbitrage https://github.com/PrabodhGyawali/funding-rate-arbitrage.git main
git subtree pull --prefix=GMX-Arb-UI https://github.com/PrabodhGyawali/GMX-Arb-UI.git main
```
