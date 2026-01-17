import { notFound } from 'next/navigation';
import menuItems from '@/data/menuItems';
import Image from 'next/image';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = menuItems.find((item) => String(item.id) === params.id);
  if (!item) return notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <Image src={item.image} alt={item.name} width={300} height={300} className="mx-auto rounded" />
        <h1 className="text-2xl font-bold mt-4 mb-2 text-center">{item.name}</h1>
        <p className="text-gray-600 text-center mb-4">{item.description}</p>
        <div className="text-center text-lg font-semibold text-[#029FBE] mb-4">৳{item.price}</div>
        <button className="bg-[#F1F604] hover:bg-yellow-300 text-[#029FBE] px-6 py-2 rounded text-base font-bold transition-colors w-full">Add to Cart</button>
      </div>
    </div>
  );
}
