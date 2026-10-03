## 2023-10-27 - Deferred String Allocation in Router Classifier
**Learning:** Large payload matching can unnecessarily execute expensive regular expressions early. The `classify` function generated a compacted string (`replace(/\s+/g," ")`) for every input before even verifying if the text matched `free-long-context` (>= 60000 characters).
**Action:** Always evaluate string processing lazily, especially O(N) regex replacements on potentially massive input strings, moving them past early returns for non-matching conditions.
