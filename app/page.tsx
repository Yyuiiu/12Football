//app/page.tsx
//商品一覧ページ


import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

export const revalidate = 0

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">商品j一覧</h1>

      {error && <p className="text-red-500">エラー: {error.message}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}