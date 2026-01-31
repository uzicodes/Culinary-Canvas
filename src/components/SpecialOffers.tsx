'use client'
import { motion } from 'framer-motion';

const SpecialOffers = () => (
    <section className="py-12 px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative bg-gradient-to-r from-[#BCE334] to-[#8dbee3] p-8 md:p-16 shadow-2xl"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <span className="bg-black text-[#BCE334] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Limited Time</span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 leading-none uppercase tracking-tighter">
                        Weekend <br /> <span className="text-white">Feast Mode</span>
                    </h2>
                    <p className="mt-4 text-slate-800 font-bold max-w-md">Get 30% off on all Family Sets this Saturday & Sunday. Use code: <span className="bg-white/40 px-2 rounded">CANVAS30</span></p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-colors"
                >
                    Claim Offer
                </motion.button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20" />
        </motion.div>
    </section>
);

export default SpecialOffers;