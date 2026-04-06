[← Back to The Hash Map — Trading Memory for Answers](../chapters/ch03-the-hash-map-trading-memory-for-answers.md)

# The Hash Map Lens

Within [The Hash Map — Trading Memory for Answers](../chapters/ch03-the-hash-map-trading-memory-for-answers.md).

18 problems · 3 groupings · 1/18 implemented · Apr 6, 2026 -> Apr 20, 2026

## Groupings

- Counting & Bijection · 7 problems · Apr 6, 2026 -> Apr 20, 2026
- Seen-Before & Sets · 6 problems · Apr 6, 2026 -> Apr 19, 2026
- Design & Indexed Lookup · 5 problems · Apr 6, 2026 -> Apr 19, 2026

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 10px; } .sectionTitle { font-size: 13px !important; letter-spacing: 0.04em; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "10px"}, "gantt": {"useMaxWidth": false, "barHeight": 24, "barGap": 22, "topPadding": 96, "rightPadding": 64, "leftPadding": 248, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 13, "fontSize": 10, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section Count & Bijection
    383                                :sp01, 2026-04-06, 2d
    242                                :sp02, after sp01, 2d
    205                                :sp03, after sp02, 2d
    290                                :sp04, after sp03, 2d
    389                                :sp05, after sp04, 2d
    1207                               :sp06, after sp05, 2d
    1657                               :sp07, after sp06, 3d

    section Seen-Before & Sets
    202                                :sp08, 2026-04-06, 2d
    2215                               :sp09, after sp08, 2d
    1                                  :crit, sp10, after sp09, 2d
    219                                :sp11, after sp10, 2d
    1679                               :sp12, after sp11, 3d
    128                                :sp13, after sp12, 3d

    section Design & Indexed...
    706                                :sp14, 2026-04-06, 2d
    49                                 :sp15, after sp14, 3d
    2352                               :sp16, after sp15, 3d
    380                                :sp17, after sp16, 3d
    1396                               :sp18, after sp17, 3d

    END · problem map complete        :milestone, crit, mend, after sp07 sp13 sp18, 0d
```

## Coverage

- Implemented in this repo: 1/18
- Published site index: [https://ideasbyrobert.github.io/algorithms/](https://ideasbyrobert.github.io/algorithms/)

## Problems by Group

### Counting & Bijection

7 problems · Apr 6, 2026 -> Apr 20, 2026

- `383` Ransom Note · `E` · 2d · planned
- `242` Valid Anagram · `E` · 2d · planned
- `205` Isomorphic Strings · `E` · 2d · planned
- `290` Word Pattern · `E` · 2d · planned
- `389` Find the Difference · `E` · 2d · planned
- `1207` Unique Number of Occurrences · `E` · 2d · planned
- `1657` Determine if Two Strings Are Close · `M` · 3d · planned

### Seen-Before & Sets

6 problems · Apr 6, 2026 -> Apr 19, 2026

- `202` Happy Number · `E` · 2d · planned
- `2215` Find the Difference of Two Arrays · `E` · 2d · planned
- [`1` Two Sum](../../1-two-sum.html) · `E` · 2d · available ★
- `219` Contains Duplicate II · `E` · 2d · planned
- `1679` Max Number of K-Sum Pairs · `M` · 3d · planned
- `128` Longest Consecutive Sequence · `M` · 3d · planned

### Design & Indexed Lookup

5 problems · Apr 6, 2026 -> Apr 19, 2026

- `706` Design HashMap · `E` · 2d · planned
- `49` Group Anagrams · `M` · 3d · planned
- `2352` Equal Row and Column Pairs · `M` · 3d · planned
- `380` Insert Delete GetRandom O(1) · `M` · 3d · planned
- `1396` Design Underground System · `M` · 3d · planned

[← Back to The Hash Map — Trading Memory for Answers](../chapters/ch03-the-hash-map-trading-memory-for-answers.md)
