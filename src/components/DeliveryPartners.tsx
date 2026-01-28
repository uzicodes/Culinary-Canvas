'use client'
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const deliveryPartners = [
  { name: 'HungryNaki', logo: '/delivery/hungrynaki.svg' },
  { name: 'Foodpanda', logo: '/delivery/foodpanda.svg' },
  { name: 'Pathao', logo: '/delivery/pathao.svg' },
  { name: 'Foodi', logo: '/delivery/foodi.svg' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
};

const DeliveryPartners = () => (
  <section className="py-20 bg-gradient-to-br from-[#8dbee3] to-[#6da5d1] overflow-hidden relative">
    {/* Background depth circles */}
    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Speedy <span className="text-blue-100/70">Partners</span>
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          viewport={{ once: true }}
          className="h-1.5 bg-white/40 mx-auto rounded-full"
        />
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-8 lg:gap-12"
      >
        {deliveryPartners.map((partner) => (
          <motion.div 
            key={partner.name} 
            variants={logoVariants}
            className="group"
          >
            <motion.div 
              whileHover={{ 
                y: -10,
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.4)", // Brightens on hover
                borderColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              // Neutral glassmorphism to let logo colors pop
              className="w-48 h-28 relative cursor-pointer bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl flex items-center justify-center p-6 transition-all duration-300"
            >
              <div className="relative w-full h-full">
                <Image 
                  src={partner.logo} 
                  alt={partner.name} 
                  fill 
                  className="object-contain transition-transform duration-500 group-hover:scale-110" 
                  // Invert filter removed to keep original logo colors
                />
              </div>
            </motion.div>
            
            <p className="mt-4 text-[10px] font-black uppercase text-white tracking-[0.3em] text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {partner.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default DeliveryPartners;