// components/FilterSelect.tsx
//汎用のプルダウン部品を作る

'use client'

import { useRouter } from 'next/navigation'

export default function FilterSelect({
  name,
  allLabel,
  options,
  current,
  basePath,
  currentParams,
}: {
  name: string
  allLabel: string
  options: { value: string; label: string }[]
  current?: string
  basePath: string
  currentParams: Record<string, string | undefined>
}) {
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams()

    // 他の絞り込み条件は引き継ぐ
    Object.entries(currentParams).forEach(([key, value]) => {
      if (value && key !== name) params.set(key, value)
    })

    // 自分の条件だけ新しい値にする
    if (e.target.value) params.set(name, e.target.value)

    const query = params.toString()
    router.push(query ? `${basePath}?${query}` : basePath)
  }

  return (
    <select
      value={current ?? ''}
      onChange={handleChange}
      className="border rounded-md px-3 py-1.5 text-sm"
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}