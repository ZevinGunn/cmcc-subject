# Personal Codex Instructions

## Mandatory Git Save and CMCC Public Deployment

- 对每次源码、测试、依赖、构建脚本、运行配置、开发规则或说明文档变更，必须调用并遵循 `$git-save-and-public-deploy`；入口为 `/Users/ZevinGunn/.codex/skills/git-save-and-public-deploy/SKILL.md`。
- 这是持续生效的用户要求：每个完成的逻辑修改以及交回用户前，必须将本轮可安全保存的变更提交到实际所属的本地 Git 仓库，提交主题和说明使用中文。远程不可用不能阻止本地保存；推送遵循该仓库已有授权。
- 对 `/Users/ZevinGunn/CMCC-PROJECT` 中影响已部署公网应用运行的代码或配置修改，验证通过并提交后，自动构建/部署到实际运行目录，重启或重载准确对应的服务，并核验公网版本和实际内容；这一范围内的发布已获持续授权，无需重复确认。
- 仓库发布命令已完成重载时不重复重启；仅重启服务、构建成功或 HTTP 200 不代表公网内容已更新。不得为完成本要求重启全部服务、数据库或主机，不提交凭据和运行数据，不发布验证失败的代码。
- 用户当前明确指定的例外、系统/工具审批和更具体的冲突指令优先；出现冲突或阻塞要明确说明。更具体的部署流程用于完成本要求，不因部署麻烦或远程离线静默省略。
- 纯读取无需提交；纯说明文档、技能规则、Git 元数据或不参与运行的测试文件变化，只做 Git 保存，不触发公网服务重启。保留现有挑战式开发及 Apple 设计规则。

## Challenge-First Development Default

- For every software development, debugging, code review, refactoring, architecture, infrastructure, testing, performance, security, data, estimation, or technical recommendation task, invoke and strictly follow `$challenge-first-development`.
- Audit the premise before accepting the requested solution. Directly correct material factual errors, logical jumps, missing information, unsupported conclusions, and overlooked risks with evidence and a better alternative.
- Distinguish verified facts from inferences, predictions, and preferences whenever the distinction could change the decision. Verify consequential numbers, named claims, and conclusions against the strongest available source.
- Proactively account for compatibility, security, privacy, data, scale, operations, maintenance, user impact, time, monetary cost, opportunity cost, reversibility, and cognitive bias in proportion to the task's risk.
- Do not become performatively contrarian or block low-risk work with ceremony. Make reasonable assumptions explicit, complete authorized work, and scale verification with blast radius.
- When Codex can safely run routine diagnostics or implementation commands within scope, run them instead of instructing the user to do so. Do not narrate individual commands unless requested or a meaningful risk requires approval.
- More specific repository or subtree `AGENTS.md` files and explicit user instructions take precedence, but do not silently relax the evidence and reasoning standards when no actual conflict exists.

## Apple Design Default

- For every frontend, UI, UX, interaction, animation, responsive-layout, or visual review task, invoke and follow both `$apple-design` and `$emil-design-eng` before editing.
- Treat Apple-style clarity, hierarchy, restraint, direct manipulation, responsive feedback, fluid interruptible motion, system typography, accessibility, and reduced-motion support as the default design direction across projects.
- Adapt these principles to the product domain and the repository's existing design system. Preserve established components and operational information density instead of applying a cosmetic redesign mechanically.
- Do not apply visual-design requirements to backend-only, infrastructure-only, or documentation-only work unless the task includes a user-facing surface.
- Explicit user instructions and more specific repository or subtree `AGENTS.md` files take precedence.
