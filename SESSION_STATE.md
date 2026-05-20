---
workflow_step: waiting_on_luiz_specs_for_osg_post
agent_type: execute
token_budget: standard
last_updated: 2026-05-02
---

# SESSION_STATE: idt-content-plan (The Brief)
Last updated: 2026-05-02 19:30 PDT

## What this is
Ciamac's internal content pipeline tracker. NOT the Luiz review portal (that is idt-approval).
React + Vite. Deployed to GitHub Pages via GitHub Actions.
Live URL: https://cia-mac.github.io/idt-content-plan/
Repo: https://github.com/cia-mac/idt-content-plan

## Current Objective
Ship the OSG drone payload LinkedIn announcement post. v5 locked at 8.2/10. Fill-in-the-blank template prepared for Luiz to populate with specs (product name, weight, compatible heads, max FPS at resolution). Gemini's v5 review proposed five additional placeholders to consider before finalizing the template.

## Last Completed Action
Ran Gemini consult (gemini_consult / gemini-2.5-flash) on the v5 fill-in draft. Gemini confirmed the four placeholders are well-positioned (frame rate prominent within mobile 7-second scan window, product name placement OK for SEO without repetition) and proposed five additional placeholders worth considering: dimensions, internal recording memory, max power draw, lens mount, operating temperature range.

## Open Blockers
- [ ] Luiz has not provided specs (product name, weight, head models, max FPS at resolution)
- [ ] Founder clarification still outstanding from prior reviews: thermal management, IP-67 seal-break protocol (deliberately deferred to product page, not the post)
- [ ] Discrepancy: prompt to Gemini described three [PRODUCT NAME] references; Gemini counted only two. Verify the locked v5 draft.

## Next Actions (Ordered)
1. Decide which (if any) of Gemini's five suggested placeholders to add to the template before sending to Luiz: dimensions, internal memory, max power draw, lens mount, operating temp range
2. Verify product name reference count in v5 (two vs three)
3. Send fill-in template to Luiz with spec request (use Luiz email path, not WhatsApp)
4. On Luiz response: replace placeholders, run final voice/banned-word check, publish to LinkedIn under IDT account
5. Log post performance after 72 hours (impressions, comments from range-test engineers)

## Decisions Made This Session
- v5 closing trilemma question ("frame rate, resolution, or duration?") locked. Gemini and GPT both flagged RF bandwidth could be added; Ciamac's call retained the three-axis version.
- "Ruggedized" dropped from v5 unless founder supplies shock/vibe/temp/IP rating to support it.
- Two-architecture comparison block (onboard recording vs live RF downlink) retained.
- Voice rules held: third-person IDT, no em dashes, banned hype words list enforced.
- Fill-in template approach chosen over speculative spec-filling. Founder owns numbers.

## Active Branches / Files in Play
- Branch: main
- Uncommitted changes: SESSION_STATE.md (this file), src/data/contentItems.js
- Untracked: .claude/, README.md, src/assets/
- LinkedIn draft text not yet committed to repo. Lives in chat session memory only. RECOMMEND: save v5 + fill-in template to a file in this repo before next session ends.

## Known Fragile Areas
- LinkedIn drafts are not version-controlled in this repo yet. v1-v5 history exists only in chat transcript. Risk: lose draft history on session compaction.
- Cloudflare Worker for AI prompt bar still not deployed (carryover from 2026-04-06 state).
- ciamac-portal .env.local still has OLD deleted Anthropic API key (carryover blocker).

## Context the Next Session Needs
- Five review rounds completed on the post. Reviewers: self + Gemini (rounds 1, 3, 5) + GPT (round 4). Trajectory: initial draft → 7.x → 8.0 (v3) → 8.2 (v5 locked).
- Forgery threat layer applies: any specs Luiz returns via screenshot or photo of an internal document should be treated as a claim, not evidence. Push for original spec sheet PDF or direct text.
- Standing rule: do not publish to LinkedIn under IDT account without Luiz's explicit approval of the final populated draft.

## Standing rules
- All Luiz-facing materials: large fonts, large buttons, generous spacing.
- Never touch contentItems.js without explicit instruction to change content.
- LinkedIn drafts: third-person IDT voice, no em dashes, no marketing hype.
