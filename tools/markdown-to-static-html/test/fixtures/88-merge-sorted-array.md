# Formal Proof of the Merge Sorted Array Algorithm

To establish the correctness of the Merge Sorted Array algorithm, we must rigorously prove three properties: that the backward fill never overwrites unread primary data, that the cross-source gate always selects the maximum remaining element, and that the descending sweep produces the complete sorted merge. We will dismantle the problem into a pointer-linkage identity (§2), a maximum-selection lemma (§3), and a descending merge invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A = (a_0, a_1, \ldots, a_{m-1})$ be a finite sequence of $m$ integers (the *primary data*), and let $B = (b_0, b_1, \ldots, b_{n-1})$ be a finite sequence of $n$ integers (the *secondary data*). Define the *combined multiset*:

$$M = \{\!\{a_0, \ldots, a_{m-1}\}\!\} \cup \{\!\{b_0, \ldots, b_{n-1}\}\!\}$$

The *sorted merge* is the unique non-decreasing sequence of length $m + n$ whose underlying multiset equals $M$.

**Preconditions and contract assumptions.**

* *Sortedness:* $a_i \le a_{i+1}$ for all $0 \le i < m - 1$, and $b_j \le b_{j+1}$ for all $0 \le j < n - 1$.
* *Storage layout:* The physical array has $m + n$ cells. The first $m$ cells hold the primary data; the remaining $n$ cells are padding (their values are irrelevant).
* *Non-empty merge:* $m + n \ge 1$.
* *Mutation permitted:* In-place overwriting of the physical array is allowed.

**Postcondition.**

$$A^{(f)}[0..m+n-1] \text{ is the non-decreasing rearrangement of } M.$$

**State variables.**

* $p_1 \in \{-1, 0, 1, \ldots, m-1\}$ — primary read pointer; scans $A$ from right to left.
* $p_2 \in \{-1, 0, 1, \ldots, n-1\}$ — secondary read pointer; scans $B$ from right to left.
* $w \in \{-1, 0, 1, \ldots, m+n-1\}$ — write pointer; fills the physical array from right to left.

**Initialization.**

$$p_1 = m - 1, \quad p_2 = n - 1, \quad w = m + n - 1$$

**Mutation model.** $A^{(0)}$ is the input state (first $m$ cells = primary data, last $n$ cells = padding). $A^{(t)}$ is the state after step $t$. Each step sets $A^{(t+1)}[w] \gets x$, where $x$ is the element selected by the gate. $A^{(f)}$ is the final state after the loop terminates.

## 2. The Non-Collision Invariant (Safety)

**Theorem 1: The pointer-linkage identity.**

$$w = p_1 + p_2 + 1 \quad \text{at the start of every iteration.}$$

*Proof:*

1. *Base case.* At initialization:

   $$w = m + n - 1 = (m - 1) + (n - 1) + 1 = p_1 + p_2 + 1$$

2. *Inductive step.* Assume $w = p_1 + p_2 + 1$ at the start of the current iteration. During the iteration, $w$ decreases by 1 and exactly one of $p_1$ or $p_2$ decreases by 1.

   *Case 1 — pick from $A$:* $p_1' = p_1 - 1$, $p_2' = p_2$, $w' = w - 1$.

   $$p_1' + p_2' + 1 = (p_1 - 1) + p_2 + 1 = p_1 + p_2 = w - 1 = w'$$

   *Case 2 — pick from $B$:* $p_1' = p_1$, $p_2' = p_2 - 1$, $w' = w - 1$.

   $$p_1' + p_2' + 1 = p_1 + (p_2 - 1) + 1 = p_1 + p_2 = w - 1 = w'$$

3. By induction, the identity holds at every iteration. $\blacksquare$

**Corollary 1.1: The write pointer never reaches unread primary data.**

The loop executes while $p_2 \ge 0$. By Theorem 1:

$$w = p_1 + p_2 + 1 \ge p_1 + 0 + 1 = p_1 + 1$$

Hence $w > p_1$ at every iteration. The write position is strictly above all unread primary positions $0, 1, \ldots, p_1$.

**Corollary 1.2: Every primary read returns the original value.**

Since all writes target positions $> p_1$, positions $0$ through $p_1$ are never overwritten. Therefore $A^{(t)}[p_1] = A^{(0)}[p_1]$ at every iteration.

## 3. Algorithm Mapping: The Cross-Source Gate

The gate condition governing each step is:

$$p_1 \ge 0 \quad \text{and} \quad A^{(t)}[p_1] > B[p_2]$$

This is a *cross-source gate*: a comparison between the heads of two sorted streams scanned in descending order.

**Lemma 1: The gate selects the maximum of all remaining elements.**

*Proof:*

Define the remaining multiset at the start of an iteration:

$$R = \{\!\{A^{(0)}[0], \ldots, A^{(0)}[p_1]\}\!\} \cup \{\!\{B[0], \ldots, B[p_2]\}\!\}$$

Since $A^{(0)}[0..p_1]$ is non-decreasing, $\max\bigl(A^{(0)}[0..p_1]\bigr) = A^{(0)}[p_1]$. Since $B[0..p_2]$ is non-decreasing, $\max\bigl(B[0..p_2]\bigr) = B[p_2]$. Therefore:

$$\max(R) = \max\bigl(A^{(0)}[p_1],\; B[p_2]\bigr)$$

By Corollary 1.2, $A^{(t)}[p_1] = A^{(0)}[p_1]$.

*Case 1 — gate passes ($p_1 \ge 0$ and $A^{(0)}[p_1] > B[p_2]$):* The algorithm places $A^{(0)}[p_1] = \max(R)$.

*Case 2 — gate fails ($p_1 < 0$ or $A^{(0)}[p_1] \le B[p_2]$):* The algorithm places $B[p_2]$.

- If $p_1 < 0$: all primary elements are exhausted and $B[p_2] = \max(R)$.
- If $A^{(0)}[p_1] \le B[p_2]$: $B[p_2] \ge A^{(0)}[p_1]$, so $B[p_2] = \max(R)$.

In every case, the placed element is $\max(R)$. $\blacksquare$

## 4. Proof of Correctness: The Descending Merge Invariant

**Theorem 2: Upon termination, $A^{(f)}[0..m+n-1]$ is the non-decreasing rearrangement of $M$.**

*Proof:*

Define the loop invariant at the start of each iteration:

$$\text{INV}: \quad A^{(t)}[w+1..m+n-1] \text{ contains the } (m+n-1-w) \text{ largest elements of } M, \text{ in non-decreasing order.}$$

1. *Base case.* Before the first iteration, $w = m + n - 1$. The region $A^{(0)}[m+n..m+n-1]$ is empty. An empty sequence vacuously contains the 0 largest elements in sorted order. $\text{INV}$ holds.

2. *Inductive step.* Assume $\text{INV}$ holds. By Lemma 1, the element $x$ placed at position $w$ satisfies $x = \max(R)$.

   *Ordering:* If at least one element was previously placed ($w + 1 \le m + n - 1$), the element $A^{(t)}[w + 1]$ was placed at the immediately preceding step and was the maximum of a larger remaining set that contained $x$. Therefore $A^{(t)}[w + 1] \ge x$.

   *Extension:* After writing $x$ at position $w$, the region $A^{(t+1)}[w..m+n-1]$ begins with $x$ and continues with the previously sorted tail. Since $x \le A^{(t+1)}[w + 1]$ (or this is the first element placed), the extended sequence is non-decreasing. It now contains the $(m + n - w)$ largest elements of $M$.

   After $w$ decreases to $w - 1$, $\text{INV}$ holds for the next iteration.

3. *Termination.* The loop exits when $p_2 = -1$. By Theorem 1, $w = p_1$.

   The placed region $A^{(f)}[p_1 + 1..m + n - 1]$ contains the $(m + n - 1 - p_1)$ largest elements of $M$, sorted (by $\text{INV}$).

   If $p_1 = -1$, the placed region is $A^{(f)}[0..m + n - 1]$ — the entire array. The sorted merge is complete.

   If $p_1 \ge 0$, positions $0$ through $p_1$ retain their original values: every write targeted position $w = p_1 + p_2 + 1 \ge p_{1,\text{final}} + 1$ (since $p_1$ only decreases and $p_2 \ge 0$ throughout the loop). These $(p_1 + 1)$ elements are the smallest in $M$, already sorted by the original sortedness of $A$. Since every placed element $\ge$ every remaining element, $A^{(f)}[p_1] \le A^{(f)}[p_1 + 1]$, and $A^{(f)}[0..m + n - 1]$ is the complete sorted merge. $\blacksquare$

**Corollary 2.1:** If $n = 0$ ($B$ is empty), $p_2 = -1$ at initialization and the loop never executes. $A$ is already the correct result.

**Corollary 2.2:** If $m = 0$ ($A$ is empty, all padding), $p_1 = -1$ at initialization. Every iteration picks from $B$, copying $B$ right-to-left into positions $n - 1, n - 2, \ldots, 0$.

**Corollary 2.3:** If $m = 1$ and $n = 1$, a single comparison places the larger value at position 1; the smaller either remains at position 0 (if from $A$) or is copied there (if from $B$).

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A^{(0)} = (4, 5, 6, 0, 0, 0)$, $m = 3$, $B = (1, 2, 3)$, $n = 3$.

| Step | $p_1$ | $p_2$ | $w$ | $w - p_1$ | Comparison | Gate | Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $2$ | $2$ | $5$ | $3$ | $6 > 3$ | pass | $A[5] \gets 6$; $p_1 \to 1$ |
| **2** | $1$ | $2$ | $4$ | $3$ | $5 > 3$ | pass | $A[4] \gets 5$; $p_1 \to 0$ |
| **3** | $0$ | $2$ | $3$ | $3$ | $4 > 3$ | pass | $A[3] \gets 4$; $p_1 \to {-1}$ |
| **4** | $-1$ | $2$ | $2$ | $3$ | $p_1 < 0$ | fail | $A[2] \gets 3$; $p_2 \to 1$ |
| **5** | $-1$ | $1$ | $1$ | $2$ | $p_1 < 0$ | fail | $A[1] \gets 2$; $p_2 \to 0$ |
| **6** | $-1$ | $0$ | $0$ | $1$ | $p_1 < 0$ | fail | $A[0] \gets 1$; $p_2 \to {-1}$ |

**Result:** $w = -1$, $A^{(f)} = (1, 2, 3, 4, 5, 6)$.

*Note on Step 4: Here $w = 2$, a position that originally held primary data ($A^{(0)}[2] = 6$). The algorithm writes $B[2] = 3$ to this position, overwriting the original value. This is safe because $A^{(0)}[2]$ was already consumed in Step 1 and relocated to position 5. Theorem 1's pointer-linkage identity guaranteed that $p_1$ had moved past position 2 (to $-1$) before $w$ descended to it — the write pointer cannot reach a position still carrying unread primary data. The $w - p_1$ column confirms $w = p_1 + p_2 + 1$ at every step.*

The theoretical guarantees translate into the mechanical result: Theorem 1 ensured the backward fill never corrupted unread data, Lemma 1 confirmed each step placed the maximum remaining element, and Theorem 2's invariant accumulated the six elements into the sorted merge.
