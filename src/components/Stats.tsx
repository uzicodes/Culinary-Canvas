'use client'

import React from 'react'
import { Users, ShoppingBag, Award, Truck } from 'lucide-react'
import { motion, Variants, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// counting effect
const RollingNumber = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const numericValue = parseInt(value.replace(/,/g, ''))

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const end = numericValue
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayValue(end)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, numericValue])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { number: '1500', suffix: '+', label: 'Happy Customers', icon: Users, color: 'text-yellow-400' },
  { number: '300', suffix: '+', label: 'Products Available', icon: ShoppingBag, color: 'text-sky-400' },
  { number: '30', suffix: '+', label: 'Years Experience', icon: Award, color: 'text-orange-400' },
  { number: '1800', suffix: '+', label: 'Orders Delivered', icon: Truck, color: 'text-rose-400' }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const statItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -40, 
    scale: 0.5,
    filter: "blur(4px)" 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 12 
    } 
  }
}

const Stats = () => {
  return (
    <section className="relative py-16 bg-primary-600 overflow-hidden">
      {/* Background Decorative Rings */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 flex justify-center items-center pointer-events-none"
      >
        <div className="w-[500px] h-[500px] border border-white rounded-full opacity-10" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={statItemVariants}
              className="group flex flex-col items-center text-white"
            >
              {/* Icon Container */}
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                className={`bg-white/10 p-4 rounded-2xl mb-4 backdrop-blur-md border border-white/20 shadow-lg transition-colors`}
              >
                <stat.icon className={`w-8 h-8 lg:w-9 lg:h-9 ${stat.color} drop-shadow-md`} strokeWidth={2.5} />
              </motion.div>
              <div className="text-3xl lg:text-4xl font-bold mb-1 tracking-tight">
                <RollingNumber value={stat.number} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.5 }}
                className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-primary-50 text-center"
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Stats