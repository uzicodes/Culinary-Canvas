'use client'

import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { BlogPost } from '@/types/blog'
export type { BlogPost } from '@/types/blog'

const blogContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const blogCardVariants: Variants = {
  hidden: { opacity: 0, rotateY: 45, rotateX: 10, z: -100 },
  visible: {
    opacity: 1, rotateY: 0, rotateX: 0, z: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  },
};

//accept 'posts' as a prop
const Blog = ({ posts }: { posts: BlogPost[] }) => {
  const safePosts = posts || [];

  return (
    <section className="py-16 overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
            <span className="text-green-600">Food</span> <span className="text-red-600">Blogs</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-black/20 mx-auto rounded-full"
          />
        </motion.div>

        <motion.div
          variants={blogContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {safePosts.map((post) => (
            <motion.article
              key={post.id}
              variants={blogCardVariants}
              whileHover={{ y: -15, rotateY: -5, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
              className="bg-[#E3DCB1] rounded-2xl shadow-sm overflow-hidden group border border-black/5"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-green-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center text-[10px] font-black uppercase text-gray-500 space-x-4 tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <span>•</span>
                  <span className="truncate max-w-[120px]">{post.author}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-2 border-t border-black/5">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-red-600 hover:text-green-700 font-black uppercase text-xs tracking-widest transition-all group/link">
                    <span>Read Story</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;