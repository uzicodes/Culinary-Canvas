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
  <section className="py-16 overflow-hidden relative">

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
          <span className="text-green-600">Delivery</span> <span className="text-red-600">Partners</span>
        </h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          viewport={{ once: true }}
          className="h-1.5 bg-black/20 mx-auto rounded-full"
        />
      </motion.div>

      {/* MODIFIED GRID CONTAINER:
          - grid-cols-2: 2 columns on mobile
          - md:flex: switch back to flex for desktop centering
      */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12"
      >
        {deliveryPartners.map((partner) => (
          <motion.div
            key={partner.name}
            variants={logoVariants}
            className="group flex flex-col items-center"
          >
            <motion.div
              whileHover={{
                y: -10,
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              /* Adjusted size for mobile to ensure the 2x2 grid fits nicely */
              className="w-full max-w-[180px] md:w-48 h-24 md:h-28 relative cursor-pointer bg-white/20 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/40 shadow-xl flex items-center justify-center p-4 md:p-6 transition-all duration-300"
            >
              <div className="relative w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>

            <p className="mt-3 text-[9px] md:text-[10px] font-black uppercase text-white tracking-[0.3em] text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {partner.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default DeliveryPartners;