// components/BrandFilter.tsx
//ブランド選択部分

'use client'

export default function BrandFilter({
  brands,
  currentBrand,
  currentCategory,
}: {
  brands: string[]
  currentBrand?: string
  currentCategory?: string
}) {
  return (
    <form method="get" className="inline-block">
      {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
      <select
        name="brand"
        defaultValue={currentBrand ?? ''}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border rounded-md px-3 py-1.5 text-sm"
      >
        <option value="">すべてのブランド</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </form>
  )
}