# Connecting Data to Models and Agents

Interactive arcade experience for the Red Hat AI Summit Pod, showcasing seven
components that form the "Connecting Data to Models and Agents" pillar.

## Components

| Component | Description | Demo |
|-----------|-------------|------|
| Data Processing | Docling, Kubeflow Spark, RayData | Coming Soon |
| AutoML | Automated ML model development | Video |
| AutoRAG | Automated RAG pipeline optimization | Video |
| Eval Hub | Model, RAG, and agent evaluation | Video |
| SDG | Synthetic data generation | Video |
| Training | Post-training with LoRA/QLoRA, CPT | Coming Soon |
| ITS | Inference-time scaling | Live |

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/CMD/`

## Build for production

```bash
npm run build
npm run preview
```

## Deploy

Pushes to `main` automatically deploy to GitHub Pages via the workflow in
`.github/workflows/deploy.yml`. The site will be available at:

```
https://lukeinglis.github.io/CMD/
```

To enable GitHub Pages, go to **Settings > Pages** in the repo and set the
source to **GitHub Actions**.

## Adding or updating demo links

All component data lives in a single file:

```
src/data/components.ts
```

Each component has these demo-related fields:

```typescript
demoUrl: 'https://...',       // URL to the demo (video or live app)
demoLabel: 'Watch Demo',      // Button text
demoStatus: 'live' | 'video' | 'coming-soon',
```

Change any of these values, rebuild, and push. No other files need editing.

## Adding screenshots or GIFs

1. Place the image in `public/` (e.g., `public/automl-demo.png`)
2. In `src/data/components.ts`, set the component's `image` field to the
   filename (e.g., `image: 'automl-demo.png'`)
3. Optionally set `image2` for a second image below the first

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- GitHub Pages
