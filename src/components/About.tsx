'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Truck, Shield, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const aboutImages = [
  '/about/1.png',
  '/about/2.png',
  '/about/3.png',
  '/about/4.png',
  '/about/5.png',
  '/about/6.png',
]

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aboutImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + aboutImages.length) % aboutImages.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % aboutImages.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content - Image Carousel */}
          <div className="relative group">
            {/* Responsive height: smaller on mobile, larger on desktop */}
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Images */}
              {aboutImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                    }`}
                >
                  <Image
                    src={src}
                    alt={`About us ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white active:scale-95 sm:hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white active:scale-95 sm:hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentIndex
                      ? 'w-6 sm:w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                We Believe In Working With{' '}
                <span className="text-primary-600">Experienced Chefs</span>
              </h2>

            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">100% Quality Ensured</h4>
                  <p className="text-sm text-gray-600">Made with love by experienced chefs</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Same day delivery within the city</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Guaranteed</h4>
                  <p className="text-sm text-gray-600">100% satisfaction or money back</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Expert Support</h4>
                  <p className="text-sm text-gray-600">24/7 customer support team</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About