'use client'

import Image from 'next/image'

const categories = [
  {
    id: 1,
    name: 'Fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    id: 2,
    name: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    id: 3,
    name: 'Fish',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    id: 4,
    name: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-600'
  },
  {
    id: 5,
    name: 'Fruit Juice',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-orange-100',
    textColor: 'text-orange-600'
  },
  {
    id: 6,
    name: 'Spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    color: 'bg-purple-100',
    textColor: 'text-purple-600'
  }
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