import Image from 'next/image';

const deliveryPartners = [
  { name: 'HungryNaki', logo: '/delivery/hungrynaki.svg' },
  { name: 'Foodpanda', logo: '/delivery/foodpanda.svg' },
  { name: 'Pathao', logo: '/delivery/pathao.svg' },
  { name: 'Foodi', logo: '/delivery/foodi.svg' }
];

const DeliveryPartners = () => (
  <section className="py-12 bg-[#8dbee3]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 mt-(-5) text-center">Our Delivery Partners</h2>
  <div className="mt-14 flex flex-wrap justify-center items-center gap-14">
        {deliveryPartners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center">
            <div className="w-32 h-16 relative mb-2">
              <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DeliveryPartners;
