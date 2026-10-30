// app/admin/products/page.tsx
//管理用商品一覧

// app/admin/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'
import FilterSelect from '@/components/FilterSelect'
import { CATEGORIES } from '@/lib/categories'
import { formatSize } from '@/lib/format'
import { buildHref, sortSizes } from '@/lib/filters'

type Variant = { size: string; stock_quantity: number }

export default async function AdminProductList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; size?: string }>
}) {
  const { category, brand, size } = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(size, stock_quantity)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const allProducts = data ?? []

  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean))).sort() as string[]
  const sizes = sortSizes(
    Array.from(
      new Set(
        allProducts.flatMap((p) =>
          (p.product_variants as Variant[]).filter((v) => v.stock_quantity >= 1).map((v) => v.size)
        )
      )
    )
  )

  const products = allProducts.filter((p) => {
    if (category && p.category !== category) return false
    if (brand && p.brand !== brand) return false
    if (size && !(p.product_variants as Variant[]).some((v) => v.size === size && v.stock_quantity >= 1)) {
      return false
    }
    return true
  })

  const basePath = '/admin/products'
  const currentParams = { category, brand, size }

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

      <div className="flex gap-2 mb-3 flex-wrap">
        <Link
          href={buildHref(basePath, { brand, size })}
          className={`text-sm rounded-full px-3 py-1 border ${
            !category ? 'bg-black text-white' : 'text-gray-600'
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={buildHref(basePath, { category: c, brand, size })}
            className={`text-sm rounded-full px-3 py-1 border ${
              category === c ? 'bg-black text-white' : 'text-gray-600'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <FilterSelect
          name="brand"
          allLabel="すべてのブランド"
          options={brands.map((b) => ({ value: b, label: b }))}
          current={brand}
          basePath={basePath}
          currentParams={currentParams}
        />
        <FilterSelect
          name="size"
          allLabel="すべてのサイズ"
          options={sizes.map((s) => ({ value: s, label: formatSize(s) }))}
          current={size}
          basePath={basePath}
          currentParams={currentParams}
        />
        {(category || brand || size) && (
          <Link href={basePath} className="text-sm text-gray-500 underline">
            絞り込みをクリア
          </Link>
        )}
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      {products.length === 0 && !error && (
        <p className="text-gray-400 text-sm">該当する商品がありません</p>
      )}

      <div className="flex flex-col gap-2">
        {products.map((product) => {
          const variants = product.product_variants as Variant[]
          const allSoldOut = variants.length > 0 && variants.every((v) => v.stock_quantity === 0)
          const inStockSizes = variants.filter((v) => v.stock_quantity >= 1).map((v) => v.size)

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
                  <p className="text-xs text-gray-400 mt-0.5">
                    {inStockSizes.length > 0 ? inStockSizes.map(formatSize).join(', ') : '在庫なし'}
                  </p>
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