# Routing

Classification priority is tools, structured output, long context, SQL, code, reasoning, fast, then general. Alias order is stable unless a weekly benchmark clears the promotion margin or the current primary degrades.

```mermaid
flowchart LR
  Q[Request] --> A[Classify]
  A --> F[Ordered free chain]
  F --> M1[Model A]
  M1 -- 429/error --> M2[Model B]
  M2 -- success --> R[Response]
  M2 -- exhausted --> E[FREE_CAPACITY_UNAVAILABLE]
```
