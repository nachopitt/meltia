---
name: git-commit-discipline
description: "Enforces strict Git staging ownership, imperative mood, and 50/72 formatting limits (subject <= 50 chars, body wrapped <= 72 chars). Activates when proposing commit messages, inspecting git status/diff, preparing milestone commits, or reviewing staged changes."
license: MIT
metadata:
  author: apex
---

# Git Commit Discipline & 50/72 Standard

This skill establishes the repository's git hygiene, commit message formatting, and staging boundary invariants.

---

## 1. User Git State Ownership Invariants

> [!CRITICAL]
> The human user owns 100% of the git workflow: staging, branching, committing, and pushing.
> AI agents NEVER execute write operations on Git.

- **Zero Git Write Execution**: NEVER run `git add`, `git commit`, `git push`, `git checkout`, `git branch`, `git reset`, or `git restore`.
- **Zero Trailing Prompts for Git Execution**: NEVER ask the user if you should run `git add` or `git commit` on their behalf. Staging and committing is strictly the user's domain.
- **Role on Commit Prompts**: When the user requests a commit (e.g. typing `git commit`, `commit`, or `/commit`), your ONLY task is to:
  1. Inspect `git status` AND `git diff --cached` (read-only).
  2. If changes are staged (`Changes to be committed:`):
     - The commit message MUST describe the staged index (`git diff --cached`).
     - If unstaged changes also exist, offer the staged message as primary, with an optional separate message for unstaged or combined files. Never confuse unstaged changes for the staged commit payload.
  3. If nothing is staged:
     - Inspect working tree changes (`git diff`) and craft the message for unstaged files.
  4. Compose and output the proposed commit message adhering strictly to the 50/72 standard.
  5. Stop and get out of the way. Do not stage, do not commit, do not ask to execute.
- **No External Tools for Text Validation**: Never invoke shell commands, Python scripts, Node one-liners, or CLI utilities to count characters or validate line wrapping. Compose text within comfortable safety margins (35–45 char subject, ~55–65 char body lines) directly during generation.

---

## 2. The Strict 50/72 Imperative Mood Standard

Every proposed commit message MUST conform strictly to the 50/72 rule.

### Format Anatomy
```git
<type>(<scope>): <imperative subject strictly <= 50 chars>

<detailed body explaining why, wrapped strictly to <= 72 chars per line.
Multiple lines allowed.>

Signed-off-by: <Name> <email>
```

### 1. Line 1: Hard $\le$ 50 Char Subject Invariant
- **Conventional Prefix**: Use standard prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- **Hard Ceiling**: Total character count of Line 1 MUST be strictly $\le 50$ characters (inclusive of prefix, scope, colon, spaces, and text).
- **Formula**:
  $$\text{Max Description Length} = 50 - \text{length}(\text{type(scope): })$$
  *Example*: `feat(calendar): ` is 16 chars $\rightarrow$ Description has at most **34 characters**.
- **Compression Rule**: If scope + description exceeds 50 chars:
  - Simplify description (e.g. `feat(calendar): add reschedule dock & slot engine` = 49 chars ✅).
  - Shorten or drop the scope (e.g. `feat: add reschedule dock & slot engine` = 40 chars ✅).
  - Move details into the commit body.
- **Safety Margins Over Tool-Assisted Counting**: Never invoke shell commands, Python scripts, Node one-liners, or CLI utilities to count characters or validate line wrapping. Instead, maintain comfortable safety margins: aim for 35–45 characters on the subject line, and wrap body text naturally at 55–65 characters. When text feels close to the limit, shorten the phrasing rather than measuring it with a tool.

### 2. Line 2: Empty Line
- Line 2 MUST be completely blank.

### 3. Line 3+: Body Wrapped Strictly $\le$ 72 Chars
- Focus on **why** and non-obvious context, not line-by-line restatements of code diffs.
- Hard wrap every body line to strictly $\le 72$ characters.

### 4. Output Cleanliness (Zero Wrapper)
- Output the commit message inside a clean, copyable code block (`gitcommit` or `text`).
- Do NOT output extraneous preambles (e.g. *"Proposed commit message..."*), summaries, or bash execution instructions (`git commit -m "..."`) unless explicitly requested.
