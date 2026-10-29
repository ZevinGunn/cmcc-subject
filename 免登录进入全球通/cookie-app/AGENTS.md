# Cookie App Codex Instructions

These instructions apply to every file in this repository.

## Mandatory Release After Code Changes

- 用户已授权：每次代码修改并验证通过后，自动生成新的 dist 包并更新公网服务。此授权持续有效，无需重复请求发布许可。
- 修改前先提交已有源码变更；发布前提交本次功能源码，不提交环境配置、凭据、备份或生成产物。
- 代码任务完成时执行 `npm run release`。该命令运行类型检查、API/UI和发布测试，构建新 dist，生成压缩包，切换产物，重载当前仓库对应的 PM2 cookie-app 服务，并验证本机及公网的版本、HTML与资源内容。
- 测试或构建失败不得切换产物或更新服务。公网验证失败须报告失败及回退结果，不能仅以构建成功宣称公网已更新。
- 仅更新本项目服务，不重启其他PM2服务或数据库。纯文档修改无需发布；涉及数据库变更时另按迁移要求处理，不自动迁移数据库。

## Mandatory Efficient Workflow

Apply the rules below to every task. For repository exploration, diagnosis, code review, implementation, or verification, invoke `$codex-efficient-workflow` once and follow it throughout the task. For a direct factual answer or a trivial instruction-only edit, follow the compact rules below without loading the full skill. Optimize for minimum sufficient context and risk-proportionate verification; never trade away correctness, security, or an explicit user requirement merely to save tokens.

- Begin with the user-named files, changed files, failing command, relevant symbol, and direct dependencies. Expand only when evidence requires it.
- Do not perform repository-wide code review, history analysis, dependency inspection, or full-file reading for a scoped task without a concrete cross-cutting reason.
- Classify risk: focused for documentation or isolated changes, standard for shared multi-file behavior, and deep for auth, credentials, cryptography, database changes, concurrency, destructive actions, orders, or broad contracts.
- For code review, inspect the requested diff/files plus direct callers, consumers, and tests. Stop after one evidence-backed pass unless findings cause new edits.
- Reuse context already collected in the current task. Do not reread unchanged files, rerun successful commands, or collect several equivalent confirmations.
- Limit command output and read targeted line ranges. Parallelize independent reads and checks when useful.
- Run the narrowest relevant verification first. Broaden only when risk, failure, or a shared contract justifies it; skip builds and tests for instruction-only documentation changes.
- Do one focused final diff review, checking behavior, edge cases, accidental churn, and secrets. Do not add unrelated refactors.
- Keep progress updates and final answers concise: report material decisions, changes, verification, and real residual risk without narrating every command.

## Mandatory UI Skill

For every task that creates, changes, reviews, or fixes frontend UI or UX, invoke and follow `$design-cmcc-product-ui` before editing. This includes pages, components, navigation, dialogs, menus, dashboards, responsive layouts, styling, data presentation, loading/error states, and requests to improve visual quality. If the skill is unavailable, apply the rules below directly and mention the missing skill in the handoff.

## Product Direction

- Treat this product as a mature China Mobile account-management and query tool for frequent use, not a marketing site.
- Inspect the existing shell, neighboring pages, shared components, styles, routes, and tests before designing.
- Preserve existing business behavior, security boundaries, source-page navigation context, cached data, and partial results.
- Prioritize compact information density, strong hierarchy, predictable scanning, and efficient repeated actions.
- Show account identity clearly with a masked phone number or another stable identifier wherever users select or switch accounts.
- Use real domain labels and data. Never invent product capabilities, response meanings, prize names, or successful results.

## Visual Rules

- Reuse the established design system and `lucide-react` icons.
- Prefer aligned sections, key-value rows, restrained grids, tables, and timelines over excessive cards.
- Do not use gradients, decorative blobs, glow, glassmorphism, bokeh, oversized hero text, marketing composition, or atmospheric decoration on operational pages.
- Avoid nested cards, excessive pills, shadows, borders, rounded corners, tinted panels, and empty space. Cards must use `8px` radius or less unless an existing shared component requires otherwise.
- Use color only for brand, state, priority, or category. Keep typography compact and readable; do not scale font size with viewport width or use negative letter spacing.
- Use semantic controls: icons for familiar tools, segmented controls for modes, tabs for views, switches/checkboxes for binary settings, menus for option sets, and inputs for values.
- Do not add visible instructional or self-descriptive copy when layout and labels can communicate the behavior.

## Interaction Requirements

- Implement all applicable states: initial loading, refresh, empty, error, authentication expiry, timeout, genuine throttling, cached/stale data, partial success, success, disabled, and in-progress.
- Retain successfully loaded information when another request fails. Do not turn every upstream failure into a generic busy state.
- Disable completed or unavailable actions, prevent duplicate submissions, and provide concrete feedback after server confirmation.
- Preserve entry context: a page entered from `public` returns to `public`; an admin entry returns to the admin context.
- Keep menus, popovers, tooltips, and dialogs inside the visible viewport. Flip, shift, or constrain them near every edge; keep long dialog titles and actions reachable.
- Maintain keyboard access, focus behavior, semantic labels, contrast, and suitable touch targets.

## Responsive And Verification Requirements

- Design intentionally for narrow mobile and desktop widths. Prevent text overflow, horizontal scrolling, control overlap, covered content, and layout shift.
- Use stable dimensions and responsive constraints for grids, controls, counters, menus, and other fixed-format elements.
- Run `npm run check`, focused tests, and `npm run build` after UI implementation when the environment permits.
- Verify the implemented page in a browser at representative mobile and desktop viewports. Inspect screenshots for density, hierarchy, wrapping, clipping, overlay placement, and all relevant states.
- Test repeated visits, refreshes, account switching, and origin-aware back navigation when those flows are touched.
- Never trigger real check-in, make-up check-in, benefit claiming, blind-box, ordering, or other side-effect operations during UI verification unless the user explicitly authorizes them.
