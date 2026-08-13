# Show HN package

## Title

Show HN: ZeroSpend – an LLM router that refuses paid fallback

## Post

I built ZeroSpend after repeatedly finding that my “free model” configuration was really a stale snapshot. A model could disappear, a provider could start rate-limiting it, or the pricing evidence could become unclear.

The rule I ended up with is plain: if ZeroSpend cannot currently verify a route as free, that route is not eligible. When a verified-free route returns 429, the router can try another verified-free candidate. It does not quietly switch to something paid; if the free chain is exhausted, the request fails.

The router exposes one local OpenAI-compatible endpoint. Classification is deterministic—tools, structured output, long context, SQL, code, reasoning, fast, then general—and each alias has an ordered candidate list. A loopback console shows the routing decision, evidence, latency, token counts, and fallback depth without storing prompts or completions.

The public demo is synthetic: one SQL request, a simulated 429, a blocked paid branch, and a successful verified-free fallback. It is not a report of a provider outage.

Repo: https://github.com/sjfakharian/zerospend

I would value feedback on three things:

1. Is failing closed the right default when free capacity is exhausted?
2. What evidence would you want to see before trusting a route marked free?
3. Is the metadata enough to debug routing without retaining request content?
