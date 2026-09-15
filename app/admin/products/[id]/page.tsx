// app/admin/products/[id]/page.tsx
//各商品情報編集ページ

import { createClient } from '@/lib/supabase/server'
import { updateProduct, addVariant, updateVariantStock } from '../actions'
import AdminNav from '@/components/AdminNav'
import { CATEGORIES } from '@/lib/categories'

export const revalidate = 0

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    updated_size?: string
    updated_qty?: string
    created?: string
    product_updated?: string
  }>
}) {
  const { id } = await params
  const { updated_size, updated_qty, created, product_updated } = await searchParams
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (!product) {
    return <p className="p-6 text-red-500">商品が見つかりませんでした</p>
  }

  // productIdを事前にbindして、フォームから直接呼べる関数を作る
  const updateProductWithId = updateProduct.bind(null, id)
  const addVariantWithId = addVariant.bind(null, id)

  return (
    <div className="p-6 max-w-md">
      <AdminNav backHref="/admin/products" backLabel="商品一覧" />

      <h1 className="text-xl font-bold mb-4">商品編集</h1>

      {created && (
        <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
          商品を登録しました。続けてサイズ・在庫を追加してください。
        </div>
      )}

      {product_updated && (
        <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
          商品情報を更新しました。
        </div>
      )}

      {updated_size && (
        <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
          在庫内容が更新されました（{updated_size}cm、在庫数：{updated_qty}）
        </div>
      )}
            

      <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mb-4">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm text-gray-400">画像なし</span>
        )}
      </div>

      <form action={updateProductWithId} className="flex flex-col gap-3"></form>

      <form action={updateProductWithId} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">商品名</label>
        <input type="text" name="name" defaultValue={product.name} required className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">ブランド</label>
        <input type="text" name="brand" defaultValue={product.brand} className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">カテゴリ</label>
        <input type="text" name="category" defaultValue={product.category} className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">カテゴリ</label>
        <select name="category" defaultValue={product.category} required className="border rounded-md px-3 py-2">
          <option value="">選択してください</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>



        <label className="text-sm text-gray-600">価格</label>
        <input type="number" name="price" defaultValue={product.price} required className="border rounded-md px-3 py-2" />

        <button type="submit" className="bg-black text-white rounded-md py-2 mt-3">
          更新する
        </button>
      </form>

      <h2 className="mt-8 mb-2 font-medium">サイズ・在庫</h2>
      <div className="flex flex-col gap-2">
        {product.product_variants.map((variant: { id: string; size: string; stock_quantity: number }) => {
          const updateStockWithIds = updateVariantStock.bind(null, variant.id, id)
          return (
            <form
              key={variant.id}
              action={updateStockWithIds}
              className="flex items-center justify-between border rounded-md px-3 py-2"
            >
              <span>{variant.size}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="stock_quantity"
                  defaultValue={variant.stock_quantity}
                  className="border rounded-md px-2 py-1 w-16 text-center"
                />
                <button type="submit" className="text-sm border rounded-md px-3 py-1">
                  保存
                </button>
              </div>
            </form>
          )
        })}
      </div>

      <h3 className="mt-4 mb-2 text-sm text-gray-600">新しいサイズを追加</h3>
      <form action={addVariantWithId} className="flex items-center gap-2">
        <input
          type="text"
          name="size"
          placeholder="26.0"
          required
          className="border rounded-md px-3 py-2 w-24"
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="在庫数"
          required
          className="border rounded-md px-3 py-2 w-24"
        />
        <button type="submit" className="bg-black text-white rounded-md px-4 py-2 text-sm">
          追加
        </button>
      </form>
    </div>
  )
}

