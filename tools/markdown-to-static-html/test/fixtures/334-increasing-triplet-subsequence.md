# Formal Proof of the Two-Bound Triplet Detection Algorithm

To establish the correctness of the Two-Bound algorithm for detecting an increasing triplet subsequence, we must rigorously prove two properties: that the pair minimum of a growing sequence obeys a two-case recurrence governed by the new element's relationship with the prefix minimum, and that the algorithm's two accumulators faithfully implement this recurrence so that every triplet is detected and no false positive is reported. We will dismantle the problem into a pair-minimum recurrence (§2), a dual-bound tracking mechanism (§3), and a greedy bound invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A = (a_0, a_1, \ldots, a_{n-1})$ be a finite sequence of integers. An *increasing triplet* in $A$ is a triple of indices $(i, j, k)$ with $0 \le i < j < k < n$ and $a_i < a_j < a_k$. Define the *triplet predicate*:

$$\mathcal{T}(A) \iff \exists\; i, j, k \in \{0, \ldots, n-1\} : i < j < k \;\land\; a_i < a_j < a_k$$

For any finite sequence $B = (b_0, \ldots, b_{m-1})$, define two quantities.

The *prefix minimum*:

$$\mu(B) = \min_{0 \le i < m} b_i$$

The *pair minimum* — the smallest value that serves as the larger element of a strictly increasing pair:

$$\sigma(B) = \min\{b_j : 0 \le j < m, \; \exists\; i < j : b_i < b_j\}$$

with the conventions $\mu(\emptyset) = +\infty$ and $\sigma(\emptyset) = +\infty$ for the empty sequence.

**Preconditions and contract assumptions.**

* $n \ge 1$.
* The sequence is read-only.

**Postcondition.**

$$\text{Return } \mathcal{T}(A).$$

**State variables.**

* $r \in \{0, 1, \ldots, n\}$ — read pointer, scanning left to right.
* $f \in \mathbb{Z} \cup \{+\infty\}$ — first bound (tracks $\mu$).
* $s \in \mathbb{Z} \cup \{+\infty\}$ — second bound (tracks $\sigma$).

**Initialization.**

$$r = 0, \quad f = +\infty, \quad s = +\infty$$

No mutation model is needed — $A$ is not modified.

## 2. The Pair-Minimum Recurrence

**Theorem 1: The pair minimum of a sequence extended by one element is determined by a two-case recurrence.**

Let $B$ be a finite sequence (possibly empty) and let $v$ be a value appended to form $B' = B \| (v)$.

$$\sigma(B') = \begin{cases} \sigma(B) & \text{if } v \le \mu(B) \\ \min(\sigma(B),\, v) & \text{if } v > \mu(B) \end{cases}$$

*Proof:*

Let $m = |B|$ and let position $m$ hold the appended value $v$.

**Case 1 — $v \le \mu(B)$.** For every $i < m$, $b_i \ge \mu(B) \ge v$, so no index $i$ satisfies $b_i < v$. The new element $v$ cannot serve as the larger element of any increasing pair. All pre-existing pairs within $B$ remain valid in $B'$ (appending does not alter earlier positions). The pair set of $B'$ equals that of $B$, so $\sigma(B') = \sigma(B)$.

**Case 2 — $v > \mu(B)$.** There exists $i < m$ with $b_i = \mu(B) < v$, so the pair $(i, m)$ is an increasing pair with $v$ as its larger element. The pair set of $B'$ is the pair set of $B$ together with $v$. Therefore $\sigma(B') = \min(\sigma(B), v)$. $\blacksquare$

**Corollary 1.1: The pair minimum is non-increasing under extension.**

$$\sigma(B') \le \sigma(B)$$

In Case 1, $\sigma(B') = \sigma(B)$. In Case 2, $\sigma(B') = \min(\sigma(B), v) \le \sigma(B)$.

**Corollary 1.2: A value exceeding a finite pair minimum completes a triplet.**

If $\sigma(B) \ne +\infty$ and $v > \sigma(B)$, then $\mathcal{T}(B') = \text{true}$.

*Proof:*

Since $\sigma(B) \ne +\infty$, the pair set of $B$ is non-empty: there exist indices $p < q < m$ with $b_p < b_q$ and $b_q = \sigma(B)$. Then $b_p < b_q = \sigma(B) < v = b_m$, with $p < q < m$, forming an increasing triplet in $B'$. $\blacksquare$

## 3. Algorithm Mapping: The Dual-Bound Tracker

The algorithm maintains two accumulators — $f$ for the prefix minimum and $s$ for the pair minimum — and processes each element $a_r$ through a three-way branch:

1. **Refresh first** ($a_r \le f$): Set $f \gets a_r$. The incoming value is at most the current prefix minimum, so it becomes the new minimum. The pair minimum is unchanged (Theorem 1, Case 1).

2. **Tighten second** ($f < a_r \le s$): Set $s \gets a_r$. The incoming value exceeds the prefix minimum — creating or improving an increasing pair — but does not exceed the current pair minimum. By Theorem 1 Case 2: $\sigma' = \min(s, a_r) = a_r$.

3. **Complete triplet** ($a_r > s$): Return true. Since $a_r$ is a finite integer and $a_r > s$, we have $s \ne +\infty$. By Corollary 1.2, an increasing triplet exists.

**Lemma 1: The first bound tracks the prefix minimum.**

After processing $A[0..r-1]$, $f = \mu(A[0..r-1])$.

*Proof:*

By induction on $r$.

*Base case ($r = 0$).* $f = +\infty = \mu(\emptyset)$.

*Inductive step.* Assume $f = \mu(A[0..r-1])$ before processing $a_r$.

* *Refresh first ($a_r \le f$):* $f' = a_r = \min(f, a_r) = \min(\mu(A[0..r-1]), a_r) = \mu(A[0..r])$.

* *Tighten second or complete triplet ($a_r > f$):* $f' = f$. Since $a_r > f = \mu(A[0..r-1])$, the minimum is unchanged: $\mu(A[0..r]) = \mu(A[0..r-1]) = f$. $\blacksquare$

## 4. Proof of Correctness: The Greedy Bound Invariant

**Theorem 2: After processing $A[0..r-1]$ (without early return), $f = \mu(A[0..r-1])$ and $s = \sigma(A[0..r-1])$. The algorithm returns $\mathcal{T}(A)$.**

*Proof:*

Define the loop invariant:

$$\text{INV}(r): \quad f = \mu(A[0..r-1]) \;\land\; s = \sigma(A[0..r-1])$$

1. *Base case ($r = 0$).* $f = +\infty = \mu(\emptyset)$ and $s = +\infty = \sigma(\emptyset)$. $\text{INV}(0)$ holds.

2. *Inductive step.* Assume $\text{INV}(r)$ holds. Process $a_r$.

   *Case 1 — Refresh first ($a_r \le f$):*

   By Lemma 1, $f' = \mu(A[0..r])$. Since $a_r \le f = \mu(A[0..r-1])$, Theorem 1 Case 1 gives $\sigma(A[0..r]) = \sigma(A[0..r-1]) = s$. The algorithm leaves $s$ unchanged. $\text{INV}(r+1)$ holds.

   *Case 2 — Tighten second ($f < a_r \le s$):*

   By Lemma 1, $f' = f = \mu(A[0..r])$. Since $a_r > f = \mu(A[0..r-1])$, Theorem 1 Case 2 gives:

   $$\sigma(A[0..r]) = \min(\sigma(A[0..r-1]),\, a_r) = \min(s, a_r) = a_r$$

   The algorithm sets $s' = a_r$. $\text{INV}(r+1)$ holds.

   *Case 3 — Complete triplet ($a_r > s$):*

   Since $a_r$ is finite and $a_r > s$, $s = \sigma(A[0..r-1]) \ne +\infty$. By Corollary 1.2, $\mathcal{T}(A[0..r]) = \text{true}$. A triplet in a prefix is a triplet in $A$, so $\mathcal{T}(A) = \text{true}$. The algorithm correctly returns true.

3. *Termination ($r = n$, no early return).*

   $\text{INV}(n)$ gives $s = \sigma(A)$.

   *Soundness.* Every true return occurs via Case 3, which is justified by Corollary 1.2.

   *Completeness.* Suppose for contradiction that $\mathcal{T}(A) = \text{true}$: there exist $i < j < k$ with $a_i < a_j < a_k$. The pair $(i, j)$ places $a_j$ into the pair set of $A[0..j]$, so:

   $$\sigma(A[0..j]) \le a_j$$

   By Corollary 1.1 applied iteratively from $A[0..j]$ through $A[0..k-1]$:

   $$s_k = \sigma(A[0..k-1]) \le \sigma(A[0..j]) \le a_j < a_k$$

   When processing $a_k$, the algorithm finds $a_k > s_k$ and enters Case 3, returning true — contradicting the assumption of no early return. Therefore $\mathcal{T}(A) = \text{false}$, and the algorithm correctly returns false. $\blacksquare$

**Corollary 2.1:** If $n < 3$, fewer than three distinct indices exist, so $\mathcal{T}(A) = \text{false}$. The algorithm scans at most two elements without triggering Case 3.

**Corollary 2.2:** If $A$ is non-increasing ($a_0 \ge a_1 \ge \cdots \ge a_{n-1}$), no increasing pair exists, $\sigma(A) = +\infty$, and the algorithm returns false.

**Corollary 2.3:** Equal values satisfy $\le$ but not $<$, so they may refresh or tighten bounds but never form the strictly increasing relationship needed for a pair or triplet.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A = (2, 1, 5, 0, 4, 6)$, $n = 6$.

| Step | $r$ | $a_r$ | Branch | $f$ | $s$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $0$ | $2$ | refresh first | $2$ | $+\infty$ |
| **2** | $1$ | $1$ | refresh first | $1$ | $+\infty$ |
| **3** | $2$ | $5$ | tighten second | $1$ | $5$ |
| **4** | $3$ | $0$ | refresh first | $0$ | $5$ |
| **5** | $4$ | $4$ | tighten second | $0$ | $4$ |
| **6** | $5$ | $6$ | complete triplet | $0$ | $4$ |

**Result:** $\mathcal{T}(A) = \text{true}$. The pair minimum $s = 4$ (at index $4$, with predecessor $a_3 = 0 < 4$) is exceeded by $a_5 = 6$, yielding the triplet $(3, 4, 5)$: $0 < 4 < 6$.

*Note on Step 4: When $a_3 = 0$ refreshes $f$ from $1$ to $0$, the second bound $s$ remains at $5$. This is Theorem 1 Case 1 in action: a value at or below the prefix minimum cannot form the larger element of any new pair, so $\sigma$ is unchanged. The historical witness for $s = 5$ — the pair at indices $(1, 2)$ with $a_1 = 1 < a_2 = 5$ — is immutable in the read-only sequence. The first bound has moved below the second bound's original predecessor, yet the second bound remains valid. This is the non-obvious safety property the algorithm depends on: refreshing $f$ never invalidates the witness behind $s$.*

The theoretical guarantees translate into the mechanical result: Theorem 1's recurrence predicted that each step would update $\sigma$ according to the new value's relationship with $\mu$, Lemma 1 confirmed $f$ tracks $\mu$ through every branch, and Theorem 2's invariant ensured that the triplet detection at Step 6 is sound via Corollary 1.2 and that no triplet could have been missed via Corollary 1.1.
