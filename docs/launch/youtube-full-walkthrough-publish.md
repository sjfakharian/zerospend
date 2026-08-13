# YouTube publishing package — full walkthrough

## Recommended title

ZeroSpend from Zero to First Routed Request

## Description

I built ZeroSpend because an ordered list of “free” models was not enough. Models disappear, providers rate-limit, and catalog entries can outlive reliable cost or availability evidence.

This walkthrough starts from a clean temporary environment, installs ZeroSpend, explains its dependencies and request path, configures the supported provider types, and sends a synthetic request through the local OpenAI-compatible endpoint. It then shows why a provider-listed model is not automatically production eligible, how a synthetic HTTP 429 falls back only to another verified-free route, and what happens when no eligible free capacity remains.

The dashboard tour covers Models, Providers, Routing, Benchmarks, Usage, Performance, and Safety. The final section connects Hermes—or any compatible OpenAI client—to the local router.

All provider/model/activity data and failures in this video are deterministic demo data. The HTTP 429 does not represent a real provider outage. No real API key, prompt, completion, account data, or private telemetry is used.

Repository: https://github.com/sjfakharian/zerospend

Try the credential-free synthetic demo:

```bash
git clone https://github.com/sjfakharian/zerospend.git
cd zerospend
npm run demo
```

ZeroSpend cannot create free capacity or guarantee future provider pricing. Review provider terms and test the evidence rules against your own workload.

## Chapters

```text
00:00 Synthetic 429 and verified-free fallback
00:25 What ZeroSpend is
00:43 Clean installation
01:33 Dependencies and architecture
02:16 Provider configuration
03:26 Discovery and production eligibility
04:30 Strict-free verification
05:10 First routed request and selected model
06:35 Dashboard tour
08:31 Complete request path
08:56 Hermes and OpenAI-compatible clients
09:24 FREE_CAPACITY_UNAVAILABLE
09:46 Limitations and GitHub CTA
```

## Thumbnail text

Primary: `ZERO TO FIRST REQUEST`

Secondary visual story: `INSTALL → VERIFY → ROUTE → OBSERVE`

## Narration note

Record a calm technical narration after final human review. Do not read every terminal line. Leave short pauses around the eligibility gates, blocked paid branch, selected-route headers, and exhausted-capacity result.

## Narration attribution

Narration was generated locally with Piper using the `en_GB-alba-medium` voice. The voice model repository is MIT-licensed; its Alba training dataset is licensed under CC BY 4.0.

Alba corpus, University of Edinburgh: https://datashare.ed.ac.uk/handle/10283/3270

No project text or audio was uploaded to an external TTS service. The quiet ambient music bed was procedurally generated for this project and released under CC0 1.0.
