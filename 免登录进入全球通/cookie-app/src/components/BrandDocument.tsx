import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 跟随 SPA 路由切换，与 index.html 的首屏品牌初始化保持一致。
export default function BrandDocument() {
  const { pathname } = useLocation()
  const brand = /^\/starbucks\/?$/.test(pathname) ? 'starbucks' : 'cmcc'
  useLayoutEffect(() => {
    document.documentElement.dataset.brand = brand
    document.title = brand === 'starbucks' ? '星巴克卡券' : '中国移动用户管理'
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const touch = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    const color = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (icon) icon.href = `/brand/${brand}/favicon-32.png`
    if (touch) touch.href = `/brand/${brand}/apple-touch-icon.png`
    if (color) color.content = brand === 'starbucks' ? '#00754a' : '#0085ce'
  }, [brand])
  return null
}
