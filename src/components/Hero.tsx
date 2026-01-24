'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, UtensilsCrossed, Truck, MapPin, Smartphone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  const features = [
    {
      icon: <Truck className="w-6 h-6 text-white" />,
      title: "Super Fast Delivery",
      desc: "Faster than your cravings can blink. Hot and fresh."
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title: "Live Tracking",
      desc: "Follow your food's journey from our kitchen to your door."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      title: "Easy Ordering",
      desc: "Find and order your top favorites in just a few taps."
    }
  ]

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 min-h-[700px] flex items-center overflow-hidden pt-32 pb-16">
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#BCE334] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full relative z-10">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-0">
          
          {/* Left Content */}
          <div className="space-y-10 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-primary-800 leading-tight">
                <span style={{ fontFamily: 'Nalinak, Inter, sans-serif' }}>Culinary Canvas</span>
                <span className="block text-black text-2xl lg:text-4xl font-semibold mt-2 marcellus-regular tracking-tight">
                  art your healthy way to life.
                </span>
              </h1>
              <p className="text-lg text-gray-700 max-w-md leading-relaxed">
                Discover fresh, organic, and nutritious food artfully crafted and delivered straight to your doorstep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/all-items">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: '#050BB3' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center space-x-3 transition-all shadow-xl shadow-primary-600/20"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/menu">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'transparent', color: 'black' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-[#BCE334] px-8 py-3.5 rounded-full font-bold flex items-center justify-center space-x-3 transition-all shadow-xl border-2 border-black"
                >
                  <span>View Menu</span>
                  <UtensilsCrossed className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="group relative p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#BCE334]/0 to-primary-500/0 group-hover:from-[#BCE334]/10 group-hover:to-primary-500/5 transition-all duration-500"></div>
                  <div className="relative z-10 flex flex-col items-start">
                    <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-[#BCE334] to-primary-500 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h4 className="text-base font-extrabold text-gray-900 mb-1.5">{f.title}</h4>
                    <p className="text-[13px] font-medium text-gray-600 leading-snug opacity-90">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex space-x-10 pt-6 border-t border-primary-200/30">
              <div>
                <div className="text-3xl font-black text-primary-900">{dishes}</div>
                <div className="text-sm font-bold text-primary-700/70 uppercase tracking-wider">Healthy Dishes</div>
              </div>
              <div>
                <div className="text-3xl font-black text-primary-900">{customers}</div>
                <div className="text-sm font-bold text-primary-700/70 uppercase tracking-wider">Happy Customers</div>
              </div>
            </div>
          </div>

          {/*  Carousel Images */}
          <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden mt-8 lg:mt-0">
            {images.map((imageObj, index) => {
              let position = '';
              // Only the current index gets the visible class
              if (index === currentImageIndex) position = 'carousel-center';
              else position = 'carousel-hidden';

              return (
                <div
                  key={imageObj.src}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${position}`}
                  style={{ zIndex: index === currentImageIndex ? 10 : 0 }}
                >
                  <Image
                    src={imageObj.src}
                    alt="Fresh healthy food"
                    fill
                    className="object-contain w-full h-full drop-shadow-2xl scale-75"
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>

          <style jsx>{`
            /* Only the active image is visible and centered */
            .carousel-center { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
              visibility: visible;
            }
            /* All other images are hidden and ready to slide in */
            .carousel-hidden { 
              opacity: 0; 
              transform: translateX(50%) scale(0.8); 
              visibility: hidden;
              pointer-events: none; 
            }

            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
          `}</style>
        </div>
      </div>
    </section>
  )
}

export default Hero