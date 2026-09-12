export type Product = {
  id: string
  name: string
  brand: string
  price: number
  image_url: string | null
}

export type ProductVariant = {
  id: string
  size: string
  color: string | null
  stock_quantity: number
}

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[]
}
