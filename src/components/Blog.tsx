'use client'

import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'

const blogPosts = [
  {
    id: 1,
    title: '25 Favorite Thanksgiving Sides',
    excerpt: 'Discover 25 of the best Thanksgiving side dishes to make your holiday meal unforgettable.',
    date: 'March 15, 2024',
    category: 'Occasional',
    image: '/blog-1.png',
    author: 'Lindsay',
    link: 'https://pinchofyum.com/25-favorite-thanksgiving-sides'
  },
  {
    id: 3,
    title: 'Cinnabon Cinnamon Rolls',
    excerpt: 'soft, gooey, and dripping with cream cheese icing, this is the cinnamon roll that ruined all others for me.',
    date: 'March 10, 2024',
    category: 'Dessert',
    image: '/blog-2.png',
    author: 'Jo cooks ( Joanna )',
    link : 'https://www.jocooks.com/recipes/cinnabons-cinnamon-rolls/'
  },
  {
    id: 2,
    title: 'Brown Sugar Salmon Rub',
    excerpt: `Perfect combination of sweet, spicy and savory flavors that complement the flavor of grilled salmon but don't overpower it. You only need brown sugar, pepper flakes, oregano, garlic powder, salt and pepper to make it.`,
    date: 'March 14, 2024',
    category: 'Recipe',
    image: '/blog-3.png',
    author: 'Nicole',
    link: 'https://thespicetrain.com/salmon-dry-rub/'
  }
];

// 3D Perspective 
const blogContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Slower stagger for a more deliberate "unfolding" feel
    },
  },
};

const blogCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    rotateY: 45, // Starts tilted away from the user
    rotateX: 10,
    z: -100 
  },
  visible: { 
    opacity: 1, 
    rotateY: 0, 
    rotateX: 0,
    z: 0,
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  },
};

const Blog = () => (
  <section className="py-16 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden" style={{ perspective: "1200px" }}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
          Food <span className="text-primary-600">Blogs</span>
        </h2>
        <div className="w-16 h-1 bg-primary-600 mx-auto rounded-full mt-2" />
      </motion.div>

      {/* Blog Grid with 3D Entrance */}
      <motion.div 
        variants={blogContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {blogPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={blogCardVariants}
            whileHover={{ 
              y: -15, 
              rotateY: -5, // Tilts toward the user on hover
              boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" 
            }}
            className="bg-[#E3DCB1] rounded-2xl shadow-sm overflow-hidden group border border-black/5"
          >
            {/* Featured Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {post.category}
                </span>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <span>•</span>
                <span className="font-medium">{post.author}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                {post.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                {post.excerpt}
              </p>

              <div className="pt-2 border-t border-black/5">
                {post.link ? (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-primary-600 hover:text-primary-700 font-bold transition-all group/link"
                  >
                    <span>Read Full Story</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </a>
                ) : (
                  <span className="flex items-center space-x-2 text-primary-600 font-semibold opacity-60 cursor-not-allowed">
                    <span>Coming Soon</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Blog;