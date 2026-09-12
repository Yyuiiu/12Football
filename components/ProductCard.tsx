import Link from 'next/link'
import { Product } from '@/types/product'

export default function ProductCard({ product }: { product: Product }) {
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
          <p className="font-medium">{product.size}</p>
          <p className="text-lg mt-1">NT${product.price}</p>
        </div>
      </div>
    </Link>
  )
}