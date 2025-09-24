'use client'

import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

const popularProducts = [
  {
    id: 1,
    name: 'Fresh Broccoli',
    price: '$14.00',
    originalPrice: '$18.00',
    rating: 4.7,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'HOT'
  },
  {
    id: 2,
    name: 'Red Meat',
    price: '$45.00',
    originalPrice: '$52.00',
    rating: 4.9,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1588347818863-e39f4ea89a35?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  },
  {
    id: 3,
    name: 'Fresh Carrot',
    price: '$12.00',
    originalPrice: '$15.00',
    rating: 4.5,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1522184216316-3c25379f9760?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'NEW'
  },
  {
    id: 4,
    name: 'Fresh Lemon',
    price: '$18.00',
    originalPrice: '$22.00',
    rating: 4.6,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  },
  {
    id: 5,
    name: 'Fresh Organic Cauliflower',
    price: '$16.00',
    originalPrice: '$20.00',
    rating: 4.4,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1568584711271-12e3d7b45b96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'HOT'
  },
  {
    id: 6,
    name: 'Fresh Spinach',
    price: '$10.00',
    originalPrice: '$13.00',
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'ORGANIC'
  },
  {
    id: 7,
    name: 'Mixed Nuts',
    price: '$28.00',
    originalPrice: '$32.00',
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1527301515917-ad14a42ee8a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'PREMIUM'
  },
  {
    id: 8,
    name: 'Bell Fresh organic Avocado',
    price: '$24.00',
    originalPrice: '$28.00',
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'ORGANIC'
  }
]

const PopularProducts = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Most Popular <span className="text-primary-600">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our customer favorites - fresh, organic, and sustainably sourced products 
            that our community loves and trusts.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-4 group"
            >
              {/* Product Image */}
              <div className="relative mb-4">
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Badge */}
                <span className={`absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full ${
                  product.badge === 'SALE' ? 'bg-orange-500' :
                  product.badge === 'HOT' ? 'bg-red-500' :
                  product.badge === 'NEW' ? 'bg-blue-500' :
                  product.badge === 'ORGANIC' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  {product.badge}
                </span>

                {/* Add to Cart Button */}
                <button className="absolute bottom-3 right-3 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary-600">
                    {product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

export default PopularProducts