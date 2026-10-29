import { cn } from '@/lib/utils'

export default function BrandLogo({
  brand = 'cmcc',
  className,
}: {
  brand?: 'cmcc' | 'starbucks'
  className?: string
}) {
  return (
    <img
      src={`/brand/${brand}/logo.png`}
      alt={brand === 'starbucks' ? '星巴克' : '中国移动'}
      aria-hidden="true"
      width={36}
      height={36}
      decoding="async"
      draggable={false}
      className={cn('brand-logo h-9 w-9 shrink-0 object-contain', className)}
    />
  )
}
