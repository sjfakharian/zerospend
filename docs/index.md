---
layout: home
title: ZeroSpend
titleTemplate: Verified-free LLM routing
hero:
  name: ZeroSpend
  text: The free-model control plane.
  tagline: One local OpenAI-compatible endpoint that discovers, verifies, benchmarks, and routes each task—without prompts in telemetry or a paid fallback path.
  actions:
    - theme: brand
      text: Install ZeroSpend
      link: /quickstart
    - theme: alt
      text: Explore the Console
      link: /dashboard
    - theme: alt
      text: View on GitHub
      link: https://github.com/sjfakharian/zerospend
features:
  - icon: ◎
    title: Verified zero-cost only
    details: Current provider evidence gates every production route. Unknown cost is rejected.
  - icon: ⤴
    title: Task-aware routing
    details: Deterministic classification selects purpose-built code, SQL, tools, reasoning, speed, context, and JSON chains.
  - icon: ◫
    title: Local observability
    details: See latency, reliability, fallback, capacity, and token counts—never prompt or completion content.
  - icon: ◇
    title: Conservative automation
    details: Bounded discovery and quota-efficient benchmarks update rankings without retry storms or unsafe promotion.
---

<div class="zero-callout"><strong>Strict-free invariant</strong><br><code>UNKNOWN COST = NOT FREE</code>. If every currently verified-free route is unavailable, ZeroSpend returns <code>FREE_CAPACITY_UNAVAILABLE</code>.</div>

## A control plane, not another model gateway

ZeroSpend sits in front of provider execution layers. It adds deterministic task classification, current free-cost evidence, measured ranking, metadata-only runtime feedback, and a local operator console. Optional 9Router support expands OpenCode Free discovery and execution; ZeroSpend owns the strict-free policy and task-aware ordering.

![Synthetic ZeroSpend Console overview](/overview.svg){.dashboard-shot}

## Start locally

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
./install.sh
zerospend setup
zerospend doctor
```

[Follow the quickstart →](/quickstart)
