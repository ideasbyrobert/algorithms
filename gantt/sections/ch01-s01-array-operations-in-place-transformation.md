[← Back to Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md)

# Array Operations — In-Place Transformation

Within [Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md).

14 problems · 3 groupings · 14/14 implemented · Apr 6, 2026 -> Apr 16, 2026

## Groupings

- In-Place Rewrite · 5 problems · Apr 6, 2026 -> Apr 16, 2026
- Array Invariants · 4 problems · Apr 6, 2026 -> Apr 16, 2026
- Order/Check/Greedy · 5 problems · Apr 6, 2026 -> Apr 15, 2026

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 10px; } .sectionTitle { font-size: 13px !important; letter-spacing: 0.04em; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "10px"}, "gantt": {"useMaxWidth": false, "barHeight": 24, "barGap": 22, "topPadding": 96, "rightPadding": 64, "leftPadding": 248, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 13, "fontSize": 10, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section In-Place Rewrite
    88                                 :sp01, 2026-04-06, 2d
    27                                 :sp02, after sp01, 2d
    26                                 :sp03, after sp02, 2d
    80                                 :sp04, after sp03, 3d
    283                                :sp05, after sp04, 2d

    section Array Invariants
    169                                :sp06, 2026-04-06, 2d
    189                                :sp07, after sp06, 3d
    274                                :sp08, after sp07, 3d
    334                                :sp09, after sp08, 3d

    section Order/Check/Greedy
    896                                :sp10, 2026-04-06, 2d
    1431                               :sp11, after sp10, 2d
    1822                               :sp12, after sp11, 2d
    1502                               :sp13, after sp12, 2d
    605                                :sp14, after sp13, 2d

    END · problem map complete        :milestone, crit, mend, after sp05 sp09 sp14, 0d
```

## Coverage

- Implemented in this repo: 14/14
- Published site index: [https://ideasbyrobert.github.io/algorithms/](https://ideasbyrobert.github.io/algorithms/)

## Problems by Group

### In-Place Rewrite

5 problems · Apr 6, 2026 -> Apr 16, 2026

- [`88` Merge Sorted Array](../../88-merge-sorted-array.html) · `E` · 2d · available
- [`27` Remove Element](../../27-remove-element.html) · `E` · 2d · available
- [`26` Remove Duplicates from Sorted Array](../../26-remove-duplicates-sorted-array.html) · `E` · 2d · available
- [`80` Remove Duplicates from Sorted Array II](../../80-remove-duplicates-sorted-array-ii.html) · `M` · 3d · available
- [`283` Move Zeroes](../../283-move-zeroes.html) · `E` · 2d · available

### Array Invariants

4 problems · Apr 6, 2026 -> Apr 16, 2026

- [`169` Majority Element](../../169-majority-element.html) · `E` · 2d · available
- [`189` Rotate Array](../../189-rotate-array.html) · `M` · 3d · available
- [`274` H-Index](../../274-hindex.html) · `M` · 3d · available
- [`334` Increasing Triplet Subsequence](../../334-increasing-triplet-subsequence.html) · `M` · 3d · available

### Order/Check/Greedy

5 problems · Apr 6, 2026 -> Apr 15, 2026

- [`896` Monotonic Array](../../896-monotonic-array.html) · `E` · 2d · available
- [`1431` Kids With the Greatest Number of Candies](../../1431-kids-candies.html) · `E` · 2d · available
- [`1822` Sign of the Product of an Array](../../1822-sign-of-product.html) · `E` · 2d · available
- [`1502` Can Make Arithmetic Progression](../../1502-arithmetic-progression.html) · `E` · 2d · available
- [`605` Can Place Flowers](../../605-can-place-flowers.html) · `E` · 2d · available

[← Back to Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md)
