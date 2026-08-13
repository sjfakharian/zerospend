# YouTube narration and timing sheet

Target runtime: 1:34. The video is subtitle-first and works without audio. This script is intended for an optional human voice recording; no artificial voice is generated.

| Time | Visual | Narration |
|---|---|---|
| 00:00–00:05 | One synthetic routing surface activates request, Route A, 429, paid block, Route B, 200 | This free route just hit a rate limit. A normal fallback might go paid. This one is blocked, so the request moves to another verified-free route. |
| 00:05–00:15 | Console appears with strict-free status | This is ZeroSpend, a local router I built around one boundary: a route is eligible only when current evidence says it is free. |
| 00:15–00:32 | The same synthetic Hermes SQL request moves through every routing state | The request is classified as SQL and enters `free-sql`. Route A has current free evidence, but returns 429. That is temporary capacity, not permission to go paid. Route B independently qualifies and returns 200. |
| 00:32–00:46 | Provider and model evidence views | Free endpoints change. Models disappear, providers rate-limit, and catalog evidence becomes stale. ZeroSpend separates cost evidence from availability and refreshes both with bounded checks. |
| 00:46–00:58 | Code, SQL, reasoning, and tools aliases | Classification is deterministic—no second model call. Each task alias has an ordered chain containing only eligible candidates. |
| 00:58–01:24 | Fast console tour: Overview, Providers, Benchmarks, Safety | The console keeps the decision auditable: provider and model, route state, latency, token counts, benchmark signals, and fallback depth. It stores operational metadata, not prompt content. |
| 01:24–01:34 | Repository, local demo commands, zero-route badges | You can run the synthetic demo locally with `npm run demo`. ZeroSpend cannot create free capacity or guarantee future pricing; it makes the fallback boundary explicit. |

## Full narration

This free route just hit a rate limit. A normal fallback might go paid. This one is blocked, so the request moves to another verified-free route.

This is ZeroSpend, a local router I built around one boundary: a route is eligible only when current evidence says it is free.

The request is classified as SQL and enters `free-sql`. Route A has current free evidence, but returns 429. That is temporary capacity, not permission to go paid. Route B independently qualifies and returns 200.

Free endpoints change. Models disappear, providers rate-limit, and catalog evidence becomes stale. ZeroSpend separates cost evidence from availability and refreshes both with bounded checks.

Classification is deterministic—no second model call. Each task alias has an ordered chain containing only eligible candidates.

The console keeps the decision auditable: provider and model, route state, latency, token counts, benchmark signals, and fallback depth. It stores operational metadata, not prompt content.

You can run the synthetic demo locally with `npm run demo`. ZeroSpend cannot create free capacity or guarantee future pricing; it makes the fallback boundary explicit.
