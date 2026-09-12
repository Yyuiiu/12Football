//app/products/[id]/page.tsx
//

import { supabase } from '@/lib/supabase'
import { ProductWithVariants } from '@/types/product'
import ReservationForm from '@/components/ReservationForm'

export default async function ProductDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { id } = await params
  const { success, error: errorParam } = await searchParams

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (error || !product) {
    return <p className="p-6 text-red-500">商品が見つかりませんでした</p>
  }

  const typedProduct = product as ProductWithVariants

  return (
    
    <div className="p-6 max-w-md mx-auto">
      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
          取り置きのお申し込みが完了しました。店舗からのご連絡をお待ちください。
        </div>
      )}

      {errorParam === 'soldout' && (
        <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
          申し訳ございません、このサイズは売り切れました。
        </div>
      )}

      {errorParam === '1' && (
        <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
          エラーが発生しました。もう一度お試しください。
        </div>
      )}
      <div className="aspect-square bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
        {typedProduct.image_url ? (
          <img src={typedProduct.image_url} alt={typedProduct.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-400 text-sm">画像なし</span>
        )}
      </div>

      <p className="text-sm text-gray-500">{typedProduct.brand}</p>
      <h1 className="text-xl font-bold">{typedProduct.name}</h1>
      <p className="text-lg mt-1">NT${typedProduct.price}</p>

      <h2 className="mt-6 mb-2 font-medium">サイズ</h2>
      
      <div className="flex flex-col gap-2">
        {typedProduct.product_variants.map((variant) => (
          <div key={variant.id} className="flex justify-between border rounded-md px-3 py-2">
            <span>{variant.size}</span>
            <span className={
              variant.stock_quantity === 0 
              ? 'text-gray-400'
              : variant.stock_quantity < 4
              ?'text-red-400'
              :'text-green-600'
              }
            >
              {variant.stock_quantity === 0
                ? '売切れ'
                : variant.stock_quantity < 4
                ? `残り${variant.stock_quantity}点`
                : '在庫あり'}
            </span>
          </div>
        ))}
      </div>
      <ReservationForm productId={typedProduct.id} variants={typedProduct.product_variants} />
    </div>
  )
}