"use client";

import Image from 'next/image';
import { Search, Pencil, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface MenuItem {
  _id?: string; 
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AllProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const activeCategory = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  const selectedId = typeof searchParams?.id === 'string' ? searchParams.id : undefined;
  
  const [showToast, setShowToast] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Dynamic state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Step 2: Fetch items from the MongoDB API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'burger', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'fastfood', label: 'Fast-Food' },
    { id: 'setmenu', label: 'Set Menus' },
    { id: 'appetizers', label: 'Appetizers' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'italian', label: 'Italian' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'pakistani', label: 'Pakistani' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'drinks', label: 'Drinks & Beverages' },
  ];

  let filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedId) {
    const found = menuItems.find(item => String(item.id) === selectedId || String(item._id) === selectedId);
    filteredItems = found ? [found] : [];
  }

  return (
    <div className="min-h-screen bg-[#F7FBE7] pt-28">
      <Header />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <form method="get" action="/all-items">
              <input
                type="text"
                name="search"
                placeholder="Search for food items..."
                defaultValue={searchTerm}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder:text-gray-400"
              />
              {activeCategory !== 'all' && <input type="hidden" name="category" value={activeCategory} />}
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-3 flex-wrap pb-2">
            {categories.map(cat => {
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              if (searchTerm) params.set('search', searchTerm);
              const href = params.toString() ? `/all-items?${params}` : '/all-items';
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-all ${
                    activeCategory === cat.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading Culinary Delights...</div>
        ) : (
          <>
            <motion.div 
              key={activeCategory + searchTerm}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4"
            >
              {filteredItems.map(item => (
                <ItemCard key={item._id || item.id} item={item} isAdmin={isAdmin} setShowToast={setShowToast} />
              ))}
            </motion.div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-slate-500">No items found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-all">
          Item updated successfully!
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, isAdmin, setShowToast }: { item: MenuItem, isAdmin: boolean, setShowToast: (v: boolean) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  // Step 3: Handle Save with PATCH request to MongoDB
  const handleSave = async () => {
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id, // Use MongoDB _id for reference
          name: editedItem.name,
          description: editedItem.description,
          price: editedItem.price
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500);
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#029FBE] rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-90 relative"
    >
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 transition-all"
        >
          <Pencil size={16} />
        </button>
      )}

      <div className="bg-[#19b368] h-48 flex items-center justify-center relative">
        <Image src={editedItem.image} alt={editedItem.name} width={192} height={192} className="object-cover w-full h-full" />
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        {isEditing ? (
          <div className="space-y-2">
            <input 
              className="w-full text-sm font-bold p-1 rounded border border-gray-300 text-black"
              value={editedItem.name}
              onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
            />
            <textarea 
              className="w-full text-xs p-1 rounded border border-gray-300 text-black h-16"
              value={editedItem.description}
              onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
            />
            <input 
              type="number"
              className="w-full text-sm font-bold p-1 rounded border border-gray-300 text-black"
              value={editedItem.price}
              onChange={(e) => setEditedItem({...editedItem, price: Number(e.target.value)})}
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-black text-center leading-tight">{editedItem.name}</h3>
            <p className="text-slate-100 text-xs mt-2 mb-3 text-center opacity-90 line-clamp-2">{editedItem.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <span className="text-base font-bold text-[#050BB3]">৳{editedItem.price}</span>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-500 p-1.5 rounded-full text-white shadow hover:bg-green-600"><Check size={16} /></button>
              <button onClick={() => { setIsEditing(false); setEditedItem(item); }} className="bg-red-500 p-1.5 rounded-full text-white shadow hover:bg-red-600"><X size={16} /></button>
            </div>
          ) : (
            <button
              className="bg-[#F1F604] hover:bg-yellow-300 text-[#029FBE] px-3 py-1.5 rounded text-xs font-bold transition-colors"
              onClick={() => {
                const cartItem = { ...editedItem, _id: String(item._id || item.id), quantity: 1 };
                if (typeof window !== 'undefined') {
                  const saved = localStorage.getItem('cart');
                  const cart = saved ? JSON.parse(saved) : [];
                  const existing = cart.find((i: any) => i._id === cartItem._id);
                  if (existing) existing.quantity += 1;
                  else cart.push(cartItem);
                  localStorage.setItem('cart', JSON.stringify(cart));
                  window.dispatchEvent(new Event('storage'));
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 1500);
                }
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}