# Formal Proof of the Three-Reversal Rotation Algorithm

To establish the correctness of the Three-Reversal Rotation algorithm, we must rigorously prove three properties: that reversing a concatenation reverses the block order while internally reversing each block, that a two-pointer swap loop correctly reverses any contiguous segment in place, and that composing three specific reversals produces exactly the right rotation. We will dismantle the problem into a reversal-concatenation identity (§2), an in-place reversal primitive (§3), and a three-phase composition theorem (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A = (a_0, a_1, \ldots, a_{n-1})$ be a finite sequence of integers. For any rotation amount $k \ge 0$, define the *effective rotation*:

$$k' = k \bmod n$$

Partition $A$ into two contiguous *blocks* determined by $k'$:

$$F = (a_0, a_1, \ldots, a_{n-k'-1}) \quad \text{(front block, length } n - k'\text{)}$$

$$T = (a_{n-k'}, a_{n-k'+1}, \ldots, a_{n-1}) \quad \text{(tail block, length } k'\text{)}$$

so that $A = F \| T$, where $\|$ denotes concatenation.

For any finite sequence $X = (x_0, x_1, \ldots, x_{d-1})$, define the *reversal*:

$$\text{Rev}(X) = (x_{d-1}, x_{d-2}, \ldots, x_0)$$

The *right rotation by $k$* produces:

$$\text{Rot}_k(A) = T \| F = (a_{n-k'}, \ldots, a_{n-1}, a_0, \ldots, a_{n-k'-1})$$

**Preconditions and contract assumptions.**

* $n \ge 1$, $k \ge 0$.
* In-place mutation of $A$ is permitted.

**Postcondition.**

$$A^{(f)} = T \| F$$

Equivalently: $A^{(f)}[j] = A^{(0)}[(j - k') \bmod n]$ for all $0 \le j < n$.

**State variables.** The algorithm applies three segment-reversal operations in sequence. Within each reversal:

* $l, r \in \{0, 1, \ldots, n-1\}$ — left and right swap pointers, converging toward each other.

**Initialization.**

$$\text{Phase 1: } l = 0, \; r = n - 1$$

$$\text{Phase 2: } l = 0, \; r = k' - 1$$

$$\text{Phase 3: } l = k', \; r = n - 1$$

**Mutation model.** $A^{(0)}$ is the input. $A^{(1)}$ is the state after Phase 1 (whole-array reversal). $A^{(2)}$ after Phase 2 (front-block reversal). $A^{(f)}$ after Phase 3 (back-block reversal).

## 2. The Reversal-Concatenation Identity

**Theorem 1: Reversing a concatenation reverses the block order with each block internally reversed.**

For any finite sequences $X = (x_0, \ldots, x_{p-1})$ and $Y = (y_0, \ldots, y_{q-1})$:

$$\text{Rev}(X \| Y) = \text{Rev}(Y) \| \text{Rev}(X)$$

*Proof:*

The concatenation $X \| Y = (x_0, \ldots, x_{p-1}, y_0, \ldots, y_{q-1})$ has length $p + q$. Its reversal reads right-to-left:

$$\text{Rev}(X \| Y) = (y_{q-1}, \ldots, y_0, x_{p-1}, \ldots, x_0)$$

The first $q$ elements are $(y_{q-1}, \ldots, y_0) = \text{Rev}(Y)$. The remaining $p$ elements are $(x_{p-1}, \ldots, x_0) = \text{Rev}(X)$. Therefore:

$$\text{Rev}(X \| Y) = \text{Rev}(Y) \| \text{Rev}(X) \quad \blacksquare$$

**Corollary 1.1: Reversal is an involution.**

$$\text{Rev}(\text{Rev}(X)) = X$$

For $X = (x_0, \ldots, x_{p-1})$: $\text{Rev}(X) = (x_{p-1}, \ldots, x_0)$, and reversing again restores the original left-to-right order.

## 3. Algorithm Mapping: The In-Place Reversal Primitive

Each of the three phases reverses a contiguous segment $A[l..r]$ using a two-pointer swap loop: $l$ starts at the left boundary, $r$ at the right boundary, and on each step they swap $A[l] \leftrightarrow A[r]$ and converge ($l \gets l + 1$, $r \gets r - 1$) until $l \ge r$.

**Lemma 1: The two-pointer swap loop correctly reverses $A[l..r]$ in place.**

*Proof:*

Define the loop invariant: after $t$ iterations, the outermost $t$ pairs have been swapped — positions $l, \ldots, l + t - 1$ and $r - t + 1, \ldots, r$ hold their reversed values, and the unprocessed interior $A[l + t .. r - t]$ retains its original content.

1. *Base case ($t = 0$).* No swaps have occurred. The entire segment is unprocessed. The invariant holds vacuously.

2. *Inductive step.* The swap $A[l + t] \leftrightarrow A[r - t]$ places position $l + t$ and $r - t$ into their reversed positions, extending the processed boundary inward by one on each side.

3. *Termination.* The loop exits when $l + t \ge r - t$, i.e., $t \ge \lfloor d / 2 \rfloor$ where $d = r - l + 1$. At this point, all $\lfloor d / 2 \rfloor$ pairs have been swapped. If $d$ is odd, the center element remains in place — which is its correct reversed position. The segment is fully reversed. $\blacksquare$

Phases 2 and 3 operate on disjoint segments ($[0, k'-1]$ and $[k', n-1]$), so they cannot interfere with each other. Every element participates in exactly one swap during Phase 1 and at most one swap during Phases 2–3.

## 4. Proof of Correctness: The Three-Phase Rotation

**Theorem 2: The three-phase algorithm produces $A^{(f)} = T \| F$.**

*Proof:*

By the block decomposition from §1, $A^{(0)} = F \| T$.

**Phase 1** — Reverse the whole array ($[0, n-1]$):

$$A^{(1)} = \text{Rev}(A^{(0)}) = \text{Rev}(F \| T) = \text{Rev}(T) \| \text{Rev}(F) \quad \text{(by Theorem 1)}$$

The front $k'$ positions now hold $\text{Rev}(T)$ and the back $n - k'$ positions hold $\text{Rev}(F)$.

**Phase 2** — Reverse the front block ($[0, k'-1]$):

$$A^{(2)}[0..k'-1] = \text{Rev}(\text{Rev}(T)) = T \quad \text{(by Corollary 1.1)}$$

The back block is untouched: $A^{(2)}[k'..n-1] = \text{Rev}(F)$.

**Phase 3** — Reverse the back block ($[k', n-1]$):

$$A^{(f)}[k'..n-1] = \text{Rev}(\text{Rev}(F)) = F \quad \text{(by Corollary 1.1)}$$

The front block is untouched: $A^{(f)}[0..k'-1] = T$.

Therefore:

$$A^{(f)} = T \| F = \text{Rot}_k(A^{(0)}) \quad \blacksquare$$

**Corollary 2.1:** If $k' = 0$ (rotation is a multiple of $n$), $T$ is empty, $F = A$, and $A^{(f)} = A^{(0)}$. The algorithm short-circuits before any reversal is performed.

**Corollary 2.2:** If $n = 1$, then $k' = 0$ for any $k$, so the single-element array is unchanged.

**Corollary 2.3:** If $k' = n - 1$, $F$ is a single element and $T$ has $n - 1$ elements. The result moves the first element to the last position — equivalent to a left rotation by 1.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A^{(0)} = (1, 2, 3, 4, 5, 6, 7)$, $n = 7$, $k = 3$, $k' = 3$.

Block decomposition: $F = (1, 2, 3, 4)$, $T = (5, 6, 7)$. Target: $T \| F = (5, 6, 7, 1, 2, 3, 4)$.

| Phase | Operation | Segment | Array state |
| :--- | :--- | :--- | :--- |
| **0** | initial | — | $(1, 2, 3, 4, 5, 6, 7)$ |
| **1** | $\text{Rev}(0, 6)$ | whole array | $(7, 6, 5, 4, 3, 2, 1)$ |
| **2** | $\text{Rev}(0, 2)$ | front $k' = 3$ | $(5, 6, 7, 4, 3, 2, 1)$ |
| **3** | $\text{Rev}(3, 6)$ | back $n - k' = 4$ | $(5, 6, 7, 1, 2, 3, 4)$ |

**Detail of Phase 1 swaps:**

| Swap | $l$ | $r$ | Before | After |
| :--- | :--- | :--- | :--- | :--- |
| **1** | $0$ | $6$ | $A[0] = 1,\; A[6] = 7$ | $A[0] = 7,\; A[6] = 1$ |
| **2** | $1$ | $5$ | $A[1] = 2,\; A[5] = 6$ | $A[1] = 6,\; A[5] = 2$ |
| **3** | $2$ | $4$ | $A[2] = 3,\; A[4] = 5$ | $A[2] = 5,\; A[4] = 3$ |

Position 3 ($A[3] = 4$) is the midpoint — it stays in place.

*Note on Phase 1: After the whole-array reversal, the front three positions hold $(7, 6, 5) = \text{Rev}(T)$ — the tail block has arrived in the correct region but in reversed internal order. By Theorem 1, the reversal of the concatenation $F \| T$ necessarily delivered $\text{Rev}(T)$ to the front and $\text{Rev}(F)$ to the back. This is the moment where the reversal-concatenation identity manifests most visibly: the two blocks have swapped positions, but each block's internal order has been inverted. Phases 2 and 3 each apply Corollary 1.1 to undo the internal reversal within each block, restoring the original left-to-right order without disturbing each other's region.*

**Result:** $A^{(f)} = (5, 6, 7, 1, 2, 3, 4) = T \| F$.

The theoretical guarantees translate into the mechanical result: Theorem 1 predicted the whole-array reversal would swap the block positions while internally reversing each block, Corollary 1.1 ensured each subsequent phase-reversal restored the original internal order, and Theorem 2 composed the three phases into the target rotation $T \| F = (5, 6, 7, 1, 2, 3, 4)$.
