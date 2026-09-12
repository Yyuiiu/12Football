// app/admin/products/page.tsx
//管理用商品一覧
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import { archiveProduct } from './actions'

export default async function AdminProductList() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_variants(stock_quantity)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <AdminNav backHref="/admin/dashboard" backLabel="管理画面トップ" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">商品一覧</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/archived" className="border rounded-md px-4 py-2 text-sm">
            売り切れ商品
          </Link>
          <Link href="/admin/products/new" className="bg-black text-white rounded-md px-4 py-2 text-sm">
            + 商品を追加
          </Link>
        </div>
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      <div className="flex flex-col gap-2">
        {products?.map((product) => {
          const variants = product.product_variants as { stock_quantity: number }[]
          const allSoldOut = variants.length > 0 && variants.every((v) => v.stock_quantity === 0)
          const archiveThisProduct = archiveProduct.bind(null, product.id)

          return (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-md px-4 py-3"
            >
              <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">なし</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <p>NT${product.price}</p>

                {allSoldOut && (
                  <Link
                    href={`/admin/products/${product.id}/archive-confirm`}
                    className="text-xs border border-red-300 text-red-500 rounded-md px-3 py-1"
                  >
                    削除する
                  </Link>
                )}
                
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}