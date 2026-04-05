/*  viz-grid.js
 *  Matrix grid renderer with boundary frame overlays.
 *
 *  Handles the common rendering pattern for grid/matrix algorithm
 *  visualizations: cells with visit badges, outer-layer dimming,
 *  sweep highlighting, and four-sided boundary frames with labels.
 *
 *  Usage:
 *    <script src="../../../shared/viz/viz-grid.js"><\/script>
 *
 *    const cols = VizGrid.renderCells(gridEl, { matrix, layer, step, visited, sweep });
 *    VizGrid.positionFrames(containerEl, gridEl, { layer, cols, frames, labels });
 */

const VizGrid = (() => {
    "use strict";

    /**
     * Render matrix cells into a CSS Grid element.
     *
     * Builds cell elements with appropriate class names for styling:
     * .visited, .current, .sweep, .outer-layer. Each cell contains a
     * .visit-badge (ordinal) and .cell-value (matrix content).
     *
     * @param {HTMLElement} gridEl — the .viz-grid container
     * @param {Object} config
     * @param {number[][]} config.matrix — 2D matrix data
     * @param {Object} config.layer — current boundary { top, right, bottom, left }
     * @param {Object|null} config.step — current step { row, col } or null
     * @param {Map<string,number>} config.visited — "r-c" → 1-based visit order
     * @param {Set<string>} config.sweep — "r-c" keys in the active sweep
     * @returns {number} column count
     */
    function renderCells(gridEl, { matrix, layer, step, visited, sweep }) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        gridEl.style.gridTemplateColumns = `repeat(${cols}, auto)`;

        const frag = document.createDocumentFragment();

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const key = `${r}-${c}`;
                const cell = document.createElement("div");
                cell.className = "cell";

                if (r < layer.top || r > layer.bottom || c < layer.left || c > layer.right)
                    cell.classList.add("outer-layer");
                if (visited.has(key))  cell.classList.add("visited");
                if (sweep.has(key))    cell.classList.add("sweep");
                if (step && step.row === r && step.col === c) cell.classList.add("current");

                const badge = document.createElement("span");
                badge.className = "visit-badge";
                badge.textContent = visited.get(key) ?? "";

                const val = document.createElement("span");
                val.className = "cell-value";
                val.textContent = matrix[r][c];

                cell.append(badge, val);
                frag.appendChild(cell);
            }
        }

        gridEl.replaceChildren(frag);
        return cols;
    }

    /**
     * Position four boundary frame overlays and their labels
     * around the cells of the current layer.
     *
     * @param {HTMLElement} containerEl — the .viz-container wrapper
     * @param {HTMLElement} gridEl — the .viz-grid element
     * @param {Object} config
     * @param {Object} config.layer — { top, right, bottom, left }
     * @param {number} config.cols — column count of the matrix
     * @param {Object} config.frames — { top: el, right: el, bottom: el, left: el }
     * @param {Object} config.labels — { top: el, right: el, bottom: el, left: el }
     * @param {number} [config.inset=12] — px between cell edge and frame line
     * @param {number} [config.labelGap=8] — px between frame line and label
     */
    function positionFrames(containerEl, gridEl, config) {
        const { layer, cols, frames, labels, inset = 12, labelGap = 8 } = config;
        const cells = gridEl.querySelectorAll(".cell");
        if (!cells.length) return;

        const cr = containerEl.getBoundingClientRect();
        const tl = cells[layer.top * cols + layer.left];
        const br = cells[layer.bottom * cols + layer.right];
        if (!tl || !br) return;

        const a = tl.getBoundingClientRect();
        const b = br.getBoundingClientRect();

        const fT = a.top    - cr.top  - inset;
        const fL = a.left   - cr.left - inset;
        const fB = b.bottom - cr.top  + inset;
        const fR = b.right  - cr.left + inset;
        const w  = fR - fL;
        const h  = fB - fT;

        frames.top.style.cssText    = `top:${fT}px;left:${fL}px;width:${w}px;`;
        frames.right.style.cssText  = `top:${fT}px;left:${fR}px;height:${h}px;`;
        frames.bottom.style.cssText = `top:${fB}px;left:${fL}px;width:${w}px;`;
        frames.left.style.cssText   = `top:${fT}px;left:${fL}px;height:${h}px;`;

        const mx = fL + w / 2;
        const my = fT + h / 2;
        const g  = labelGap;

        labels.top.style.top     = `${fT - g}px`;
        labels.top.style.left    = `${mx}px`;
        labels.bottom.style.top  = `${fB + g}px`;
        labels.bottom.style.left = `${mx}px`;
        labels.left.style.top    = `${my}px`;
        labels.left.style.left   = `${fL - g}px`;
        labels.right.style.top   = `${my}px`;
        labels.right.style.left  = `${fR + g}px`;
    }

    /**
     * Build a visited-cells map from trace steps up to a given position.
     *
     * @param {Array} steps — step objects with { row, col, index }
     * @param {number} position — current step index (-1 = none)
     * @returns {Map<string,number>} "r-c" → 1-based visit order
     */
    function buildVisited(steps, position) {
        const visited = new Map();
        for (let i = 0; i <= position && i < steps.length; i++) {
            const s = steps[i];
            visited.set(`${s.row}-${s.col}`, s.index + 1);
        }
        return visited;
    }

    return { renderCells, positionFrames, buildVisited };
})();
