// lib/email.ts
//通知を送る関数を作る

import { Resend } from 'resend'
import { formatSize } from './format'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendReservationNotification({
  productName,
  size,
  customerName,
  phone,
  email,
}: {
  productName: string
  size: string
  customerName: string
  phone: string
  email: string
}) {
  try {
    await resend.emails.send({
      from: 'Football Shop <onboarding@resend.dev>',
      to: '13iori2014@gmail.com',
      subject: `新しい取り置き予約：${productName}`,
      text: `新しい取り置き予約が入りました。\n\n商品：${productName}（${formatSize(size)}）\nお客様：${customerName}\n電話番号：${phone}\nメールアドレス：${email}\n\n管理画面から確認してください。`,
      
    })
  } catch (err) {
    console.error('メール送信に失敗しました', err)
  }
}