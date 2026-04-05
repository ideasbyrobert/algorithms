/*  viz-array.js
 *  1D array renderer with pointer indicators.
 *
 *  Renders a horizontal strip of cells with optional:
 *  - active-range dimming (cells outside range fade)
 *  - pointer arrows positioned above or below cells
 *  - visit badges, current-cell highlight, sweep markers
 *
 *  Usage:
 *    <script src="../../../shared/viz/viz-array.js"><\/script>
 *
 *    const cols = VizArray.renderCells(refs.grid, {
 *        array: [2, 7, 11, 15],
 *        active: new Set([1, 2]),
 *        current: 2,
 *        visited: VizArray.buildVisited(steps, position)
 *    });
 *
 *    const ptrs = VizArray.createPointers(refs.container, [
 *        { id: "low",  label: "low",  position: "below" },
 *        { id: "mid",  label: "mid",  position: "above" }
 *    ]);
 *
 *    VizArray.positionPointers(refs.container, refs.grid, {
 *        pointers: { low: { index: 0 }, mid: { index: 2 } },
 *        elements: ptrs
 *    });
 */

const VizArray = (() => {
    "use strict";

    /**
     * Render array cells into a grid element.
     *
     * @param {Element} gridEl — the .viz-array element
     * @param {Object}  config
     * @param {Array}   config.array    — 1D array of values
     * @param {Set}     [config.active] — indices considered "in range" (others dim)
     * @param {number}  [config.current] — index of the current element
     * @param {Map}     [config.visited] — index → visit-order number
     * @param {Set}     [config.sweep]   — indices in the active sweep
     * @param {Map}     [config.highlights] — index → extra className
     * @returns {number} cell count
     */
    function renderCells(gridEl, config) {
        const { array, active, current, visited, sweep, highlights } = config;
        const n = array.length;

        // Dynamic sizing — shrink cells for longer arrays
        const cellSize = n <= 8 ? null : n <= 12 ? 66 : 56;
        const gap = n <= 12 ? 8 : 6;
        if (cellSize) {
            gridEl.style.setProperty("--array-cell-size", cellSize + "px");
        } else {
            gridEl.style.removeProperty("--array-cell-size");
        }
        gridEl.style.gap = gap + "px";
        gridEl.style.gridTemplateColumns = `repeat(${n}, auto)`;
        gridEl.innerHTML = "";

        for (let i = 0; i < array.length; i++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = i;

            const val = document.createElement("span");
            val.className = "cell-value";
            val.textContent = array[i];
            cell.appendChild(val);

            const idx = document.createElement("span");
            idx.className = "cell-index";
            idx.textContent = i;
            cell.appendChild(idx);

            if (visited && visited.has(i)) {
                cell.classList.add("visited");
                const badge = document.createElement("span");
                badge.className = "visit-badge visible";
                badge.textContent = visited.get(i);
                cell.appendChild(badge);
            }

            if (current === i) cell.classList.add("current");
            if (active && !active.has(i)) cell.classList.add("outer-layer");
            if (sweep && sweep.has(i)) cell.classList.add("sweep");
            if (highlights && highlights.has(i)) cell.classList.add(highlights.get(i));

            gridEl.appendChild(cell);
        }

        return array.length;
    }

    /**
     * Create pointer indicator elements inside a container.
     *
     * @param {Element} containerEl — the .viz-container wrapper
     * @param {Array}   defs — pointer definitions
     * @param {string}  defs[].id       — unique identifier
     * @param {string}  defs[].label    — display label (e.g. "low")
     * @param {string}  [defs[].position='below'] — 'above' or 'below'
     * @returns {Object} { id: Element } map of pointer wrapper elements
     */
    function createPointers(containerEl, defs) {
        const elements = {};
        for (const def of defs) {
            const { id, label, position = "below" } = def;

            const wrapper = document.createElement("div");
            wrapper.className = `array-pointer array-pointer-${position}`;

            const labelEl = document.createElement("span");
            labelEl.className = "ptr-label";
            labelEl.textContent = label;

            const arrowEl = document.createElement("span");
            arrowEl.className = "ptr-arrow";
            arrowEl.textContent = position === "above" ? "\u25BC" : "\u25B2";

            if (position === "above") {
                wrapper.appendChild(labelEl);
                wrapper.appendChild(arrowEl);
            } else {
                wrapper.appendChild(arrowEl);
                wrapper.appendChild(labelEl);
            }

            containerEl.appendChild(wrapper);
            elements[id] = wrapper;
        }
        return elements;
    }

    /**
     * Position pointer elements relative to array cells.
     *
     * @param {Element} containerEl — the .viz-container wrapper
     * @param {Element} gridEl      — the .viz-array element
     * @param {Object}  config
     * @param {Object}  config.pointers  — { id: { index } } current positions
     * @param {Object}  config.elements  — { id: Element } from createPointers
     */
    function positionPointers(containerEl, gridEl, config) {
        const { pointers, elements } = config;
        const containerRect = containerEl.getBoundingClientRect();
        const cells = gridEl.querySelectorAll(".cell");

        const ABOVE_OFFSET = 60;
        const BELOW_OFFSET = 36;
        const COLLISION_DIST = 56;
        const STAGGER = 28;

        const above = [];
        const below = [];

        for (const [id, ptr] of Object.entries(pointers)) {
            const el = elements[id];
            if (!el) continue;

            const { index } = ptr;
            if (index == null || index < 0 || index >= cells.length) {
                el.style.opacity = "0";
                continue;
            }

            const cellRect = cells[index].getBoundingClientRect();
            const cx = cellRect.left + cellRect.width / 2 - containerRect.left;
            el.style.opacity = "1";
            el.style.left = cx + "px";

            const isAbove = el.classList.contains("array-pointer-above");
            (isAbove ? above : below).push({ el, cx, cellRect, stagger: 0 });
        }

        function layoutGroup(group, isAbove) {
            group.sort((a, b) => a.cx - b.cx);
            for (let i = 0; i < group.length; i++) {
                for (let j = 0; j < i; j++) {
                    if (Math.abs(group[i].cx - group[j].cx) < COLLISION_DIST) {
                        group[i].stagger = Math.max(group[i].stagger, group[j].stagger + 1);
                    }
                }
                const { el, cellRect, stagger } = group[i];
                if (isAbove) {
                    el.style.top = (cellRect.top - containerRect.top - ABOVE_OFFSET - stagger * STAGGER) + "px";
                } else {
                    el.style.top = (cellRect.bottom - containerRect.top + BELOW_OFFSET + stagger * STAGGER) + "px";
                }
            }
        }

        layoutGroup(above, true);
        layoutGroup(below, false);
    }

    /**
     * Build visited map from trace steps.
     *
     * @param {Array}  steps    — step objects with `arrayIndex` property
     * @param {number} position — current step index
     * @returns {Map} arrayIndex → visit order (1-based)
     */
    function buildVisited(steps, position) {
        const visited = new Map();
        for (let i = 0; i <= position && i < steps.length; i++) {
            const step = steps[i];
            if (step.arrayIndex != null && !visited.has(step.arrayIndex)) {
                visited.set(step.arrayIndex, i + 1);
            }
        }
        return visited;
    }

    return { renderCells, createPointers, positionPointers, buildVisited };
})();
