[← Back to The Sliding Window](../chapters/ch07-the-sliding-window.md)

# The Window Lens

Within [The Sliding Window](../chapters/ch07-the-sliding-window.md).

9 problems · 3 groupings · 0/9 implemented · Apr 6, 2026 -> Apr 19, 2026

## Groupings

- Fixed Windows · 3 problems · Apr 6, 2026 -> Apr 15, 2026
- Variable Windows · 4 problems · Apr 6, 2026 -> Apr 19, 2026
- Implicit Windows · 2 problems · Apr 6, 2026 -> Apr 10, 2026

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 10px; } .sectionTitle { font-size: 13px !important; letter-spacing: 0.04em; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "10px"}, "gantt": {"useMaxWidth": false, "barHeight": 24, "barGap": 22, "topPadding": 96, "rightPadding": 64, "leftPadding": 248, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 13, "fontSize": 10, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section Fixed Windows
    643                                :sp01, 2026-04-06, 2d
    1456                               :sp02, after sp01, 3d
    30                                 :sp03, after sp02, 5d

    section Variable Windows
    1004                               :sp04, 2026-04-06, 3d
    1493                               :sp05, after sp04, 3d
    209                                :sp06, after sp05, 3d
    76                                 :sp07, after sp06, 5d

    section Implicit Windows
    121                                :crit, sp08, 2026-04-06, 2d
    3                                  :crit, sp09, after sp08, 3d

    END · problem map complete        :milestone, crit, mend, after sp03 sp07 sp09, 0d
```

## Coverage

- Implemented in this repo: 0/9
- Published site index: [https://ideasbyrobert.github.io/algorithms/](https://ideasbyrobert.github.io/algorithms/)

## Problems by Group

### Fixed Windows

3 problems · Apr 6, 2026 -> Apr 15, 2026

- `643` Maximum Average Subarray I · `E` · 2d · planned
- `1456` Max Number of Vowels in Substring of Given Length · `M` · 3d · planned
- `30` Substring with Concatenation of All Words · `H` · 5d · planned

### Variable Windows

4 problems · Apr 6, 2026 -> Apr 19, 2026

- `1004` Max Consecutive Ones III · `M` · 3d · planned
- `1493` Longest Subarray of 1's After Deleting One · `M` · 3d · planned
- `209` Minimum Size Subarray Sum · `M` · 3d · planned
- `76` Minimum Window Substring · `H` · 5d · planned

### Implicit Windows

2 problems · Apr 6, 2026 -> Apr 10, 2026

- `121` Best Time to Buy and Sell Stock · `E` · 2d · planned ★
- `3` Longest Substring Without Repeating Characters · `M` · 3d · planned ★

[← Back to The Sliding Window](../chapters/ch07-the-sliding-window.md)
