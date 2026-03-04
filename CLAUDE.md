# danielwait.com — Claude Orchestrator Guide

## Project Overview
Personal portfolio site for Daniel Wait. React 18 frontend + Node.js/Express backend + SQLite.

**Live URL:** https://danielwait.com
**Git remote:** https://github.com/danielwait2/danielwaitsitereact.git
**Deploys:** Automatically to Cloudflare Pages on push to `main` via GitHub Actions

---

## Orchestrator Agent Prompt

> You are an orchestrator agent for the personal portfolio site at
> `/Users/danielwait/GitHubRepos/danielwaitsitereact/danielwaitsite`.
>
> **Tech stack:** React 18 (Tailwind CSS, Framer Motion) + Node.js/Express + SQLite.
> **Deployment:** Cloudflare Pages via GitHub Actions on push to `main`. Only the React static build (`client/build`) is deployed — the Node.js backend is not deployed to Cloudflare.
> **Live URL:** https://danielwait.com
> **Git remote:** https://github.com/danielwait2/danielwaitsitereact.git
> **Design system:** Black/white/gray only — no blues, purples, or brand colors anywhere in the UI.
>
> Your job is to improve UX, UI, and repo organization. Spawn parallel subagents:
> - Use `general-purpose` agents for file edits and code changes
> - Use `Explore` agents for codebase research
> - Assign independent tasks to different agents and run them in parallel
> - After all edits, commit with a descriptive message, push to `main`
> - Verify deployment by checking https://github.com/danielwait2/danielwaitsitereact/actions
> - Check the live site at https://danielwait.com after deployment
>
> **Key files:**
> - `client/src/pages/` — all React pages (Home, WaitList, WaitWorks, Resume, Projects, Contact, AdminPanel, etc.)
> - `client/src/components/` — Navbar, Footer
> - `client/src/index.css` — Tailwind component classes (card-modern, btn-modern, gradient-text, etc.)
> - `client/src/utils/api.js` — Axios instance for API calls
> - `server/index.js` — Express server (port 6000)
> - `.github/workflows/deploy.yml` — CI/CD: builds React app, deploys to Cloudflare Pages
>
> **Rules:**
> - Never introduce colors outside the black/white/gray palette
> - Keep the codebase minimal — delete anything that isn't actively used
> - Don't add features unless explicitly requested
> - Always read files before editing them
> - Don't create new documentation files

---

## Architecture Notes

- **Frontend only** is deployed to Cloudflare Pages (the `client/build` output)
- The Node.js backend (`server/`) handles the WaitList links and analytics — it runs separately if needed
- The SQLite database (`database.db`) stores links, clicks, page views, and admin credentials
- Admin panel is at `/admin` (protected by JWT cookie auth)

## Design System

All custom Tailwind classes are defined in `client/src/index.css`:
- `.card-modern` — white/dark card with rounded corners and shadow
- `.btn-modern` — black/white filled button
- `.btn-modern-outline` — black/white outlined button
- `.gradient-text` — bold black (light) / white (dark) text
- `.gradient-primary` — black (light) / white (dark) background
- `.input-modern` — styled form input
