# Formal Proof of the Right-to-Left Binary Addition Algorithm

To establish the correctness of the Right-to-Left Binary Addition algorithm, we must rigorously prove three properties: that the carry never exceeds a single bit, that each column's modular arithmetic faithfully implements a binary full-adder, and that the accumulated result bits compose the binary representation of the input sum. We will dismantle the problem into a carry-bound theorem (§2), a full-adder identity (§3), and a column-value invariant (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $A$ and $B$ be finite binary strings of lengths $m$ and $n$ respectively. Define bit positions by their power of 2: $a_k \in \{0, 1\}$ is the bit at position $k$ of $A$ (weight $2^k$), with position $0$ being the least significant bit. Extend both strings with zeros beyond their length:

$$a_k = 0 \;\text{ for }\; k \ge m, \qquad b_k = 0 \;\text{ for }\; k \ge n$$

The *numeric values* are:

$$\text{val}(A) = \sum_{i=0}^{m-1} a_i \cdot 2^i, \qquad \text{val}(B) = \sum_{j=0}^{n-1} b_j \cdot 2^j$$

The *binary sum* is the unique binary string $R = (r_{K-1}, \ldots, r_1, r_0)$ satisfying $r_i \in \{0, 1\}$ for all $i$, $\text{val}(R) = \text{val}(A) + \text{val}(B)$, and either $K = 1$ (the sum is zero) or $r_{K-1} = 1$ (no leading zeros).

**Preconditions and contract assumptions.**

* *Binary validity:* $a_k, b_j \in \{0, 1\}$ for all relevant positions.
* *Non-empty:* $m \ge 1$ and $n \ge 1$.
* *No leading zeros:* $a_{m-1} = 1$ unless $m = 1$ and $a_0 = 0$; likewise for $B$.
* *Unbounded length:* The algorithm operates digit-by-digit without converting to fixed-width integers.

**Postcondition.**

$$\text{val}(R) = \text{val}(A) + \text{val}(B)$$

**State variables.**

* $k \in \{0, 1, \ldots\}$ — current bit position, advancing from LSB toward MSB.
* $c_k \in \mathbb{Z}_{\ge 0}$ — carry into position $k$.
* $r_k \in \{0, 1\}$ — result bit at position $k$.
* $\sigma_k \in \mathbb{Z}_{\ge 0}$ — column sum at position $k$.

**Initialization.**

$$k = 0, \quad c_0 = 0$$

**Iteration.** At each position $k$, the algorithm computes:

$$\sigma_k = a_k + b_k + c_k, \qquad r_k = \sigma_k \bmod 2, \qquad c_{k+1} = \lfloor \sigma_k / 2 \rfloor$$

Then $k$ advances to $k + 1$.

**Termination.** The loop runs while $k < m$ or $k < n$ or $c_k \neq 0$. It exits at the first position $K$ where all three conditions fail simultaneously.

## 2. The Carry Bound (Safety)

**Theorem 1: The carry satisfies $c_k \in \{0, 1\}$ at every position $k \ge 0$.**

*Proof:*

1. *Base case.* $c_0 = 0 \in \{0, 1\}$.

2. *Inductive step.* Assume $c_k \in \{0, 1\}$. The column sum is:

   $$\sigma_k = a_k + b_k + c_k$$

   Since $a_k \in \{0, 1\}$, $b_k \in \{0, 1\}$, and $c_k \in \{0, 1\}$:

   $$\sigma_k \in \{0, 1, 2, 3\}$$

   Therefore:

   $$c_{k+1} = \lfloor \sigma_k / 2 \rfloor \in \{0, 1\}$$

3. By induction, $c_k \in \{0, 1\}$ for all $k \ge 0$. $\blacksquare$

**Corollary 1.1: The result bit $r_k \in \{0, 1\}$.** Since $\sigma_k \in \{0, 1, 2, 3\}$, $r_k = \sigma_k \bmod 2 \in \{0, 1\}$. Every result bit is a valid binary digit.

**Corollary 1.2: The loop terminates.** Let $L = \max(m, n)$. For all $k \ge L$, $a_k = b_k = 0$, so $\sigma_k = c_k \in \{0, 1\}$. If $c_L = 0$, the loop exits at $K = L$. If $c_L = 1$, then $\sigma_L = 1$, $r_L = 1$, $c_{L+1} = 0$, and the loop exits at $K = L + 1$. The result has at most $\max(m, n) + 1$ bits.

## 3. Algorithm Mapping: The Binary Full-Adder

At each position $k$, the algorithm performs integer division of the column sum $\sigma_k$ by 2, extracting a remainder (the result bit) and a quotient (the outgoing carry). This is the classical binary full-adder operation.

**Lemma 1: The full-adder identity holds at every position.**

$$r_k + 2 \cdot c_{k+1} = a_k + b_k + c_k \quad \text{for all } k \ge 0$$

*Proof:*

By the division algorithm applied to $\sigma_k$ with divisor 2:

$$\sigma_k = 2 \cdot \lfloor \sigma_k / 2 \rfloor + (\sigma_k \bmod 2) = 2 \cdot c_{k+1} + r_k$$

Rearranging: $r_k + 2 \cdot c_{k+1} = \sigma_k = a_k + b_k + c_k$. $\blacksquare$

The full-adder decomposes the column sum into its "stays here" component ($r_k$, the bit written at position $k$) and its "moves left" component ($c_{k+1}$, the carry into the next higher position). The identity ensures no information is created or destroyed — the column sum is perfectly partitioned between the result bit and the carry.

## 4. Proof of Correctness: The Column-Value Invariant

**Theorem 2: Upon termination, $\text{val}(R) = \text{val}(A) + \text{val}(B)$.**

*Proof:*

Define the loop invariant at the start of iteration $k$:

$$\text{INV}(k): \quad \sum_{i=0}^{k-1} r_i \cdot 2^i \;+\; c_k \cdot 2^k \;=\; \sum_{i=0}^{k-1} (a_i + b_i) \cdot 2^i$$

The invariant states that the numeric value of the result bits computed so far, augmented by the carry at its positional weight, equals the column-by-column sum of the inputs processed so far.

1. *Base case ($k = 0$).* No result bits have been computed. The sums on both sides are empty, and $c_0 = 0$:

   $$0 + 0 \cdot 2^0 = 0$$

   $\text{INV}(0)$ holds vacuously.

2. *Inductive step.* Assume $\text{INV}(k)$ holds. After processing position $k$:

   $$\begin{aligned}
   \sum_{i=0}^{k} r_i \cdot 2^i + c_{k+1} \cdot 2^{k+1}
   &= \sum_{i=0}^{k-1} r_i \cdot 2^i + r_k \cdot 2^k + c_{k+1} \cdot 2^{k+1} \\
   &= \sum_{i=0}^{k-1} r_i \cdot 2^i + (r_k + 2 \cdot c_{k+1}) \cdot 2^k
   \end{aligned}$$

   By Lemma 1, $r_k + 2 \cdot c_{k+1} = a_k + b_k + c_k$. Substituting:

   $$\begin{aligned}
   &= \sum_{i=0}^{k-1} r_i \cdot 2^i + (a_k + b_k + c_k) \cdot 2^k \\
   &= \underbrace{\sum_{i=0}^{k-1} r_i \cdot 2^i + c_k \cdot 2^k}_{\text{INV}(k)} + (a_k + b_k) \cdot 2^k \\
   &= \sum_{i=0}^{k-1} (a_i + b_i) \cdot 2^i + (a_k + b_k) \cdot 2^k \\
   &= \sum_{i=0}^{k} (a_i + b_i) \cdot 2^i
   \end{aligned}$$

   This is $\text{INV}(k+1)$.

3. *Termination.* The loop exits at position $K$ with $c_K = 0$ and $K \ge \max(m, n)$. By $\text{INV}(K)$:

   $$\sum_{i=0}^{K-1} r_i \cdot 2^i + \underbrace{c_K}_{0} \cdot 2^K = \sum_{i=0}^{K-1} (a_i + b_i) \cdot 2^i$$

   Since $a_i = 0$ for $i \ge m$ and $b_i = 0$ for $i \ge n$:

   $$\text{val}(R) = \sum_{i=0}^{K-1} r_i \cdot 2^i = \sum_{i=0}^{m-1} a_i \cdot 2^i + \sum_{i=0}^{n-1} b_i \cdot 2^i = \text{val}(A) + \text{val}(B)$$

   By Corollary 1.1, every $r_i \in \{0, 1\}$, so $R$ is a valid binary string. $\blacksquare$

**Corollary 2.1:** If $\text{val}(A) = \text{val}(B) = 0$, the loop processes one position ($\sigma_0 = 0$, $r_0 = 0$, $c_1 = 0$) and the result is $R = \text{``0"}$.

**Corollary 2.2:** If one input is "0", then $c_k = 0$ for all $k$ (since the column sum never exceeds 1), and $r_k$ equals the corresponding bit of the non-zero input. The result is the other input unchanged.

**Corollary 2.3:** The result has at most $\max(m, n) + 1$ bits. The extra bit appears if and only if $c_{\max(m,n)} = 1$ — that is, the carry survives past both input strings. This occurs precisely when the sum overflows the wider operand's bit width.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $A = \text{``1010"}$, $B = \text{``1011"}$. Bit positions: $a_3 = 1, a_2 = 0, a_1 = 1, a_0 = 0$; $b_3 = 1, b_2 = 0, b_1 = 1, b_0 = 1$. $m = n = 4$, $L = 4$.

| Step | $k$ | $a_k$ | $b_k$ | $c_k$ | $\sigma_k$ | $r_k$ | $c_{k+1}$ | $R$ (MSB first) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $0$ | $0$ | $1$ | $0$ | $1$ | $1$ | $0$ | $\text{1}$ |
| **2** | $1$ | $1$ | $1$ | $0$ | $2$ | $0$ | $1$ | $\text{01}$ |
| **3** | $2$ | $0$ | $0$ | $1$ | $1$ | $1$ | $0$ | $\text{101}$ |
| **4** | $3$ | $1$ | $1$ | $0$ | $2$ | $0$ | $1$ | $\text{0101}$ |
| **5** | $4$ | $0$ | $0$ | $1$ | $1$ | $1$ | $0$ | $\text{10101}$ |

**Result:** $c_5 = 0$, both strings exhausted. $R = \text{"10101"}$, $\text{val}(R) = 16 + 4 + 1 = 21 = 10 + 11 = \text{val}(A) + \text{val}(B)$.

*Note on Step 5: Both input strings are exhausted ($k = 4 \ge m = n = 4$, so $a_4 = b_4 = 0$), but the carry $c_4 = 1$ from Step 4 forces one additional iteration. This is the only step where the carry alone sustains the loop — the three-way termination condition ($k < m$ or $k < n$ or $c_k \neq 0$) is essential here. Without the carry check, the algorithm would stop after Step 4 and output $\text{"0101"} = 5$, losing the most significant bit. Theorem 1's carry bound guarantees this extra step produces exactly one additional bit ($c_4 = 1$ yields $r_4 = 1, c_5 = 0$), so the loop cannot extend beyond a single overflow position.*

The theoretical guarantees translate into the mechanical result: Theorem 1 ensured the carry never exceeded a single bit, Lemma 1 confirmed each step faithfully partitioned the column sum into a result bit and a carry, and Theorem 2's invariant accumulated the five result bits into the binary sum $\text{``10101"}$.
