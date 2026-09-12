// app/admin/dashboard/page.tsx
//管理者ログイン成功画面
import Link from 'next/link'
import { logout } from '../../login/actions'

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">管理画面</h1>
      <p>ログイン中。</p>

      <div className="flex flex-col gap-2 mt-4 max-w-xs">
        <Link href="/admin/products" className="border rounded-md px-4 py-2 text-center">
          商品一覧
        </Link>
        <Link href="/admin/reservations" className="border rounded-md px-4 py-2 text-center">
          取り置き一覧
        </Link>
      </div>

      <form action={logout}>
        <button type="submit" className="mt-6 border rounded-md px-4 py-2">
          ログアウト
        </button>
      </form>
    </div>
  )
}