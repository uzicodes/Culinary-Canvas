'use client'

import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'

const bestSellingProducts = [
    { id: 1, name: 'Tiramisu', price: '200', originalPrice: '220', rating: 5, reviews: 15, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930251/kyvcoohzi6saedxpguns.png', badge: 'SALE' },
    { id: 2, name: 'Double Patty', price: '380', originalPrice: '400', rating: 5, reviews: 35, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928494/lqhcxe20m6ws6hkurvhf.png', badge: 'SALE' },
    { id: 3, name: 'Croissant', price: '170', originalPrice: '200', rating: 5, reviews: 28, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930115/ke9r6yd2hj2osscss29n.png', badge: 'SALE' },
    { id: 4, name: 'Spaghetti', price: '180', originalPrice: '200', rating: 5, reviews: 42, image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930944/zb7hv5nzgmm2jgynnjnb.png', badge: 'SALE' },
]

// 1. Spring-Pop Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Slightly slower stagger for more impact
        }
    }
}

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
        } 
    }
}

const BestSelling = () => {
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleAddToCart = (product: typeof bestSellingProducts[0]) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((i: any) => i.id === product.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setSuccessMsg(`${product.name} added to cart!`);
        setTimeout(() => setSuccessMsg(null), 1500);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
            {/* Animated Success Toast */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -100, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -100, x: '-50%' }}
                        className="fixed top-8 left-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold"
                    >
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                        Best Sellers{' '}
                        <motion.div
                            animate={{ rotate: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <Star className="text-yellow-400 w-7 h-7" fill="#facc15" />
                        </motion.div>
                    </h2>
                </motion.div>

                {/* Products Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {bestSellingProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={cardVariants}
                            whileHover={{ y: -10 }} // Lift effect on hover
                            className="bg-[#C5D5EB] rounded-3xl shadow-sm p-4 group text-center relative"
                        >
                            {/* Product Image Wrapper */}
                            <div className="relative mb-4">
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Sale Badge with Pulse */}
                                <motion.span 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md"
                                >
                                    {product.badge}
                                </motion.span>

                                {/* Hover Add to Cart Button */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute bottom-3 right-3 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                                    onClick={() => handleAddToCart(product)}
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2 pb-2">
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center space-x-1 justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < product.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-500 font-medium ml-1">
                                        ({product.reviews})
                                    </span>
                                </div>

                                {/* Price Section */}
                                <div className="flex items-center space-x-2 justify-center pt-1">
                                    <span className="text-xl font-black text-sky-700">
                                        ৳{product.price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through decoration-red-400">
                                        ৳{product.originalPrice}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default BestSelling