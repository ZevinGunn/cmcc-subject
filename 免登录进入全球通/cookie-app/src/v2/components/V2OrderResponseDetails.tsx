import { FileJson } from 'lucide-react'
import { ApiClientError } from '../lib/api'

export type OrderFailureResponse = {
  code: string
  message: string
  response: unknown
}

export function orderFailureResponse(error: unknown): OrderFailureResponse {
  if (error instanceof ApiClientError) {
    const payload = error.payload && typeof error.payload === 'object' && !Array.isArray(error.payload)
      ? error.payload as Record<string, unknown>
      : undefined
    return {
      code: error.errorCode || (error.status ? `HTTP_${error.status}` : 'NETWORK_ERROR'),
      message: error.message,
      response: payload?.response ?? error.payload ?? {
        status: error.status,
        errorCode: error.errorCode,
        requestId: error.requestId,
        message: error.message,
      },
    }
  }
  const message = error instanceof Error ? error.message : '订购请求失败'
  return { code: 'REQUEST_FAILED', message, response: { code: 'REQUEST_FAILED', message } }
}

export function formatOrderResponse(value: unknown): string {
  if (value === undefined) return JSON.stringify({ message: '订购接口未返回响应内容' }, null, 2)
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export default function V2OrderResponseDetails({ response, title = '订购接口具体响应' }: { response: unknown; title?: string }) {
  return (
    <details open className="mt-4 border-t border-zinc-200 pt-4">
      <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-zinc-800">
        <FileJson className="h-4 w-4 shrink-0" />
        {title}
      </summary>
      <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap break-all rounded-md bg-zinc-950 p-4 text-left text-xs leading-6 text-zinc-100">
        {formatOrderResponse(response)}
      </pre>
    </details>
  )
}
