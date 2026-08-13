# Reddit publication drafts

## r/LocalLLaMA

**Title:** I built a router for when yesterday’s free model disappears or starts returning 429

I kept maintaining lists of free endpoints, and the list was usually stale before the config was. A model would vanish, an offer would change, or the first request of the day would hit a rate limit.

ZeroSpend is my attempt to make that failure explicit. It classifies a request locally with deterministic rules, selects a task alias, and only tries routes backed by current zero-cost evidence. If Route A returns 429, Route B must independently qualify as free. The router will fail rather than unlock a paid fallback.

The demo shows a synthetic SQL request going Route A → 429 → paid branch blocked → Route B → 200. No real provider outage is implied.

Repo: https://github.com/sjfakharian/zerospend

Would you prefer this fail-closed behavior, or an opt-in paid ceiling? Also curious which provider evidence you consider trustworthy enough for automation.

## r/selfhosted

**Title:** ZeroSpend: a loopback-only control plane for free LLM routes

This is my project. I wanted routing policy, credentials, and operational history to stay on my machine even when inference uses external free endpoints.

The router and console bind to `127.0.0.1` by default. Clients use one local OpenAI-compatible endpoint. The local event store keeps route metadata—provider/model, status, latency, token counts, attempts, fallback depth—but excludes prompts, completions, SQL, and tool payloads.

The other boundary is cost: unknown pricing is treated as ineligible. A temporary 429 may move to another verified-free route, never silently to paid capacity.

The launch demo is deterministic and synthetic. Repo: https://github.com/sjfakharian/zerospend

I’d appreciate feedback on the local security boundary, service packaging, and what metadata you would retain for debugging.

## General LLM/developer community

**Title:** What should an LLM router do when every “free” route is uncertain?

I built ZeroSpend because ordinary fallback logic answered that question too casually: try the next model. But the next model might be paid, ambiguously priced, or based on stale catalog data.

ZeroSpend gives each route an eligibility check. A synthetic example in the demo is:

`SQL → verified-free A → 429 → paid blocked → verified-free B → 200`

Classification is deterministic, not another LLM call. The console shows why a route was selected and records operational metadata without request content.

This is my project, and the demo/provider data is synthetic: https://github.com/sjfakharian/zerospend

I’m looking for critique of the error contract and evidence model, especially from people building multi-provider clients.
