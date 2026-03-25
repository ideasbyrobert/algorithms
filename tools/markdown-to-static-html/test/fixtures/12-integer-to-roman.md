# Formal Proof of the Greedy Roman Numeral Construction Algorithm

To establish the correctness of the Greedy Roman Numeral Construction algorithm, we must rigorously prove two properties: that the denomination table's place-value structure causes the greedy process to encode each decimal digit into its canonical Roman form, and that the descending scan order isolates the four place values so the concatenated output is the unique canonical Roman numeral. We will dismantle the problem into a digit-encoding theorem (§2), a place-value separation lemma (§3), and a canonical output proof (§4).

## 1. First Principles & System Definitions

**Problem objects.** Let $n \in \mathbb{Z}_{>0}$ be an integer. The *decimal digit extraction* at place $p$ is:

$$d_p(n) = \lfloor n / 10^p \rfloor \bmod 10 \quad \text{for } p \in \{0, 1, 2\}, \qquad d_3(n) = \lfloor n / 1000 \rfloor$$

giving the decomposition $n = 1000\,d_3 + 100\,d_2 + 10\,d_1 + d_0$.

Define the *canonical denomination table* as a sequence of 13 tokens:

$$T = \bigl((v_0, s_0),\; (v_1, s_1),\; \ldots,\; (v_{12}, s_{12})\bigr)$$

| $k$ | $v_k$ | $s_k$ | Group |
| :--- | :--- | :--- | :--- |
| $0$ | $1000$ | $\text{M}$ | $G_3$ |
| $1$ | $900$ | $\text{CM}$ | $G_2$ |
| $2$ | $500$ | $\text{D}$ | $G_2$ |
| $3$ | $400$ | $\text{CD}$ | $G_2$ |
| $4$ | $100$ | $\text{C}$ | $G_2$ |
| $5$ | $90$ | $\text{XC}$ | $G_1$ |
| $6$ | $50$ | $\text{L}$ | $G_1$ |
| $7$ | $40$ | $\text{XL}$ | $G_1$ |
| $8$ | $10$ | $\text{X}$ | $G_1$ |
| $9$ | $9$ | $\text{IX}$ | $G_0$ |
| $10$ | $5$ | $\text{V}$ | $G_0$ |
| $11$ | $4$ | $\text{IV}$ | $G_0$ |
| $12$ | $1$ | $\text{I}$ | $G_0$ |

The values are strictly decreasing: $v_0 > v_1 > \cdots > v_{12}$. The table partitions into four *place-value groups*. For each place $p \in \{0, 1, 2\}$, define the base unit $b_p = 10^p$ and the group:

$$G_p = \bigl((9b_p,\; s_{9b_p}),\;\; (5b_p,\; s_{5b_p}),\;\; (4b_p,\; s_{4b_p}),\;\; (b_p,\; s_{b_p})\bigr)$$

The thousands group is $G_3 = \bigl((1000, \text{M})\bigr)$.

Define the *canonical digit encoding* $\rho_p : \{0, \ldots, 9\} \to \Sigma^*$ as the standard Roman representation of digit $d$ at place $p$. For $p \in \{0, 1, 2\}$:

$$\rho_p(d) = \begin{cases}
\varepsilon & \text{if } d = 0 \\
s_{b_p}^{\;d} & \text{if } 1 \le d \le 3 \\
s_{4b_p} & \text{if } d = 4 \\
s_{5b_p} & \text{if } d = 5 \\
s_{5b_p} \cdot s_{b_p}^{\;d-5} & \text{if } 6 \le d \le 8 \\
s_{9b_p} & \text{if } d = 9
\end{cases}$$

For $p = 3$: $\rho_3(d) = \text{M}^d$ for $d \in \{0, 1, 2, 3\}$.

The *canonical Roman numeral* for $n$ is the concatenation:

$$R(n) = \rho_3(d_3) \cdot \rho_2(d_2) \cdot \rho_1(d_1) \cdot \rho_0(d_0)$$

**Preconditions and contract assumptions.**

* *Input range:* $1 \le n \le 3999$.
* *Denomination completeness:* $T$ contains all 13 tokens — the 7 base symbols and 6 subtractive compounds.
* *Descending order:* $v_0 > v_1 > \cdots > v_{12}$.

**Postcondition.**

$$S^{(f)} = R(n) \quad \text{and} \quad r^{(f)} = 0$$

**State variables.**

* $r \in \{0, 1, \ldots, 3999\}$ — the remaining value to encode.
* $k \in \{0, 1, \ldots, 13\}$ — current position in the denomination table (outer scan index; $k = 13$ signals termination).
* $S \in \Sigma^*$ — the output string accumulated so far.

**Initialization.**

$$r = n, \quad k = 0, \quad S = \varepsilon$$

## 2. The Greedy Choice Property (Digit Encoding)

**Theorem 1: For any place $p \in \{0, 1, 2\}$ and digit $d \in \{0, \ldots, 9\}$, the greedy algorithm applied to group $G_p$ starting with remainder $r = d \cdot b_p + r'$ (where $0 \le r' < b_p$) emits exactly $\rho_p(d)$ and terminates with remainder $r'$.**

*Proof:*

The greedy algorithm scans $G_p = \bigl((9b_p,\; s_{9b_p}),\; (5b_p,\; s_{5b_p}),\; (4b_p,\; s_{4b_p}),\; (b_p,\; s_{b_p})\bigr)$ and for each token repeatedly emits while $r \ge v_k$. Since every token value in $G_p$ is a multiple of $b_p$ and $0 \le r' < b_p$, the sub-base residue $r'$ never triggers or prevents a token emission: for any token value $c \cdot b_p$ in the group, $r \ge c \cdot b_p$ if and only if $d \ge c$, because $d \cdot b_p \le r < (d+1) \cdot b_p$ forces the comparison to depend entirely on $d$. All greedy decisions therefore depend only on $d$.

*Case $d = 9$:* $r = 9b_p + r' \ge 9b_p$. Emit $s_{9b_p}$; $r \to r'$. Since $r' < b_p \le 4b_p$, no further token fires. Output: $s_{9b_p} = \rho_p(9)$.

*Case $5 \le d \le 8$:* $r = db_p + r'$. Since $d \le 8$, $r < 9b_p$; skip $9b_p$. Since $d \ge 5$, $r \ge 5b_p$; emit $s_{5b_p}$, $r \to (d-5)b_p + r'$. Now $d - 5 \in \{0, 1, 2, 3\}$, so $r = (d-5)b_p + r' \le 3b_p + (b_p - 1) < 4b_p$; skip $4b_p$. The token $b_p$ fires $(d - 5)$ times, each subtracting $b_p$. Final remainder: $r'$. Output: $s_{5b_p} \cdot s_{b_p}^{\;d-5} = \rho_p(d)$.

*Case $d = 4$:* $r = 4b_p + r' < 5b_p$. Skip $9b_p, 5b_p$. Since $r \ge 4b_p$, emit $s_{4b_p}$; $r \to r'$. Since $r' < b_p$, the token $b_p$ does not fire. Output: $s_{4b_p} = \rho_p(4)$.

*Case $1 \le d \le 3$:* $r = db_p + r' < 4b_p$. Skip $9b_p, 5b_p, 4b_p$. The token $b_p$ fires $d$ times, each subtracting $b_p$. Final remainder: $r'$. Output: $s_{b_p}^{\;d} = \rho_p(d)$.

*Case $d = 0$:* $r = r' < b_p$. Every token value in $G_p$ is at least $b_p$, so no token fires. Output: $\varepsilon = \rho_p(0)$.

In every case, the output is $\rho_p(d)$ and the remainder is $r'$. $\blacksquare$

**Corollary 1.1: The thousands group encodes correctly.** $G_3 = \bigl((1000, \text{M})\bigr)$ contains a single token. For $d_3 \in \{0, 1, 2, 3\}$, the token $1000$ fires $d_3$ times, producing $\text{M}^{d_3} = \rho_3(d_3)$ and leaving remainder $n - 1000d_3 < 1000$.

## 3. The Descending Denomination Scan (Place-Value Separation)

The denomination table processes tokens in strictly decreasing value order. The four groups occupy contiguous segments: $G_3$ at index $0$, $G_2$ at indices $1$–$4$, $G_1$ at indices $5$–$8$, $G_0$ at indices $9$–$12$. After the algorithm finishes a group's tokens, it advances to the next group without backtracking.

**Lemma 1: After the greedy algorithm completes group $G_p$, the remainder satisfies $r < 10^p$.**

*Proof:*

By induction on the place-value stages, processed in the order $p = 3, 2, 1, 0$.

1. *Base ($p = 3$):* Before $G_3$, $r = n \le 3999$, so $d_3 = \lfloor n / 1000 \rfloor \le 3$. By Corollary 1.1, after $G_3$ the remainder is $n - 1000d_3 < 1000 = 10^3$.

2. *Inductive step ($p \in \{2, 1, 0\}$):* Assume the remainder entering $G_p$ satisfies $r < 10^{p+1}$. Write $r = d \cdot 10^p + r'$ where $d = \lfloor r / 10^p \rfloor \le 9$ and $0 \le r' < 10^p$. By Theorem 1, the greedy algorithm on $G_p$ emits $\rho_p(d)$ and leaves remainder $r' < 10^p$.

By induction, the remainder after each group is below the group's base unit. $\blacksquare$

**Corollary L1.1: Each group operates on its digit independently.** Since the remainder entering $G_p$ has the form $\sum_{q=0}^{p} d_q \cdot 10^q$ and all tokens in $G_p$ are multiples of $10^p$, the sub-base residue $r' = \sum_{q=0}^{p-1} d_q \cdot 10^q$ passes through the group unchanged. Lower-place digits are neither consumed nor disturbed.

## 4. Proof of Correctness: Canonical Output

**Theorem 2: Upon termination, $S^{(f)} = R(n)$ and $r^{(f)} = 0$.**

*Proof:*

The algorithm scans $T$ from $k = 0$ to $k = 12$. By Lemma 1 and Theorem 1, the four groups process in sequence, each encoding its corresponding decimal digit:

1. $G_3$ emits $\rho_3(d_3)$. Remainder: $100d_2 + 10d_1 + d_0$.

2. $G_2$ emits $\rho_2(d_2)$. Remainder: $10d_1 + d_0$.

3. $G_1$ emits $\rho_1(d_1)$. Remainder: $d_0$.

4. $G_0$ emits $\rho_0(d_0)$. Remainder: $0$.

The concatenation of emitted symbols is:

$$S^{(f)} = \rho_3(d_3) \cdot \rho_2(d_2) \cdot \rho_1(d_1) \cdot \rho_0(d_0) = R(n)$$

The final remainder is $r^{(f)} = 0$: at the lowest place value ($p = 0$, $b_0 = 1$), Theorem 1 guarantees the sub-base residue is $r' = 0$ because there is no fractional part below the units place — the remainder entering $G_0$ is $d_0 = d_0 \cdot 1 + 0$, so Theorem 1 yields remainder $0$. $\blacksquare$

**Corollary 2.1:** If $n < 10$ (single decimal digit), groups $G_3$, $G_2$, and $G_1$ emit nothing ($d_3 = d_2 = d_1 = 0$). The output is $\rho_0(n)$ — the ones-digit encoding alone.

**Corollary 2.2:** If $n$ is a multiple of $1000$ (e.g., $n = 3000$), only $G_3$ emits (producing $\text{M}^{d_3}$). All other groups encounter digit $0$ and produce nothing.

**Corollary 2.3:** If every non-zero digit of $n$ is $4$ or $9$ (e.g., $n = 944$, digits $(0, 9, 4, 4)$), each active group emits a single subtractive token. The output $\text{CM} \cdot \text{XL} \cdot \text{IV} = \text{CMXLIV}$ demonstrates the independence of place-value encodings — three subtractive forms from three separate groups concatenated without interference.

***

## 5. Mechanical Execution (System Trace)

**Input System.** $n = 1994$, $T$ = canonical 13-token table. Decimal digits: $d_3 = 1$, $d_2 = 9$, $d_1 = 9$, $d_0 = 4$.

| Step | $k$ | Token ($s_k$) | $v_k$ | Group | $r$ before | $r$ after | $S$ after |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | $0$ | $\text{M}$ | $1000$ | $G_3$ | $1994$ | $994$ | $\text{M}$ |
| **2** | $1$ | $\text{CM}$ | $900$ | $G_2$ | $994$ | $94$ | $\text{MCM}$ |
| **3** | $5$ | $\text{XC}$ | $90$ | $G_1$ | $94$ | $4$ | $\text{MCMXC}$ |
| **4** | $11$ | $\text{IV}$ | $4$ | $G_0$ | $4$ | $0$ | $\text{MCMXCIV}$ |

**Result:** $r^{(f)} = 0$, $S^{(f)} = \text{MCMXCIV} = R(1994)$.

*Note on the index gaps ($k$: $0 \to 1 \to 5 \to 11$): At each group boundary, the remainder has already dropped below the entering group's base unit — $994 < 1000$ after $G_3$, $94 < 100$ after $G_2$, $4 < 10$ after $G_1$ — so the intervening tokens at indices $2$–$4$, $6$–$8$, and $9$–$10$ all fail the greedy condition $r \ge v_k$. This is Lemma 1 in action: each group exhausts exactly its decimal digit and the descending scan passes cleanly through each group transition without emitting stray tokens from adjacent place values. The subtractive tokens $\text{CM}$, $\text{XC}$, and $\text{IV}$ at Steps 2–4 are the single-token encodings that Theorem 1's case $d = 9$ and case $d = 4$ predict — had the denomination table lacked these six subtractive entries, the greedy process would have produced $\text{DCCCC}$, $\text{LXXXX}$, and $\text{IIII}$ instead, violating the canonical form.*

The theoretical guarantees translate into the mechanical result: Theorem 1 confirmed each group encodes its digit canonically ($\text{M}$ for $d_3 = 1$, $\text{CM}$ for $d_2 = 9$, $\text{XC}$ for $d_1 = 9$, $\text{IV}$ for $d_0 = 4$), Lemma 1 ensured the place-value groups operate in isolation, and Theorem 2 composed the four encodings into the canonical Roman numeral $\text{MCMXCIV}$.
