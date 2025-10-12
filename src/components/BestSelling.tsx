'use client'

import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

const bestSellingProducts = [
  {
    id: 1,
    name: 'Fresh Tomato',
    price: '$26.00',
    originalPrice: '$30.00',
    rating: 4.5,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  },
  {
    id: 2,
    name: 'Fresh Apple',
    price: '$20.00',
    originalPrice: '$25.00',
    rating: 4.8,
    reviews: 35,
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  },
  {
    id: 3,
    name: 'Big Potatoes',
    price: '$15.00',
    originalPrice: '$18.00',
    rating: 4.3,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  },
  {
    id: 4,
    name: 'Orange Fruit',
    price: '$22.00',
    originalPrice: '$26.00',
    rating: 4.6,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    badge: 'SALE'
  }
]

const BestSelling = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            Best Sellers <Star className="inline-block text-yellow-400 w-7 h-7" fill="#facc15" />
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellingProducts.map((product) => (
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
                
                {/* Sale Badge */}
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {product.badge}
                </span>

                {/* Add to Cart Button */}
                <button className="absolute bottom-3 right-3 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-lg">
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

export default BestSelling