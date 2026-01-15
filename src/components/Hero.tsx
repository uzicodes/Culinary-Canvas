'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

const useCountUp = (end: number, duration: number, suffix = '') => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    let raf: number;
    const step = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return suffix ? `${count}${suffix}` : count;
};

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    { src: '/1.png' }, { src: '/2.png' }, { src: '/3.png' },
    { src: '/4.png' }, { src: '/5.png' }, { src: '/6.png' },
    { src: '/7.png' }, { src: '/8.png' }, { src: '/9.png' }, { src: '/10.png' }
  ]

  const dishes = useCountUp(50, 1200, '+')
  const customers = useCountUp(10000, 1200)
  
  // This line defines "status" and "session"
  const { data: session, status } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 min-h-[600px] flex items-center overflow-hidden pt-32">
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

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/all-items">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <span>Explore Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{dishes}</div>
                <div className="text-sm text-gray-600">Healthy Dishes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{customers}</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Fast Delivery</div>
              </div>
            </div>

            {/* Login and Register Buttons Section */}
            {status === "unauthenticated" && (
              <div className="pt-6 flex flex-wrap gap-4">
                {/* Login Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login">
                    <div className="user-profile">
                      <div className="user-profile-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Login
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Register Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register">
                    <div className="user-profile">
                      <div className="user-profile-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Register
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            )}
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
                    className="object-contain w-full h-full scale-90"
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
            }
            .carousel-right {
              opacity: 1;
              transform: translateX(100%) scale(0.8) rotate(10deg);
            }
            .carousel-far-right {
              opacity: 0;
              transform: translateX(200%) scale(0.7) rotate(20deg);
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