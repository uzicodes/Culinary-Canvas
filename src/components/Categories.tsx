'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    color: string;
    textColor: string;
}

// Adjusted the base color classes to work better as glass overlays
const categories: Category[] = [
    { id: 1, name: 'Burgers', slug: 'Burgers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928414/hluwiapjhw5zxmajot0s.png', color: 'bg-red-500/10', textColor: 'text-slate-900' },
    { id: 2, name: 'Pizza', slug: 'Pizza', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931606/jlo1datdnea4q2e2znzf.png', color: 'bg-cyan-500/10', textColor: 'text-slate-900' },
    { id: 3, name: 'Fast Foods', slug: 'Fast-Food', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930687/m4xqqwl0laegdbrdia5x.png', color: 'bg-blue-500/10', textColor: 'text-slate-900' },
    { id: 4, name: 'Set Menus', slug: 'Set Menus', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931824/entv9bx7pbaf5w585uq8.png', color: 'bg-yellow-500/10', textColor: 'text-slate-900' },
    { id: 5, name: 'Appetizers', slug: 'Appetizers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928874/aeczkqrrzihrjhypcimy.png', color: 'bg-purple-500/10', textColor: 'text-slate-900' },
    { id: 6, name: 'Chinese', slug: 'Chinese', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929387/hwz3wnob7an2owpfsmji.png', color: 'bg-blue-500/10', textColor: 'text-slate-900' },
    { id: 7, name: 'Desserts', slug: 'Desserts', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929707/e1mb19v21fygi4g0q7ri.png', color: 'bg-cyan-500/10', textColor: 'text-slate-900' },
    { id: 8, name: 'Italian', slug: 'Italian', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930944/zb7hv5nzgmm2jgynnjnb.png', color: 'bg-orange-500/10', textColor: 'text-slate-900' },
    { id: 9, name: 'Traditional', slug: 'Traditional', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768932168/ui6fxgadb6qiokz4pd4s.png', color: 'bg-blue-500/10', textColor: 'text-slate-900' },
    { id: 10, name: 'Japanese', slug: 'Japanese', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1769263611/culinary-canvas/items/spzco8tvg4e7dbsippj7.png', color: 'bg-amber-500/10', textColor: 'text-slate-900' },
    { id: 11, name: 'Sea-Food', slug: 'Sea-Food', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1769258267/culinary-canvas/items/up4eyut0dnuqo7tuaztu.png', color: 'bg-red-500/10', textColor: 'text-slate-900' },
    { id: 12, name: 'Coffee', slug: 'Coffee', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929560/gr11cmbnyis9am6wza75.png', color: 'bg-indigo-500/10', textColor: 'text-slate-900' },
    { id: 13, name: 'Pakistani', slug: 'Pakistani', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931301/w4swf1srbxfriq36jmr5.png', color: 'bg-rose-500/10', textColor: 'text-slate-900' },
    { id: 14, name: 'Drinks & Beverages', slug: 'Drinks & Beverages', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930469/gd9vgbakrt0mmuv5ao4s.png', color: 'bg-blue-500/10', textColor: 'text-slate-900' },
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
};

const Categories = () => {
    return (
        <section className="py-16 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
                        Hottest <span className="text-red-600">Categories</span>
                    </h2>
                    <div className="w-20 h-1 bg-sky-600 mx-auto rounded-full"></div>
                </motion.div>

                {/* Staggered Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6"
                >
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                href={`/all-items?category=${category.slug}`}
                                className="group block h-full"
                            >
                                <motion.div
                                    whileHover={{
                                        y: -10,
                                        scale: 1.02,
                                        boxShadow: "0px 20px 40px rgba(0,0,0,0.1)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    // Glassmorphism implementation: 
                                    // 1. Semi-transparent background (white/60)
                                    // 2. High backdrop blur (blur-xl)
                                    // 3. Thin, semi-transparent border (white/80)
                                    className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 text-center h-full flex flex-col items-center justify-center border border-white/80 shadow-sm transition-all duration-300"
                                >
                                    {/* Subtle color glow matching the category */}
                                    <div className={`absolute inset-0 ${category.color} rounded-[2rem] -z-10`} />

                                    <div className="relative w-16 h-16 mb-4">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                                        />
                                    </div>
                                    <h3
                                        className={`font-black text-xs lg:text-sm ${category.textColor} tracking-widest uppercase leading-tight`}
                                    >
                                        {category.name}
                                    </h3>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Categories;