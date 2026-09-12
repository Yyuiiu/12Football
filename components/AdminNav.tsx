// components/AdminNav.tsx
//共通の管理画面ナビゲーション

import Link from 'next/link'

export default function AdminNav({
  backHref,
  backLabel,
}: {
  backHref: string
  backLabel: string
}) {
  return (
    <div className="flex items-center gap-3 mb-4 text-sm">
      <Link href={backHref} className="text-gray-500 hover:text-black">
        ← {backLabel}
      </Link>
      <span className="text-gray-300">|</span>
      <Link href="/admin/dashboard" className="text-gray-500 hover:text-black">
        管理画面トップ
      </Link>
    </div>
  )
}