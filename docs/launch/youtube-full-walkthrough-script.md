# ZeroSpend from zero to first routed request — final narration

Voice direction: calm, neutral, technical, moderate pace. Generated locally with Piper en_GB-alba-medium. All provider/model/activity data and failures are synthetic demo data.

## 00:00–00:08 — HOOK

A synthetic SQL request has reached a route with current evidence that it is free.

## 00:08–00:16 — HOOK

The route returns HTTP four twenty-nine. That means temporary capacity pressure, not permanent model invalidation.

## 00:16–00:25 — HOOK

ZeroSpend blocks the paid branch, tries another verified-free candidate, and completes the request without silent spend.

## 00:25–00:34 — WHAT IS ZEROSPEND?

ZeroSpend is a local, OpenAI-compatible routing layer for workloads that must remain on currently verified-free routes.

## 00:34–00:43 — WHAT IS ZEROSPEND?

Its central rule is simple: unknown cost is not free. When evidence is ambiguous, the route is ineligible.

## 00:43–00:53 — CLEAN INSTALL

We will begin from a clean temporary home, so the recording contains no personal paths, shell history, or existing configuration.

## 00:53–01:03 — CLEAN INSTALL

ZeroSpend currently requires macOS, Node.js twenty-two or later, npm, and Git for this source installation.

## 01:03–01:13 — CLEAN INSTALL

Clone the repository, enter the project directory, and point HOME and ZEROSPEND_HOME at an isolated temporary location.

## 01:13–01:23 — CLEAN INSTALL

Run the installer without sudo. It creates a user-owned launcher and keeps the router and console bound to loopback.

## 01:23–01:33 — CLEAN INSTALL

No provider credential is entered here. The clean installation remains recoverable even before interactive provider setup is complete.

## 01:33–01:43 — DEPENDENCIES

The components command reports the runtime, the local router, the console, supported clients, and optional execution backends.

## 01:43–01:54 — DEPENDENCIES

Hermes is the recommended client, but it is not required. Any compatible OpenAI client can call the same endpoint.

## 01:54–02:05 — ARCHITECTURE

The router classifies each request deterministically, maps it to a task alias, and orders only eligible candidates.

## 02:05–02:16 — ARCHITECTURE

Provider adapters execute requests, while the console reads operational metadata without storing prompts, completions, SQL, or tool payloads.

## 02:16–02:27 — PROVIDER SETUP

Provider setup is shared by the terminal and local console. Bearer credentials are entered with hidden input and stored locally.

## 02:27–02:38 — PROVIDER SETUP

OpenRouter is a direct OpenAI-compatible provider. Its free evidence requires explicit zero pricing and an eligible free model identifier.

## 02:38–02:49 — PROVIDER SETUP

NVIDIA NIM is also direct. A route needs current official Free Endpoint evidence before ZeroSpend can admit it.

## 02:49–03:00 — PROVIDER SETUP

OpenCode Free follows a different path: ZeroSpend calls local 9Router, which then executes the OpenCode Free request.

## 03:00–03:13 — PROVIDER SETUP

OpenCode Free needs no provider credential, but backend reachability, current catalog evidence, local mapping, and a bounded probe still matter.

## 03:13–03:26 — PROVIDER SETUP

OpenCode Zen is never substituted. All provider names, model names, counts, and availability states shown here are demo data.

## 03:26–03:36 — DISCOVERY

A model appearing in a provider catalog is only the first gate. Listing alone says nothing definitive about production eligibility.

## 03:36–03:46 — DISCOVERY

Next, ZeroSpend checks provider-specific cost evidence. Explicit zero cost may proceed; unknown or ambiguous cost is rejected.

## 03:46–03:57 — DISCOVERY

The candidate must also support the request requirements, such as tools, structured output, context size, or task category.

## 03:57–04:08 — DISCOVERY

A small bounded probe then checks current execution availability without creating a retry storm or consuming excessive free quota.

## 04:08–04:19 — DISCOVERY

Only after those gates does ZeroSpend create a timestamped production-eligibility decision for that specific route.

## 04:19–04:30 — DISCOVERY

The Models and Providers views expose the evidence source, probe result, current capacity state, and last verification time.

## 04:30–04:40 — STRICT-FREE

Before sending traffic, run the doctor command and inspect the strict-free counters. Paid routes and unverified routes should both be zero.

## 04:40–04:50 — STRICT-FREE

The router exposes one loopback OpenAI-compatible endpoint, while the console uses a separate loopback management boundary.

## 04:50–05:00 — STRICT-FREE

Unknown cost never becomes an emergency fallback. A capacity failure cannot silently widen the policy to a paid route.

## 05:00–05:10 — STRICT-FREE

The Safety view also confirms that content is excluded from telemetry and local services are not exposed by default.

## 05:10–05:20 — FIRST REQUEST

Now send an explicitly synthetic streaming request to the local chat-completions endpoint. The local token stays hidden.

## 05:20–05:30 — FIRST REQUEST

The request and generated answer are intentionally omitted from the recording. We only inspect routing headers and metadata.

## 05:30–05:40 — FIRST REQUEST

The classifier recognizes the SQL task and selects the free-sql alias without making a second language-model call.

## 05:40–05:50 — FIRST REQUEST

Candidate A is currently eligible because its cost evidence, capabilities, and bounded availability result all passed.

## 05:50–06:00 — 429 FALLBACK

For this synthetic scenario, candidate A returns HTTP four twenty-nine after the request begins.

## 06:00–06:10 — 429 FALLBACK

ZeroSpend records temporary capacity pressure. It does not erase the model evidence or mark the identifier permanently unsupported.

## 06:10–06:20 — 429 FALLBACK

The policy evaluates the next branch. A paid or unverified route is not eligible, so that branch is explicitly blocked.

## 06:20–06:31 — 429 FALLBACK

Candidate B has independent current free evidence. It receives the request and returns a synthetic HTTP two hundred response.

## 06:31–06:35 — 429 FALLBACK

The console row updates with fallback depth one.

## 06:35–06:48 — DASHBOARD

Live Routing shows the selected alias, provider and model, status, latency, token counts, attempts, and fallback depth.

## 06:48–07:01 — DASHBOARD

The Routing view explains candidate order. Task score, recent reliability, and bounded benchmark evidence inform the ranking.

## 07:01–07:14 — DASHBOARD

Models separates catalog membership, cost evidence, capability support, availability, and final production eligibility.

## 07:14–07:27 — DASHBOARD

Providers separates configuration from catalog reachability and current capacity. A configured provider can still have zero eligible routes.

## 07:27–07:40 — DASHBOARD

Benchmarks are small synthetic routing signals, not a universal model leaderboard. Failed evaluation does not overwrite a known-good ranking.

## 07:40–07:53 — DASHBOARD

Usage records aggregate prompt and completion token counts by route, but never stores the underlying prompt or generated text.

## 07:53–08:06 — DASHBOARD

Performance combines latency, time to first token, success history, errors, and recent rate-limit state without continuous background testing.

## 08:06–08:18 — DASHBOARD

Safety keeps the invariant visible: zero paid production routes, zero unverified production routes, and loopback-only defaults.

## 08:18–08:31 — DASHBOARD

Overview brings the same evidence together so an operator can audit why a route was selected and how fallback behaved.

## 08:31–08:43 — ARCHITECTURE

Here is the complete path again. A compatible client sends one request to ZeroSpend on the local endpoint.

## 08:43–08:56 — ARCHITECTURE

ZeroSpend owns classification, evidence policy, ordering, and metadata. Execution is direct, or passes through 9Router for OpenCode Free.

## 08:56–09:10 — CLIENT INTEGRATION

For Hermes, configure a custom OpenAI-compatible provider with the local base URL and the smart-free model name.

## 09:10–09:24 — CLIENT INTEGRATION

Hermes configuration syntax can change, so verify its current documentation. Other compatible SDKs use the same base URL and model.

## 09:24–09:35 — NO CAPACITY

Finally, suppose every currently verified-free candidate is unavailable. ZeroSpend does not attempt a paid route.

## 09:35–09:46 — NO CAPACITY

It returns HTTP five hundred and three with FREE_CAPACITY_UNAVAILABLE, zero paid attempts, and no immediate retry storm.

## 09:46–09:58 — LIMITATIONS

ZeroSpend cannot create free capacity, remove rate limits, or guarantee that provider pricing will remain unchanged.

## 09:58–10:10 — LIMITATIONS

Verified free means the implemented evidence rule passed at a recorded time. It is not a permanent promise.

## 10:10–10:22 — LIMITATIONS

Review provider terms, protect local credentials, and test model quality against your own workload and capability requirements.

## 10:22–10:34 — CTA

To explore the project without credentials, clone the repository, enter the directory, and run npm run demo.

## 10:34–10:47 — CTA

The source, setup guide, and deterministic demo are available at github dot com slash sjfakharian slash zerospend.
