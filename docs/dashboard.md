# ZeroSpend Console

The loopback console has nine views: Overview, Live, Models, Routing, Benchmarks, Usage, Providers, Safety, and Automation. They expose routing reasons, fallback chains, provider/model health, benchmark history, aggregate tokens and latency, free-evidence decisions, schedule state, and warnings.

It reads only ZeroSpend state files and the metadata event store. Prompt text, completions, SQL, tool arguments/results, credentials, and external telemetry are absent by design. `npm run demo` loads deterministic synthetic fixtures—including SQL, code, tools, a 429 fallback, a promotion, and a free-status rejection—and contacts no provider.
