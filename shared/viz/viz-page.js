/*  viz-page.js
 *  Interactive section scaffold generator.
 *
 *  Generates the standard interactive visualization section
 *  (toolbar, legend, viz container, timeline, info grid, note,
 *  order strip) from a configuration object. Returns DOM references
 *  for wiring up the renderer.
 *
 *  Usage:
 *    <script src="../../../shared/viz/viz-page.js"><\/script>
 *
 *    const refs = VizPage.createInteractive(mountEl, {
 *        legend: [
 *          { className: 'solid', label: 'top row' },
 *          { dot: true, label: 'current' }
 *        ],
 *        boundaries: [{ id: 'top', label: 'top', accent: 'accent-solid' }, ...],
 *        status:     [{ id: 'direction', label: 'Direction' }, ...],
 *        orderTitle: 'Spiral Order'
 *    });
 */

const VizPage = (() => 
{
  "use strict"

  function cap(s) 
  {
    return s.charAt(0).toUpperCase() + s.slice(1) 
  }

  /**
     * Generate and inject the interactive section HTML.
     *
     * @param {HTMLElement} targetEl — mount point (contents replaced)
     * @param {Object} config
     * @param {Array}  config.legend — legend items
     * @param {Array}  config.boundaries
     * boundary definitions (for frames, labels, values bar)
     * @param {Array}  config.pointers — pointer definitions for array algorithms
     * @param {Array}  config.status — status bar item definitions
     * @param {Array}  [config.values] — values bar items (defaults to boundaries)
     * @param {string} [config.gridClass='viz-grid'] — CSS class for the grid element
     * @param {string} [config.orderTitle='Output Order'] — order strip heading
     * @param {boolean} [config.showNote=true]
     * @param {boolean} [config.showOrder=true]
     * @returns {Object}
     * DOM references: { grid, container, note, frames, labels, values, status }
     */
  function createInteractive(targetEl, config = {}) 
  {
    const {
      legend = [],
      boundaries = [],
      pointers = [],
      status = [],
      values,
      gridClass = "viz-grid",
      orderTitle = "Output Order",
      showNote = true,
      showOrder = true
    } = config

    const vals = values || (boundaries.length ? boundaries : pointers)

    targetEl.innerHTML = [
      '<div class="interactive">',
      toolbar(),
      legendBlock(legend),
      vizContainer(boundaries, gridClass),
      timeline(),
      infoGrid(status, vals),
      showNote ? '<div id="note" class="note"></div>' : '',
      showOrder ? orderSection(orderTitle) : '',
      '</div>'
    ].join("\n")

    return collectRefs(boundaries, status, vals, showNote)
  }

  /* ── Fragment builders ─────────────────────────────── */

  function toolbar() 
  {
    return [
      '<div class="toolbar">',
      '<select id="presetSelect" aria-label="Matrix preset"></select>',
      '<div class="transport">',
      '<button id="restartBtn" aria-label="Restart">Restart</button>',
      '<button id="prevBtn" aria-label="Previous step">Prev</button>',
      '<button id="playBtn" class="primary" aria-label="Play or pause">Play</button>',
      '<button id="nextBtn" aria-label="Next step">Next</button>',
      '</div>',
      '</div>'
    ].join("\n")
  }

  function legendBlock(items) 
  {
    if (!items.length) return ""
    const spans = items.map(i =>
      i.dot
        ? `<span class="legend-item"><span class="legend-dot"></span> ${i.label}</span>`
        : (
          `<span class="legend-item"><span class="legend-line ${i.className}"></span> ` +
          `${i.label}</span>`
        )
    )
    return `<div class="legend">${spans.join("")}</div>`
  }

  function vizContainer(boundaries, gridClass) 
  {
    const lbls = boundaries.map(b =>
      (
        `<span class="boundary-label label-${b.id}" id="label${cap(b.id)}">` +
        `${b.label} <span class="bval">0</span></span>`
      )
    ).join("\n")
    const frms = boundaries.map(b =>
      `<div class="boundary-frame frame-${b.id}" id="frame${cap(b.id)}"></div>`
    ).join("\n")
    return [
      '<div class="viz-container" id="vizContainer">',
      placeholder(),
      lbls, frms,
      `<div id="vizGrid" class="${gridClass}" aria-live="polite"></div>`,
      '</div>'
    ].join("\n")
  }

  function placeholder()
  {
    return [
      '<div class="viz-placeholder" id="vizPlaceholder" hidden aria-hidden="true">',
      '<span class="viz-placeholder-label">Ready</span>',
      '<div class="viz-placeholder-cta">Press Play or Next</div>',
      '<p class="viz-placeholder-preset" id="vizPlaceholderPreset"></p>',
      '</div>'
    ].join("\n")
  }

  function timeline() 
  {
    return [
      '<div class="timeline">',
      '<div class="timeline-labels">',
      '<span id="stepLabel">Start</span>',
      '<span id="stepHint">Ready</span>',
      '</div>',
      (
        '<input id="stepSlider" type="range" min="-1" max="0" value="-1" ' +
        'aria-label="Step scrubber">'
      ),
      '</div>'
    ].join("\n")
  }

  function infoGrid(statusItems, valueItems) 
  {
    const sCells = statusItems.map(s =>
      (
        `<div class="status-item"><small>${s.label}</small>` +
        `<span id="${s.id}Display" class="status-value">\u2014</span></div>`
      )
    ).join("\n")
    const vCells = valueItems.map(v =>
      (
        `<div class="val-cell ${v.accent || ""}"><small>${v.label}</small>` +
        `<strong id="${v.id}Val">0</strong></div>`
      )
    ).join("\n")
    return [
      '<div class="info-grid">',
      `<div class="status-bar">${sCells}</div>`,
      `<div class="values-bar">${vCells}</div>`,
      '</div>'
    ].join("\n")
  }

  function orderSection(title) 
  {
    return [
      '<div class="order-section">',
      `<h3>${title}</h3>`,
      '<div id="orderStrip" class="order-strip"></div>',
      '</div>'
    ].join("\n")
  }

  /* ── Ref collector ─────────────────────────────────── */

  function collectRefs(boundaries, statusItems, valueItems, hasNote) 
  {
    const refs = {
      grid:      document.getElementById("vizGrid"),
      container: document.getElementById("vizContainer"),
      placeholder: document.getElementById("vizPlaceholder"),
      placeholderPreset: document.getElementById("vizPlaceholderPreset"),
      frames:    {},
      labels:    {},
      values:    {},
      status:    {}
    }

    if (hasNote) refs.note = document.getElementById("note")

    boundaries.forEach(b => 
    {
      refs.frames[b.id] = document.getElementById(`frame${cap(b.id)}`)
      refs.labels[b.id] = document.getElementById(`label${cap(b.id)}`)
    })

    statusItems.forEach(s => 
    {
      refs.status[s.id] = document.getElementById(`${s.id}Display`)
    })

    valueItems.forEach(v => 
    {
      refs.values[v.id] = document.getElementById(`${v.id}Val`)
    })

    return refs
  }

  return { createInteractive }
})()
