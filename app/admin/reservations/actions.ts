// app/admin/reservations/actions.ts
//取置き一覧、取置き商品状況のサーバーアクション
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReservationStatus(reservationId: string, newStatus: string) {
  const supabase = await createClient()

  await supabase
    .from('reservations')
    .update({ status: newStatus })
    .eq('id', reservationId)

  revalidatePath('/admin/reservations')
}