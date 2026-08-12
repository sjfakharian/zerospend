# Free verification

The invariant is `UNKNOWN COST = NOT FREE`. Eligibility needs current route-level zero-price evidence and current availability. Promotional credit is insufficient. A discovery failure preserves the last known-good production configuration rather than admitting uncertain routes.

```mermaid
flowchart LR
  D[Discover] --> E[Cost evidence]
  E -->|unknown/paid| R[Reject]
  E -->|zero| H[Bounded health probe]
  H -->|pass| P[Production eligible]
  H -->|fail| U[Unavailable]
```
