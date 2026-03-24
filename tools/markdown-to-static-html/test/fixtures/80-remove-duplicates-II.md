# Formal Proof of the At-Most-Two Compaction Algorithm

To establish the correctness of the At-Most-Two Compaction algorithm, we must rigorously prove three properties: that the write pointer never corrupts unscanned data, that the lookback-two gate tracks original values through a pair of interlocking identities on consecutive write positions, and that the written region accumulates exactly the at-most-two compaction of the processed prefix. We will dismantle the problem into a safety invariant (§2), a lookback pair identity (§3), and the compaction invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A = (a_0, a_1, \ldots, a_{n-1})$ be a finite sequence of integers. Define the *multiplicity function*:

$$\mu(v) = |\{i \in \{0, 1, \ldots, n-1\} : a_i = v\}|$$

The *at-most-two compaction* $T = (t_0, t_1, \ldots, t_{k-1})$ is the unique non-decreasing sequence such that for each distinct value $v$ in $A$, the multiplicity of $v$ in $T$ is $\min(\mu(v), 2)$. The length of the compaction is:

$$k = \sum_{v \,:\, \mu(v) > 0} \min(\mu(v), 2)$$

**Preconditions and contract assumptions.**

* *Sortedness:* $a_i \le a_{i+1}$ for all $0 \le i < n - 1$.
* *Non-empty:* $n \ge 1$.
* *Mutation permitted:* In-place overwriting of $A$ is allowed.

**Postcondition.**

$$A^{(f)}[i] = t_i \quad \text{for each } 0 \le i < k, \quad \text{and the algorithm returns } k.$$

**State variables.**

* $w \in \{2, 3, \ldots, n\}$ — write pointer; the next available write position.
* $r \in \{2, 3, \ldots, n - 1\}$ — read pointer; scans each position exactly once.

**Initialization.** For $n \le 2$, the algorithm returns $n$ immediately — any sequence of at most two elements already satisfies the at-most-two constraint. For $n \ge 3$:

$$w = 2, \quad r = 2$$

The first two elements $a_0, a_1$ are unconditionally retained — regardless of whether they are equal or distinct, they contribute at most two copies of any single value.

**Mutation model.** $A^{(0)}$ is the input sequence. $A^{(t)}$ is the state after step $t$. Each write step sets $A^{(t+1)}[w] \gets A^{(t)}[r]$, leaving all other positions unchanged. $A^{(f)}$ is the final state after the loop terminates.

## 2. The Write-Read Safety Invariant

**Theorem 1: The write pointer never exceeds the read pointer.**

$$w \le r \quad \text{at the start of every iteration.}$$

*Proof:*

1. *Base case.* At initialization, $w = 2 = r$. So $w \le r$.

2. *Inductive step.* Assume $w \le r$ at the start of iteration $r$.

   *Case 1 — gate fails (skip):* $w$ is unchanged; $r$ advances to $r + 1$.

   $$w \le r < r + 1$$

   *Case 2 — gate passes (write):* $w$ advances to $w + 1$; $r$ advances to $r + 1$.

   $$w + 1 \le r + 1$$

3. By induction on $r$, $w \le r$ holds at every iteration. $\blacksquare$

**Corollary 1.1: Every read returns the original value.**

Since $w \le r$, positions $r, r + 1, \ldots, n - 1$ have not been written to when the algorithm reads position $r$. Therefore $A^{(t)}[r] = A^{(0)}[r]$ for every read.

## 3. Algorithm Mapping: The Lookback-Two Gate

The gate condition governing write-or-skip is:

$$A^{(t)}[r] \ne A^{(t)}[w - 2]$$

This is a *self-referential gate*: the comparison target $A^{(t)}[w - 2]$ is in the written region — a position the algorithm may have overwritten.

**Lemma 1: The lookback pair identity.**

At the start of every iteration with read pointer $r$ and write pointer $w$:

(a) $A^{(t)}[w - 2] = A^{(0)}[r - 2]$

(b) $A^{(t)}[w - 1] = A^{(0)}[r - 1]$

*Proof:*

By joint induction on $r$.

1. *Base case ($r = 2$).* $w = 2$. Positions 0 and 1 have not been written, so $A^{(0)}[0] = A^{(0)}[0]$ and $A^{(0)}[1] = A^{(0)}[1]$. Both (a) and (b) hold.

2. *Inductive step.* Assume (a) and (b) hold at the start of iteration $r$.

   *Case 1 — gate fails:* By Corollary 1.1 and (a): $A^{(0)}[r] = A^{(t)}[w - 2] = A^{(0)}[r - 2]$. By sortedness, $A^{(0)}[r - 2] \le A^{(0)}[r - 1] \le A^{(0)}[r] = A^{(0)}[r - 2]$, so:

   $$A^{(0)}[r - 2] = A^{(0)}[r - 1] = A^{(0)}[r]$$

   After the step, $w$ is unchanged and $r$ advances to $r + 1$. For (a): $A^{(t)}[w - 2] = A^{(0)}[r - 2] = A^{(0)}[r - 1] = A^{(0)}[(r + 1) - 2]$. For (b): $A^{(t)}[w - 1] = A^{(0)}[r - 1] = A^{(0)}[r] = A^{(0)}[(r + 1) - 1]$. Both hold.

   *Case 2 — gate passes:* The algorithm writes $A^{(t+1)}[w] \gets A^{(0)}[r]$ (by Corollary 1.1) and advances $w$ to $w + 1$, $r$ to $r + 1$. Position $w - 1$ is untouched by this write.

   For (a): $A^{(t+1)}[(w+1) - 2] = A^{(t+1)}[w - 1] = A^{(t)}[w - 1] = A^{(0)}[r - 1] = A^{(0)}[(r+1) - 2]$, using (b).

   For (b): $A^{(t+1)}[(w+1) - 1] = A^{(t+1)}[w] = A^{(0)}[r] = A^{(0)}[(r+1) - 1]$, by the write.

   Both hold.

3. By joint induction, (a) and (b) hold at every iteration. $\blacksquare$

**Consequence.** By Corollary 1.1 and Lemma 1(a), the gate $A^{(t)}[r] \ne A^{(t)}[w - 2]$ reduces to:

$$A^{(0)}[r] \ne A^{(0)}[r - 2]$$

Combined with sortedness ($a_{r-2} \le a_{r-1} \le a_r$), the gate passes if and only if $a_r > a_{r-2}$. This occurs in exactly two situations:

* *New value:* $a_r > a_{r-1}$ — position $r$ introduces a distinct value not yet at its copy limit.
* *Second copy:* $a_r = a_{r-1} > a_{r-2}$ — position $r$ is the second occurrence of its value.

The gate fails when $a_r = a_{r-1} = a_{r-2}$ — position $r$ is a third-or-beyond consecutive occurrence.

## 4. Proof of Correctness: The At-Most-Two Compaction Invariant

**Theorem 2: Upon termination, $A^{(f)}[0..w-1] = T$ and $w = k$.**

*Proof:*

For any prefix $A^{(0)}[0..j-1]$, let $T_j$ denote its at-most-two compaction. Define the loop invariant at the start of iteration $r$:

$$\text{INV}(r): \quad A^{(t)}[0..w-1] = T_r$$

1. *Base case ($r = 2$).* $w = 2$. The written region is $(a_0, a_1)$. A two-element sorted sequence has each value appearing at most twice, so $T_2 = (a_0, a_1)$. $\text{INV}(2)$ holds.

2. *Inductive step.* Assume $\text{INV}(r)$ holds.

   *Case 1 — gate fails:* By the consequence, $a_r = a_{r-1} = a_{r-2}$. The value $a_r$ appears at positions $r - 2$, $r - 1$, and $r$ — a third-or-beyond consecutive occurrence. The at-most-two compaction already includes two copies of this value, so $T_{r+1} = T_r$. Since $w$ is unchanged, $\text{INV}(r + 1)$ holds.

   *Case 2 — gate passes:* $a_r > a_{r-2}$. By sortedness, $a_r \ge a_{r-1} \ge a_{r-2}$. Since $a_r > a_{r-2}$, the contiguous block of value $a_r$ in $A^{(0)}[0..r]$ can extend back at most to position $r - 1$ (because $a_{r-2} < a_r$). The value $a_r$ therefore appears at most twice in $A^{(0)}[0..r]$: once if $a_r > a_{r-1}$, or twice if $a_r = a_{r-1}$. In both cases, this copy belongs in the compaction:

   $$T_{r+1} = T_r \| (a_r)$$

   The algorithm writes $A^{(0)}[r]$ at position $w$ (by Corollary 1.1):

   $$A^{(t+1)}[0..w] = (T_r, a_r) = T_{r+1}$$

   After $w$ increments, $\text{INV}(r + 1)$ holds.

3. *Termination.* The loop ends when $r = n$. By $\text{INV}(n)$, $A^{(f)}[0..w-1] = T_n = T$ and $w = |T| = k$. $\blacksquare$

**Corollary 2.1:** If all elements are identical ($\mu(v) = n$ for one value $v$), the gate fails at every iteration. $w = 2$, retaining exactly two copies.

**Corollary 2.2:** If no value appears more than twice, the gate passes at every iteration. $w = n$, the entire array is retained.

**Corollary 2.3:** For $n \le 2$, the early return gives $w = n = k$ — the array is already at most two copies of each value.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A^{(0)} = (1, 1, 1, 2, 2, 3)$, $n = 6$. Target: $T = (1, 1, 2, 2, 3)$, $k = 5$.

Initialization: $w = 2$, $r = 2$. Positions 0 and 1 retained unconditionally: $(1, 1)$.

| Step | $r$ | $A^{(0)}[r]$ | $A^{(t)}[w-2]$ | $A^{(0)}[r-2]$ | Gate | Action | $w$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $2$ | $1$ | $1$ | $1$ | $1 = 1$ — fail | skip | $2$ |
| **2** | $3$ | $2$ | $1$ | $1$ | $2 \ne 1$ — pass | write $A[2] \gets 2$ | $3$ |
| **3** | $4$ | $2$ | $1$ | $1$ | $2 \ne 1$ — pass | write $A[3] \gets 2$ | $4$ |
| **4** | $5$ | $3$ | $2$ | $2$ | $3 \ne 2$ — pass | write $A[4] \gets 3$ | $5$ |

**Result:** $w = 5 = k$, $A^{(f)}[0..4] = (1, 1, 2, 2, 3) = T$.

*Note on Step 4: The gate reads $A^{(t)}[w - 2] = A^{(t)}[2] = 2$, but position 2 originally held $A^{(0)}[2] = 1$ — the algorithm overwrote it from $1$ to $2$ in Step 2. Despite this mutation, Lemma 1(a) guarantees the lookback value equals $A^{(0)}[r - 2] = A^{(0)}[3] = 2$. The joint induction is the reason this works: identity (a) for Step 4 depended on identity (b) from Step 3's gate-pass — each half of the lookback pair supports the other through the interlocking induction. This mutual dependence is what distinguishes #80 from #26, where a single self-sustaining identity sufficed.*

The theoretical guarantees translate into the mechanical result: Theorem 1 ensured every write landed in already-scanned territory, Lemma 1 confirmed the lookback pair tracked original values through two interlocking identities, and Theorem 2's invariant accumulated exactly the five elements of the at-most-two compaction.
