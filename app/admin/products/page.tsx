// app/admin/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

export default async function AdminProductList() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <AdminNav backHref="/admin/dashboard" backLabel="管理画面トップ" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">商品一覧</h1>
        <Link href="/admin/products/new" className="bg-black text-white rounded-md px-4 py-2 text-sm">
          + 商品を追加
        </Link>
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      <div className="flex flex-col gap-2">
        {products?.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="flex items-center justify-between border rounded-md px-4 py-3 hover:bg-gray-50"
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
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>
            </div>
            <div className="text-right">
              <p>NT${product.price}</p>
              <p className={`text-xs ${product.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                {product.is_active ? '公開中' : '非公開'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}