import { Copy, ExternalLink, X } from 'lucide-react'

export default function SsoNavigationDialog({
  url,
  destination = '10086',
  onOpen,
  onCopy,
}: {
  url: string | null
  destination?: string
  onOpen: () => void
  onCopy: () => void
}) {
  if (!url) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="不跳转并复制链接"
        onClick={onCopy}
        className="absolute inset-0 bg-black/45"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sso-navigation-title"
        aria-describedby="sso-navigation-description"
        className="relative w-full border border-zinc-200 bg-white shadow-2xl sm:max-w-md sm:rounded-md">
        <header className="flex items-start gap-3 border-b border-zinc-200 px-4 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700">
            <ExternalLink className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="sso-navigation-title" className="text-base font-semibold text-zinc-950">
              跳转到 {destination}？
            </h2>
            <p id="sso-navigation-description" className="mt-1 text-sm leading-6 text-zinc-600">
              {destination}登录链接已生成。确认后将在新标签页打开；不跳转则复制链接到剪贴板。
            </p>
          </div>
          <button
            type="button"
            title="不跳转并复制链接"
            aria-label="不跳转并复制链接"
            onClick={onCopy}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </header>
        <footer className="flex flex-col-reverse gap-2 px-4 py-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Copy className="h-4 w-4" />
            复制链接
          </button>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            <ExternalLink className="h-4 w-4" />
            新标签页打开
          </button>
        </footer>
      </section>
    </div>
  )
}
