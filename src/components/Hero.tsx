'use client'

import { ArrowRight, Play } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    { src: '/1.png', name: 'File 1.png' },
    { src: '/2.png', name: 'File 2.png' }, 
    { src: '/3.png', name: 'File 3.png' },
    { src: '/4.png', name: 'File 4.png' },
    { src: '/5.png', name: 'File 5.png' },
    { src: '/6.png', name: 'File 6.png' },
    { src: '/7.png', name: 'File 7.png' },
    { src: '/8.png', name: 'File 8.png' },
    { src: '/9.png', name: 'File 9.png' },
    { src: '/10.png', name: 'File 10.png' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 min-h-[600px] flex items-center">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-primary-600 leading-tight">
                <span style={{ fontFamily: 'Nalinak, Inter, sans-serif' }}>Culinary Canvas</span>
                <span className="block text-black text-3xl lg:text-3xl font-semibold mt-1 marcellus-regular">
                  art your healthy way to life !
                </span>
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
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Healthy Dishes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Fast Delivery</div>
              </div>
            </div>
            {/* Login and Register Buttons */}
            <div className="pt-6 flex gap-4">
              <Link href="/login" passHref legacyBehavior>
                <button className="user-profile">
                  <span className="user-profile-inner">
                    {/* SVG user icon */}
                    <svg viewBox="0 0 30 30" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C15.3137 12 18 9.31371 18 6C18 2.68629 15.3137 0 12 0C8.68629 0 6 2.68629 6 6C6 9.31371 8.68629 12 12 12Z" />
                      <path d="M0 22C0 17.0294 4.02944 13 9 13H15C19.9706 13 24 17.0294 24 22V24H0V22Z" />
                    </svg>
                    Login
                  </span>
                </button>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                <button className="user-profile">
                  <span className="user-profile-inner">
                    Register
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Rotating Hero Images */}
          <div className="relative w-full h-[500px] overflow-hidden">
            {images.map((imageObj, index) => {
              let position = '';
              if (index === currentImageIndex) {
                position = 'carousel-center';
              } else if (index === (currentImageIndex + 1) % images.length) {
                position = 'carousel-right';
              } else if (index === (currentImageIndex - 1 + images.length) % images.length) {
                position = 'carousel-far-right';
              } else {
                position = 'carousel-hidden';
              }
              return (
                <div
                  key={imageObj.src}
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${position}`}
                  style={{ zIndex: index === currentImageIndex ? 10 : 0 }}
                >
                  <Image
                    src={imageObj.src}
                    alt="Fresh healthy food"
                    fill
                    className="object-contain w-full h-full scale-80"
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>

          <style jsx>{`
            .carousel-center {
              opacity: 1;
              transform: translateX(0) scale(0.9);
              transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s;
            }
            .carousel-right {
              opacity: 1;
              transform: translateX(100%) scale(0.8) rotate(10deg);
              transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s;
            }
            .carousel-far-right {
              opacity: 0;
              transform: translateX(200%) scale(0.7) rotate(20deg);
              transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s;
            }
            .carousel-hidden {
              opacity: 0;
              transform: translateX(200%) scale(0.7);
              pointer-events: none;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}

export default Hero