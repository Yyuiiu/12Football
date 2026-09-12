// app/admin/products/[id]/archive-confirm/page.tsx
//確認ページ

import { createClient } from '@/lib/supabase/server'
import { archiveProduct } from '../../actions'
import Link from 'next/link'

export default async function ArchiveConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(size, stock_quantity)')
    .eq('id', id)
    .single()

  if (!product) {
    return <p className="p-6 text-red-500">商品が見つかりませんでした</p>
  }

  const archiveThisProduct = archiveProduct.bind(null, id)

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-4">この商品を削除しますか？</h1>

      <div className="flex gap-3 border rounded-md p-3 mb-4">
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
          <p className="text-sm text-gray-500">NT${product.price}</p>
        </div>
      </div>

      <div className="border rounded-md p-3 mb-6 text-sm">
        <p className="text-gray-500 mb-1">サイズ・在庫</p>
        {product.product_variants.map((v: { size: string; stock_quantity: number }) => (
          <p key={v.size}>
            {v.size}cm：{v.stock_quantity}個
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">
        ※削除しても予約データは残ります。後から「売り切れ商品」ページで確認・復元できます。
      </p>

      <div className="flex gap-2">
        <form action={archiveThisProduct} className="flex-1">
          <button type="submit" className="w-full bg-red-500 text-white rounded-md py-2 text-sm">
            削除する
          </button>
        </form>
        <Link
          href={`/admin/products/${id}`}
          className="flex-1 border rounded-md py-2 text-sm text-center"
        >
          キャンセル
        </Link>
      </div>
    </div>
  )
}