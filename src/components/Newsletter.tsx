'use client'

import { Download, Apple, PlaySquare } from 'lucide-react'
import Image from 'next/image'

const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Download Delicacy <br />
              <span className="text-primary-100">Mobile App</span>
            </h2>
            <p className="text-lg text-primary-100">
              Get the best shopping experience with our mobile app. Order fresh, 
              organic products on the go and enjoy exclusive mobile-only deals.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center space-x-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>

              <button className="flex items-center space-x-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors">
                <PlaySquare className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            <div className="relative w-80 h-96 mx-auto">
              <Image
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Mobile app screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter