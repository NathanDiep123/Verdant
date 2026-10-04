---
description: Hands-off project setup for the tool that runs it (Claude Code or Codex). Installs that tool's required skills, plugins, and graphify; writes AGENTS.md (standing instructions), a thin CLAUDE.md under Claude Code, PROGRESS.md, and that tool's hooks. The resulting workflow fires every skill automatically from session start and asks the user only for design decisions - trimmed superpowers workflow, ponytail minimal-code discipline, taste-first design, shadcn plus React/TypeScript/Tailwind frontend defaults, agentic orchestration from any model tier (three-tier model split, every piece of work dispatched to the lowest capable tier, no model-switch requests), PROGRESS.md log, graphify-first file access, re-anchoring after compaction, no-AI-attribution commits, and no-ai-slop humanizing of user-facing text.
---

# Setup instructions

This is the **setup file**. The session that reads it carries out every step below, in order, in one run. The file it produces, `AGENTS.md`, holds the standing instructions for every later session. In this setup file, "AGENTS.md" always means that output file, and "this setup file" always means the file you are reading.

## How this run behaves

**The run targets exactly one tool: the session's tool.** Determine whether you are Claude Code or OpenAI Codex (CLI/IDE). That tool is the session's tool. Every install, plugin, graphify registration, hook, and tool-specific detail in this run is for the session's tool only. Where this setup file says *Claude Code: … / Codex: …*, carry out the half for the session's tool and ignore the other half. The run installs nothing for the other tool and writes no config for it. When the user later runs this setup file from the other tool, that run adds the other tool's pieces and merges them with what already exists.

**The run is hands-off.** The user pointing the session at this setup file is the approval for every install and every file write it lists. The run never asks for confirmation, never presents a plan and waits, and never stops on a failed step. A failed step gets its listed fallback; when the fallback also fails, the run records the failure with its error output, continues with the remaining steps, and reports it in the closing report. The run stops to ask the user only when it reaches a situation this setup file does not cover.

**Every model tier runs this setup.** The run installs global tools and writes only these files: `AGENTS.md`, `PROGRESS.md`, and the session's tool config (Claude Code: `CLAUDE.md` and `.claude/settings.json`. Codex: `.codex/hooks.json`). It writes no source code.

**The run logs itself in `PROGRESS.md`**, in the format defined in point 7 below: a start entry before AGENTS.md is written and an end entry after the closing report. The run creates `PROGRESS.md` when it does not exist.

## Step 1: Install skills and plugins

Check every skill below before doing anything else. **The skill list the session exposes is the authoritative check** (Claude Code: the available-skills listing in the system context. Codex: the skills it lists as available). A skill that appears in that list is installed. A skill that does not appear is installed with exactly the command in its bullet.

Rules for every install:

- Every `npx skills add` command carries `-y` (or `--yes`) so it never prompts.
- `npx skills add … -g` installs into the shared global skills directory and also attempts other agent targets. Errors for those other targets (for example "PromptScript does not support global skill installation") do not mean the install failed. The install succeeded when the skill's folder exists afterwards. Claude Code: `~/.claude/skills/<name>`. Codex: `~/.agents/skills/<name>`.
- Each skill's command below was verified against that project's own repo or docs. Never replace it with the generic `npx skills add <name> -g -s <name> -y` pattern or any other guessed package, repo, or flag.

The skills:

- **`shadcn`** (official skill from `shadcn-ui/ui`), listed as `shadcn`. Install: `npx skills add https://github.com/shadcn-ui/ui/tree/main/skills/shadcn -g -y`.
- **`superpowers`** (`obra/superpowers`), a **plugin** listed as a set of skills (`brainstorming`, `writing-plans`, and others; Claude Code shows them as `superpowers:brainstorming` and so on). Install: Claude Code: `claude plugin install superpowers@claude-plugins-official`; when `claude plugin marketplace list` does not show `claude-plugins-official`, first run `claude plugin marketplace add anthropics/claude-plugins-official`. Codex: run `codex plugin list`, find the line `superpowers@<marketplace>` (currently `superpowers@openai-curated-remote`), and run `codex plugin add superpowers@<marketplace>` with the marketplace that line shows. Fallback, only when that command fails: the closing report tells the user to run `/plugins`, search `superpowers`, and select **Install Plugin**.
- **`design-taste-frontend`** (`Leonxlnx/taste-skill`), listed as `design-taste-frontend`. Install: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend" -g -y`.
- **`impeccable`** (`pbakaus/impeccable`), listed as `impeccable`. Install: `npx -y impeccable install`. Fallback, when that command is unavailable or fails (for example with "invalid zip data"): `npx skills add https://github.com/pbakaus/impeccable --skill impeccable -g -y`. The impeccable init step does not run in this setup run, because the skill loads only in a new session. The user does not run it either: AGENTS.md point 3 makes the next session run it automatically before its first UI work.
- **`ponytail`** (`DietrichGebert/ponytail`), a **plugin** that injects a minimal-code ruleset through session hooks; listed as skills including `ponytail`, `ponytail-review`, `ponytail-audit`, and `ponytail-debt`. Install: Claude Code: `claude plugin marketplace add DietrichGebert/ponytail`, then `claude plugin install ponytail@ponytail`. Codex: `codex plugin marketplace add DietrichGebert/ponytail`, then `codex plugin add ponytail@ponytail`. Its mode stays at the default (`full`): the run creates no ponytail config file and does not set `PONYTAIL_DEFAULT_MODE`.
- **`no-ai-slop`** (`petergyang/no-ai-slop`), listed as `no-ai-slop`. Install: `npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes`. It is the only humanizer in this workflow (point 12). No other installed humanizer skill is part of this workflow.

Skills and plugins installed during this run load only in a new session. The run does not invoke them; the closing report says a new session is needed.

## Step 2: Install and register graphify

1. Run `graphify --version`. When the command is not found, check `~/.local/bin/graphify`; when it exists there, add `~/.local/bin` to PATH for the session. graphify is installed when either check finds it.
2. When graphify is not installed: run `uv --version`. When `uv` is not installed, install it with Astral's official installer (Windows: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`. macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`), then add `~/.local/bin` to PATH for the session. Then run `uv tool install graphifyy` (the package name has two y's).
3. From the project root, register graphify for the session's tool. Claude Code: `graphify claude install`, which writes a `## graphify` section into CLAUDE.md and adds a Claude Code PreToolUse hook. Codex: `graphify codex install`, which writes a `## graphify` section into AGENTS.md.
4. **Point 8 replaces the `## graphify` section graphify wrote.** When writing the files in step 3, delete that section, so point 8 in AGENTS.md is the only set of graphify rules. Keep every hook graphify registered (step 4 extends it).

## Step 3: Write the files

- **`AGENTS.md`** at the project root holds **all** the standing instructions in the blocks and numbered points below. It is the single source of truth. Codex reads it natively; Claude Code reads it through the import in CLAUDE.md.
- **`CLAUDE.md`** (Claude Code only) at the project root is a thin pointer and contains nothing else: the line `@AGENTS.md` (Claude Code's import syntax, which inlines that file), followed by one sentence stating that all standing instructions live in AGENTS.md and are edited there, never duplicated in CLAUDE.md. A Codex run neither creates nor edits CLAUDE.md.

**Tool-specific details in AGENTS.md cover the session's tool only.** Wherever the instructions below say *Claude Code: … / Codex: …*, AGENTS.md gets the session's tool's half, written without the tool label. Exception: when AGENTS.md already contains the other tool's half from an earlier run of this setup file, keep it and write both halves in the labeled *Claude Code: … / Codex: …* form, so the repo works from both tools.

**Block references become section names.** In AGENTS.md, each opening block is a section with its own heading (the block's name, without "Block N:"), and every reference below to "block N" is written as that section's name, for example "(Skills fire automatically)".

Merging with existing files:

- When AGENTS.md exists, merge the blocks and numbered points into it and leave unrelated content in place. A section that an earlier run of this setup file wrote is updated in place, never duplicated.
- When CLAUDE.md exists and holds standing instructions from an earlier version of this setup file, **move** them: merge their content into AGENTS.md under the rule above, then delete them from CLAUDE.md. Unrelated content in CLAUDE.md stays, below the `@AGENTS.md` line.
- When either file contains a Neon backend point from an earlier version of this setup file, keep it in AGENTS.md and place it after the last numbered point, so no point number shifts.

### The opening blocks of AGENTS.md

Six blocks sit above point 1 in AGENTS.md, in exactly this order, shortest and most binding first:

1. **Standing-contract preamble** (below).
2. **Everything is agentic** (below).
3. **Order of operations** (below).
4. **Skills fire automatically** (below).
5. **Terminology** (below).
6. **The cannot-be-followed disclosure rule** (below).

Each of the six stays short enough to survive being the first thing read.

**Block 1: Standing-contract preamble.** At most eight lines, the first content in the file, stating:

- The file is binding for every session in this repo.
- After a compaction or session resume, the orchestrator re-reads it instead of recalling it (point 9).
- The non-negotiables: the process-skill chain runs before non-small implementation (point 1); the orchestrator, on every tier, dispatches every piece of work to the lowest capable tier and never asks the user to switch models (block 2, points 6 and 10); `superpowers:verification-before-completion` runs before every claim of done (points 1 and 6); every change gets a `PROGRESS.md` entry (point 7); `graphify` is queried before every non-exempt file read (point 8); skills fire automatically, never waiting for the user to name them (block 4).

**Block 2: Everything is agentic.** Written into AGENTS.md as follows:

- **The orchestrator dispatches.** The orchestrator is the main session, on whichever tier it runs, and it is the user's only point of contact. It talks with the user, dispatches the work, verifies the results, and relays what matters. Every dispatch sets the model explicitly (point 10). Claude Code: the Agent tool's `model` parameter, with the alias `opus`, `sonnet`, or `haiku`. Codex: the model on the spawn request.
- **Planning-tier work goes to the planning tier.** Brainstorming, writing specs and plans, `superpowers:systematic-debugging` diagnosis, the design-direction pass, and bounded research. When the orchestrator is on the planning tier, it does this work inline. Else it dispatches it to a planning-tier agent (Claude Code: `model: "opus"`), using the question-round protocol for brainstorming and diagnosis (point 10).
- **Non-small implementation goes to execution-tier agents** (Claude Code: `model: "sonnet"`) through `superpowers:subagent-driven-development` (point 1), on every orchestrator tier. The orchestrator never makes a non-small implementation edit itself.
- **Read-only legwork above three tool calls goes to light-tier agents** (Claude Code: `model: "haiku"`).
- **Inline on every tier, closed list:** small changes, read-only checks of three tool calls or fewer, `PROGRESS.md` entries, edits to AGENTS.md, CLAUDE.md, prompts, or an existing spec or plan (point 6), and the final `superpowers:verification-before-completion`.
- **The user never switches models for this workflow.** The orchestrator never asks the user to switch models and never stops to wait for a switch. Work that belongs on another tier is dispatched to that tier. When the user switches models anyway, every rule holds unchanged on the new tier.

**Block 3: Order of operations.** Multiple points fire on one task and each says "first"; this list is the tiebreak. On every new task, the orchestrator runs these steps in this order:

0. **Re-anchor (point 9)**, only after a compaction or a resume: re-read AGENTS.md and state which rules govern the work in flight. Nothing else starts until that is stated.
1. `graphify` (point 8), before reading any non-exempt file, including while orienting at the start of the task.
2. Pick the tier for the work and dispatch accordingly (block 2, points 6 and 10), **before** invoking a process skill, because the skill invocation is what classifies the work. Planning-tier work runs inline when the orchestrator is on the planning tier; else the process skill runs inside a dispatched planning-tier agent.
3. The `superpowers` process skill (point 1): `superpowers:brainstorming` or `superpowers:systematic-debugging`, inline or inside the planning-tier agent per step 2. Process skills set the approach; the steps below carry it out.
4. Implementation skills: the `ponytail` ladder (point 2), design (point 3), `shadcn` (point 4), stack defaults (point 5), `no-ai-slop` on user-facing text (point 12). They run inside the process chain, never instead of it. Non-small implementation at this step goes to execution-tier agents (point 10), whose briefs name the skills they use.
5. `superpowers:verification-before-completion` (point 1) before every claim of done, run by the orchestrator on the work itself, including everything an agent returned.

`graphify` fires again at every later step the moment a non-exempt file needs reading. It is first in this list because orientation comes first, not because it applies only there.

When two points conflict and this list does not settle it, the process skill wins over the implementation skill, and the more restrictive reading wins over the more permissive one.

**Block 4: Skills fire automatically.** Every session invokes every skill below on its trigger, without being asked and without asking. The user never names a skill. A trigger that matches means the skill runs; "the user didn't mention it" is never a reason to skip one.

| Skill | Trigger |
|---|---|
| `superpowers:using-superpowers` | Session start (the superpowers plugin's own hook injects it). |
| `superpowers:brainstorming` | Every non-small new feature or behavior change, before any implementation. |
| `superpowers:systematic-debugging` | A bug the user reports, or a failure found outside a dispatched task (point 1). |
| `superpowers:writing-plans` | Directly after brainstorming or debugging diagnosis produces an agreed design for non-small work. |
| `superpowers:subagent-driven-development` | Directly after the plan file is written. |
| `superpowers:executing-plans` | Only when the session has no subagent tool; it replaces subagent-driven-development in that case. |
| `superpowers:test-driven-development` | Inside every implementer agent working on logic, data, or API code. |
| `superpowers:requesting-code-review` | After the last implementation task of every non-small change, before final verification. |
| `superpowers:receiving-code-review` | Whenever review feedback arrives, from the user or from a reviewer agent. |
| `superpowers:using-git-worktrees` | Start of non-small work, in a git repository only. |
| `superpowers:finishing-a-development-branch` | End of non-small work on a branch, in a git repository only. |
| `superpowers:verification-before-completion` | Before every claim of done, fixed, working, or passing, on every task. |
| `ponytail` | Every coding task (its plugin hooks keep it active). |
| `ponytail-review` | On the diff of every non-small change, alongside `superpowers:requesting-code-review`. |
| `ponytail-debt` | At the end of every task that added a `ponytail:` comment. |
| `design-taste-frontend` | The first UI work that has no written design direction yet (point 3). |
| `impeccable` init | The first UI work in this repo, before anything else, when `PROGRESS.md` has no entry recording it. Log it in `PROGRESS.md` when done. |
| `impeccable` | Every UI pass after the direction exists: critique, iteration, polish, audit (point 3). |
| `shadcn` | Every component that needs standard UI plumbing (point 4). |
| `no-ai-slop` | Finished user-facing text (point 12). |

Skills not in this table run only when the user asks for them: `ponytail-audit`, `ponytail-gain`, `ponytail-help`, `/ponytail` mode changes, `superpowers:writing-skills`, `superpowers:diagnosing-superpowers`, and `superpowers:dispatching-parallel-agents` (point 10 covers parallel dispatch).

**Minimal user input.** The orchestrator asks the user only for decisions that the request, the repo, and these instructions do not settle:

- Brainstorming, inline or in a planning-tier agent, asks only questions whose answer changes the design and cannot be inferred. The questions reach the user together in one message from the orchestrator, each with a recommended answer, so the user can reply "yes". When no question meets that bar, brainstorming states its assumptions in one short list and proceeds to `superpowers:writing-plans` without waiting for approval (point 10, question-round protocol).
- Choices these instructions already settle are never put to the user: plans execute through `superpowers:subagent-driven-development` (or `superpowers:executing-plans` when no subagent tool exists); `superpowers:finishing-a-development-branch` keeps the branch and reports it, and merging, pushing, or opening a PR happens only when the user asks (point 11).
- The model tier is never put to the user. When work belongs on another tier, the orchestrator dispatches an agent on that tier (block 2, point 10). It never asks the user to switch models.

**Block 5: Terminology.** Defined once, here; every block and point uses these terms and no synonyms.

- **Orchestrator**: the main session the user talks to, on whichever tier it runs. It is the user's only point of contact, dispatches all work that is not on block 2's inline list, and owns every result.
- **Agent**: a subagent the orchestrator dispatches. An agent never talks to the user; its report goes to the orchestrator only.
- **Session**: the orchestrator or an agent. A rule whose actor is "every session" binds whichever of them performs the action.
- **Dispatch**: starting an agent with an explicit model (point 10). It is the only word used for sending work to an agent.
- **Inline**: done by the orchestrator itself, without an agent.
- **Planning tier**: Claude Code: the latest available Opus model (Agent-tool alias `opus`). Codex: the latest available Sol model. Does brainstorming, debugging diagnosis, the design-direction pass, spec- and plan-writing, and bounded research.
- **Execution tier**: Claude Code: the latest available Sonnet model (alias `sonnet`). Codex: the latest available Luna model. Writes and edits code, tests, and config from a plan, and reviews that work.
- **Light tier**: Claude Code: the latest available Haiku model (alias `haiku`). Codex: the latest available Luna model with `model_reasoning_effort = "low"` (Codex has nothing below Luna). **Read-only work only:** locating code, running graphify queries and summarizing the answer, running tests, builds, or linters and reporting the result, summarizing logs or docs. A light-tier agent never creates or edits files, so it writes no `PROGRESS.md` entry.
- **Lower tiers** are the execution and light tiers. **Work goes to the lowest tier that does it correctly**: light before execution, execution before planning. Planning-tier tokens go only to the planning-tier work listed in block 2.
- **"Latest available" is part of the rule.** Every model choice (setting, recommending, or dispatching) uses the newest version of the family that the tool offers, never an older pinned version. Claude Code: the aliases always resolve to the latest version, so dispatches pass the alias, never a full model ID. This block names the model families; block 2 and point 10 name only the aliases; everything else says "planning tier", "execution tier", or "light tier". When model families change, only this block and those aliases change.
- **Session shape:** the orchestrator runs on whichever tier the user started it on. On the planning tier, it does planning-tier work inline. On every other tier, it dispatches planning-tier work to a planning-tier agent. Everything else is identical on every tier: the orchestrator dispatches non-small implementation to execution-tier agents, dispatches read-only legwork to light-tier agents, and runs final verification itself.
- **Switching models:** the user never needs to switch models, and the orchestrator never asks for a switch. When the user switches anyway (Claude Code: the model picker or `/model`. Codex: `/model`), every rule holds unchanged on the new tier.
- **Spec**: the design document `superpowers:brainstorming` writes. **Plan**: the implementation plan file `superpowers:writing-plans` writes from the spec. They are different files; "plan" never means an outline in chat.
- **Small** is a change on point 6's closed list. **Non-small** is every other change. These are the only two size words; "trivial", "significant", and similar words are not used.
- **Skill names** are written as `plugin:skill` (for example `superpowers:brainstorming`), the way Claude Code lists them. Codex uses the skill of the same name as Codex lists it.

**Block 6: A rule that cannot be followed is stated out loud, never skipped silently.** When an instruction in AGENTS.md cannot be satisfied at that moment (`graphify` is not installed, `PROGRESS.md` cannot be written, a skill is missing), the session does not proceed as though the step did not apply. In the same response as the work, it states which rule it could not follow, why, and what it did instead. A silent skip looks identical to compliance from the outside, so the skip is always stated. Being unable to follow a rule is acceptable; concealing it is not.

This block does **not** cover the model-tier split (point 6). A tier violation is never disclosed and worked around. An absent user is not a waiver, and "I noted that this belonged on another tier" is not a substitute for dispatching it. Work on the wrong tier is always dispatched to an agent on the right tier (point 10). The orchestrator never asks the user to switch models, never stops to wait for a switch, and never proceeds on the wrong tier with a disclaimer.

### The numbered points of AGENTS.md

AGENTS.md instructs every session in this repo as follows.

1. **A trimmed `superpowers` skill set is the default workflow.** Before any non-small work (point 6), the orchestrator runs `superpowers:brainstorming` (new features or behavior changes) or `superpowers:systematic-debugging` (bugs or unexpected behavior), inline when it is on the planning tier and else in a dispatched planning-tier agent (block 2). Implementation never starts before one of them. **Small changes skip the chain:** the orchestrator makes the edit inline, on every tier (point 6), then runs `superpowers:verification-before-completion`. The rest of the chain is this closed set; block 4 lists the skills outside it, which run only on request:
   - **Non-small changes, in order:** `superpowers:brainstorming` → `superpowers:writing-plans` → `superpowers:subagent-driven-development` (the only way plans are executed; `superpowers:executing-plans` replaces it only when the session has no subagent tool) → `superpowers:requesting-code-review` → `superpowers:verification-before-completion`, which every task gets.
   - **Which bugs go to `superpowers:systematic-debugging`:** bugs the user reports, and failures found outside every dispatched task (for example during final verification). A test failing inside a dispatched execution-tier task, including the expected red step of test-driven development, is fixed by that execution-tier agent within the plan's scope. It goes to planning-tier diagnosis only when that agent reports it cannot fix it within that scope.
   - **Conditional, `superpowers:test-driven-development`:** required for logic, data, and API code (all code with testable inputs and outputs). Not required for visual work (layout, styling, copy, purely presentational components), where verification means running the app and checking the result.
   - **Git repositories only, `superpowers:using-git-worktrees` and `superpowers:finishing-a-development-branch`:** they run when the project is a git repository and the work happens on a branch. In a project that is not a git repository they never run.
   - **Review, `superpowers:requesting-code-review` and `superpowers:receiving-code-review`:** requesting runs automatically on every non-small change after its last implementation task; receiving runs automatically whenever review feedback arrives.
   - **Not used, `superpowers:dispatching-parallel-agents`:** point 10 covers parallel dispatch.

   **Reaching for any of these skills is the signal to pick the tier (point 6).** Invoking `superpowers:brainstorming`, `superpowers:writing-plans`, or `superpowers:systematic-debugging` classifies the work as planning-tier, so the orchestrator picks the tier before the skill runs, not after.

2. **The least code that works, built on what already exists (`ponytail`).** The `ponytail` plugin enforces this through its hooks; the rules are restated here so they hold where the plugin is not installed. Before writing any code, every session walks this ladder and stops at the first rung that solves the problem:
   1. Does it need to exist at all? When no, write nothing and say so.
   2. Does the codebase already have it? Reuse it.
   3. Does the language's standard library cover it? Use that.
   4. Does the platform or framework have it natively? Use that.
   5. Does an already-installed dependency cover it (including shadcn components already in the repo, point 4)? Use that. Adding a new dependency is not a rung: it needs the user's agreement, and a dependency named in a spec or plan the user approved counts as agreed. Pulling a new shadcn component is not a new dependency; point 4 requires it over hand-building.
   6. Does one line solve it? Write one line.
   7. Only then write new code: the minimum that solves the problem, nothing speculative.

   Edits are surgical: they touch only what the request requires, match existing style, and flag (never remove) pre-existing dead code. **Minimalism never cuts:** input validation at trust boundaries, data-loss handling, security, accessibility, the tests point 1 requires, and the design quality point 3 requires. Ponytail governs how much *code* gets written, never whether the UI looks considered. `ponytail-review` and `ponytail-debt` run on the triggers in block 4; `/ponytail` mode changes, `ponytail-audit`, `ponytail-gain`, and `ponytail-help` run only when the user asks. Surfacing assumptions, success criteria, and planning belong to `superpowers:brainstorming` and `superpowers:writing-plans` (point 1).

3. **Design skills run on all frontend and UI work, and avoiding AI clichés is the top priority, from the first pass on, not as a final polish.** For everything touching visual design, layout, components, or styling, the sequence is fixed:
   - **First UI work in the repo:** before anything else, the orchestrator runs the `impeccable` init step automatically when `PROGRESS.md` has no entry recording it, then logs it in `PROGRESS.md`.
   - **`design-taste-frontend` runs the initial pass** that establishes the direction. It runs exactly once per UI; it never re-runs on work that already has a direction.
   - **`impeccable` then critiques that pass**, and **`impeccable` runs every pass after that**: every iteration, revision, polish, or audit of that UI.

   The anti-slop mandate applies with equal force to both skills and to every pass, including late passes where the temptation is to just make it consistent. The goal: the result does **not look AI-generated or templated**. An obvious, safe, default design decision is a signal to reconsider it, not evidence it is correct. Every session doing UI work hunts for and rejects boilerplate gradients, default shadcn spacing and shadows, centered-hero-with-emoji layouts, generic rounded cards on a grid, the stock "clean SaaS" look, purple/blue gradient backgrounds, and every other recognizable "AI slop" pattern, including ones not listed here. It chooses specific, deliberate, opinionated typography, color, and layout over safe, generic ones. It audits existing UI before redesigning it and never blindly rewrites it. The test: when the finished interface is indistinguishable from a thousand other AI-generated interfaces, the work is not done.

   **Tiering:** the `design-taste-frontend` direction pass is planning-tier work. It runs as part of `superpowers:brainstorming`: inline when the orchestrator is on the planning tier, else inside the planning-tier agent (point 10). The chosen direction (typography, color tokens, layout approach, explicit anti-patterns to avoid) is written into the spec and the plan. Building the UI and every `impeccable` pass are execution-tier work: the execution-tier agent's brief names `impeccable` and points to the written direction, so the agent never invents one.

4. **The `shadcn` skill supplies component primitives, not visual taste.** When a component needs standard, well-tested UI plumbing (dialogs, forms, dropdowns, and similar), the session building it pulls it from `shadcn` as a functional starting point, then applies the point 3 sequence on top so it does not ship with default shadcn styling. When the pulled component lands in UI that already has a written direction, the pass on it is `impeccable`. Else (the component is the first thing establishing the direction), `design-taste-frontend` runs first, as planning-tier work (point 3).

5. **New frontend work uses React, TypeScript, and Tailwind CSS**, the stack `shadcn/ui` is built for. CSS primitives are never hand-rolled: no component-level CSS files, no CSS modules, no styled-components or other CSS-in-JS, no bespoke utility class systems. Styling uses Tailwind utility classes, following shadcn's conventions. **The one allowed stylesheet** is the single global file Tailwind and shadcn require (for example `globals.css`); it holds Tailwind directives and imports, theme tokens as CSS variables, and base-layer resets. Design work changes tokens there and never adds new CSS files. Components come from the `shadcn` skill or library first (point 4), never built from scratch when shadcn has one. A project already on a different stack (Vue, plain CSS, another component library) is not migrated; this default applies only to new frontend work and new projects.

6. **Models are split by role: the planning tier plans, the execution tier implements, the light tier does read-only legwork, and the orchestrator dispatches work to all three from whichever tier it runs on. This applies to the task in front of you; the split is the default posture, not a threshold to clear.** Terminology defines each tier. Specifically:

   > **Writer note (never copied into AGENTS.md):** this point exists to be un-rationalizable, so every bullet below is copied verbatim, never condensed. The specificity is the mechanism; a summarized version is a version a future session can argue with.

   - **Invoking a process skill from point 1 is the tripwire; use it, because it is unambiguous.** Do not rely solely on judging whether a change is non-small; that judgment is exactly what gets rationalized away. Reaching for a skill is a discrete, observable event, so the tier check is bound to it. "Get onto the right tier" below always means: when the orchestrator is already on that tier, it does the work inline; else it dispatches the work to an agent on that tier (point 10). The orchestrator never asks the user to switch models and never stops to wait for a switch. Never proceed on the wrong tier.
     - `superpowers:brainstorming`, `superpowers:writing-plans` → **planning tier.** When the orchestrator is not on the planning tier, it dispatches them to a planning-tier agent under the question-round protocol (point 10) **before any brainstorming happens**, not after. The orchestrator never brainstorms, writes a spec, or writes a plan on a lower tier. A plan produced on the execution tier still counts as a plan under the rule below, so producing it on the wrong tier launders weak planning straight into execution. That is the failure this ordering exists to prevent.
     - `superpowers:systematic-debugging` → **planning tier for the diagnosis.** Investigation, hypothesis forming, and root-cause analysis are planning-tier work; when the orchestrator is not on the planning tier, it dispatches the diagnosis to a planning-tier agent under the question-round protocol (point 10). Once the root cause is identified and the fix is understood, dispatching the fix to the execution tier is the normal next step; the orchestrator states that boundary in its reply instead of sliding across it.
     - `superpowers:subagent-driven-development` → **run by the orchestrator on whichever tier it is on; every implementer and reviewer agent it dispatches runs on the execution tier** (model set explicitly, point 10). This is the default way a plan becomes code, and the orchestrator's own tier never changes it.
     - `superpowers:test-driven-development` → **execution tier.** It is used inside the implementer agents, never by the orchestrator.
     - `superpowers:verification-before-completion`, `superpowers:requesting-code-review` → either tier; these are checks, not changes. **`superpowers:verification-before-completion` is required on every task, no exceptions.** Every claim of done, fixed, working, or passing is preceded by actually running the verification and reading the output, small edits included.
     - `superpowers:using-git-worktrees` → **planning tier.** Workspace setup is decided while planning, not during implementation.
     - `superpowers:receiving-code-review`, `superpowers:finishing-a-development-branch` → **execution tier.** They act on work that already exists.
     - Superpowers skills outside point 1's set run only on request (block 4), so they need no tier.
   - **Everything is non-small by default.** A change is small only when it is on this closed list: a typo or comment fix, a single-line change, a rename confined to one file, or a config or constant value change; and it touches exactly one file; and it introduces no new behavior. Everything not on that list is non-small, however easy it looks. The list is never extended by analogy. A change that does not match a list item exactly is non-small.
   - **Non-small means the planning tier writes a plan first, then the execution tier executes it.** Not "plan as you go", not "start and course-correct", not an outline in the chat. A plan is a written file produced by `superpowers:writing-plans`, saved where that skill saves it, with its path recorded in the `PROGRESS.md` start entry. It exists before the first implementation edit. When no such file exists, the planning step has not happened.
   - **Small changes are made inline on every tier.** Dispatching an agent for a one-line edit costs more than making it. The remaining bullets cover non-small work.
   - **What the orchestrator does inline.** Inline on every tier: reading and searching of three tool calls or fewer (more goes to a light-tier agent); running existing tests, builds, or scripts to reproduce or verify behavior, without editing anything first; building or updating the graphify graph (point 8); writing `PROGRESS.md` entries; editing AGENTS.md, CLAUDE.md, prompts, or an existing spec or plan; small changes. Inline only on the planning tier, else dispatched to a planning-tier agent: brainstorming, writing specs and plans, debugging diagnosis, the design-direction pass, bounded research. **Never inline on any tier (non-small implementation):** editing or creating source code, tests, or config; installing or removing dependencies; running migrations, codegen, or formatters that rewrite files. A planning-tier agent follows the same limit: it writes specs and plans, never implementation. Commits are made by whichever session the user asked to commit (point 11).
   - **Enforced in both directions.** When the orchestrator is about to make a non-small implementation edit, it dispatches the edit to an execution-tier agent instead. When the orchestrator is not on the planning tier and faces planning-tier work (a non-small task with no written plan, a diagnosis, a design-direction pass), it dispatches that work to a planning-tier agent under the question-round protocol (point 10). It never writes the plan itself and never asks the user to switch.
   - **The "any tier" carve-out is narrow.** Editing an existing spec or plan, a prompt, AGENTS.md, CLAUDE.md, or `PROGRESS.md` is allowed on every tier. It does not extend to authoring substantial new documentation, restructuring docs, or any code change described as "just docs"; those follow the normal rule.
   - **Re-check mid-task.** When a task that started as small turns out to be non-small (a second file needs touching, a new edge case appears, the fix is not where it looked), the orchestrator stops the edit at that moment, says so, and gets a plan (inline on the planning tier, else from a planning-tier agent) before continuing. It never finishes the task on momentum.
   - **Accumulation counts.** A run of individually small edits that together add up to a non-small change is a non-small change. The orchestrator notices the pattern and gets a plan instead of logging the third or fourth "quick fix" in a row.
   - **Subagents inherit the rule, and dispatching one is a sanctioned way to satisfy it (point 10).** Implementation dispatched to a subagent runs on the execution tier and still requires a written plan first. Dispatching does not launder a non-small change past the planning step, and it is not an evasion either: the orchestrator dispatching planning to a planning-tier agent and execution to execution-tier agents *is* the split being honored.
   - **Only the user waives this**, explicitly, per task. A waiver is never inferred from urgency, from the task looking easy, from a previous waiver, or from the user simply asking for the change directly.

7. **Every change is logged in `PROGRESS.md`, with no exceptions and no judgment call about whether it counts.** `PROGRESS.md` lives at the project root and gets an entry for **every** change to the repo (edits to `PROGRESS.md` itself excepted). The size of a change sets the size of its entry, never whether an entry is written.

   - **Timestamps are `YYYY-MM-DD HH:MM ±HH:MM`**: local time with its UTC offset (for example `2026-08-06 14:32 -05:00`). The value comes from the system clock, never from memory or an assumed date: `date "+%Y-%m-%d %H:%M %:z"` in bash, `Get-Date -Format "yyyy-MM-dd HH:mm zzz"` in PowerShell. Entries from different machines have to be orderable against each other.
   - **A small change (point 6) gets one entry**: one line with timestamp, file or files, and what changed. A typo fix, a one-file rename, and a bumped config value each get their line. The entry is written immediately after the edit lands, never batched at the end of a session.
   - **A non-small change (point 6) gets a paired entry**: a start entry (timestamp, what is starting, the spec and plan paths, the current state of the files it touches) and a matching end entry (timestamp, what was done, status done/blocked/partial, and why when not done). The orchestrator writes the start entry after the plan exists and before the first implementation edit, so an interrupted task still leaves a trace. The start entry also covers the spec and plan files themselves, so the planning-tier agent that wrote them writes no entry of its own.
   - Newest entries go at the bottom. Old entries are never restructured, summarized, compressed, or deleted; the file is an append-only log, not documentation.
   - Every entry states who did the work and in which tool: `[inline: claude]` or `[inline: codex]` for inline work, `[agent: <tool>/<type>/<tier>]` (for example `[agent: claude/general-purpose/execution]`) for work done by a dispatched agent. Light-tier agents change nothing, so they never appear in the log.
   - Agent work is not exempt. The orchestrator either writes "append your PROGRESS.md entry" into the agent's brief as a mandatory step, or writes the entry itself after the agent returns, and in both cases verifies the entry landed before moving on. When the agent was also authorized to commit, the entry goes in that same commit. Else the entry stays in the working tree like every other change, and the orchestrator does not commit it on its own initiative. Commits are authorized by the user per point 11, never implied by a dispatch.
   - The first change in a repo without `PROGRESS.md` creates it.

   The log is detailed enough to be a **clean handoff to another device, a fresh session, or the other tool**: someone reading it cold, top to bottom, knows what was done, what state things are in, and what is unfinished, without any prior conversation. Every change gets an entry; there is no "worth an entry" judgment.

8. **`graphify` comes before every file access. It is the default way this repo is read, not a tool for a special class of question.** The rule: **before opening, searching, or listing a non-exempt file, every session queries the graph.** Every file-reading action (Claude Code: Read, Grep, Glob; shell `cat`, `ls`, `find`, `rg`, `grep` in both tools) comes after a `graphify` call. graphify exists to cut token usage, and every file opened that a query could have scoped down wastes exactly what it saves.

   - **The trigger is the file access itself, not the shape of the question.** Whether something "counts as a structure question" is never weighed; that judgment is the loophole. A non-exempt file about to be read means the graph is queried first.
   - **Commands:** `graphify query "<question>"` for open-ended questions, `graphify path "A" "B"` for the relationship between two symbols, `graphify explain "X"` for one concept. Every question that is not a two-symbol relationship or a single concept uses `query`.
   - **The query informs the read; it does not always replace it.** When the graph answers the question, no file is opened. Else it names *which* file and *which region*, so the follow-up read is targeted, not a full-file dump. A broad read is allowed only after a query, only for what the graph did not cover, and only with that gap stated out loud.
   - **Exemptions (closed list, never extended by analogy):** a file the user named by exact path in their request; a file created or edited earlier in the same session; root-level project config and manifest files (`package.json`, `tsconfig.json`, `.gitignore`, framework and tool config files such as `*.config.*`); lockfiles; `.env*`; images and binaries; `PROGRESS.md`; `AGENTS.md` and `CLAUDE.md` (point 9); spec and plan files. Every other file is queried first, including files whose location you believe you know.
   - **Reading above three tool calls is dispatched.** A question that needs graph queries plus targeted reads totaling more than three tool calls ("where is X handled and what calls it") is light-tier work: the orchestrator dispatches it to a light-tier agent, which returns file paths, line ranges, and a short answer, so the files never enter the orchestrator's context.
   - **A missing graph is a build step, not an exemption.** In a repo with no source files yet there is nothing to graph, and this rule starts with the first source file. Else, when `graphify-out/graph.json` is absent, the session builds it before the first non-exempt read, never "just this once" grepping: `graphify . --code-only` (no API key needed for code; an LLM key also indexes docs and images), then `graphify cluster-only .` to generate `GRAPH_REPORT.md` and `graph.html`, then queries it. Building and updating the graph is allowed on every tier (point 6).
   - **The graph stays current.** `graphify update .` runs at the end of every task that added, removed, renamed, or moved a file or a top-level symbol; not once per edit, not once per session. It is AST-only and costs nothing. A stale graph is worse than none, because it answers confidently and wrongly.

9. **The orchestrator re-anchors to AGENTS.md, because the rules decay, especially after a compaction.** The instructions compete with everything else in a long session, and a compaction replaces the transcript with a summary that does not carry them faithfully. The typical failure is not noticing they were dropped. The countermeasures:

   - **The orchestrator re-reads AGENTS.md, never recalls it, at exactly two moments:** immediately after a context compaction, and on a session resume. Both tools load AGENTS.md at session start, so a fresh session does not re-read it, and nothing else triggers a re-read. A remembered version from before a compaction is not a substitute for the file.
   - **After a compaction or resume, the orchestrator states the anchor out loud. This is step 0 of the order of operations, ahead of everything including `graphify`.** The first response after a compaction names the rules governing the work in flight: at minimum the model-tier split and dispatch rule (block 2, point 6), the `PROGRESS.md` logging duty (point 7), and every process skill already mid-chain (point 1). Re-anchoring comes first because it reveals which skill the orchestrator was already inside; starting one before knowing that risks restarting a chain already underway. When the orchestrator cannot say what state the work was in, it reads `PROGRESS.md` before anything else; that file exists for this and is exempt from point 8 so nothing blocks the recovery.
   - **A compaction is a checkpoint, not a seam to work through.** Implementation never resumes on momentum from a summary. The orchestrator re-establishes: the plan, the step in progress, whether it was verified, which tier the orchestrator is on, and which agents are in flight.
   - **A summary that says nothing about these rules is not evidence they were satisfied.** Absence from a summary means the information was dropped, never that the step was done. The orchestrator verifies against the repo and `PROGRESS.md`, never against the summary.

10. **Work reaches the right tier through dispatch. The orchestrator dispatches; the user never switches models.** Point 6 requires the right tier. The orchestrator gets work onto it in exactly one of two ways: it does the work inline when it is already on the right tier and the work is on block 2's inline list, else it dispatches an agent with an explicit model. Asking the user to switch models is never one of the ways.

    - **Planning-tier work from an orchestrator below the planning tier follows the question-round protocol.** An agent cannot talk to the user, and a planning-tier agent that answers its own clarifying questions returns a plan built on invented premises, which is worse than no plan because it looks legitimate. The protocol, for `superpowers:brainstorming` and `superpowers:systematic-debugging`:
      1. **Question round.** The orchestrator dispatches a planning-tier agent (general-purpose type, because it writes files) to run the process skill. The brief carries the user's request verbatim, the repo context (relevant paths, the current `PROGRESS.md` state), and the AGENTS.md rules that bind the design (points 2 to 6 and 12). The agent returns exactly one of: (a) one batched list of the questions whose answer changes the design and cannot be inferred, each with a recommended answer, with no files written; or (b) a short list of its assumptions, when no question meets that bar, followed in the same dispatch by the spec and, for non-small work, the plan, written via `superpowers:writing-plans`.
      2. **Relay.** The orchestrator puts the agent's list into its own reply to the user, verbatim. After (a), it waits for the user's answer; this is the only wait in the protocol. After (b), it does not wait.
      3. **Plan round, after (a) only.** The orchestrator sends the user's answers verbatim to a planning-tier agent: the same agent, continued (Claude Code: SendMessage), when it is still available; else a fresh planning-tier agent whose brief repeats the question-round brief with the questions and the answers inlined. The agent finishes the design, writes the spec (including the design-direction pass for UI work, point 3), runs `superpowers:writing-plans` to write the plan, and returns the spec and plan paths. When the answers raise a new question that changes the design, the agent returns that question instead of the plan, and steps 2 and 3 repeat.
      4. **Ownership.** The planning-tier agent writes the spec and the plan and nothing else: no implementation and no `PROGRESS.md` entry. It never answers its own question; every unanswered question goes back to the user through step 2. The orchestrator writes the `PROGRESS.md` start entry with the spec and plan paths after the plan exists and before the first implementation dispatch (point 7), then runs `superpowers:subagent-driven-development`. A diagnosis whose fix is small returns the root cause and the fix instead of a plan, and the orchestrator makes the small change inline.
    - **When the orchestrator is on the planning tier**, it runs brainstorming and diagnosis inline, talking with the user directly under the same batching rule (block 4, Minimal user input), and writes the spec, the plan, and the start entry itself.
    - **Bounded research is one dispatch.** A specific question ("how does X work", "what are the tradeoffs between A and B") that a light-tier agent failed to answer goes to one planning-tier agent, which returns the answer and writes no files.
    - **Every dispatch sets the model explicitly**, as the latest model of the right tier's family (Terminology). Claude Code: the Agent tool's `model` parameter, with the alias `opus`, `sonnet`, or `haiku`. Codex: the model on the spawn request, or `model` and `model_reasoning_effort` in the agent's TOML file under `.codex/agents/`; light-tier dispatches always set `model_reasoning_effort = "low"`. A dispatch never leaves the model unset to inherit. An agent silently on the wrong tier is the failure point 6 exists to prevent, and it is invisible once it happens.
    - **Tier first, then agent type.** The tier is the lowest that does the job: read-only legwork (find code, answer "where" or "what calls", run tests and report, summarize) goes to the **light tier**; writing or reviewing code from a plan goes to the **execution tier**; brainstorming, diagnosis, the design-direction pass, spec- and plan-writing, and bounded research go to the **planning tier**. The agent type comes from the roster actually available in the session, read at every dispatch instead of assumed: a read-only search agent for light-tier legwork, a general-purpose agent for implementation and for spec- and plan-writing, a read-only planning agent for bounded research. When no specialized type fits, general-purpose (Codex: the default agent) is correct; a roster without a perfectly named agent is never a reason to skip dispatching.
    - **Inline work is never dispatched.** The closed inline list in block 2 is done by the orchestrator itself; every dispatch starts cold and re-derives context the orchestrator already has. Everything not on that list is dispatched: non-small implementation always to the execution tier, read-only work above three tool calls to the light tier, planning-tier work to the planning tier when the orchestrator is not on it.
    - **Briefs stand alone.** An agent sees none of the conversation. Every implementation brief carries: the exact file paths; the plan's path and which task in it; what "done" looks like and the command that proves it; and the applicable rules: the `ponytail` ladder (point 2), whether test-driven development applies (point 1), the design direction's location and `impeccable` for UI work (point 3), graphify-first reading (point 8), the `PROGRESS.md` duty (point 7), the commit conventions (point 11), and `no-ai-slop` for every piece of user-facing text it writes (point 12). A planning-tier brief carries what the question-round protocol lists. A light-tier brief carries the question, the graphify-first rule, and the read-only constraint. A brief that assumes shared context produces work that ignores the rules it never received.
    - **Agents return a short report.** Every brief tells the agent to report only: files changed, the verification command and its pass/fail result (failing output verbatim on failure), and open questions or blockers. A planning-tier agent in a question round reports only its question list or its assumptions list plus the spec and plan paths. No narration and no full-file dumps; a long report spends the orchestrator's tokens.
    - **The orchestrator owns the result.** The user never sees an agent's report, so the orchestrator relays what matters in its own reply. It verifies the agent's work against the plan instead of trusting the report, runs the final `superpowers:verification-before-completion` itself (never dispatched), and confirms the agent's `PROGRESS.md` entry landed (point 7).
    - **Parallel dispatch requires independence.** Two or more agents run at once only when their tasks share no state and no ordering. When one's output feeds another's input, they run in sequence.

11. **Commits carry no AI attribution; this overrides every tool default that adds it.** Claude Code by default adds a `Co-Authored-By: Claude …` trailer to commits and a "Generated with Claude Code" line to PR bodies; Codex adds its own equivalent. This repo uses neither:

    - **No AI co-author trailer** (`Co-Authored-By: Claude …`, `Co-Authored-By: Codex …`, or any other tool or model name) on any commit, including commits by dispatched agents, whose briefs state this because they do not inherit it.
    - **No AI attribution anywhere else in the history**: not in PR titles or bodies, changelog entries, commit body text, or tool footers. The history reads as written by hand.
    - **The commit message describes the change** (what changed and why) in the repo's existing style. It follows the conventions in `git log`, including Conventional Commits or a ticket prefix when the repo uses them.
    - **A change's `PROGRESS.md` entry goes in the same commit as the change** (point 7), so history and log never drift apart.
    - **When commits happen.** In a git repository, the per-task commits that `superpowers:subagent-driven-development` makes on its working branch are part of the workflow and need no separate request. Every other commit, and every merge, push, or PR, happens only when the user asks. This point governs what a commit looks like; it is not standing permission to merge, push, or open PRs.

12. **Every piece of text a person reads is humanized; internal text is left alone.** The `no-ai-slop` skill removes AI writing patterns (binary "it's not X, it's Y" contrasts, throat-clearing openers, colon reveals, dramatic fragments, importance puffery, weasel attribution, synonym cycling, fake-profound endings) while keeping the content and voice. Which text gets what (closed list):

    - **Skill pass (invoke `no-ai-slop` on the finished text):** user-facing product copy (UI text, labels, empty states, error messages, onboarding, marketing and landing copy); README files and other docs written for people; PR titles and descriptions; release notes and changelogs; every message, email, or post drafted for the user to send. The pass runs exactly once, on the finished text, not on every draft, inside whichever session wrote the text; for UI copy that is the execution-tier implementer, whose brief names `no-ai-slop` (point 10).
    - **Style only (the same rules applied while writing, no skill invocation):** chat replies to the user, commit messages, and code comments. They lead with the point and use plain active sentences with no filler; they are too short or too frequent for a separate pass.
    - **Internal, never touched:** thinking and reasoning, AGENTS.md and CLAUDE.md, specs and plans, agent briefs and reports, `PROGRESS.md` (terse log format, point 7), code identifiers, and tool and config files. These are never rewritten for tone.

    The pass changes wording only. It never changes facts, numbers, code, commands, product names, or meaning, and never drops a required element (an error message still says what went wrong and what to do).

### Writing rules for AGENTS.md

- AGENTS.md is written in plain, direct, declarative instructional language. It reads as standing operating instructions for an AI coding agent, not as a description of the project.
- Every rule names its trigger, its actor (orchestrator, planning-tier agent, execution-tier agent, light-tier agent, every session, or the user), and its exact action. Every conditional states its else branch. Exceptions are closed lists. Permissive or hedged wording ("may", "should", "usually", "generally", "prefer", "try", "where possible", "when in doubt", "as needed", "a few") is never used where a rule is meant.
- **Length rule:** point 6's bullets and block 2's bullets are copied verbatim (see point 6's writer note). Every other block and point keeps every bullet and every rule; wording is tightened only without dropping or merging a rule, exemption, tool-specific detail for the session's tool, or example list. A point without bullets stays one short paragraph.
- Anything marked **Writer note** is guidance for this setup run only and never appears in AGENTS.md.

## Step 4: Install the hooks

Prose alone is weak protection: an instruction telling a session not to lose the thread is enforced by the same attention that lost it. Hooks fire regardless of what the model attends to, so they are the enforcement layer. After writing AGENTS.md (and, under Claude Code, CLAUDE.md), install these four hooks for the session's tool only. Claude Code: in `.claude/settings.json`. Codex: in `.codex/hooks.json`.

| Hook | What it prints | Claude Code event and matcher | Codex event and matcher |
|---|---|---|---|
| Session start | The block 4 rule in one paragraph: skills fire automatically on their triggers, without waiting for the user to name them; minimal user input. | `SessionStart`, `startup\|clear` | `SessionStart`, `startup` |
| Re-anchor | The standing-contract preamble, plus an instruction to re-read AGENTS.md and `PROGRESS.md` now and state the anchor (point 9). Highest-value hook: it fires exactly when the rules are most likely dropped. | `SessionStart`, `compact\|resume` | `SessionStart`, `compact\|resume` |
| Edit guard | No non-small implementation inline on any tier (dispatch it to an execution-tier agent); no change without a `PROGRESS.md` entry. | `PreToolUse`, `Edit\|Write` | `PreToolUse`, `apply_patch` |
| Read guard | Point 8: query `graphify` first for non-exempt files; say so out loud when graphify is unavailable. | `PreToolUse`, `Read\|Grep\|Glob` | `PreToolUse`, `Bash` (Codex reads files through the shell) |

Hook command rules:

- Each hook's command only prints its reminder text, using `echo` with the text in single quotes, so it runs in the shell the tool uses for hooks on this machine. The text itself contains no single quotes.
- Claude Code: `SessionStart` hooks print plain text, which is added to the session's context. `PreToolUse` hooks print JSON, because plain stdout from a `PreToolUse` hook is not shown to the model: `{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"<reminder text>"}}`.
- Codex: every hook prints plain text.
- When `graphify claude install` already registered a Claude Code `PreToolUse` hook, the read-guard hook extends that existing entry instead of adding a duplicate.
- Existing hooks in the config file are merged with, never overwritten.
- When the hook config cannot be written, the closing report says so explicitly, so the user knows the enforcement layer is missing; the prose in AGENTS.md does not count as a substitute.

## Step 5: Closing report

After the hooks, the run reports back as a short list:

- **Session's tool:** Claude Code or Codex.
- **Skills and plugins:** which were already present, which were installed (they load only in a new session), which failed and with what error.
- **graphify:** already present, installed (including whether `uv` had to be installed), or failed and why; whether it was registered for the session's tool; whether its `## graphify` section was removed in favor of point 8.
- **AGENTS.md / CLAUDE.md:** created or updated, which sections were added or changed, and whether instructions were migrated out of an old CLAUDE.md.
- **Hooks:** installed, merged into existing hooks, or could not be written.
- **PROGRESS.md:** confirmation that the start and end entries for this run landed.
- **Next step for the user:** start a new session so the installed skills, plugins, and hooks load. List every manual step left over from a failed install. When nothing failed, this is the only action the user takes.
