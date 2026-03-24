# Formal Proof of the H-Index Algorithm

To establish the correctness of the H-Index algorithm, we must rigorously prove three properties: that citation counts above $n$ can be capped without altering the h-index, that the bucket array faithfully encodes the support counting function, and that the descending threshold scan identifies the maximum qualifying threshold. We will dismantle the problem into a capping identity (§2), a bucket-to-support mapping (§3), and a descending scan invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $C = (c_0, c_1, \ldots, c_{n-1})$ be a finite sequence of non-negative integers, where $c_i$ is the citation count of paper $i$. Define the *support counting function*:

$$S(h) = |\{i \in \{0, 1, \ldots, n-1\} : c_i \ge h\}|$$

$S(h)$ counts how many papers have at least $h$ citations. Define the *h-index*:

$$H = \max\{h \in \{0, 1, \ldots, n\} : S(h) \ge h\}$$

This set is non-empty because $S(0) = n \ge 0$, so $h = 0$ always qualifies.

**Preconditions and contract assumptions.**

* $c_i \in \mathbb{Z}_{\ge 0}$ for all $0 \le i < n$.
* $n \ge 1$.

**Postcondition.**

$$\text{The algorithm returns } H.$$

**State variables.**

* $B[j] \in \mathbb{Z}_{\ge 0}$ for $j \in \{0, 1, \ldots, n\}$ — bucket array; $B[j]$ counts papers whose capped citation count equals $j$.
* $h \in \{0, 1, \ldots, n\}$ — candidate threshold, scanned from $n$ down to $0$.
* $\sigma \in \{0, 1, \ldots, n\}$ — running support count; accumulates papers with capped citations $\ge h$.

**Initialization.**

Bucket construction:

$$B[j] = |\{i : \min(c_i, n) = j\}| \quad \text{for each } 0 \le j \le n$$

Scan initialization:

$$h = n, \quad \sigma = 0$$

No mutation model is needed — the algorithm constructs a separate bucket array and does not modify $C$.

## 2. Bounding and Capping

**Theorem 1: Capping citations at $n$ preserves the support counting function.**

Define $\hat{c}_i = \min(c_i, n)$ and $\hat{S}(h) = |\{i : \hat{c}_i \ge h\}|$. Then:

$$\hat{S}(h) = S(h) \quad \text{for all } h \in \{0, 1, \ldots, n\}$$

*Proof:*

Fix any $h \le n$ and any paper $i$.

1. If $c_i \ge h$: either $c_i \le n$, so $\hat{c}_i = c_i \ge h$; or $c_i > n$, so $\hat{c}_i = n \ge h$. In both cases, $\hat{c}_i \ge h$.

2. If $c_i < h$: then $c_i < h \le n$, so $\hat{c}_i = c_i < h$.

Therefore $c_i \ge h \iff \hat{c}_i \ge h$ for every paper $i$ and every threshold $h \le n$. Summing over all papers, $\hat{S}(h) = S(h)$. $\blacksquare$

**Corollary 1.1: The h-index lies in $\{0, 1, \ldots, n\}$.**

Since there are only $n$ papers, $S(h) \le n$ for all $h$. Any $h > n$ would require $S(h) \ge h > n$, which is impossible. And $S(0) = n \ge 0$, so $h = 0$ always qualifies. Therefore $H \in \{0, 1, \ldots, n\}$, and the search space for $H$ is exactly the domain of $B$.

## 3. Algorithm Mapping: The Bucket Array

The bucket array $B$ encodes the support counting function via a right-to-left prefix sum.

**Lemma 1: The right-to-left prefix sum of $B$ equals $S$.**

$$\sum_{j=h}^{n} B[j] = S(h) \quad \text{for all } h \in \{0, 1, \ldots, n\}$$

*Proof:*

By definition of $B$:

$$\sum_{j=h}^{n} B[j] = \sum_{j=h}^{n} |\{i : \min(c_i, n) = j\}|$$

Since each paper maps to exactly one bucket (the sets $\{i : \min(c_i, n) = j\}$ are pairwise disjoint for distinct $j$):

$$= |\{i : \min(c_i, n) \ge h\}| = \hat{S}(h)$$

By Theorem 1, $\hat{S}(h) = S(h)$. $\blacksquare$

**Consequence.** The running sum $\sigma$, after adding $B[h]$ at threshold $h$, satisfies:

$$\sigma = \sum_{j=h}^{n} B[j] = S(h)$$

The bucket array converts the support function — which would otherwise require a full pass over $C$ for each threshold — into an incremental right-to-left accumulation with $O(1)$ work per threshold.

## 4. Proof of Correctness: The Descending Threshold Scan

**Theorem 2: The descending scan returns $H$.**

*Proof:*

Define the loop invariant at the start of the iteration with candidate $h$:

$$\text{INV}(h): \quad \sigma = \sum_{j=h+1}^{n} B[j] = S(h + 1), \quad \text{and } S(h') < h' \text{ for all } h' > h$$

1. *Base case ($h = n$).* Before the first iteration, $\sigma = 0$. The empty sum $\sum_{j=n+1}^{n} B[j] = 0 = S(n + 1)$ holds, and no $h' > n$ exists, so the second clause is vacuously true. $\text{INV}(n)$ holds.

2. *Inductive step.* Assume $\text{INV}(h)$ holds. The iteration adds $B[h]$ to $\sigma$:

   $$\sigma' = \sigma + B[h] = \sum_{j=h+1}^{n} B[j] + B[h] = \sum_{j=h}^{n} B[j] = S(h) \quad \text{(by Lemma 1)}$$

   *Case 1 — $\sigma' \ge h$ (support sufficient):* The scan returns $h$. By hypothesis, $S(h') < h'$ for all $h' > h$, so no larger threshold qualifies. Since $S(h) \ge h$, we have $h \in \{h : S(h) \ge h\}$ and no element of that set exceeds $h$. Therefore $h = H$.

   *Case 2 — $\sigma' < h$ (support insufficient):* $S(h) < h$, so $h$ is not a valid candidate. The scan continues to $h - 1$. Now $\sigma = S(h)$ and $S(h') < h'$ for all $h' \ge h$, so $\text{INV}(h - 1)$ holds.

3. *Termination.* If no positive threshold passes, the scan reaches $h = 0$. At this point:

   $$\sigma' = \sum_{j=0}^{n} B[j] = S(0) = n \ge 0 = h$$

   The check passes and the scan returns $0$. By Corollary 1.1, when no positive threshold is supported, $H = 0$.

In all cases, the returned value equals $H$. $\blacksquare$

**Corollary 2.1:** If every paper has zero citations ($c_i = 0$ for all $i$), then $S(h) = 0$ for all $h \ge 1$, and $H = 0$.

**Corollary 2.2:** If every paper has at least $n$ citations ($c_i \ge n$ for all $i$), then $S(n) = n \ge n$, and $H = n$.

**Corollary 2.3:** For a single paper ($n = 1$), $H = 1$ if $c_0 \ge 1$; otherwise $H = 0$.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $C = (3, 0, 6, 1, 5)$, $n = 5$.

**Bucket construction.** Capping: $\min(3, 5) = 3$, $\min(0, 5) = 0$, $\min(6, 5) = 5$, $\min(1, 5) = 1$, $\min(5, 5) = 5$.

$$B = (1, 1, 0, 1, 0, 2)$$

**Descending scan.**

| Step | $h$ | $B[h]$ | $\sigma$ after | $S(h) = \sigma$ | $\sigma \ge h$? | Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $5$ | $2$ | $2$ | $S(5) = 2$ | $2 < 5$ — no | continue |
| **2** | $4$ | $0$ | $2$ | $S(4) = 2$ | $2 < 4$ — no | continue |
| **3** | $3$ | $1$ | $3$ | $S(3) = 3$ | $3 \ge 3$ — yes | return $3$ |

**Result:** $H = 3$.

*Note on Step 3: The running support count $\sigma$ reaches exactly 3 at threshold $h = 3$ — the tightest possible match where $S(h) = h$. The two papers with citations $\ge 5$ (values 6 and 5, both capped into bucket 5 by Theorem 1) were counted in Step 1, and the paper with exactly 3 citations was added in Step 3. Lemma 1's prefix sum correctly computes $S(3) = 3$ despite the capping — citation count 6 was compressed to bucket 5 alongside citation count 5, yet both still register as supporters of every threshold $\le 5$.*

The theoretical guarantees translate into the mechanical result: Theorem 1 justified compressing citations into $n + 1$ buckets without altering the support counts, Lemma 1 confirmed that each accumulation step computed the true value of $S(h)$, and Theorem 2's invariant delivered the h-index at the first qualifying threshold.
