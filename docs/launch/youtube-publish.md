# YouTube publication package

## Candidate titles

1. **The Free Model Hit a Rate Limit. My Router Refused to Go Paid.** — recommended
2. I Built an LLM Router That Blocks Paid Fallbacks
3. What Happens When a Free LLM Route Returns 429?
4. ZeroSpend: Routing Only Through Verified-Free LLM Capacity
5. Building a Free-Only LLM Router Without a Model List

## Description

I kept hitting the same problem with free LLM endpoints: a model that worked yesterday could disappear, become ambiguous, or start returning 429s today.

ZeroSpend is the local router I built around one rule: a route is not eligible unless current evidence says it is free. In this synthetic demo, a SQL request reaches a verified-free route, gets HTTP 429, blocks the paid branch, and succeeds through a second verified-free route.

Repository: https://github.com/sjfakharian/zerospend
Documentation: https://sjfakharian.github.io/zerospend/

Try the synthetic demo:

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
npm run demo
```

Chapters:

- 00:00 A free route returns 429
- 00:05 What ZeroSpend is
- 00:15 One continuous routing decision
- 00:32 Why current evidence matters
- 00:46 Deterministic task aliases
- 00:58 Console and routing metadata
- 01:24 Try the synthetic demo

The request, model names, provider state, and 429 in the video are synthetic. Provider free tiers and availability change independently of ZeroSpend. The project does not create free capacity or guarantee future pricing; it prevents unknown or paid routes from silently entering its fallback chain.

ZeroSpend is open source under the MIT License. It is not endorsed by the providers or clients it can integrate with.

## Tags

ZeroSpend, LLM router, free LLM API, OpenAI compatible, model routing, LLM observability, open source AI, local AI tooling
