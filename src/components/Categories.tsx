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

const categories: Category[] = [
    { id: 1, name: 'Burgers', slug: 'Burgers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928414/hluwiapjhw5zxmajot0s.png', color: 'bg-red-50', textColor: 'text-red-600' },
    { id: 2, name: 'Pizza', slug: 'Pizza', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931606/jlo1datdnea4q2e2znzf.png', color: 'bg-green-50', textColor: 'text-green-600' },
    { id: 3, name: 'Fast Foods', slug: 'Fast-Food', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930687/m4xqqwl0laegdbrdia5x.png', color: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 4, name: 'Set Menus', slug: 'Set Menus', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931824/entv9bx7pbaf5w585uq8.png', color: 'bg-yellow-50', textColor: 'text-pink-600' },
    { id: 5, name: 'Appetizers', slug: 'Appetizers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928874/aeczkqrrzihrjhypcimy.png', color: 'bg-purple-50', textColor: 'text-yellow-600' },
    { id: 6, name: 'Chinese', slug: 'Chinese', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929387/hwz3wnob7an2owpfsmji.png', color: 'bg-blue-50', textColor: 'text-purple-600' },
    { id: 7, name: 'Desserts', slug: 'Desserts', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929707/e1mb19v21fygi4g0q7ri.png', color: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { id: 8, name: 'Italian', slug: 'Italian', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930944/zb7hv5nzgmm2jgynnjnb.png', color: 'bg-orange-50', textColor: 'text-orange-600' },
    { id: 9, name: 'Traditional', slug: 'Traditional', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768932168/ui6fxgadb6qiokz4pd4s.png', color: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { id: 10, name: 'Coffee', slug: 'Coffee', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929560/gr11cmbnyis9am6wza75.png', color: 'bg-stone-50', textColor: 'text-stone-700' },
    { id: 11, name: 'Drinks & Beverages', slug: 'Drinks & Beverages', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930469/gd9vgbakrt0mmuv5ao4s.png', color: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { id: 12, name: 'Pakistani', slug: 'Pakistani', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931301/w4swf1srbxfriq36jmr5.png', color: 'bg-rose-50', textColor: 'text-rose-600' }
]

// Animation Variants with TypeScript Fix
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Subtle stagger for a premium feel
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
        <section className="py-16 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Browse Our Hottest{' '}
                        <span className="text-sky-600">Categories</span>
                    </h2>
                    <div className="w-20 h-1 bg-sky-600 mx-auto rounded-full"></div>
                </motion.div>

                {/* Staggered Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                href={`/all-items?category=${category.slug}`}
                                className="group block h-full"
                            >
                                <motion.div
                                    whileHover={{ 
                                        y: -8,
                                        boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" 
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`${category.color} rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center border border-transparent transition-all hover:border-white/50`}
                                >
                                    <div className="relative w-16 h-16 mb-4">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3
                                        className={`font-bold text-sm lg:text-base ${category.textColor} tracking-tight leading-tight`}
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

export default Categories