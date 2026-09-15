// app/admin/products/new/page.tsx
//商品登録フォーム
import { createProduct } from '../actions'
import AdminNav from '@/components/AdminNav'
import { CATEGORIES } from '@/lib/categories'

export default function NewProductPage() {
  return (
    <div className="p-6 max-w-md">
      <AdminNav backHref="/admin/dashboard" backLabel="管理画面トップ" />

      <h1 className="text-xl font-bold mb-4">商品登録</h1>

      <form action={createProduct} className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">商品名</label>
        <input type="text" name="name" required className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">ブランド</label>
        <input type="text" name="brand" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">カテゴリ</label>
        <input type="text" name="category" placeholder="Shoes" className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">カテゴリ</label>
        <select name="category" required className="border rounded-md px-3 py-2">
          <option value="">選択してください</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="text-sm text-gray-600">価格</label>
        <input type="number" name="price" required className="border rounded-md px-3 py-2" />

        <label className="text-sm text-gray-600">商品画像</label>
        <input type="file" name="image" accept="image/*" className="border rounded-md px-3 py-2" />


        <button type="submit" className="bg-black text-white rounded-md py-2 mt-3">
          登録する
        </button>
      </form>
    </div>
  )
}