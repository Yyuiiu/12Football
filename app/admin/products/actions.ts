// app/admin/products/actions.ts
//商品登録のサーバーアクション
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

//商品を追加
export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const category = formData.get('category') as string
  const price = Number(formData.get('price'))
  const imageFile = formData.get('image') as File

  let image_url: string | null = null

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

  const { data: newProduct, error } = await supabase
    .from('products')
    .insert({
      name,
      brand,
      category,
      price,
      image_url,
      store_id: store?.id,
    })
    .select('id')
    .single()

  if (error || !newProduct) {
    redirect('/admin/products/new?error=1')
  }

  revalidatePath('/')

  redirect(`/admin/products/${newProduct.id}?created=1`)
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

  redirect(`/admin/products/${productId}?product_updated=1`)
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

// 商品をアーカイブする（全サイズ在庫0の場合のみ許可）
export async function archiveProduct(productId: string) {
  const supabase = await createClient()

  // サーバー側でも念のため在庫を再確認する
  const { data: variants } = await supabase
    .from('product_variants')
    .select('stock_quantity')
    .eq('product_id', productId)

  const allSoldOut = variants && variants.length > 0 && variants.every((v) => v.stock_quantity === 0)

  if (!allSoldOut) {
    redirect(`/admin/products/${productId}?error=notsoldout`)
  }

  await supabase.from('products').update({ is_active: false }).eq('id', productId)

  revalidatePath(`/products/${productId}`)
  revalidatePath('/')
  revalidatePath('/admin/products')

  redirect('/admin/products')
}

// アーカイブした商品を元に戻す
export async function restoreProduct(productId: string) {
  const supabase = await createClient()

  await supabase.from('products').update({ is_active: true }).eq('id', productId)

  revalidatePath(`/products/${productId}`)
  revalidatePath('/')
  revalidatePath('/admin/products/archived')

  redirect('/admin/products/archived')
}
