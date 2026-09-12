// lib/format.ts
//サイズの判定関数

export function formatSize(size: string): string {
  const isNumeric = /^\d+(\.\d+)?$/.test(size.trim())
  return isNumeric ? `${size}cm` : size
}