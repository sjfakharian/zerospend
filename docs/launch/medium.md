# I Built ZeroSpend After My “Free Model” List Kept Going Stale

## The problem I hit

My first free-LLM setup was ordinary fallback routing: keep a list of endpoints and try the next one when the first fails. It looked sensible in a configuration file. In practice, the list described yesterday.

A model would disappear. A provider would return HTTP 429 for the current window. An identifier still containing “free” would no longer be enough evidence to trust the cost. The endpoint could even respond successfully while the pricing evidence remained ambiguous.

The routing problem was not just availability. It was deciding which routes were allowed to receive a request at all.

## Why ordinary fallback was not enough

Most fallback code treats every candidate as interchangeable. That is useful when the only goal is getting a response. It is dangerous when one of the constraints is “do not spend money.”

If a free route fails and the next configured model is paid, a successful fallback is still a policy failure. I did not want a warning after the request. I wanted the paid route excluded before routing began.

That led to ZeroSpend: one local OpenAI-compatible endpoint with task aliases whose candidate chains contain only routes that currently meet the project’s free-evidence rules.

## The rule I ended up enforcing

The internal rule is written as `UNKNOWN COST = NOT FREE`.

That wording is intentionally conservative. It does not mean ZeroSpend can guarantee future pricing. It means uncertainty does not qualify a route for production. A route also needs availability and production eligibility before it can enter a fallback chain.

HTTP 429 is treated as temporary capacity pressure. It does not permanently invalidate a model. ZeroSpend can try another distinct candidate, but that candidate must independently pass the same free-route checks. If the chain is exhausted, the request fails with `FREE_CAPACITY_UNAVAILABLE`.

## What broke while I was building it

The useful design decisions mostly came from failures, not the original architecture sketch.

An unsupported model response, HTTP 406, initially looked similar to every other provider rejection. It was not. A stale model can justify a bounded inventory refresh; a 429 should record temporary state without deleting the model’s free evidence. Mixing those cases produced the wrong recovery behavior.

Discovery jobs also needed locks. Then the locks themselves became a failure mode: a killed process could leave stale state behind, while a malformed but recent lock might belong to work still starting. The final logic distinguishes live, dead, interrupted, recent malformed, and expired malformed locks, and retries stale recovery only once.

Local backend authentication created another confusing case. The catalog, free extraction, and local mapping could all work while the actual bounded chat probe returned 401. Reporting “provider unavailable” hid the useful fact. The diagnostic result now separates backend reachability, catalog reachability, mapping, authentication, probe status, and production eligibility.

## OpenCode and 9Router lessons

OpenCode Free is an advanced path through optional local 9Router. The first mistake would have been to hardcode a model that happened to work during development. That model list changes.

The adapter now reads current provider evidence, maps eligible candidates into the local 9Router namespace, and probes only a small number of distinct candidates. OpenCode Zen is not a substitute fallback. A model name alone is not authoritative evidence.

The separation matters when the official catalog is reachable but local capacity is rate-limited. That is a temporary-capacity result, not a configuration error and not permission to widen the route set.

## Rate limits and stale free-model lists

The deterministic launch demo makes this behavior visible without claiming a real outage:

`Hermes → SQL → free-sql → synthetic Route A → 429 → paid blocked → synthetic Route B → 200`

The console row then records the provider/model route, latency, token counts, attempts, and fallback depth. The prompt itself is not stored.

That sequence is deliberately small because it captures the whole policy. Availability can change while cost evidence remains valid. The router may continue within the verified-free set, but it cannot invent capacity and cannot silently go paid.

## The clean-machine Mac test

The most valuable testing happened away from my development environment.

One machine exposed npm-prefix permission assumptions. Another exposed Apple Silicon and Rosetta confusion: the shell architecture, Node architecture, Homebrew location, and native dependency architecture did not necessarily agree. Recommending one fixed Homebrew path would have replaced one machine-specific bug with another.

The clean-install integration test now derives the active Node directory from `path.dirname(process.execPath)` and preserves the rest of `PATH`. That works with Intel Homebrew, Apple Silicon, and GitHub Actions because it follows the runtime actually executing the test.

The same tests found empty-capacity behavior that used to be too brittle. An alias with zero eligible routes should produce a clear degraded state, not crash the router. A recoverable installer should leave a working launcher before interactive setup is complete.

These details are less exciting than model ranking, but they determine whether the project works outside its original laptop.

## What ZeroSpend does now

Requests are classified with deterministic heuristics into code, SQL, reasoning, tools, structured output, long context, fast, or general aliases. There is no second LLM call just to choose a route.

Discovery applies provider-specific evidence rules and bounded availability checks. Small synthetic benchmarks plus recent reliability can inform candidate order without continuously consuming free quota. Failed discovery preserves the last known-good production inventory.

The router and console bind to loopback by default. The event store keeps operational metadata—status, provider/model, token counts, latency, attempts, tool outcome, and fallback depth—but excludes prompts, completions, SQL, tool arguments/results, and credentials.

## What it deliberately does not guarantee

ZeroSpend cannot create free capacity. It cannot prevent a provider from changing terms, remove rate limits, or promise that evidence observed at one timestamp remains true forever.

“Verified free” means the current evidence met the implemented rule at a recorded time. Some integrations require provider credentials and network access. OpenCode Free through 9Router and OmniRoute remain advanced or experimental paths. macOS is the primary supported platform; Linux service installation is experimental.

The synthetic benchmarks are routing signals, not a universal model leaderboard. Users still need to review provider terms and evaluate their own workload.

## What I want feedback on

I am most interested in three questions:

1. Should a free-only router always fail closed, or should it support an explicitly configured spending ceiling?
2. What provider evidence is strong enough to automate free-route eligibility?
3. Which metadata makes a routing decision auditable without retaining request content?

ZeroSpend is MIT-licensed: https://github.com/sjfakharian/zerospend

The public demo uses synthetic routes and a synthetic 429. It does not report live provider capacity or claim endorsement from any provider.
