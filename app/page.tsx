//app/page.tsx
//商品一覧ページ


import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import FilterSelect from '@/components/FilterSelect'
import { CATEGORIES } from '@/lib/categories'
import { formatSize } from '@/lib/format'
import { buildHref, sortSizes } from '@/lib/filters'
import Link from 'next/link'

export const revalidate = 0

type Variant = { size: string; stock_quantity: number }

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; size?: string }>
}) {
  const { category, brand, size } = await searchParams

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(size, stock_quantity)')
    .eq('is_active', true)

  const allProducts = data ?? []

  // プルダウンの選択肢(登録済みの商品から自動で作る)
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

  // 絞り込み
  const products = allProducts.filter((p) => {
    if (category && p.category !== category) return false
    if (brand && p.brand !== brand) return false
    if (size && !(p.product_variants as Variant[]).some((v) => v.size === size && v.stock_quantity >= 1)) {
      return false
    }
    return true
  })

  const currentParams = { category, brand, size }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">商品一覧</h1>

      <div className="flex gap-2 mb-3 flex-wrap">
        <Link
          href={buildHref('/', { brand, size })}
          className={`text-sm rounded-full px-3 py-1 border ${
            !category ? 'bg-black text-white' : 'text-gray-600'
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={buildHref('/', { category: c, brand, size })}
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
          basePath="/"
          currentParams={currentParams}
        />
        <FilterSelect
          name="size"
          allLabel="すべてのサイズ"
          options={sizes.map((s) => ({ value: s, label: formatSize(s) }))}
          current={size}
          basePath="/"
          currentParams={currentParams}
        />
        {(category || brand || size) && (
          <Link href="/" className="text-sm text-gray-500 underline">
            絞り込みをクリア
          </Link>
        )}
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      {products.length === 0 && !error && (
        <p className="text-gray-400 text-sm">該当する商品がありません</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}