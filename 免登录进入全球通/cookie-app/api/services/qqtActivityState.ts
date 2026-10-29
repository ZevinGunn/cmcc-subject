type RecordValue = Record<string, unknown>

export async function verifyQqtActivityState<T>(args: {
  query: () => Promise<T>
  completed: (state: T) => boolean
  message: string
}): Promise<T> {
  let lastError: unknown
  // Retry reads only: upstream state can lag a successful mutation; never repeat the mutation here.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      const state = await args.query()
      if (args.completed(state)) return state
      lastError = new Error(args.message)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error ? lastError : new Error(args.message)
}

function record(value: unknown): RecordValue | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : undefined
}

export function assertQqtActivitySuccess(payload: unknown): void {
  const root = record(payload)
  if (String(root?.status) !== '1') {
    throw new Error(String(root?.msg || root?.message || '全球通活动响应异常，未确认成功'))
  }
}

export function readQqtSignDays(payload: unknown): RecordValue[] {
  assertQqtActivitySuccess(payload)
  const data = record(record(payload)?.data)
  if (!Array.isArray(data?.signDates) || data.signDates.length === 0) {
    throw new Error('签到日期数据缺失，无法判断是否完成')
  }
  return data.signDates.map((raw) => {
    const day = record(raw)
    if (!day || day.signStatus == null || day.signStatus === '' ||
      ![-1, 0, 1, 2].includes(Number(day.signStatus)) ||
      !Number.isInteger(Number(day.dayNum)) || Number(day.dayNum) < 1 || Number(day.dayNum) > 31) {
      throw new Error('签到日期状态异常，无法判断是否完成')
    }
    return day
  })
}

export function currentQqtActivitySignState(payload: unknown): 'unknown' | 'signed' | 'unsigned' {
  try {
    const days = readQqtSignDays(payload)
    // Official xdrsignNew uses status 0 for today's available sign slot, not calendar dates.
    if (days.some((day) => Number(day.signStatus) === 0)) return 'unsigned'
    return days.some((day) => Number(day.signStatus) === 1) ? 'signed' : 'unknown'
  } catch {
    return 'unknown'
  }
}
