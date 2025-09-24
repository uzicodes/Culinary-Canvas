'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Health Enthusiast',
    rating: 5,
    comment: 'The quality of products is exceptional! Fresh vegetables delivered right to my door. Highly recommend Delicacy for anyone who values healthy eating.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Professional Chef',
    rating: 5,
    comment: 'As a chef, I need the freshest ingredients. Delicacy consistently delivers premium quality produce that elevates my dishes.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Busy Mom',
    rating: 5,
    comment: 'Convenient, fresh, and organic! Perfect for my family&apos;s healthy lifestyle. The delivery is always on time and the packaging is eco-friendly.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
]

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Customer <span className="text-primary-600">Love Us</span> ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our customers say about their 
            experience with Delicacy&apos;s fresh and organic products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary-500" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials