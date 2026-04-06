#!/usr/bin/env python3

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
import json
from pathlib import Path
import re
import shutil

SITE_BASE_URL = "https://ideasbyrobert.github.io/algorithms/"
TOC_RELATIVE_PATH = "../craft/pattern/core/toc.md"
PLAN_RELATIVE_PATH = "../craft/engine/active/plan.md"

START_DATE = "2026-04-06"
DIFFICULTY_DAYS = {
    "E": 2,
    "M": 3,
    "H": 5,
}

START_DAY = date.fromisoformat(START_DATE)

CHAPTER_CHART_LABELS = {
    1: "Ch01 Arrays",
    2: "Ch02 Lists",
    3: "Ch03 Hash",
    4: "Ch04 S/Q",
    5: "Ch05 Sorted",
    6: "Ch06 Prefix",
    7: "Ch07 Window",
    8: "Ch08 BSearch",
    9: "Ch09 Trees",
    10: "Ch10 BST/Trie",
    11: "Ch11 Memo",
    12: "Ch12 DP Table",
    13: "Ch13 Graphs",
    14: "Ch14 Heap/PQ",
    15: "Ch15 Greedy",
    16: "Ch16 Backtrack",
    "APPENDIX A: BIT MANIPULATION": "App A Bits",
    "APPENDIX B: MATHEMATICAL REASONING": "App B Math",
}

PART_SECTION_LABELS = {
    "PART I: FOUNDATIONS AND ELIMINATION": "Part I · Foundations",
    "PART II: THE PHYSICS OF BOUNDARIES": "Part II · Boundaries",
    "PART III: THE PHYSICS OF DECOMPOSITION": "Part III · Decomposition",
    "PART IV: THE PHYSICS OF RELATIONSHIPS AND DECISIONS": "Part IV · Decisions",
    "APPENDICES": "Appendices",
}

PART_GATE_LABELS = {
    "PART I: FOUNDATIONS AND ELIMINATION": "part I mapped",
    "PART II: THE PHYSICS OF BOUNDARIES": "part II mapped",
    "PART III: THE PHYSICS OF DECOMPOSITION": "part III mapped",
    "PART IV: THE PHYSICS OF RELATIONSHIPS AND DECISIONS": "part IV mapped",
    "APPENDICES": "appendices mapped",
}

SECTION_CHART_LABELS = {
    "array-operations-in-place-transformation": "Array Ops",
    "string-operations-parsing-and-transformation": "String Ops",
    "matrix-operations-2d-traversal": "Matrix Ops",
    "mathematical-fluency": "Math Fluency",
    "pointer-fluency": "Pointer Fluency",
    "the-hash-map-lens": "Hash Map Lens",
    "stacks-lifo-processing": "Stacks",
    "queues-fifo-processing": "Queues",
    "monotonic-stacks-aggressive-pruning": "Monotonic",
    "two-pointers": "Two Pointers",
    "intervals": "Intervals",
    "the-prefix-lens": "Prefix Lens",
    "the-window-lens": "Window Lens",
    "the-binary-search-lens": "Binary Search",
    "recursive-structure": "Recursive",
    "bfs-traversal": "BFS",
    "binary-search-trees": "BST",
    "tries": "Tries",
    "divide-and-conquer": "Div & Conquer",
    "the-memoization-lens": "Memo Lens",
    "multi-dimensional-dp": "Multi-D DP",
    "state-machine-dp": "State DP",
    "dfs-bfs-traversal": "DFS/BFS",
    "topological-sort": "Topo Sort",
    "the-heap-lens": "Heap Lens",
    "the-greedy-lens": "Greedy",
    "the-backtracking-lens": "Backtracking",
    "bit-manipulation-problems": "Bit Manip",
    "mathematical-reasoning-problems": "Math Reason",
}

SECTION_GROUPS = {
    "array-operations-in-place-transformation": [
        ("In-Place Rewrite", ["88", "27", "26", "80", "283"]),
        ("Array Invariants", ["169", "189", "274", "334"]),
        ("Order/Check/Greedy", ["896", "1431", "1822", "1502", "605"]),
    ],
    "string-operations-parsing-and-transformation": [
        ("Numeral & Binary", ["13", "12", "67", "273"]),
        ("Scan & Compare", ["58", "14", "28", "1071"]),
        ("Rewrite & Normalize", ["151", "345", "443", "1768", "709"]),
        ("Pattern & Validation", ["459", "6", "68", "65"]),
    ],
    "matrix-operations-2d-traversal": [
        ("Summaries & Traversal", ["1672", "1572", "54"]),
        ("Transforms & Markers", ["48", "73"]),
        ("Constraint Simulation", ["36", "289"]),
    ],
    "mathematical-fluency": [
        ("Numeric Transforms", ["9", "66"]),
        ("Movement & Simulation", ["657", "1275", "1603"]),
    ],
    "pointer-fluency": [
        ("Core Pointer Rewrites", ["206", "21", "19", "82", "328", "86", "61", "92"]),
        ("Number Construction", ["2", "445", "2095", "2130"]),
        ("Structure & Systems", ["141", "138", "25", "146"]),
    ],
    "the-hash-map-lens": [
        ("Counting & Bijection", ["383", "242", "205", "290", "389", "1207", "1657"]),
        ("Seen-Before & Sets", ["202", "2215", "1", "219", "1679", "128"]),
        ("Design & Indexed Lookup", ["706", "49", "2352", "380", "1396"]),
    ],
    "stacks-lifo-processing": [
        ("Delimiters & Paths", ["20", "71", "155"]),
        ("Simulation Stacks", ["682", "2390", "735", "394", "150"]),
        ("Emulation & Parsing", ["225", "224"]),
    ],
    "queues-fifo-processing": [
        ("Window Queue", ["933"]),
        ("Competitive Queue", ["649"]),
    ],
    "monotonic-stacks-aggressive-pruning": [
        ("Next-Greater Patterns", ["739", "901"]),
        ("Basin Computation", ["42"]),
    ],
    "two-pointers": [
        ("Symmetric Scans", ["125", "392"]),
        ("Sorted Elimination", ["167", "15"]),
        ("Boundary Optimization", ["11"]),
    ],
    "intervals": [
        ("Build & Merge", ["228", "56", "57"]),
        ("Greedy Pruning", ["435", "452"]),
    ],
    "the-prefix-lens": [
        ("Running Aggregates", ["1732", "724", "238"]),
        ("Max-Subarray Variants", ["53", "918"]),
        ("Boundary Accumulation", ["42"]),
    ],
    "the-window-lens": [
        ("Fixed Windows", ["643", "1456", "30"]),
        ("Variable Windows", ["1004", "1493", "209", "76"]),
        ("Implicit Windows", ["121", "3"]),
    ],
    "the-binary-search-lens": [
        ("Template & Answer Space", ["704", "374", "35", "367", "69"]),
        ("Structured Arrays", ["74", "33", "34", "153"]),
        ("Threshold & Partition", ["162", "2300", "875", "4"]),
    ],
    "recursive-structure": [
        ("Core Recursion", ["104", "100", "226", "101", "112", "543", "617", "872", "700", "222"]),
        ("Path Propagation", ["129", "1448", "236", "437", "1372", "124"]),
        ("Rewire & Rebuild", ["114", "105", "106", "117", "173"]),
    ],
    "bfs-traversal": [
        ("Level Summaries", ["637", "102", "199", "103", "1161"]),
    ],
    "binary-search-trees": [
        ("Ordered Traversals", ["530", "230", "98"]),
        ("Structural Update", ["450"]),
    ],
    "tries": [
        ("Core Trie Ops", ["208", "211"]),
        ("Suggestions", ["1268"]),
    ],
    "divide-and-conquer": [
        ("Split & Build", ["108", "148", "427"]),
        ("Exponentiation", ["50"]),
    ],
    "the-memoization-lens": [
        ("Fibonacci Family", ["1137", "70", "746"]),
        ("Choice Recurrences", ["198", "790", "322"]),
        ("Sequence & Decomposition", ["300", "139"]),
    ],
    "multi-dimensional-dp": [
        ("Grid Walks", ["120", "62", "64", "63"]),
        ("String Alignment", ["1143", "97", "72"]),
        ("Shape/Palindrome State", ["5", "221"]),
    ],
    "state-machine-dp": [
        ("Transaction Fee", ["714"]),
        ("Bounded Transactions", ["123", "188"]),
    ],
    "dfs-bfs-traversal": [
        ("Connectivity", ["547", "200", "130", "133", "841"]),
        ("Path & State", ["1466", "399", "994", "1926"]),
        ("Board & Mutation Search", ["909", "433", "127"]),
    ],
    "topological-sort": [
        ("Feasibility", ["207"]),
        ("Ordering", ["210"]),
    ],
    "the-heap-lens": [
        ("Selection & Streaming", ["215", "2336", "295"]),
        ("Frontiers & Pairing", ["373", "2462", "2542"]),
        ("Capital & Merge", ["502", "23"]),
    ],
    "the-greedy-lens": [
        ("Change & Reachability", ["860", "55", "45"]),
        ("Stock & Balance", ["122", "134"]),
        ("Allocation Fairness", ["135"]),
    ],
    "the-backtracking-lens": [
        ("Combination Generation", ["17", "77", "216", "39"]),
        ("Permutation & Constraints", ["46", "22", "52"]),
        ("Grid Word Search", ["79", "212"]),
    ],
    "bit-manipulation-problems": [
        ("XOR & Counting", ["136", "338", "191", "190", "461"]),
        ("Bit-State Reconstruction", ["137", "1318", "201"]),
    ],
    "mathematical-reasoning-problems": [
        ("Closed-Form Counting", ["1523", "1491", "172"]),
        ("Geometry & Lines", ["976", "1232", "149"]),
        ("Motion & Arithmetic", ["1041", "43"]),
    ],
}

LABEL_REPLACEMENTS = [
    ("Array and String", "Array & String"),
    ("Binary Search Tree", "BST"),
    ("Binary Tree", "BT"),
    ("Linked List", "LL"),
    ("Remove Duplicates", "Dedupe"),
    ("Two Numbers", "2 Nums"),
    ("Subsequence", "Subseq"),
    ("Substring", "Substr"),
    ("Consecutive", "Consec"),
    ("Average", "Avg"),
    ("Minimum", "Min"),
    ("Maximum", "Max"),
    ("Difference", "Diff"),
    ("Occurrences", "Occurs"),
    ("Occurrence", "Occur"),
    ("Numbers", "Nums"),
    ("Number", "Num"),
    ("Transaction", "Txn"),
    ("Transactions", "Txns"),
    ("Element", "Elem"),
    ("Elements", "Elems"),
    ("Sorted Array", "Sorted Arr"),
    ("Inorder", "Inord"),
    ("Postorder", "Postord"),
    ("Preorder", "Preord"),
    ("Transformation", "Transform"),
    ("Traversal", "Traverse"),
]


@dataclass
class Problem:
    number: str
    title: str
    difficulty: str
    is_starred: bool
    page_href: str | None = None

    @property
    def duration(self) -> int:
        return DIFFICULTY_DAYS[self.difficulty]

    @property
    def chart_label(self) -> str:
        return self.number

    @property
    def is_implemented(self) -> bool:
        return self.page_href is not None


@dataclass
class Section:
    number: int
    title: str
    chapter_key: int | str
    chapter_title: str
    chapter_file: str
    slug: str
    nav_title: str
    chart_section_label: str
    file_name: str
    problems: list[Problem] = field(default_factory=list)

    @property
    def duration(self) -> int:
        return sum(problem.duration for problem in self.problems)

    @property
    def has_critical(self) -> bool:
        return any(problem.is_starred for problem in self.problems)

    @property
    def chart_label(self) -> str:
        return SECTION_CHART_LABELS.get(self.slug, shorten_label(self.nav_title, max_chars=16))

    @property
    def implemented_problem_count(self) -> int:
        return sum(problem.is_implemented for problem in self.problems)


@dataclass
class Chapter:
    key: int | str
    title: str
    part: str
    file_name: str
    nav_title: str
    chart_label: str
    lab_title: str | None = None
    sections: list[Section] = field(default_factory=list)

    @property
    def duration(self) -> int:
        return sum(section.duration for section in self.sections)

    @property
    def has_critical(self) -> bool:
        return any(section.has_critical for section in self.sections)

    @property
    def problem_count(self) -> int:
        return sum(len(section.problems) for section in self.sections)

    @property
    def implemented_problem_count(self) -> int:
        return sum(section.implemented_problem_count for section in self.sections)


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def slugify(text: str) -> str:
    slug = text.lower()
    slug = slug.replace("&", "and")
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def shorten_label(text: str, max_chars: int = 34) -> str:
    shortened = text

    for old, new in LABEL_REPLACEMENTS:
        shortened = shortened.replace(old, new)

    shortened = shortened.replace(" and ", " & ")
    shortened = shortened.replace(" with ", " w/ ")
    shortened = shortened.replace(" Without ", " w/o ")
    shortened = shortened.replace(" to ", " -> ")
    shortened = re.sub(r"\s+", " ", shortened).strip()

    if len(shortened) <= max_chars:
        return shortened

    return shortened[: max_chars - 3].rstrip() + "..."


def compact_group_label(text: str) -> str:
    compact = text
    compact = compact.replace("Validation", "Validate")
    compact = compact.replace("Normalize", "Norm")
    compact = compact.replace("Simulation", "Sim")
    compact = compact.replace("Arithmetic", "Arith")
    compact = compact.replace("Counting", "Count")
    compact = compact.replace("Combination", "Comb")
    compact = compact.replace("Generation", "Gen")
    compact = compact.replace("Connectivity", "Connect")
    compact = compact.replace("Comparison", "Compare")
    return shorten_label(compact, max_chars=20)


def extract_init_line(plan_path: Path) -> str:
    for line in plan_path.read_text().splitlines():
        if line.startswith("%%{init:"):
            return line
    raise ValueError(f"Could not find Mermaid init line in {plan_path}")


def tuned_init_line(init_line: str, chart_kind: str) -> str:
    payload = json.loads(init_line[len("%%{init: "):-3])
    theme_vars = payload.setdefault("themeVariables", {})
    gantt = payload.setdefault("gantt", {})
    css = payload.get("themeCSS", "")

    if chart_kind == "overview":
        gantt.update(
            {
                "barHeight": 26,
                "barGap": 24,
                "leftPadding": 240,
                "rightPadding": 72,
            }
        )
        css += (
            " .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 11px; }"
            " .sectionTitle { font-size: 14px !important; }"
            " .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }"
        )
        theme_vars["fontSize"] = "11px"
    elif chart_kind == "chapter":
        gantt.update(
            {
                "barHeight": 26,
                "barGap": 24,
                "leftPadding": 244,
                "rightPadding": 72,
            }
        )
        css += (
            " .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 11px; }"
            " .sectionTitle { font-size: 14px !important; }"
            " .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }"
        )
        theme_vars["fontSize"] = "11px"
        gantt["fontSize"] = 11
        gantt["sectionFontSize"] = 14
    elif chart_kind == "section":
        gantt.update(
            {
                "barHeight": 24,
                "barGap": 22,
                "topPadding": 96,
                "leftPadding": 248,
                "rightPadding": 64,
            }
        )
        css += (
            " .taskText, .taskTextOutsideRight, .taskTextOutsideLeft { font-size: 10px; }"
            " .sectionTitle { font-size: 13px !important; letter-spacing: 0.04em; }"
            " .taskTextOutsideRight, .taskTextOutsideLeft { display: none; }"
        )
        theme_vars["fontSize"] = "10px"
        gantt["fontSize"] = 10
        gantt["sectionFontSize"] = 13

    payload["themeCSS"] = css
    return f"%%{{init: {json.dumps(payload, ensure_ascii=True)}}}%%"


def default_section_title(chapter: Chapter) -> str:
    if chapter.lab_title:
        return chapter.lab_title

    if isinstance(chapter.key, int):
        return chapter.title

    appendix_title = chapter.title.split(":", 1)[-1].strip()
    return f"{appendix_title.title()} Problems"


def end_day(duration: int) -> date:
    if duration <= 0:
        return START_DAY
    return START_DAY + timedelta(days=duration - 1)


def format_day(value: date) -> str:
    return value.strftime("%b %d, %Y").replace(" 0", " ")


def timeline_label(duration: int) -> str:
    return f"{format_day(START_DAY)} -> {format_day(end_day(duration))}"


def pluralize(count: int, singular: str, plural: str | None = None) -> str:
    if count == 1:
        return f"{count} {singular}"
    return f"{count} {plural or singular + 's'}"


def group_duration(problems: list[Problem]) -> int:
    return sum(problem.duration for problem in problems)


def make_chapter(
    key: int | str,
    title: str,
    part: str,
) -> Chapter:
    if isinstance(key, int):
        file_name = f"ch{key:02d}-{slugify(title)}.md"
        nav_title = f"Chapter {key:02d} — {title}"
    else:
        prefix = "app-a" if "A:" in key else "app-b"
        short_title = title.split(":", 1)[-1].strip()
        file_name = f"{prefix}-{slugify(short_title)}.md"
        nav_title = title

    return Chapter(
        key=key,
        title=title,
        part=part,
        file_name=file_name,
        nav_title=nav_title,
        chart_label=CHAPTER_CHART_LABELS[key],
    )


def make_section(chapter: Chapter, section_number: int, title: str) -> Section:
    if isinstance(chapter.key, int):
        file_name = f"ch{chapter.key:02d}-s{section_number:02d}-{slugify(title)}.md"
        nav_title = title
    else:
        prefix = "app-a" if "A:" in str(chapter.key) else "app-b"
        file_name = f"{prefix}-s{section_number:02d}-{slugify(title)}.md"
        nav_title = title

    chart_section_label = chapter.lab_title or "Sections"

    return Section(
        number=section_number,
        title=title,
        chapter_key=chapter.key,
        chapter_title=chapter.title,
        chapter_file=chapter.file_name,
        slug=slugify(title),
        nav_title=nav_title,
        chart_section_label=chart_section_label,
        file_name=file_name,
    )


def parse_curriculum(toc_path: Path) -> list[Chapter]:
    chapters: list[Chapter] = []
    current_chapter: Chapter | None = None
    current_part: str | None = None
    current_section: Section | None = None
    in_problem_index = False

    for line in toc_path.read_text().splitlines():
        if line.startswith("## PROBLEM INDEX"):
            in_problem_index = True
            continue

        if in_problem_index:
            continue

        part_match = re.match(r"^## (PART [IVX]+: .+)$", line)
        if part_match:
            current_part = part_match.group(1)
            continue

        chapter_match = re.match(r"^### Chapter (\d+): (.+)$", line)
        if chapter_match:
            current_chapter = make_chapter(
                key=int(chapter_match.group(1)),
                title=chapter_match.group(2),
                part=current_part or "UNASSIGNED",
            )
            chapters.append(current_chapter)
            current_section = None
            continue

        appendix_match = re.match(r"^## (APPENDIX [A-Z]: .+)$", line)
        if appendix_match:
            current_chapter = make_chapter(
                key=appendix_match.group(1),
                title=appendix_match.group(1),
                part="APPENDICES",
            )
            chapters.append(current_chapter)
            current_section = None
            continue

        if current_chapter is None:
            continue

        lab_match = re.match(r"^#### Lab: (.+)$", line)
        if lab_match:
            current_chapter.lab_title = lab_match.group(1)
            current_section = None
            continue

        subsection_match = re.match(r"^\*\*(.+):\*\*$", line)
        if subsection_match:
            current_section = make_section(
                chapter=current_chapter,
                section_number=len(current_chapter.sections) + 1,
                title=subsection_match.group(1),
            )
            current_chapter.sections.append(current_section)
            continue

        problem_match = re.match(
            r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|",
            line,
        )
        if not problem_match:
            continue

        if current_section is None:
            current_section = make_section(
                chapter=current_chapter,
                section_number=len(current_chapter.sections) + 1,
                title=default_section_title(current_chapter),
            )
            current_chapter.sections.append(current_section)

        raw_difficulty = problem_match.group(3).strip()
        current_section.problems.append(
            Problem(
                number=problem_match.group(1),
                title=problem_match.group(2).strip(),
                difficulty=raw_difficulty.replace("★", "").strip().split()[0],
                is_starred="★" in raw_difficulty,
            )
        )

    return chapters


def canonical_problem_pages(repo_path: Path) -> dict[str, str]:
    index_path = repo_path / "index.html"
    canonical: dict[str, str] = {}

    if index_path.exists():
        text = index_path.read_text()
        for href in re.findall(r'href="([0-9][^"]+\.html)"', text):
            match = re.match(r"^(\d+)-", href)
            if match and match.group(1) not in canonical:
                canonical[match.group(1)] = href

    for html_path in sorted(repo_path.glob("*.html")):
        if html_path.name == "index.html":
            continue
        match = re.match(r"^(\d+)-", html_path.name)
        if match and match.group(1) not in canonical:
            canonical[match.group(1)] = html_path.name

    return canonical


def attach_problem_pages(chapters: list[Chapter], page_map: dict[str, str]) -> None:
    for chapter in chapters:
        for section in chapter.sections:
            for problem in section.problems:
                problem.page_href = page_map.get(problem.number)


def overall_unique_counts(chapters: list[Chapter]) -> tuple[int, int]:
    all_numbers = {
        problem.number
        for chapter in chapters
        for section in chapter.sections
        for problem in section.problems
    }
    implemented_numbers = {
        problem.number
        for chapter in chapters
        for section in chapter.sections
        for problem in section.problems
        if problem.is_implemented
    }
    return len(implemented_numbers), len(all_numbers)


def relative_problem_href(section: Section, problem: Problem) -> str | None:
    if problem.page_href is None:
        return None
    return f"../../{problem.page_href}"


def root_problem_href(problem: Problem) -> str | None:
    if problem.page_href is None:
        return None
    return f"./{problem.page_href}"


def chapter_coverage_label(chapter: Chapter) -> str:
    return f"{chapter.implemented_problem_count}/{chapter.problem_count} implemented"


def section_coverage_label(section: Section) -> str:
    return f"{section.implemented_problem_count}/{len(section.problems)} implemented"


def gantt_header(init_line: str, chart_kind: str) -> list[str]:
    return [
        "```mermaid",
        tuned_init_line(init_line, chart_kind),
        "%% hierarchical curriculum gantt:",
        "%% root = chapters, chapter pages = sections, section pages = problems",
        "gantt",
        "    dateFormat YYYY-MM-DD",
        "    axisFormat %b '%y",
        "    tickInterval 2month",
        "",
    ]


def render_parallel_tasks(
    lines: list[str],
    tasks: list[tuple[str, str, int, bool]],
) -> list[str]:
    task_ids: list[str] = []

    for label, task_id, duration, is_critical in tasks:
        prefix = "crit, " if is_critical else ""
        lines.append(
            f"    {label:<34} :{prefix}{task_id}, {START_DATE}, {duration}d"
        )
        task_ids.append(task_id)

    return task_ids


def ordered_groupings(section: Section) -> list[tuple[str, list[Problem]]]:
    grouping_spec = SECTION_GROUPS.get(section.slug)
    problems_by_number = {problem.number: problem for problem in section.problems}

    if grouping_spec:
        groups: list[tuple[str, list[Problem]]] = []
        seen: set[str] = set()

        for group_name, numbers in grouping_spec:
            members = [problems_by_number[number] for number in numbers if number in problems_by_number]
            if members:
                groups.append((group_name, members))
                seen.update(problem.number for problem in members)

        leftovers = [problem for problem in section.problems if problem.number not in seen]
        if leftovers:
            groups.append(("Additional Problems", leftovers))

        return groups

    buckets: dict[str, list[Problem]] = {"Easy Track": [], "Medium Track": [], "Hard Track": []}
    for problem in section.problems:
        if problem.difficulty == "E":
            buckets["Easy Track"].append(problem)
        elif problem.difficulty == "M":
            buckets["Medium Track"].append(problem)
        else:
            buckets["Hard Track"].append(problem)

    return [(name, problems) for name, problems in buckets.items() if problems]


def chapter_problem_count(chapter: Chapter) -> int:
    return sum(len(section.problems) for section in chapter.sections)


def chapter_group_count(chapter: Chapter) -> int:
    return sum(len(ordered_groupings(section)) for section in chapter.sections)


def part_rollup(chapters: list[Chapter]) -> tuple[int, int, int, int]:
    chapter_count = len(chapters)
    section_count = sum(len(chapter.sections) for chapter in chapters)
    grouping_count = sum(chapter_group_count(chapter) for chapter in chapters)
    duration = max((chapter.duration for chapter in chapters), default=0)
    return chapter_count, section_count, grouping_count, duration


def part_coverage(chapters: list[Chapter]) -> tuple[int, int]:
    implemented = sum(chapter.implemented_problem_count for chapter in chapters)
    total = sum(chapter.problem_count for chapter in chapters)
    return implemented, total


def render_overview_page(chapters: list[Chapter], init_line: str) -> str:
    implemented_unique, total_unique = overall_unique_counts(chapters)
    lines = [
        "# Algorithm Curriculum Gantt",
        "",
        f"This repo currently implements {implemented_unique} of {total_unique} unique problems from the curriculum. Use this hierarchy to navigate from parts to chapters to sections, then into the linked algorithm pages that already exist in the site.",
        "",
        "Chapters are grouped by part and compared as parallel timelines. Click a chapter bar to open its sections gantt. If Mermaid links are disabled in your renderer, use the chapter links below the chart.",
        "",
    ]
    lines.extend(gantt_header(init_line, "overview"))

    click_lines: list[str] = []
    current_part: str | None = None
    current_part_tasks: list[str] = []
    part_gates: list[str] = []

    for index, chapter in enumerate(chapters, start=1):
        if chapter.part != current_part:
            if current_part is not None and current_part_tasks:
                gate_id = f"mp{index - 1:02d}"
                gate_label = f"GATE · {PART_GATE_LABELS[current_part]}"
                lines.append(
                    f"    {gate_label:<34} :milestone, crit, {gate_id}, after {' '.join(current_part_tasks)}, 0d"
                )
                part_gates.append(gate_id)
                lines.append("")

            current_part = chapter.part
            current_part_tasks = []
            lines.append(f"    section {PART_SECTION_LABELS[current_part]}")

        task_id = f"ch{index:02d}"
        prefix = "crit, " if chapter.has_critical else ""
        lines.append(
            f"    {chapter.chart_label:<34} :{prefix}{task_id}, {START_DATE}, {chapter.duration}d"
        )
        current_part_tasks.append(task_id)

        click_lines.append(
            f'    click {task_id} href "./chapters/{chapter.file_name}"'
        )

    if current_part is not None and current_part_tasks:
        gate_id = f"mp{len(chapters):02d}"
        gate_label = f"GATE · {PART_GATE_LABELS[current_part]}"
        lines.append(
            f"    {gate_label:<34} :milestone, crit, {gate_id}, after {' '.join(current_part_tasks)}, 0d"
        )
        part_gates.append(gate_id)
        lines.append("")

    lines.append(
        f"    END · chapter map complete        :milestone, crit, mend, after {' '.join(part_gates)}, 0d"
    )
    lines.append("")
    lines.extend(click_lines)
    lines.append("```")
    lines.append("")
    lines.append("## Part Timelines")
    lines.append("")

    current_part = None
    part_chapters: list[Chapter] = []

    def flush_part() -> None:
        if current_part is None or not part_chapters:
            return

        chapter_count, section_count, grouping_count, duration = part_rollup(part_chapters)
        implemented, total = part_coverage(part_chapters)
        lines.append(f"### {PART_SECTION_LABELS[current_part]}")
        lines.append("")
        lines.append(
            f"{pluralize(chapter_count, 'chapter')} · "
            f"{pluralize(section_count, 'section')} · "
            f"{pluralize(grouping_count, 'grouping')} · "
            f"{implemented}/{total} implemented · "
            f"{timeline_label(duration)}"
        )
        lines.append("")

        for chapter in part_chapters:
            lines.append(
                f'- [{chapter.nav_title}](./chapters/{chapter.file_name}) · '
                f'{pluralize(len(chapter.sections), "section")} · '
                f'{pluralize(chapter_group_count(chapter), "grouping")} · '
                f'{pluralize(chapter.problem_count, "problem")} · '
                f'{chapter_coverage_label(chapter)} · '
                f'{timeline_label(chapter.duration)}'
            )

        lines.append("")

    for chapter in chapters:
        if chapter.part != current_part:
            flush_part()
            current_part = chapter.part
            part_chapters = []

        part_chapters.append(chapter)

    flush_part()
    return "\n".join(lines)


def render_chapter_page(chapter: Chapter, init_line: str) -> str:
    back_link = "[← Back to Chapters Overview](../README.md)"
    section_count = len(chapter.sections)
    grouping_count = chapter_group_count(chapter)
    problem_count = chapter.problem_count
    lines = [
        back_link,
        "",
        f"# {chapter.nav_title}",
        "",
        f"Within [{PART_SECTION_LABELS[chapter.part]}](../README.md).",
        "",
        f"{pluralize(section_count, 'section')} · {pluralize(grouping_count, 'grouping')} · {pluralize(problem_count, 'problem')} · {chapter_coverage_label(chapter)} · {timeline_label(chapter.duration)}",
        "",
        "Sections are compared as parallel timelines inside the chapter. Click a section bar to open its problem gantt. If Mermaid task links are disabled, use the section links below the chart.",
        "",
    ]
    lines.extend(gantt_header(init_line, "chapter"))

    section_header = chapter.lab_title or "Sections"
    lines.append(f"    section {section_header}")

    click_lines: list[str] = []
    section_task_ids: list[str] = []

    for index, section in enumerate(chapter.sections, start=1):
        task_id = f"cs{index:02d}"
        prefix = "crit, " if section.has_critical else ""
        lines.append(
            f"    {section.chart_label:<34} :{prefix}{task_id}, {START_DATE}, {section.duration}d"
        )
        section_task_ids.append(task_id)

        click_lines.append(
            f'    click {task_id} href "../sections/{section.file_name}"'
        )

    lines.append(
        f"    END · section map complete        :milestone, crit, mend, after {' '.join(section_task_ids)}, 0d"
    )
    lines.append("")
    lines.extend(click_lines)
    lines.append("```")
    lines.append("")
    lines.append("## Section Timelines")
    lines.append("")

    for section in chapter.sections:
        group_names = "; ".join(group_name for group_name, _ in ordered_groupings(section))
        lines.append(f"### {section.nav_title}")
        lines.append("")
        lines.append(
            f"[Open problem gantt](../sections/{section.file_name}) · "
            f"{pluralize(len(section.problems), 'problem')} · "
            f"{pluralize(len(ordered_groupings(section)), 'grouping')} · "
            f"{section_coverage_label(section)} · "
            f"{timeline_label(section.duration)}"
        )
        lines.append("")
        lines.append(f"Groupings: {group_names}")
        lines.append("")

    lines.append("")
    lines.append(back_link)
    lines.append("")
    return "\n".join(lines)


def render_section_page(section: Section, init_line: str) -> str:
    back_link = f"[← Back to {section.chapter_title}](../chapters/{section.chapter_file})"
    groupings = ordered_groupings(section)
    section_duration = max((group_duration(problems) for _, problems in groupings), default=section.duration)
    available = section.implemented_problem_count
    total = len(section.problems)
    lines = [
        back_link,
        "",
        f"# {section.nav_title}",
        "",
        f"Within [{section.chapter_title}](../chapters/{section.chapter_file}).",
        "",
        f"{pluralize(len(section.problems), 'problem')} · {pluralize(len(groupings), 'grouping')} · {available}/{total} implemented · {timeline_label(section_duration)}",
        "",
        "## Groupings",
        "",
    ]

    for group_name, problems in groupings:
        lines.append(
            f"- {group_name} · {pluralize(len(problems), 'problem')} · {timeline_label(group_duration(problems))}"
        )

    lines.append("")
    lines.extend(gantt_header(init_line, "section"))

    end_anchors: list[str] = []
    problem_index = 0

    for group_name, problems in groupings:
        lines.append(f"    section {compact_group_label(group_name)}")
        previous_anchor: str | None = None

        for problem in problems:
            problem_index += 1
            task_id = f"sp{problem_index:02d}"
            prefix = "crit, " if problem.is_starred else ""
            if previous_anchor is None:
                lines.append(
                    f"    {problem.chart_label:<34} :{prefix}{task_id}, {START_DATE}, {problem.duration}d"
                )
            else:
                lines.append(
                    f"    {problem.chart_label:<34} :{prefix}{task_id}, after {previous_anchor}, {problem.duration}d"
                )
            previous_anchor = task_id

        if previous_anchor is not None:
            end_anchors.append(previous_anchor)
        lines.append("")

    lines.append(
        f"    END · problem map complete        :milestone, crit, mend, after {' '.join(end_anchors)}, 0d"
    )
    lines.append("```")
    lines.append("")
    lines.append("## Coverage")
    lines.append("")
    lines.append(f"- Implemented in this repo: {available}/{total}")
    lines.append(f"- Published site index: [{SITE_BASE_URL}]({SITE_BASE_URL})")
    lines.append("")
    lines.append("## Problems by Group")
    lines.append("")

    for group_name, problems in groupings:
        lines.append(f"### {group_name}")
        lines.append("")
        lines.append(
            f"{pluralize(len(problems), 'problem')} · {timeline_label(group_duration(problems))}"
        )
        lines.append("")

        for problem in problems:
            star = " ★" if problem.is_starred else ""
            href = relative_problem_href(section, problem)
            status = "available" if href else "planned"
            if href:
                lines.append(
                    f"- [`{problem.number}` {problem.title}]({href}) · `{problem.difficulty}` · {problem.duration}d · {status}{star}"
                )
            else:
                lines.append(
                    f"- `{problem.number}` {problem.title} · `{problem.difficulty}` · {problem.duration}d · {status}{star}"
                )

        lines.append("")

    lines.append(back_link)
    lines.append("")
    return "\n".join(lines)


def render_root_readme(chapters: list[Chapter]) -> str:
    implemented_unique, total_unique = overall_unique_counts(chapters)
    part_order: list[str] = []
    chapters_by_part: dict[str, list[Chapter]] = {}

    for chapter in chapters:
        if chapter.part not in chapters_by_part:
            chapters_by_part[chapter.part] = []
            part_order.append(chapter.part)
        chapters_by_part[chapter.part].append(chapter)

    lines = [
        "# Algorithms",
        "",
        "Interactive proofs and visual explanations for problems from *The Mechanics of Problem-Solving* curriculum.",
        "",
        "This repository is aligned to the source curriculum in the sibling `craft` repo at `pattern/core/toc.md`.",
        "",
        "## Entry Points",
        "",
        f"- [Published site]({SITE_BASE_URL})",
        "- [Local site index](./index.html)",
        "- [Curriculum Gantt overview](./gantt/README.md)",
        "",
        "Each chapter Gantt links to section Gantts. Each section page links to the implemented problem pages that already exist in this repo, while still showing the remaining planned problems from the curriculum.",
        "",
        "## Alignment Snapshot",
        "",
        f"- Unique curriculum problems implemented here: **{implemented_unique}/{total_unique}**",
        "- Fully covered today: **Chapter 1 — Array and String Mechanics**",
        "- Bridge pages already implemented outside Chapter 1: **206 Reverse Linked List**, **1 Two Sum**, **704 Binary Search**",
        "- Not yet implemented in this repo: the rest of Chapters 2–16 and both appendices",
        "",
        "## Coverage by Part",
        "",
        "| Part | Chapters | Implemented | Timeline |",
        "| --- | ---: | ---: | --- |",
    ]

    for part in part_order:
        part_chapters = chapters_by_part[part]
        implemented, total = part_coverage(part_chapters)
        _, _, _, duration = part_rollup(part_chapters)
        lines.append(
            f"| {PART_SECTION_LABELS[part]} | {len(part_chapters)} | {implemented}/{total} | {timeline_label(duration)} |"
        )

    lines.extend(
        [
            "",
            "## Curriculum Navigation",
            "",
            "- [Overview Gantt](./gantt/README.md)",
        ]
    )

    for part in part_order:
        lines.append(f"  - **{PART_SECTION_LABELS[part]}**")
        for chapter in chapters_by_part[part]:
            lines.append(
                f"    - [{chapter.nav_title}](./gantt/chapters/{chapter.file_name}) · {chapter_coverage_label(chapter)}"
            )
            for section in chapter.sections:
                lines.append(
                    f"      - [{section.nav_title}](./gantt/sections/{section.file_name}) · {section_coverage_label(section)}"
                )

    lines.extend(
        [
            "",
            "## Current Site Surface",
            "",
            "The current published site is chapter-heavy around foundational mechanics: arrays, strings, matrix traversal, a few mathematical warm-ups, plus one page each for hashing, binary search, and linked-list pointers.",
            "",
            "The Gantt hierarchy in this repo makes that partial coverage explicit instead of flattening everything into one index page.",
            "",
        ]
    )

    return "\n".join(lines)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def prepare_output_dirs(base_dir: Path) -> tuple[Path, Path]:
    chapters_dir = base_dir / "chapters"
    sections_dir = base_dir / "sections"

    if base_dir.exists():
        for folder in (chapters_dir, sections_dir):
            if folder.exists():
                shutil.rmtree(folder)

    chapters_dir.mkdir(parents=True, exist_ok=True)
    sections_dir.mkdir(parents=True, exist_ok=True)
    return chapters_dir, sections_dir


def main() -> None:
    root = repo_root()
    gantt_dir = root / "gantt"
    plan_path = (root / PLAN_RELATIVE_PATH).resolve()
    toc_path = (root / TOC_RELATIVE_PATH).resolve()

    init_line = extract_init_line(plan_path)
    chapters = parse_curriculum(toc_path)
    page_map = canonical_problem_pages(root)
    attach_problem_pages(chapters, page_map)

    chapters_dir, sections_dir = prepare_output_dirs(gantt_dir)

    write_text(root / "README.md", render_root_readme(chapters))
    write_text(gantt_dir / "README.md", render_overview_page(chapters, init_line))

    for chapter in chapters:
        write_text(chapters_dir / chapter.file_name, render_chapter_page(chapter, init_line))

        for section in chapter.sections:
            write_text(
                sections_dir / section.file_name,
                render_section_page(section, init_line),
            )

    print(f"Wrote curriculum docs to {gantt_dir}")


if __name__ == "__main__":
    main()
