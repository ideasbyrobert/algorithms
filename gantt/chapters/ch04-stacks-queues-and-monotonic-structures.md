[← Back to Chapters Overview](../README.md)

# Chapter 04 — Stacks, Queues, and Monotonic Structures

Within [Part I · Foundations](../README.md).

3 sections · 7 groupings · 15 problems · 0/15 implemented · Apr 6, 2026 -> May 20, 2026

Sections are compared as parallel timelines inside the chapter. Click a section bar to open its problem gantt. If Mermaid task links are disabled, use the section links below the chart.

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 11px; } .sectionTitle { font-size: 14px !important; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "11px"}, "gantt": {"useMaxWidth": false, "barHeight": 26, "barGap": 24, "topPadding": 104, "rightPadding": 72, "leftPadding": 244, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 14, "fontSize": 11, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section The Stack, Queue, and Monotonic Lens
    Stacks                             :cs01, 2026-04-06, 29d
    Queues                             :cs02, 2026-04-06, 5d
    Monotonic                          :crit, cs03, 2026-04-06, 11d
    END · section map complete        :milestone, crit, mend, after cs01 cs02 cs03, 0d

    click cs01 href "../sections/ch04-s01-stacks-lifo-processing.md"
    click cs02 href "../sections/ch04-s02-queues-fifo-processing.md"
    click cs03 href "../sections/ch04-s03-monotonic-stacks-aggressive-pruning.md"
```

## Section Timelines

### Stacks — LIFO Processing

[Open problem gantt](../sections/ch04-s01-stacks-lifo-processing.md) · 10 problems · 3 groupings · 0/10 implemented · Apr 6, 2026 -> May 4, 2026

Groupings: Delimiters & Paths; Simulation Stacks; Emulation & Parsing

### Queues — FIFO Processing

[Open problem gantt](../sections/ch04-s02-queues-fifo-processing.md) · 2 problems · 2 groupings · 0/2 implemented · Apr 6, 2026 -> Apr 10, 2026

Groupings: Window Queue; Competitive Queue

### Monotonic Stacks — Aggressive Pruning

[Open problem gantt](../sections/ch04-s03-monotonic-stacks-aggressive-pruning.md) · 3 problems · 2 groupings · 0/3 implemented · Apr 6, 2026 -> Apr 16, 2026

Groupings: Next-Greater Patterns; Basin Computation


[← Back to Chapters Overview](../README.md)
