# TokenHarbor

TokenHarbor is a direct OpenAI-compatible provider at `https://tokenharbor.ai/v1`. ZeroSpend accepts only current catalog entries that have both:

- an explicit model ID ending in `:free`; and
- explicit zero input and output prices in the authenticated `/v1/models` response.

A paid base model, promotional wallet credit, a subscription allowance, or `th-orchestra` is not free-cost evidence. Unknown or missing pricing fails closed and is never added to a production route.

## Configure

Use the shared hidden-input provider flow:

```bash
zerospend provider add
zerospend provider test tokenharbor
zerospend discover
zerospend provider status tokenharbor
```

The credential is stored locally as `~/.zerospend/secrets/tokenharbor.token` with mode `0600`; it is not placed in JSON configuration or sent to the Console browser after saving.

TokenHarbor requires users to opt in before permanent free routes are enabled. Its free-route terms state that prompts and responses may be retained after that opt-in. Review the current [TokenHarbor free-model terms](https://tokenharbor.ai/docs/billing/cashback) and [privacy information](https://tokenharbor.ai/faq) before sending sensitive content.

Free model membership and allowance are time-varying. A successful catalog check is followed by a bounded availability probe; a route is not production eligible until both cost evidence and availability pass. If no verified-free capacity remains, ZeroSpend returns `FREE_CAPACITY_UNAVAILABLE` and never falls back to a paid TokenHarbor route.
