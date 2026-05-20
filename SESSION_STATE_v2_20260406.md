---
workflow_step: waiting_on_luiz_email_send
agent_type: execute
token_budget: deep
last_updated: 2026-04-06
---

# SESSION_STATE: idt-content-plan (The Brief)
Last updated: 2026-04-06 12:30 PDT

## What this is
Ciamac's internal content pipeline tracker. NOT the Luiz review portal (that is idt-approval).
React + Vite. Deployed to GitHub Pages via GitHub Actions.
Live URL: https://cia-mac.github.io/idt-content-plan/
Repo: https://github.com/cia-mac/idt-content-plan

## Current state
- Last commit: 1340c48 — Added AI prompt bar (PromptBar component + Cloudflare Worker)
- All 34 content items in src/data/contentItems.js (April-June 2026 + Ongoing)
- PIN-gated edit mode: 6868 (Ciamac only)
- Two-phase workflow: Pitch phase (Proposals) and Final Approval phase (In Review)
- AI prompt bar added to top of app (queries pipeline state via Cloudflare Worker)

## Workflow
Proposed > Green Light (Luiz) > Greenlit > [Ciamac sends] > In Review > Approved/Revise
- Revise > development section (back to Ciamac)
- On Hold stays in proposals section
- Passed = archived

## Email to Luiz
- Gmail draft created (draft ID: r-9112387093592098405)
- To: luiz@idtvision.com
- Subject: Content strategy. Need your input.
- Final version: v8 (~/Desktop/Email_to_Luiz_SEO_Strategy_v8_final.md)
- NEEDS: Attach IDT_Content_Queue_v2.xlsx from Desktop before sending
- Asks: go-ahead on keyword research, dealer search terms, pick 4 LinkedIn + 2 Blog

## AI Prompt Bar
- Component: src/App.jsx (PromptBar, ~lines 459-537)
- Styles: src/App.css (.prompt-bar, .prompt-input-row, etc.)
- Worker: worker/src/index.js (Cloudflare Worker, pipeline-ai)
- Worker config: worker/wrangler.toml
- WORKER NOT YET DEPLOYED. Steps: cd worker && npm install && npx wrangler login && npx wrangler secret put ANTHROPIC_API_KEY && npx wrangler deploy

## Artifacts on Desktop
- Email_to_Luiz_SEO_Strategy_v1 through v8_final.md (v8 is final)
- IDT_Content_Queue_v1.xlsx (original, 33 items)
- IDT_Content_Queue_v2.xlsx (revised, 32 items, grouped by category, larger fonts)

## Blockers
- Cloudflare Worker needs deployment (wrangler)
- ciamac-portal .env.local still has OLD deleted Anthropic API key. Console Rewrite button broken until new key pasted.

## Next session pick-up
- Confirm email was sent and Excel attached
- Deploy the Cloudflare Worker
- After Luiz responds with picks, update Content Queue in Notion and contentItems.js
- If adding new content items, edit src/data/contentItems.js only

## Standing rules
- All Luiz-facing materials: large fonts, large buttons, generous spacing.
- Never touch contentItems.js without explicit instruction to change content.
