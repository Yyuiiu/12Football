// app/admin/products/actions.ts
//商品登録のサーバーアクション
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const category = formData.get('category') as string
  const price = Number(formData.get('price'))
  const imageFile = formData.get('image') as File

  let image_url: string | null = null

  // 画像が選択されていた場合だけアップロード処理をする
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile)

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      image_url = publicUrlData.publicUrl
    }
  }

  const { data: store } = await supabase.from('stores').select('id').single()

  const { error } = await supabase.from('products').insert({
    name,
    brand,
    category,
    price,
    image_url,
    store_id: store?.id,
  })

  if (error) {
    redirect('/admin/products/new?error=1')
  }

  redirect('/admin/products')
}

// 商品を追加・商品情報を編集
export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const category = formData.get('category') as string
  const price = Number(formData.get('price'))

  const { error } = await supabase
    .from('products')
    .update({ name, brand, category, price })
    .eq('id', productId)

  if (error) {
    redirect(`/admin/products/${productId}?error=1`)
  }

  revalidatePath(`/products/${productId}`)
  revalidatePath('/')

  redirect('/admin/products')
}

// サイズを新しく追加する
export async function addVariant(productId: string, formData: FormData) {
  const supabase = await createClient()

  const size = formData.get('size') as string
  const stock_quantity = Number(formData.get('stock_quantity'))

  const { error } = await supabase.from('product_variants').insert({
    product_id: productId,
    size,
    stock_quantity,
  })

  if (error) {
    redirect(`/admin/products/${productId}?error=1`)
  }

  revalidatePath(`/products/${productId}`)
  revalidatePath('/')

  redirect(
    `/admin/products/${productId}?updated_size=${encodeURIComponent(size)}&updated_qty=${stock_quantity}`
  )
}

// 既存サイズの在庫数を更新する
export async function updateVariantStock(variantId: string, productId: string, formData: FormData) {
  const supabase = await createClient()

  const stock_quantity = Number(formData.get('stock_quantity'))

  const { data: updated, error } = await supabase
    .from('product_variants')
    .update({ stock_quantity })
    .eq('id', variantId)
    .select('size, stock_quantity')
    .single()

  if (error || !updated) {
    redirect(`/admin/products/${productId}?error=1`)
  }

  revalidatePath(`/products/${productId}`)
  revalidatePath('/')

  redirect(
    `/admin/products/${productId}?updated_size=${encodeURIComponent(updated.size)}&updated_qty=${updated.stock_quantity}`
  )
}