"use client";

import Image from 'next/image';
import { Search, Pencil, Check, X, Trash2 } from 'lucide-react'; // Added Trash2 icon
import Header from '@/components/Header';
import { useState, useEffect } from 'react'; 
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
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Sync Complete"); // State for custom toast messages
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

  const categoryOrder = [
    'Burgers', 'Pizza', 'Fast-Food', 'Set Menus', 'Appetizers', 
    'Chinese', 'Italian', 'Traditional', 'Pakistani', 'Coffee', 
    'Desserts', 'Drinks & Beverages'
  ];

  const filterCategories = [
    { id: 'all', label: 'All Items' },
    ...categoryOrder.map(cat => ({ id: cat, label: cat }))
  ];

  const processedItems = menuItems
    .filter(item => {
      const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');
      const itemCat = normalize(item.category || "");
      const activeCat = normalize(activeCategory);
      const matchesCategory = activeCategory === 'all' || itemCat === activeCat || itemCat.includes(activeCat) || activeCat.includes(itemCat);
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '').substring(0, 4);
      const indexA = categoryOrder.findIndex(cat => normalize(a.category).includes(normalize(cat)));
      const indexB = categoryOrder.findIndex(cat => normalize(b.category).includes(normalize(cat)));
      const priorityA = indexA === -1 ? 99 : indexA;
      const priorityB = indexB === -1 ? 99 : indexB;
      if (priorityA === priorityB) return a.price - b.price;
      return priorityA - priorityB;
    });

  return (
    <div className="min-h-screen bg-[#F7FBE7] pt-28">
      <Header />
      
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <form method="get" action="/all-items">
              <input
                type="text"
                name="search"
                placeholder="Search for food items..."
                defaultValue={searchTerm}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] text-black font-medium transition-all"
              />
              {activeCategory !== 'all' && <input type="hidden" name="category" value={activeCategory} />}
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white border-b sticky top-16 z-30 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2.5 pb-1">
            {filterCategories.map(cat => {
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              if (searchTerm) params.set('search', searchTerm);
              const href = params.toString() ? `/all-items?${params}` : '/all-items';
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-full transition-all flex-shrink-0 ${
                    activeCategory === cat.id ? 'bg-black text-[#BCE334] shadow-lg scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="text-center py-20 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse text-gray-400">
            Organizing the Kitchen...
          </div>
        ) : (
          <>
            <motion.div 
              key={activeCategory + searchTerm}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {processedItems.map(item => (
                <ItemCard 
                  key={item._id || item.id} 
                  item={item} 
                  isAdmin={isAdmin} 
                  setShowToast={setShowToast} 
                  setToastMessage={setToastMessage} 
                  setMenuItems={setMenuItems} // Pass setter to update UI after delete
                />
              ))}
            </motion.div>

            {processedItems.length === 0 && (
              <div className="text-center py-24 bg-white/40 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching items found</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-[#BCE334] px-10 py-4 rounded-[2rem] font-black uppercase text-[9px] tracking-[0.2em] shadow-2xl z-50 border border-white/10">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function ItemCard({ 
  item, 
  isAdmin, 
  setShowToast, 
  setToastMessage, 
  setMenuItems 
}: { 
  item: MenuItem, 
  isAdmin: boolean, 
  setShowToast: (v: boolean) => void, 
  setToastMessage: (v: string) => void,
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
}) {
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
        setToastMessage("Sync Complete");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return; // Simple confirmation

    try {
      const response = await fetch(`/api/items?id=${item._id}`, {
        method: 'DELETE', // Matches the DELETE method in your route.ts
      });

      if (response.ok) {
        setMenuItems((prev) => prev.filter((i) => i._id !== item._id)); // UI update
        setToastMessage("Item Deleted");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#029FBE] rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full relative group border border-white/5"
    >
      {/* Admin Action Buttons (Pencil & Trash) */}
      {isAdmin && !isEditing && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2.5 bg-white/95 rounded-xl shadow-xl hover:scale-110 transition-transform"
          >
            <Pencil size={12} className="text-black" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2.5 bg-red-500 rounded-xl shadow-xl hover:scale-110 transition-transform text-white"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      <div className="bg-white/5 h-48 flex items-center justify-center relative overflow-hidden p-2">
        <Image 
          src={editedItem.image} 
          alt={editedItem.name} 
          width={250} 
          height={250} 
          className="object-cover w-full h-full rounded-[2rem] group-hover:scale-105 transition-transform duration-700" 
        />
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#029FBE] to-[#028da8]">
        {isEditing ? (
          <div className="space-y-2.5">
            <input className="w-full text-[10px] font-black uppercase p-3 rounded-2xl bg-white/90 text-black border-none" value={editedItem.name} onChange={(e) => setEditedItem({...editedItem, name: e.target.value})} />
            <textarea className="w-full text-[10px] p-3 rounded-2xl bg-white/90 text-black h-20 resize-none border-none leading-relaxed" value={editedItem.description} onChange={(e) => setEditedItem({...editedItem, description: e.target.value})} />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-black">৳</span>
              <input type="number" className="w-full text-[10px] font-black pl-7 pr-3 py-3 rounded-2xl bg-white/90 text-black border-none" value={editedItem.price} onChange={(e) => setEditedItem({...editedItem, price: Number(e.target.value)})} />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[13px] font-black text-black uppercase tracking-wider leading-tight mb-3">
              {editedItem.name}
            </h3>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wide line-clamp-2 leading-relaxed">
              {editedItem.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">
          <span className="text-xl font-black text-[#F1F604]">৳{editedItem.price}</span>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-[#BCE334] p-2.5 rounded-xl text-black shadow-lg hover:scale-105 transition-transform"><Check size={14} /></button>
              <button onClick={() => { setIsEditing(false); setEditedItem(item); }} className="bg-red-500 p-2.5 rounded-xl text-white shadow-lg hover:scale-105 transition-transform"><X size={14} /></button>
            </div>
          ) : (
            <button
              className="bg-[#F1F604] hover:bg-black hover:text-[#BCE334] text-black px-5 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
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
                  setToastMessage("Added to Cart");
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