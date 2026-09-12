//components/ProductCard.tsx
//一覧ページの商品カード

import Link from 'next/link'
import { Product } from '@/types/product'
import { formatSize } from '@/lib/format'

type ProductCardProps = {
  product: Product & {
    product_variants?: { size: string; stock_quantity: number }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStockSizes =
    product.product_variants?.filter((v) => v.stock_quantity >= 1).map((v) => v.size) ?? []

  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">画像なし</span>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="font-medium">{product.name}</p>
          {inStockSizes.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{inStockSizes.map(formatSize).join(', ')}</p>
          )}
          <p className="text-lg mt-1">NT${product.price}</p>
        </div>
      </div>
    </Link>
  )
}