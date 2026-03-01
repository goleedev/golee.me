# CLAUDE.md

This file provides context for AI assistants (Claude, Copilot, etc.) working in this repository.

---

## Project Overview

**BagelOS** — a macOS-inspired personal portfolio for Go Lee ([golee.me](https://golee.me)).  
Built with React + TypeScript on the frontend, deployed on Cloudflare Pages, with a separate Cloudflare Worker handling all API routes.

---

## Repository Structure

```
src/
  components/       # React components
  data/             # Static data (blog posts, work experience, etc.)
  hooks/            # Custom React hooks
  types/            # TypeScript types
  utils/            # Utility functions (analytics tracking, etc.)
public/             # Static assets, thumbnails, blog MDX files
```

The `golee-api` Cloudflare Worker is managed **separately** from this repo (via Cloudflare Dashboard). It handles all `/api/*` routes.

---

## Critical Architecture Decisions

### API Routing — Worker, Not Pages Functions

All API logic lives in the `golee-api` Cloudflare Worker, not in `functions/`.

**Do not add files under `functions/api/`.** The `golee-api` Worker intercepts all `golee.me/api/*` traffic. Any Pages Function you add will return 404 because the Worker catches the route first.

To add a new API endpoint, add a new route handler in the `golee-api` Worker:

```js
if (url.pathname === '/api/your-endpoint') {
  return handleYourEndpoint(request, env, corsHeaders);
}
```

Current API routes:

- `POST /api/analytics` — visitor tracking
- `GET  /api/analytics` — analytics data
- `GET  /api/guestbook` — fetch guestbook entries
- `POST /api/guestbook` — submit guestbook entry
- `POST /api/ask` — AI assistant (Workers AI / Llama 3.3 70B)

### AI Assistant — Long Context, Not RAG

The AI assistant uses a ~3,000 token system prompt with all context about Go Lee baked in directly. There is no vector database, no embeddings, no chunking pipeline.

The model (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) has a 128K context window — the system prompt is tiny relative to that. Do not introduce RAG unless the context grows significantly beyond what fits comfortably in the prompt.

### Workers AI Binding

The AI assistant calls Workers AI via `env.AI` binding — no external API key, no `fetch()` to an external endpoint. This binding is configured in the Cloudflare Dashboard under the `golee-api` Worker settings.

```js
const aiResponse = await env.AI.run(
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  { stream: true, messages: [...] }
);
```

---

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (tsc -b && vite build)
```

### Deployment

Push to `main` → Cloudflare Pages auto-builds and deploys.  
Worker changes are deployed separately via the Cloudflare Dashboard.

---

## What Not to Touch

- `src/data/blogPosts.ts` — personal content, do not modify
- `src/data/` in general — biographical and personal data
- `public/thumbnails/` — personal images
- Do not add `functions/api/` files (see API Routing above)
- Do not change the AI model without testing Korean/English/Chinese response quality

---

## TypeScript Config

Three separate tsconfig files:

| File                      | Covers                                  |
| ------------------------- | --------------------------------------- |
| `tsconfig.app.json`       | `src/` — React frontend                 |
| `tsconfig.node.json`      | `vite.config.ts`                        |
| `tsconfig.functions.json` | `functions/` — Cloudflare Workers types |

`@cloudflare/workers-types` and DOM types conflict — keep them in separate tsconfig scopes.

---

## Tech Stack

| Layer    | Tech                                           |
| -------- | ---------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, TailwindCSS        |
| Hosting  | Cloudflare Pages                               |
| API      | Cloudflare Workers (golee-api)                 |
| Database | Cloudflare D1 (SQLite)                         |
| AI       | Cloudflare Workers AI — Llama 3.3 70B fp8-fast |
| Blog     | MDX + React Markdown                           |
