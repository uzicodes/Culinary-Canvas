import Image from 'next/image';

const deliveryPartners = [
  { name: 'Uber Eats', logo: '/delivery/ubereats.png' },
  { name: 'DoorDash', logo: '/delivery/doordash.png' },
  { name: 'Grubhub', logo: '/delivery/grubhub.png' },
  { name: 'Zomato', logo: '/delivery/zomato.png' },
  { name: 'Swiggy', logo: '/delivery/swiggy.png' },
];

const DeliveryPartners = () => (
  <section className="py-12 bg-[#E07460]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">Our Delivery Partners</h2>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {deliveryPartners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center">
            <div className="w-32 h-16 relative mb-2">
              <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
            </div>
            <span className="text-gray-700 text-sm font-medium">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DeliveryPartners;
