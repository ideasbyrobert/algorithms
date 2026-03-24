# Formal Proof of the Boyer-Moore Voting Algorithm

To establish the correctness of the Boyer-Moore Voting algorithm, we must rigorously prove three properties: that removing a pair of distinct values from a sequence preserves its majority element, that the three-way branch implements this pairwise cancellation in a streaming fashion, and that the loop invariant guarantees the surviving candidate is the majority element. We will dismantle the problem into a cancellation lemma (§2), a streaming vote mapping (§3), and a Boyer-Moore invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A = (a_0, a_1, \ldots, a_{n-1})$ be a finite sequence of integers. Define the *multiplicity function*:

$$\mu(v) = |\{i \in \{0, 1, \ldots, n-1\} : a_i = v\}|$$

A value $m$ is the *majority element* of $A$ if:

$$\mu(m) > \frac{n}{2}$$

**Preconditions and contract assumptions.**

* $n \ge 1$.
* A majority element exists: there exists $m$ such that $\mu(m) > n/2$.

**Postcondition.**

$$\text{The algorithm returns } m.$$

**State variables.**

* $r \in \{0, 1, \ldots, n\}$ — read pointer; scans each position exactly once.
* $\gamma \in \mathbb{Z}$ — current candidate value.
* $\beta \in \mathbb{Z}_{\ge 0}$ — balance; accumulated vote count for the current candidate.

**Initialization.**

$$r = 0, \quad \beta = 0, \quad \gamma \text{ undefined}$$

No mutation model is needed — the algorithm reads $A$ without modifying it.

## 2. The Cancellation Lemma

**Theorem 1: Removing a distinct-value pair preserves the majority.**

Let $A$ be a sequence of length $n$ with majority element $m$. If two elements $a_i$ and $a_j$ with $a_i \ne a_j$ are removed, the resulting sequence of length $n - 2$ still has $m$ as its majority element.

*Proof:*

Since $a_i \ne a_j$, at most one of them equals $m$. The count of $m$ in the reduced sequence satisfies:

$$\mu'(m) \ge \mu(m) - 1 > \frac{n}{2} - 1 = \frac{n - 2}{2}$$

Therefore $m$ has strict majority in the reduced sequence. $\blacksquare$

**Corollary 1.1: Repeated cancellation preserves the majority.**

If $k$ disjoint distinct-value pairs are removed from $A$, the majority element of the remaining $n - 2k$ elements is still $m$. The remaining sequence is non-empty because the non-$m$ values number $n - \mu(m) < n/2$, at most $n - \mu(m)$ copies of $m$ can participate in distinct-value pairs, and the uncanceled copies of $m$ number at least $\mu(m) - (n - \mu(m)) = 2\mu(m) - n > 0$.

## 3. Algorithm Mapping: The Streaming Vote Mechanism

The Boyer-Moore algorithm processes elements left-to-right through a three-way branch:

1. **Start** ($\beta = 0$): Set $\gamma \gets a_r$, $\beta \gets 1$. The algorithm begins a new phase after the previous phase fully canceled.
2. **Reinforce** ($a_r = \gamma$, $\beta > 0$): $\beta \gets \beta + 1$. The candidate gains one vote.
3. **Cancel** ($a_r \ne \gamma$, $\beta > 0$): $\beta \gets \beta - 1$. One copy of $\gamma$ from the residue is paired with $a_r$ to form a canceled distinct-value pair.

**Lemma 1: The three-way branch implements pairwise cancellation.**

At any point during execution, the processed prefix $A[0..r-1]$ decomposes into a set of canceled distinct-value pairs and an uncanceled residue of $\beta$ copies of $\gamma$.

*Proof:*

Every "cancel" step produces one distinct-value pair by consuming one copy of $\gamma$ from the residue and pairing it with $a_r \ne \gamma$. Every "reinforce" step adds one copy of $\gamma$ to the residue. Every "start" step begins a fresh residue of one element, possible only when $\beta = 0$ (the previous phase was fully canceled). The residue is always homogeneous: $\beta$ copies of the current $\gamma$. $\blacksquare$

## 4. Proof of Correctness: The Boyer-Moore Invariant

**Theorem 2: Upon termination, $\gamma = m$.**

*Proof:*

Define the *live multiset* at the start of iteration $r$ as the union of the uncanceled residue and the unscanned suffix:

$$L_r = \underbrace{\{\!\{\gamma, \ldots, \gamma\}\!\}}_{\beta \text{ copies}} \cup \{\!\{a_r, a_{r+1}, \ldots, a_{n-1}\}\!\}$$

with $|L_r| = \beta + (n - r)$. When $\beta = 0$, the residue contributes nothing.

Define the loop invariant:

$$\text{INV}(r): \quad m \text{ is the majority element of } L_r$$

1. *Base case ($r = 0$).* $\beta = 0$, so $L_0 = A$. By the precondition, $m$ is the majority of $A$. $\text{INV}(0)$ holds.

2. *Inductive step.* Assume $\text{INV}(r)$ holds.

   *Case 1 — Start ($\beta = 0$):* $L_r = \{\!\{a_r, \ldots, a_{n-1}\}\!\}$. The branch sets $\gamma = a_r$, $\beta = 1$. The new live multiset is:

   $$L_{r+1} = \{\!\{a_r\}\!\} \cup \{\!\{a_{r+1}, \ldots, a_{n-1}\}\!\} = L_r$$

   The multiset is unchanged. $\text{INV}(r+1)$ holds.

   *Case 2 — Reinforce ($a_r = \gamma$, $\beta > 0$):* Element $a_r$ moves from the suffix into the residue. The new live multiset is:

   $$L_{r+1} = \underbrace{\{\!\{\gamma, \ldots, \gamma\}\!\}}_{\beta + 1} \cup \{\!\{a_{r+1}, \ldots, a_{n-1}\}\!\} = L_r$$

   The multiset is unchanged. $\text{INV}(r+1)$ holds.

   *Case 3 — Cancel ($a_r \ne \gamma$, $\beta > 0$):* The branch removes one copy of $\gamma$ from the residue and discards $a_r$ from the suffix, forming a distinct-value pair $(\gamma, a_r)$ with $\gamma \ne a_r$. The new live multiset is:

   $$L_{r+1} = \underbrace{\{\!\{\gamma, \ldots, \gamma\}\!\}}_{\beta - 1} \cup \{\!\{a_{r+1}, \ldots, a_{n-1}\}\!\}$$

   This is $L_r$ with the pair $(\gamma, a_r)$ removed. By Theorem 1, removing a distinct-value pair preserves the majority. $\text{INV}(r+1)$ holds.

3. *Termination.* At $r = n$, the suffix is empty. By $\text{INV}(n)$, $m$ is the majority of $L_n$, which consists of $\beta$ copies of $\gamma$.

   Since the residue is homogeneous — every element equals $\gamma$ — the only value that can be the majority is $\gamma$. Therefore $\gamma = m$.

   The case $\beta = 0$ cannot occur: by Corollary 1.1, the total number of canceled pairs is at most $n - \mu(m) < n/2$, and the uncanceled copies of $m$ number at least $2\mu(m) - n > 0$, so the residue is non-empty at termination. $\blacksquare$

**Corollary 2.1:** If all elements are identical ($a_i = v$ for all $i$), the candidate is set to $v$ at the first element and never changed. Every subsequent element reinforces, and $\beta = n$ at termination.

**Corollary 2.2:** For a single-element input ($n = 1$), the algorithm starts with $\gamma = a_0$, $\beta = 1$, and the loop terminates immediately.

**Corollary 2.3:** For a minimum-strength majority ($\mu(m) = \lfloor n/2 \rfloor + 1$), the non-$m$ elements number $\lceil n/2 \rceil - 1$, which is the maximum possible. The algorithm still terminates with $\beta \ge 1$ because even in the worst case, cancellation consumes fewer copies of $m$ than exist.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A = (2, 2, 1, 1, 1, 2, 2)$, $n = 7$, $m = 2$ ($\mu(2) = 4 > 7/2$).

| Step | $r$ | $a_r$ | Branch | Action | $\gamma$ | $\beta$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $0$ | $2$ | start | $\gamma \gets 2$ | $2$ | $1$ |
| **2** | $1$ | $2$ | reinforce | $\beta + 1$ | $2$ | $2$ |
| **3** | $2$ | $1$ | cancel | $\beta - 1$ | $2$ | $1$ |
| **4** | $3$ | $1$ | cancel | $\beta - 1$ | $2$ | $0$ |
| **5** | $4$ | $1$ | start | $\gamma \gets 1$ | $1$ | $1$ |
| **6** | $5$ | $2$ | cancel | $\beta - 1$ | $1$ | $0$ |
| **7** | $6$ | $2$ | start | $\gamma \gets 2$ | $2$ | $1$ |

**Result:** $\gamma = 2 = m$, $\beta = 1$.

*Note on Step 5: After $\beta$ reached 0 in Step 4, the prefix $(2, 2, 1, 1)$ has been fully decomposed into two distinct-value pairs — two copies of the majority element 2 canceled against two copies of 1. The algorithm restarts with $\gamma = 1$, which is not the majority element. This is safe: by Corollary 1.1, $m = 2$ remains the majority of the suffix $(1, 2, 2)$, where $\mu(2) = 2 > 3/2$. The incorrect candidate survives only one step before Step 6 cancels it — the majority element's numerical superiority in the suffix makes the wrong candidate's tenure unsustainable.*

The theoretical guarantees translate into the mechanical result: Theorem 1 ensured each cancellation step preserved the majority, Lemma 1 confirmed the three-way branch maintained a valid decomposition into canceled pairs and a homogeneous residue, and Theorem 2's invariant guaranteed that the final candidate $\gamma = 2$ is the majority element.
