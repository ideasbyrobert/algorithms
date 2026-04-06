[← Back to Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md)

# String Operations — Parsing and Transformation

Within [Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md).

17 problems · 4 groupings · 17/17 implemented · Apr 6, 2026 -> Apr 20, 2026

## Groupings

- Numeral & Binary · 4 problems · Apr 6, 2026 -> Apr 17, 2026
- Scan & Compare · 4 problems · Apr 6, 2026 -> Apr 13, 2026
- Rewrite & Normalize · 5 problems · Apr 6, 2026 -> Apr 17, 2026
- Pattern & Validation · 4 problems · Apr 6, 2026 -> Apr 20, 2026

```mermaid
%%{init: {"theme": "base", "themeCSS": ".grid .tick line { stroke: #000000; stroke-opacity: 0.14; stroke-width: 1; } .grid .tick text { fill: #000000; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", system-ui, sans-serif; transform: translateY(18px); } .grid + .grid .tick text { transform: translateY(-18px); } .grid path { stroke-width: 0; } .task { fill: #ffffff; stroke: #000000; stroke-width: 2; transform: translateY(8px); } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { fill: #000000; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .milestone, .milestone path { fill: #000000 !important; stroke: #000000 !important; transform: translateY(8px); } .milestoneText { fill: #000000; font-style: italic; font-weight: 500; letter-spacing: 0.01em; transform: translateY(8px); } .section { opacity: 1 !important; stroke: none !important; } .sectionTitle { fill: #000000 !important; font-size: 15px !important; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; } .today { stroke: #000000; stroke-opacity: 0.28; stroke-width: 1.5; } .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 10px; } .sectionTitle { font-size: 13px !important; letter-spacing: 0.04em; } .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }", "themeVariables": {"background": "#ffffff", "mainBkg": "#ffffff", "primaryColor": "#ffffff", "primaryBorderColor": "#000000", "primaryTextColor": "#000000", "textColor": "#000000", "titleColor": "#000000", "lineColor": "#000000", "secondaryColor": "#ffffff", "tertiaryColor": "#ffffff", "sectionBkgColor": "#fbfbfd", "altSectionBkgColor": "#f5f5f7", "taskBkgColor": "#ffffff", "taskBorderColor": "#000000", "taskTextColor": "#000000", "taskTextDarkColor": "#000000", "taskTextOutsideColor": "#000000", "activeTaskBkgColor": "#ffffff", "activeTaskBorderColor": "#000000", "gridColor": "#000000", "todayLineColor": "#000000", "critBkgColor": "#000000", "critBorderColor": "#000000", "doneTaskBkgColor": "#ffffff", "doneTaskBorderColor": "#000000", "fontFamily": "\"SF Mono\", \"SFMono-Regular\", ui-monospace, Menlo, monospace", "fontSize": "10px"}, "gantt": {"useMaxWidth": false, "barHeight": 24, "barGap": 22, "topPadding": 96, "rightPadding": 64, "leftPadding": 248, "gridLineStartPadding": 20, "topAxis": true, "titleTopMargin": 0, "sectionFontSize": 13, "fontSize": 10, "numberSectionStyles": 2, "bottomMarginAdj": 0}}}%%
%% hierarchical curriculum gantt:
%% root = chapters, chapter pages = sections, section pages = problems
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b '%y
    tickInterval 2month

    section Numeral & Binary
    13                                 :sp01, 2026-04-06, 2d
    12                                 :sp02, after sp01, 3d
    67                                 :sp03, after sp02, 2d
    273                                :sp04, after sp03, 5d

    section Scan & Compare
    58                                 :sp05, 2026-04-06, 2d
    14                                 :sp06, after sp05, 2d
    28                                 :sp07, after sp06, 2d
    1071                               :sp08, after sp07, 2d

    section Rewrite & Norm
    151                                :sp09, 2026-04-06, 3d
    345                                :sp10, after sp09, 2d
    443                                :sp11, after sp10, 3d
    1768                               :sp12, after sp11, 2d
    709                                :sp13, after sp12, 2d

    section Pattern & Validate
    459                                :sp14, 2026-04-06, 2d
    6                                  :sp15, after sp14, 3d
    68                                 :sp16, after sp15, 5d
    65                                 :sp17, after sp16, 5d

    END · problem map complete        :milestone, crit, mend, after sp04 sp08 sp13 sp17, 0d
```

## Coverage

- Implemented in this repo: 17/17
- Published site index: [https://ideasbyrobert.github.io/algorithms/](https://ideasbyrobert.github.io/algorithms/)

## Problems by Group

### Numeral & Binary

4 problems · Apr 6, 2026 -> Apr 17, 2026

- [`13` Roman to Integer](../../13-roman-to-integer.html) · `E` · 2d · available
- [`12` Integer to Roman](../../12-integer-to-roman.html) · `M` · 3d · available
- [`67` Add Binary](../../67-add-binary.html) · `E` · 2d · available
- [`273` Integer to English Words](../../273-integer-to-english-words.html) · `H` · 5d · available

### Scan & Compare

4 problems · Apr 6, 2026 -> Apr 13, 2026

- [`58` Length of Last Word](../../58-length-of-last-word.html) · `E` · 2d · available
- [`14` Longest Common Prefix](../../14-longest-common-prefix.html) · `E` · 2d · available
- [`28` Find the Index of the First Occurrence](../../28-find-first-occurrence.html) · `E` · 2d · available
- [`1071` Greatest Common Divisor of Strings](../../1071-gcd-of-strings.html) · `E` · 2d · available

### Rewrite & Normalize

5 problems · Apr 6, 2026 -> Apr 17, 2026

- [`151` Reverse Words in a String](../../151-reverse-words.html) · `M` · 3d · available
- [`345` Reverse Vowels of a String](../../345-reverse-vowels.html) · `E` · 2d · available
- [`443` String Compression](../../443-string-compression.html) · `M` · 3d · available
- [`1768` Merge Strings Alternately](../../1768-merge-strings-alternately.html) · `E` · 2d · available
- [`709` To Lower Case](../../709-to-lower-case.html) · `E` · 2d · available

### Pattern & Validation

4 problems · Apr 6, 2026 -> Apr 20, 2026

- [`459` Repeated Substring Pattern](../../459-repeated-substring-pattern.html) · `E` · 2d · available
- [`6` Zigzag Conversion](../../6-zigzag-conversion.html) · `M` · 3d · available
- [`68` Text Justification](../../68-text-justification.html) · `H` · 5d · available
- [`65` Valid Number](../../65-valid-number.html) · `H` · 5d · available

[← Back to Array and String Mechanics](../chapters/ch01-array-and-string-mechanics.md)
