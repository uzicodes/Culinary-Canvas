'use client'

import { ArrowRight, Play } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 min-h-[600px] flex items-center">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Choose delicacy{' '}
                <span className="text-primary-600">the best healthy</span>{' '}
                way to life
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Discover fresh, organic, and nutritious food delivered straight to your doorstep. 
                Start your healthy journey today.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-colors">
                <span>Explore Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="font-medium">Watch Video</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-600">Healthy Dishes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Fast Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative w-full h-[500px]">
            <Image
              src="/1.png"
              alt="Fresh healthy food"
              fill
              className="object-contain w-full h-full scale-80"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
    </section>
  )
}

export default Hero