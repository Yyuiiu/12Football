// components/ReservationForm.tsx
//商品取置き（サイズ選択＋予約フォーム）
'use client'

import { useState } from 'react'
import { createReservation } from '@/app/reservations/actions'
import { ProductVariant } from '@/types/product'

export default function ReservationForm({
  productId,
  variants,
}: {
  productId: string
  variants: ProductVariant[]
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const availableVariants = variants.filter((v) => v.stock_quantity > 0)

  if (availableVariants.length === 0) {
    return <p className="text-gray-400 mt-4">現在ご予約いただけるサイズがありません</p>
  }

  const createReservationWithVariant = selectedVariantId
    ? createReservation.bind(null, selectedVariantId)
    : null

  return (
    <div className="mt-6">
      <h2 className="font-medium mb-2">サイズを選択</h2>
      <div className="flex flex-col gap-2 mb-4">
        {availableVariants.map((variant) => (
          <label
            key={variant.id}
            className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer"
          >
            <input
              type="radio"
              name="variant"
              value={variant.id}
              onChange={() => setSelectedVariantId(variant.id)}
            />
            <span>{variant.size}</span>
          </label>
        ))}
      </div>

      {selectedVariantId && createReservationWithVariant && (
        <form action={createReservationWithVariant} className="flex flex-col gap-3 border-t pt-4">
          <input type="hidden" name="product_id" value={productId} />

          <label className="text-sm text-gray-600">お名前</label>
          <input type="text" name="customer_name" required className="border rounded-md px-3 py-2" />

          <label className="text-sm text-gray-600">電話番号</label>
          <input type="tel" name="phone" required className="border rounded-md px-3 py-2" />

          <label className="text-sm text-gray-600">e-mail</label>
          <input type="email" name="email" required className="border rounded-md px-3 py-2" />

          <button type="submit" className="bg-black text-white rounded-md py-2 mt-2">
            取り置きを申し込む
          </button>
        </form>
      )}
    </div>
  )
}