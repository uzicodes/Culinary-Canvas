export interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string
  rating: number
  reviews: number
  image: string
  badge?: string
  category?: string
  description?: string
  inStock?: boolean
}

export interface Category {
  id: number
  name: string
  image: string
  color: string
  textColor: string
  productCount?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'customer' | 'admin'
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  image: string
  author: string
  slug: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  rating: number
  comment: string
  avatar: string
}