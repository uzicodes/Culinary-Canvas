"use client";

import Image from 'next/image';
import { Search, Pencil, Check, X, Trash2 } from 'lucide-react';
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
  const [toastMessage, setToastMessage] = useState("Sync Complete");
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
    'Desserts', 'Drinks & Beverages', 'Sea-Food', 'Japanese'
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
      
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <form method="get" action="/all-items">
              <input
                type="text"
                name="search"
                placeholder="Search for food items..."
                defaultValue={searchTerm}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] text-black font-medium transition-all shadow-sm"
              />
              {activeCategory !== 'all' && <input type="hidden" name="category" value={activeCategory} />}
            </form>
          </div>
        </div>
      </div>

      <div className="bg-transparent sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
            {filterCategories.map(cat => {
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              if (searchTerm) params.set('search', searchTerm);
              const href = params.toString() ? `/all-items?${params}` : '/all-items';
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap shadow-sm ${
                    activeCategory === cat.id 
                      ? 'bg-black text-[#BCE334] scale-105' 
                      : 'bg-white/70 text-slate-600 hover:bg-white backdrop-blur-sm'
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
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6"
            >
              {processedItems.map(item => (
                <ItemCard 
                  key={item._id || item.id} 
                  item={item} 
                  isAdmin={isAdmin} 
                  setShowToast={setShowToast} 
                  setToastMessage={setToastMessage}
                  setMenuItems={setMenuItems}
                />
              ))}
            </motion.div>

            {processedItems.length === 0 && (
              <div className="text-center py-24 bg-white/20 rounded-[3rem] border-2 border-dashed border-slate-300">
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
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      const response = await fetch(`/api/items?id=${item._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMenuItems((prev) => prev.filter((i) => i._id !== item._id));
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
      className="bg-[#029FBE] rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full relative group border border-white/5"
    >
      {isAdmin && !isEditing && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => setIsEditing(true)} className="p-1.5 md:p-2.5 bg-white/95 rounded-lg md:rounded-xl shadow-xl hover:scale-110"><Pencil size={10} className="md:w-3 md:h-3 text-black" /></button>
          <button onClick={handleDelete} className="p-1.5 md:p-2.5 bg-red-500 rounded-lg md:rounded-xl shadow-xl hover:scale-110 text-white"><Trash2 size={10} className="md:w-3 md:h-3" /></button>
        </div>
      )}

      <div className="bg-white/5 h-28 md:h-48 flex items-center justify-center relative overflow-hidden p-1 md:p-2">
        <Image src={editedItem.image} alt={editedItem.name} width={250} height={250} className="object-cover w-full h-full rounded-[1.2rem] md:rounded-[2rem] group-hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="p-3 md:p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#029FBE] to-[#028da8]">
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
            <h3 className="text-[10px] md:text-[13px] font-black text-black uppercase tracking-wider leading-tight mb-1 md:mb-3">{editedItem.name}</h3>
            <p className="text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-wide line-clamp-2 leading-relaxed">{editedItem.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 md:pt-5 mt-2 md:mt-5 border-t border-white/10">
          <span className="text-sm md:text-xl font-black text-[#F1F604]">৳{editedItem.price}</span>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-[#BCE334] p-2.5 rounded-xl text-black shadow-lg hover:scale-105 transition-transform"><Check size={14} /></button>
              <button onClick={() => { setIsEditing(false); setEditedItem(item); }} className="bg-red-500 p-2.5 rounded-xl text-white shadow-lg hover:scale-105 transition-transform"><X size={14} /></button>
            </div>
          ) : (
            <button
              className="bg-[#F1F604] hover:bg-black hover:text-[#BCE334] text-black px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-[1.2rem] text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
              onClick={() => {
                // If admin ? not allow adding to cart
                if (isAdmin) return; 

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