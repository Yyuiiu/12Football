// app/admin/reservations/page.tsx
//取置き一覧ページ

import { createClient } from '@/lib/supabase/server'
import { updateReservationStatus } from './actions'
import AdminNav from '@/components/AdminNav'
import { formatSize } from '@/lib/format'

type ReservationRow = {
  id: string
  customer_name: string
  phone: string
  email:string
  status: string
  created_at: string
  product_variants: {
    size: string
    products: {
      name: string
    }
  }
}

export default async function ReservationList() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('*, product_variants(size, products(name))')
    .order('created_at', { ascending: false })

  const reservations = (data ?? []) as unknown as ReservationRow[]
  const pendingCount = reservations.filter((r) => r.status === 'pending').length

  return (
    <div className="p-6 max-w-2xl">
      <AdminNav backHref="/admin/dashboard" backLabel="管理画面トップ" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">取り置き一覧</h1>
        {pendingCount > 0 && (
          <span className="bg-orange-50 text-orange-600 text-xs font-medium rounded-md px-3 py-1">
            新規 {pendingCount}件
          </span>
        )}
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      <div className="flex flex-col gap-2">
        {reservations.map((r) => {
          const confirmReservation = updateReservationStatus.bind(null, r.id, 'confirmed')
          const pickupReservation = updateReservationStatus.bind(null, r.id, 'picked_up')
          const cancelReservation = updateReservationStatus.bind(null, r.id, 'cancelled')

          const isDone = r.status === 'picked_up' || r.status === 'cancelled'

          return (
            <div
              key={r.id}
              className={`flex items-center justify-between border rounded-md px-4 py-3 ${
                isDone ? 'opacity-50' : ''
              }`}
            >
              <div>
                <p className="font-medium">
                  {r.customer_name} ・ {r.phone}
                </p>
                <p className="text-xs text-gray-400">{r.email}</p>
                <p className="text-sm text-gray-500">
                  {r.product_variants?.products?.name} / {formatSize(r.product_variants.size)}
                </p>
                <p className="text-sm text-gray-500">
                  {r.product_variants?.products?.name} / {r.product_variants?.size}cm
                </p>
              </div>

              <div className="flex items-center gap-2">
                {r.status === 'pending' && (
                  <>
                    <form action={confirmReservation}>
                      <button type="submit" className="bg-black text-white rounded-md px-3 py-1 text-sm">
                        確定にする
                      </button>
                    </form>
                    <form action={cancelReservation}>
                      <button type="submit" className="border rounded-md px-3 py-1 text-sm text-gray-500">
                        キャンセル
                      </button>
                    </form>
                  </>
                )}

                {r.status === 'confirmed' && (
                  <form action={pickupReservation}>
                    <button type="submit" className="bg-black text-white rounded-md px-3 py-1 text-sm">
                      受け渡し完了
                    </button>
                  </form>
                )}

                {r.status === 'picked_up' && <span className="text-sm text-green-600">受け渡し済み</span>}
                {r.status === 'cancelled' && <span className="text-sm text-gray-400">キャンセル済み</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}