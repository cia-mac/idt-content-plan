# SESSION_STATE: idt-content-plan (The Brief)
Last updated: 2026-04-02 22:20 PDT

## What this is
Ciamac's internal content pipeline tracker. NOT the Luiz review portal (that is idt-approval).
React + Vite. Deployed to GitHub Pages via GitHub Actions.
Live URL: https://cia-mac.github.io/idt-content-plan/
Repo: https://github.com/cia-mac/idt-content-plan

## Current state
- Last commit: 60a8ed3 — Audit: workflow fixes, color borders, blog card sizing
- All 34 content items in src/data/contentItems.js (April-June 2026 + Ongoing)
- PIN-gated edit mode: 6868 (Ciamac only)
- Two-phase workflow: Pitch phase (Proposals) and Final Approval phase (In Review)

## Workflow
Proposed → Green Light (Luiz) → Greenlit → [Ciamac sends] → In Review → Approved/Revise
- Revise → development section (back to Ciamac)
- On Hold stays in proposals section
- Passed = archived

## Color coding
- Blog: #d4a017 (IDT gold) 4px left border
- LinkedIn: #0a66c2 (blue) 4px left border
- Video: #7d3c98 (purple)
- X: #777 (grey)
- Project: #b8860b (dark gold)

## Next session pick-up
- Verify GitHub Pages deployment is current (Actions should have deployed commit 60a8ed3)
- No code blockers. Ready to show Luiz if needed.
- If adding new content items, edit src/data/contentItems.js only.

## Standing rules
- All Luiz-facing materials: large fonts, large buttons, generous spacing.
- Never touch contentItems.js without explicit instruction to change content.
