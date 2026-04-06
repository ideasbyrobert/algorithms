[← Back to Chapters Overview](../README.md)

# Chapter 01 — Array and String Mechanics

Within [Part I · Foundations](../README.md).

4 sections · 12 groupings · 43 problems · 43/43 implemented · Apr 6, 2026 -> Jul 22, 2026

Sections are compared as parallel timelines inside the chapter. Click a section bar to open its problem gantt. If Mermaid task links are disabled, use the section links below the chart.

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 11px; } .sectionTitle { font-size: 14px !important; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "11px"}, "gantt": {"useMaxWidth": false, "barHeight": 26, "barGap": 24, "topPadding": 104, "rightPadding": 72, "leftPadding": 244, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 14, "fontSize": 11, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section Structural Fluency
    Array Ops                          :cs01, 2026-04-06, 32d
    String Ops                         :cs02, 2026-04-06, 47d
    Matrix Ops                         :cs03, 2026-04-06, 19d
    Math Fluency                       :cs04, 2026-04-06, 10d
    END · section map complete        :milestone, crit, mend, after cs01 cs02 cs03 cs04, 0d

    click cs01 href "../sections/ch01-s01-array-operations-in-place-transformation.md"
    click cs02 href "../sections/ch01-s02-string-operations-parsing-and-transformation.md"
    click cs03 href "../sections/ch01-s03-matrix-operations-2d-traversal.md"
    click cs04 href "../sections/ch01-s04-mathematical-fluency.md"
```

## Section Timelines

### Array Operations — In-Place Transformation

[Open problem gantt](../sections/ch01-s01-array-operations-in-place-transformation.md) · 14 problems · 3 groupings · 14/14 implemented · Apr 6, 2026 -> May 7, 2026

Groupings: In-Place Rewrite; Array Invariants; Order/Check/Greedy

### String Operations — Parsing and Transformation

[Open problem gantt](../sections/ch01-s02-string-operations-parsing-and-transformation.md) · 17 problems · 4 groupings · 17/17 implemented · Apr 6, 2026 -> May 22, 2026

Groupings: Numeral & Binary; Scan & Compare; Rewrite & Normalize; Pattern & Validation

### Matrix Operations — 2D Traversal

[Open problem gantt](../sections/ch01-s03-matrix-operations-2d-traversal.md) · 7 problems · 3 groupings · 7/7 implemented · Apr 6, 2026 -> Apr 24, 2026

Groupings: Summaries & Traversal; Transforms & Markers; Constraint Simulation

### Mathematical Fluency

[Open problem gantt](../sections/ch01-s04-mathematical-fluency.md) · 5 problems · 2 groupings · 5/5 implemented · Apr 6, 2026 -> Apr 15, 2026

Groupings: Numeric Transforms; Movement & Simulation


[← Back to Chapters Overview](../README.md)
