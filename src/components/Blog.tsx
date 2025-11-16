'use client'

import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    title: '25 Favorite Thanksgiving Sides',
    excerpt: 'Discover 25 of the best Thanksgiving side dishes to make your holiday meal unforgettable.',
    date: 'March 15, 2024',
    category: 'Occasional',
    image: '/blog-1.png',
    author: 'Lindsay',
    link: 'https://pinchofyum.com/25-favorite-thanksgiving-sides'
  },
  {
    id: 3,
    title: 'Cinnabon Cinnamon Rolls',
    excerpt: 'soft, gooey, and dripping with cream cheese icing, this is the cinnamon roll that ruined all others for me.',
    date: 'March 10, 2024',
    category: 'Dessert',
    image: '/blog-2.png',
    author: 'Jo cooks ( Joanna )'
  }
]

const Blog = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Latest News & <span className="text-primary-600">Blogs</span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#E3DCB1] rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Date and Author */}
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="pt-2">
                  {post.link ? (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="flex items-center space-x-2 text-primary-600 font-semibold opacity-60 cursor-not-allowed">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog