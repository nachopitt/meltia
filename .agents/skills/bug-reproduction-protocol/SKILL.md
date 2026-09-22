---
name: bug-reproduction-protocol
description: "Enforces the 5-step test-first reproduction and surgical resolution protocol for bugs, console errors, and SSR hydration issues. Activates when investigating, diagnosing, or fixing bugs, test failures, console warnings, or regressions."
license: MIT
metadata:
  author: apex
---

# Bug Reproduction Protocol (Reproduce-First Loop)

This skill governs the systematic investigation, reproduction, and surgical remediation of software bugs, console warnings, regression failures, and SSR hydration errors.

---

## 1. The Core Philosophy

> [!CRITICAL]
> **No Guesswork, Zero Speculation**: Never modify application code until the failure has been observed live in an automated test. Never claim a bug is resolved based solely on static analysis, type checks, or assumptions.

---

## 2. The 5-Step Reproduction First Loop

```mermaid
flowchart TD
    A[1. Reproduce First: Automated Test] --> B[2. Capture & Confirm Live Failure]
    B --> C[3. Root-Cause Analysis]
    C --> D[4. Surgical Fix: Minimal Diff]
    D --> E[5. Verify: Test Passes with 0 Errors]
```

### Step 1: Reproduce First
- Write or execute an automated test BEFORE modifying any application code.
- Tool selection:
  - **Browser runtime / console / hydration errors**: Use Playwright E2E with `page.on('console')`.
  - **Backend logic / database / auth / policy**: Use Pest PHP.
  - **Isolated utility functions / component state**: Use Vitest.

### Step 2: Capture & Confirm
- Run the test in the appropriate Docker container (`workspace` or `playwright`).
- Confirm that the exact error string, stack trace, or warning appears live in the test runner output.
- Record the baseline failure.

### Step 3: Root-Cause Analysis
- Trace the root cause rather than patching symptoms.
- Examples:
  - SSR hydration warning $\rightarrow$ non-deterministic timestamp or DOM nesting error.
  - 403 Forbidden $\rightarrow$ missing tenant scoping in Policy.
  - `dragleave` loop $\rightarrow$ dynamic DOM overlays mounted under moving mouse pointer.

### Step 4: Surgical Fix
- Apply the minimal targeted diff (Ponytail discipline: fewest changed lines, zero unrequested refactoring).
- Touch only the lines directly causing the defect.

### Step 5: Verify with Test
- Re-run the reproducing test in the real Docker container environment.
- Confirm green exit code, zero errors, and zero warnings.
