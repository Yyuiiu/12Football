// app/admin/products/archived/page.tsx
//売り切れ商品ページ

import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/AdminNav'
import { restoreProduct } from '../actions'

export default async function ArchivedProductList() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', false)
    .order('updated_at', { ascending: false })

  return (
    <div className="p-6">
      <AdminNav backHref="/admin/products" backLabel="商品一覧" />

      <h1 className="text-xl font-bold mb-4">売り切れ商品</h1>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      {products?.length === 0 && (
        <p className="text-gray-400 text-sm">削除された商品はありません</p>
      )}

      <div className="flex flex-col gap-2">
        {products?.map((product) => {
          const restoreThisProduct = restoreProduct.bind(null, product.id)

          return (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-md px-4 py-3 opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">なし</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.brand} ・ NT${product.price}
                  </p>
                </div>
              </div>

              <form action={restoreThisProduct}>
                <button type="submit" className="text-xs border rounded-md px-3 py-1">
                  復元する
                </button>
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}