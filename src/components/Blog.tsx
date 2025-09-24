'use client'

import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    title: 'The Benefits of Eating Organic Food',
    excerpt: 'Discover why organic food is better for your health and the environment. Learn about the key differences and benefits.',
    date: 'March 15, 2024',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    author: 'Dr. Sarah Smith'
  },
  {
    id: 2,
    title: 'Seasonal Vegetables: A Complete Guide',
    excerpt: 'Learn which vegetables are in season and how to make the most of fresh, seasonal produce in your cooking.',
    date: 'March 12, 2024',
    category: 'Cooking',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    author: 'Chef Michael'
  },
  {
    id: 3,
    title: '10 Tips for a Healthy Lifestyle',
    excerpt: 'Simple and practical tips to maintain a healthy lifestyle with fresh food and proper nutrition habits.',
    date: 'March 10, 2024',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    author: 'Emily Johnson'
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
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights on healthy eating, organic farming, 
            and sustainable living from our expert contributors.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
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
                  <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}

export default Blog