// app/reservations/actions.ts
//商品取置き予約のサーバーアクション・予約作成処理＋通知

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendReservationNotification } from '@/lib/email'

export async function createReservation(variantId: string, formData: FormData) {
  const supabase = await createClient()
  const productId = formData.get('product_id') as string

  const { data: success, error: stockError } = await supabase.rpc('decrement_variant_stock', {
    target_variant_id: variantId,
  })

  if (stockError || !success) {
    redirect(`/products/${productId}?error=soldout`)
  }

  const customer_name = formData.get('customer_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      variant_id: variantId,
      customer_name,
      phone,
      email,
    })
    .select('*, product_variants(size, products(name))')
    .single()

  if (error || !reservation) {
    redirect(`/products/${productId}?error=1`)
  }

  await sendReservationNotification({
    productName: reservation.product_variants.products.name,
    size: reservation.product_variants.size,
    customerName: customer_name,
    phone: phone,
    email: email,
  })

  redirect(`/reservations/${reservation.id}`)

}