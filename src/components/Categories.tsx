'use client'

import Image from 'next/image'

const categories = [
  {
    id: 1,
    name: 'Burgers',
    image: '/items/burger/classic.png',
    color: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    id: 2,
    name: 'Pizza',
    image: '/items/pizza/deluxe.png',
    color: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    id: 3,
    name: 'Fast Foods',
    image: '/items/fastfood/fried_chicken.png',
    color: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    id: 4,
    name: 'Set Menus',
    image: '/items/setmenu/1.png',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-600'
  },
  {
    id: 5,
    name: 'Appetizers',
    image: '/items/appetizers/Dual Tacos.png',
    color: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    id: 6,
    name: 'Chinese',
    image: '/items/chinese/kung_pao.png',
    color: 'bg-blue-100',
    textColor: 'text-purple-600'
  },
  {
    id: 7,
    name: 'Italian',
    image: '/items/italian/spaghetti.png',
    color: 'bg-purple-100',
    textColor: 'text-orange-600'
  },
  {
    id: 8,
    name: 'Traditional',
    image: '/items/traditional/butter.png',
    color: 'bg-red-100',
    textColor: 'text-green-600'
  },
  {
    id: 9,
    name: 'Coffee',
    image: '/items/coffee/espresso.png',
    color: 'bg-green-100',
    textColor: 'text-purple-600'
  },
  {
    id: 10,
    name: 'Drinks & Beverages',
    image: '/items/drinks/matcha.png',
    color: 'bg-purple-100',
    textColor: 'text-purple-600'
  },






















]

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Browser Our Hottest <span className="text-primary-600">Categories</span>
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className={`${category.color} rounded-2xl p-6 text-center hover:shadow-lg transition-shadow`}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className={`font-semibold ${category.textColor} group-hover:scale-110 transition-transform`}>
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  )
}

export default Categories