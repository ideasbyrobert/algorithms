/*  viz-engine.js
 *  Reusable step-through engine for algorithm visualizations.
 *  Import from any problem folder:
 *    <script src="../../../shared/viz/viz-engine.js"><\/script>
 *
 *  Usage:
 *    const engine = VizEngine.create({
 *      presets:      [ { name, matrix?, data?, ... }, ... ],
 *      buildTrace:   (preset) => ({ steps, order, ...custom }),
 *      onRender:     (engine) => { ... update DOM ... },
 *      describeStep: (engine) => "explanation string",
 *      speed:        600   // ms per step when playing
 *    });
 */

const VizEngine = (() => {
    "use strict";

    /* ── DOM helpers ───────────────────────────────────── */

    const $ = (id) => document.getElementById(id);

    /* ── Factory ───────────────────────────────────────── */

    function create(opts) {
        const {
            presets,
            buildTrace,
            onRender,
            describeStep,
            speed = 600
        } = opts;

        /* state */
        let trace      = null;  // result of buildTrace()
        let position   = -1;    // current step index (-1 = initial)
        let intervalId = null;

        /* dom refs (resolved lazily on first use) */
        let dom = null;

        function resolveDom() {
            dom = {
                presetSelect: $("presetSelect"),
                restartBtn:   $("restartBtn"),
                prevBtn:      $("prevBtn"),
                playBtn:      $("playBtn"),
                nextBtn:      $("nextBtn"),
                stepSlider:   $("stepSlider"),
                stepLabel:    $("stepLabel"),
                stepHint:     $("stepHint"),
                orderStrip:   $("orderStrip"),
                note:         $("note")
            };
        }

        /* ── public API ────────────────────────────────── */

        const engine = {
            get trace()    { return trace; },
            get position() { return position; },
            get presets()  { return presets; },
            get playing()  { return intervalId !== null; },

            currentStep() {
                if (!trace || position < 0) return null;
                return trace.steps[position];
            },

            load,
            goTo,
            next,
            prev,
            restart,
            play,
            pause,
            togglePlay,
            render,
            init
        };

        return engine;

        /* ── Initialization ────────────────────────────── */

        function init() {
            resolveDom();
            wirePresets();
            wireTransport();
            wireSlider();
            wireKeyboard();
            const isMobile = window.innerWidth < 768;
            let start = 0;
            if (isMobile) {
                const mi = presets.findIndex(p => p.mobileDefault);
                if (mi >= 0) start = mi;
            }
            load(start);
        }

        /* ── Preset switching ──────────────────────────── */

        function wirePresets() {
            if (!dom.presetSelect) return;
            dom.presetSelect.innerHTML = "";
            presets.forEach((p, i) => {
                const o = document.createElement("option");
                o.value = i;
                o.textContent = p.name;
                dom.presetSelect.appendChild(o);
            });
            dom.presetSelect.addEventListener("change", () => {
                load(parseInt(dom.presetSelect.value, 10));
            });
        }

        function load(presetIndex) {
            pause();
            if (dom.presetSelect) dom.presetSelect.value = presetIndex;
            trace = buildTrace(presets[presetIndex]);
            position = -1;
            syncSlider();
            render();
        }

        /* ── Transport ─────────────────────────────────── */

        function wireTransport() {
            if (dom.restartBtn) dom.restartBtn.addEventListener("click", restart);
            if (dom.prevBtn)    dom.prevBtn.addEventListener("click", prev);
            if (dom.playBtn)    dom.playBtn.addEventListener("click", togglePlay);
            if (dom.nextBtn)    dom.nextBtn.addEventListener("click", next);
        }

        function goTo(step) {
            if (!trace) return;
            position = Math.max(-1, Math.min(step, trace.steps.length - 1));
            syncSlider();
            render();
        }

        function next()    { if (trace && position < trace.steps.length - 1) goTo(position + 1); }
        function prev()    { if (trace && position > -1) goTo(position - 1); }
        function restart() { pause(); goTo(-1); }

        function play() {
            if (intervalId) return;
            if (trace && position >= trace.steps.length - 1) restart();
            intervalId = setInterval(() => {
                if (position >= trace.steps.length - 1) { pause(); return; }
                goTo(position + 1);
            }, speed);
            if (dom.playBtn) dom.playBtn.textContent = "Pause";
        }

        function pause() {
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            if (dom.playBtn) dom.playBtn.textContent = "Play";
        }

        function togglePlay() { intervalId ? pause() : play(); }

        /* ── Slider ────────────────────────────────────── */

        function wireSlider() {
            if (!dom.stepSlider) return;
            dom.stepSlider.addEventListener("input", () => {
                goTo(parseInt(dom.stepSlider.value, 10));
            });
        }

        function syncSlider() {
            if (!dom.stepSlider || !trace) return;
            dom.stepSlider.min = -1;
            dom.stepSlider.max = trace.steps.length - 1;
            dom.stepSlider.value = position;
            if (dom.stepLabel) {
                dom.stepLabel.textContent = position < 0
                    ? "Start"
                    : `Step ${position + 1} / ${trace.steps.length}`;
            }
        }

        /* ── Keyboard ──────────────────────────────────── */

        function wireKeyboard() {
            document.addEventListener("keydown", (e) => {
                if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
                if (e.key === "ArrowRight") { e.preventDefault(); next(); }
                if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
                if (e.key === " ")          { e.preventDefault(); togglePlay(); }
            });
        }

        /* ── Render orchestration ──────────────────────── */

        function render() {
            if (!trace) return;

            onRender(engine);

            /* Step hint */
            if (dom.stepHint && describeStep) {
                dom.stepHint.textContent = describeStep(engine);
            }

            /* Order strip */
            renderOrderStrip();

            /* Note — algorithm-specific; set in onRender if needed */
        }

        function renderOrderStrip() {
            if (!dom.orderStrip || !trace) return;
            const order = trace.order || [];

            dom.orderStrip.innerHTML = "";
            order.forEach((val, i) => {
                const span = document.createElement("span");
                span.className = "token";
                span.textContent = val;
                if (i === position)    span.classList.add("current");
                else if (i > position) span.classList.add("future");
                dom.orderStrip.appendChild(span);
            });
        }
    }

    /* ── Utility: resize debouncer ─────────────────────── */

    function onResize(callback, delay = 80) {
        let timer;
        window.addEventListener("resize", () => {
            clearTimeout(timer);
            timer = setTimeout(callback, delay);
        });
    }

    return { create, onResize };
})();
