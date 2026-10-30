// lib/filters.ts

//複数条件絞り込み用の補助関数

// 絞り込み条件からURLを組み立てる(空の条件は自動で除外)
export function buildHref(basePath: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })
  const query = searchParams.toString()
  return query ? `${basePath}?${query}` : basePath
}

// サイズを並び替える(数字は小さい順、文字はその後ろ)
export function sortSizes(sizes: string[]): string[] {
  const isNumeric = (s: string) => /^\d+(\.\d+)?$/.test(s.trim())
  const numbers = sizes.filter(isNumeric).sort((a, b) => parseFloat(a) - parseFloat(b))
  const others = sizes.filter((s) => !isNumeric(s)).sort()
  return [...numbers, ...others]
}