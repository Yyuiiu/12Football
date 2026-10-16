//app/page.tsx
//商品一覧ページ

// app/page.tsx
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES } from '@/lib/categories'
import Link from 'next/link'
import BrandFilter from '@/components/BrandFilter'

export const revalidate = 0

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>
}) {
  const { category, brand } = await searchParams

  // ブランド一覧を取得(重複なし)
  const { data: allProducts } = await supabase.from('products').select('brand').eq('is_active', true)
  const brands = Array.from(new Set(allProducts?.map((p) => p.brand).filter(Boolean))).sort()

  let query = supabase.from('products').select('*, product_variants(size, stock_quantity)').eq('is_active', true)

  if (category) {
    query = query.eq('category', category)
  }
  if (brand) {
    query = query.eq('brand', brand)
  }

  const { data: products, error } = await query

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">商品一覧</h1>

      <div className="flex gap-2 mb-3 flex-wrap">
        <Link
          href={brand ? `/?brand=${encodeURIComponent(brand)}` : '/'}
          className={`text-sm rounded-full px-3 py-1 border ${
            !category ? 'bg-black text-white' : 'text-gray-600'
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => {
          const params = new URLSearchParams()
          params.set('category', c)
          if (brand) params.set('brand', brand)
          return (
            <Link
              key={c}
              href={`/?${params.toString()}`}
              className={`text-sm rounded-full px-3 py-1 border ${
                category === c ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              {c}
            </Link>
          )
        })}
      </div>

      <div className="mb-4">
              <div className="mb-4">
        <BrandFilter brands={brands} currentBrand={brand} currentCategory={category} />
      </div>
      </div>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}