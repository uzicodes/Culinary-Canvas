"use client";

import Image from 'next/image';
import { Search, Pencil, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import { useState, useEffect } from 'react'; 
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // 1. STRICT CATEGORY ORDER
  const categoryOrder = [
    'Burgers',
    'Pizza',
    'Fast-Food',
    'Set Menus',
    'Appetizers',
    'Chinese',
    'Italian',
    'Traditional',
    'Pakistani',
    'Coffee',
    'Desserts',
    'Drinks & Beverages'
  ];

  // 2. FIX: Buttons now use the EXACT string stored in MongoDB
  const filterCategories = [
    { id: 'all', label: 'All Items' },
    ...categoryOrder.map(cat => ({ id: cat, label: cat }))
  ];

let filteredItems = menuItems.filter(item => {
  const matchesCategory = activeCategory === 'all' || 
    item.category.toLowerCase().trim() === activeCategory.toLowerCase().trim() ||
    // Also check if singular vs plural matches (e.g., Burger vs Burgers)
    item.category.toLowerCase().startsWith(activeCategory.toLowerCase().substring(0, 4));

  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
  return matchesCategory && matchesSearch;
});

  // 3. SORTING: Always starts with Burgers, ends with Drinks
  const sortedItems = [...filteredItems].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category);
    const indexB = categoryOrder.indexOf(b.category);
    
    // Default unknown categories to the middle
    const priorityA = indexA === -1 ? 99 : indexA;
    const priorityB = indexB === -1 ? 99 : indexB;
    
    return priorityA - priorityB;
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
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder:text-gray-400 shadow-sm"
              />
              {activeCategory !== 'all' && <input type="hidden" name="category" value={activeCategory} />}
            </form>
          </div>
        </div>
      </div>

      {/* FIXED FILTER BUTTONS */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2.5 flex-wrap pb-1">
            {filterCategories.map(cat => {
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              if (searchTerm) params.set('search', searchTerm);
              const href = params.toString() ? `/all-items?${params}` : '/all-items';
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat.id 
                      ? 'bg-orange-500 text-white shadow-md scale-105' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="text-center py-20 text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">
            Fetching Culinary Delights...
          </div>
        ) : (
          <>
            <motion.div 
              key={activeCategory + searchTerm}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {sortedItems.map(item => (
                <ItemCard key={item._id || item.id} item={item} isAdmin={isAdmin} setShowToast={setShowToast} />
              ))}
            </motion.div>

            {sortedItems.length === 0 && (
              <div className="text-center py-24">
                <div className="bg-white/50 backdrop-blur inline-block p-10 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No items found in this category.</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-[#BCE334] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl z-50 transition-all border border-white/10">
          Update Successful
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, isAdmin, setShowToast }: { item: MenuItem, isAdmin: boolean, setShowToast: (v: boolean) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id, 
          name: editedItem.name,
          description: editedItem.description,
          price: editedItem.price
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#029FBE] rounded-[2rem] shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full relative border border-white/10 group"
    >
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-xl shadow-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Pencil size={14} />
        </button>
      )}

      <div className="bg-white/10 h-44 flex items-center justify-center relative overflow-hidden">
        <Image src={editedItem.image} alt={editedItem.name} width={250} height={250} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#029FBE] to-[#028da8]">
        {isEditing ? (
          <div className="space-y-2">
            <input className="w-full text-[10px] font-black uppercase p-2 rounded-xl border-none bg-white/20 text-white placeholder:text-white/50" value={editedItem.name} onChange={(e) => setEditedItem({...editedItem, name: e.target.value})} />
            <textarea className="w-full text-[10px] p-2 rounded-xl border-none bg-white/20 text-white h-16 resize-none" value={editedItem.description} onChange={(e) => setEditedItem({...editedItem, description: e.target.value})} />
            <input type="number" className="w-full text-[10px] font-black p-2 rounded-xl border-none bg-white/20 text-white" value={editedItem.price} onChange={(e) => setEditedItem({...editedItem, price: Number(e.target.value)})} />
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-black text-black uppercase tracking-tighter leading-tight mb-2">{editedItem.name}</h3>
            <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider line-clamp-2 leading-relaxed">{editedItem.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
          <span className="text-lg font-black text-[#F1F604]">৳{editedItem.price}</span>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-[#BCE334] p-2 rounded-lg text-black shadow-lg hover:scale-110 transition-transform"><Check size={14} /></button>
              <button onClick={() => { setIsEditing(false); setEditedItem(item); }} className="bg-red-500 p-2 rounded-lg text-white shadow-lg hover:scale-110 transition-transform"><X size={14} /></button>
            </div>
          ) : (
            <button
              className="bg-[#F1F604] hover:bg-[#BCE334] text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
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
                  setTimeout(() => setShowToast(false), 2000);
                }
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}