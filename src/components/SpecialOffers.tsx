'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const offersImages = [

    '/offers/fast1.png',
    '/offers/fast4.png',
    '/offers/fast6.png',


];

const slideVariants = {
    enter: { x: '100%', opacity: 0, scale: 0.8 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: '-100%', opacity: 0, scale: 0.8 },
};

const SpecialOffers = () => {
    const [index, setIndex] = useState(0);

    // slide timer 3.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % offersImages.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto rounded-none overflow-hidden relative bg-gradient-to-r from-[#BCE334] to-[#8dbee3] p-6 md:p-10 shadow-2xl"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Text Content */}
                    <div className="text-center md:text-left flex-1 z-20">
                        <span className="bg-black text-[#BCE334] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Limited Time Offer
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 leading-none uppercase tracking-tighter">
                            Weekend <br /> <span className="text-red-600">Feast <span className="text-black">Mode</span></span>

                        </h2>
                        <p className="mt-4 text-slate-800 font-bold max-w-md">
                            Get 30% off on above 1000Tk orders on Sunday&apos;s. <span className="text-xs text-gray-500">* Selected Items Only</span> <br />
                            Use code: <span className="bg-white/40 px-2 rounded">CANVAS30</span>
                        </p>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative w-full max-w-md md:max-w-lg h-48 md:h-64 flex justify-center items-center z-10">
                        <AnimatePresence mode='popLayout'>
                            <motion.div
                                key={index}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.5 }}
                                className="absolute w-full h-full flex items-center justify-center"
                            >
                                <div className="relative w-full h-full filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]">
                                    <Image
                                        src={offersImages[index]}
                                        alt="Special Offer Item"
                                        fill
                                        className="object-contain mix-blend-multiply"
                                        sizes="(max-width: 768px) 320px, 448px"
                                        priority={index === 0}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Action Button */}
                    <div className="flex-none z-20">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-black text-white px-12 py-5 rounded-none font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-colors"
                        >
                            Claim Offer
                        </motion.button>
                    </div>
                </div>

                {/* Blur Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 z-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 z-0" />
            </motion.div>
        </section>
    );
};

export default SpecialOffers;