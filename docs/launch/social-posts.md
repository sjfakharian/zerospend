# Social publication drafts

## LinkedIn — concise

I kept running into the same problem with free LLM endpoints: the model that worked yesterday could disappear or start rate-limiting today.

So I built ZeroSpend.

In the synthetic demo, a SQL request hits a verified-free route, receives HTTP 429, blocks the paid branch, and succeeds through a second verified-free route. If no eligible free route remains, it fails instead of spending money silently.

The router and metadata-only console run locally. Provider availability still changes; ZeroSpend makes the boundary visible rather than pretending it does not.

https://github.com/sjfakharian/zerospend

## LinkedIn — technical

My original free-LLM setup was an ordered model list. That worked until the list became stale.

The design question that led to ZeroSpend was: what should fallback mean when the next endpoint might be paid or ambiguously priced?

My answer was to make eligibility separate from availability. A 429 is temporary capacity pressure. It can move a request to another route, but only if that route independently has current zero-cost evidence.

The public demo shows the full synthetic decision:

`SQL → free-sql → Route A → 429 → paid blocked → Route B → 200`

The console records the category, route, status, latency, token counts, attempts, and fallback depth—not prompt content.

I’m interested in feedback on the fail-closed behavior and the evidence you would require before automating a “free” designation.

https://github.com/sjfakharian/zerospend

## X announcement

Yesterday’s free LLM route can be today’s 429.

I built ZeroSpend so fallback means:

free Route A → 429 → paid blocked → free Route B → 200

The demo is synthetic. The policy is real: unknown cost is ineligible.

https://github.com/sjfakharian/zerospend

## X thread

1/ I started ZeroSpend after maintaining one too many stale “free model” lists. A model could disappear, rate-limit, or become ambiguous while the config still looked healthy.

2/ Ordinary fallback says “try the next model.” ZeroSpend asks a second question first: does current evidence still say the next route is free?

3/ The synthetic demo is one request: SQL → Route A → 429 → paid branch blocked → Route B → 200.

4/ Classification is deterministic. The local console records route metadata, latency, token counts, and fallback depth, but not prompts or completions.

5/ The project cannot create capacity or guarantee future provider pricing. I’d like feedback on whether failing closed is the right default. https://github.com/sjfakharian/zerospend
