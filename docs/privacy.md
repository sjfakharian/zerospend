# Privacy

Observability is metadata-only. Prompt and response logging is deliberately absent. The event store allowlists routing identifiers, timings, status, token counts, and fallback metadata; forbidden content fields are dropped. Do not add SQL, tool payload, file content, MCP payload, browser session, or credential fields. Demo fixtures are deterministic and synthetic.
