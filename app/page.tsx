//app/page.tsx
//商品一覧ページ

import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES } from '@/lib/categories'
import Link from 'next/link'

export const revalidate = 0

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  let query = supabase.from('products').select('*, product_variants(size, stock_quantity)').eq('is_active', true)

  if (category) {
    query = query.eq('category', category)
  }

  const { data: products, error } = await query

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">商品一覧</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Link
          href="/"
          className={`text-sm rounded-full px-3 py-1 border ${
            !category ? 'bg-black text-white' : 'text-gray-600'
          }`}
        >
          すべて
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/?category=${encodeURIComponent(c)}`}
            className={`text-sm rounded-full px-3 py-1 border ${
              category === c ? 'bg-black text-white' : 'text-gray-600'
            }`}
          >
            {c}
          </Link>
        ))}
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