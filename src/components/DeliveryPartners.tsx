'use client'
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const deliveryPartners = [
  { name: 'HungryNaki', logo: '/delivery/hungrynaki.svg' },
  { name: 'Foodpanda', logo: '/delivery/foodpanda.svg' },
  { name: 'Pathao', logo: '/delivery/pathao.svg' },
  { name: 'Foodi', logo: '/delivery/foodi.svg' }
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Logos appear one after another
    },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  },
};

const DeliveryPartners = () => (
  <section className="py-16 bg-[#8dbee3] overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Animated Header */}
      <motion.h2 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-2xl lg:text-4xl font-extrabold text-white mb-4 text-center tracking-tight"
      >
        Our Delivery Partners
      </motion.h2>
      
      {/* Decorative underline */}
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        viewport={{ once: true }}
        className="h-1.5 bg-white/40 mx-auto rounded-full mb-12"
      />

      {/* Staggered Logo Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-12 lg:gap-20"
      >
        {deliveryPartners.map((partner) => (
          <motion.div 
            key={partner.name} 
            variants={logoVariants}
            className="flex flex-col items-center"
          >
            <motion.div 
              //"Bigger on Hover" effect
              whileHover={{ 
                scale: 1.2, 
                filter: "brightness(1.1)",
                rotate: 2 
              }}
              whileTap={{ scale: 0.9 }}
              className="w-36 h-20 relative cursor-pointer drop-shadow-md"
            >
              <Image 
                src={partner.logo} 
                alt={partner.name} 
                fill 
                className="object-contain" 
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default DeliveryPartners;