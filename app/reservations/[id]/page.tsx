// app/reservations/[id]/page.tsx
//予約確認ページ

import { createClient } from '@/lib/supabase/server'

type ReservationDetail = {
  id: string
  customer_name: string
  phone: string
  email: string
  status: string
  created_at: string
  product_variants: {
    size: string
    products: {
      name: string
      brand: string
      price: number
      image_url: string | null
    }
  }
}

export default async function ReservationConfirmation({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reservations')
    .select('*, product_variants(size, products(name, brand, price, image_url))')
    .eq('id', id)
    .single()

  const reservation = data as unknown as ReservationDetail

  if (error || !reservation) {
    return <p className="p-6 text-red-500">予約情報が見つかりませんでした</p>
  }

  const product = reservation.product_variants.products

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-green-50 text-green-700 rounded-md px-4 py-3 mb-6 text-center">
        <p className="font-medium">取り置き予約完了</p>
        <p className="text-sm mt-1">店舗からのご連絡をお待ちください</p>
      </div>

      <h2 className="text-sm text-gray-500 mb-2">商品詳細</h2>
      <div className="flex gap-3 border rounded-md p-3 mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">画像なし</span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">
            サイズ {reservation.product_variants.size}cm ・ NT${product.price}
          </p>
        </div>
      </div>

      <h2 className="text-sm text-gray-500 mb-2">お客様情報</h2>
      <div className="border rounded-md p-3 flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">お名前</span>
          <span>{reservation.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">電話番号</span>
          <span>{reservation.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">メールアドレス</span>
          <span>{reservation.email}</span>
        </div>
      </div>
    </div>
  )
}