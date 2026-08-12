# Benchmarking

The weekly runner uses at most eight verified-free candidates and one small synthetic task for code, SQL, reasoning, general, tools, fast responses, long context, and structured output. Deterministic graders check correctness, instructions, tool calls, and JSON shape. Ranking combines those controlled scores with recent latency, errors, rate limits, availability, and tool reliability.

```bash
zerospend benchmark --dry-run  # report only
zerospend benchmark            # atomic routing update after a complete run
```

A candidate replaces an incumbent only when it clears the configured score margin. Each category retains ordered backups. The runner takes an exclusive lock, saves timestamped results, backs up the prior routing file, and leaves production routing unchanged if the run is incomplete. Benchmarking consumes real provider quota; CI uses mocks only.
