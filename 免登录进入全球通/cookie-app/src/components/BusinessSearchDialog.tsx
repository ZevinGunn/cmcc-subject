import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Inbox, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BusinessSearchItem = {
  id: string
  title: string
  subtitle?: string
  searchText?: string
}

export function HighlightText({ text, keyword }: { text: string; keyword?: string }): ReactNode {
  const needle = keyword?.trim()
  if (!needle) return text
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'))
  return parts.map((part, index) =>
    part.toLocaleLowerCase().includes(needle.toLocaleLowerCase()) ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-yellow-200 px-0.5 text-inherit">
        {part}
      </mark>
    ) : part,
  )
}

export default function BusinessSearchDialog({
  open,
  items,
  onClose,
  onSelect,
}: {
  open: boolean
  items: BusinessSearchItem[]
  onClose: () => void
  onSelect: (item: BusinessSearchItem, keyword: string) => void
}) {
  const [keyword, setKeyword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => {
    const needle = keyword.trim().toLocaleLowerCase()
    if (!needle) return items
    return items.filter((item) =>
      `${item.title} ${item.subtitle || ''} ${item.searchText || ''}`.toLocaleLowerCase().includes(needle),
    )
  }, [items, keyword])

  useEffect(() => {
    if (!open) return
    setKeyword('')
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  function choose(item: BusinessSearchItem) {
    onSelect(item, keyword.trim() || item.title)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/55 px-3 pt-[12vh]" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-search-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <h2 id="business-search-title" className="text-base font-semibold text-zinc-950">搜索业务</h2>
          <button type="button" title="关闭" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          className="border-b border-zinc-100 p-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (results[0]) choose(results[0])
          }}>
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="业务名称、分类或编码"
              className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </form>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length ? results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => choose(item)}
              className="block w-full rounded-md px-3 py-2.5 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none">
              <div className="break-words text-sm font-medium text-zinc-900">
                <HighlightText text={item.title} keyword={keyword} />
              </div>
              {item.subtitle ? (
                <div className="mt-1 break-all text-xs text-zinc-500">
                  <HighlightText text={item.subtitle} keyword={keyword} />
                </div>
              ) : null}
            </button>
          )) : (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-zinc-400">
              <Inbox className="h-7 w-7" />
              没有匹配的业务
            </div>
          )}
        </div>
        <div className={cn('border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400', !keyword && 'hidden')}>
          {results.length} 个匹配结果
        </div>
      </section>
    </div>
  )
}
