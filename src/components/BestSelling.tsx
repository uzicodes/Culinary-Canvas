'use client'

import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Edit3, X, Save, Loader2, PackageSearch, Eye } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useSession } from 'next-auth/react' //

// --- Interfaces ---
interface Product {
    id: string | number;
    name: string;
    price: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
}

// --- Animation Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
}

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 260, damping: 20 } 
    }
}

const BestSelling = () => {
    const { data: session, status } = useSession(); // Get real-time session status
    const [products, setProducts] = useState<Product[]>([]);
    const [allInventory, setAllInventory] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [tempData, setTempData] = useState<Partial<Product>>({});

    // 1. Load Data and Strict Admin Check
    useEffect(() => {
        const loadInitialData = async () => {
            // Update Admin status based on the active session
            if (session?.user) {
                const userRole = (session.user as any).role;
                const userEmail = session.user.email;
                
                // Set true only if role is admin OR owner email matches
                if (userRole === 'admin' || userEmail === 'utshozi11@gmail.com') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false); // Reset if user is not admin
                }
            } else {
                setIsAdmin(false); // Reset if logged out entirely
            }

            try {
                // Fetch Best Sellers & All Items
                const [bestRes, itemsRes] = await Promise.all([
                    fetch('/api/best-sellers'),
                    fetch('/api/items')
                ]);
                
                const bestData = await bestRes.json();
                const itemsData = await itemsRes.json();

                setProducts(Array.isArray(bestData) ? bestData : []);
                setAllInventory(Array.isArray(itemsData) ? itemsData : []);
            } catch (err) {
                console.error("Failed to load section data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (status !== "loading") {
            loadInitialData();
        }
    }, [session, status]); // Re-run whenever session changes to toggle icons

    const handleAddToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((i: any) => i.id === product.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); 
        setSuccessMsg(`${product.name} added to cart!`);
        setTimeout(() => setSuccessMsg(null), 1500);
    };

    const handleSaveUpdate = async () => {
        if (editingSlot === null) return;
        try {
            const res = await fetch('/api/best-sellers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotIndex: editingSlot, ...tempData })
            });
            
            if (res.ok) {
                const updated = [...products];
                updated[editingSlot] = { ...updated[editingSlot], ...tempData as Product };
                setProducts(updated);
                setIsEditModalOpen(false);
                
                // Clear any existing message and show new one
                setSuccessMsg(null);
                setSuccessMsg("Featured slot updated!");
                
                // Explicit timeout to remove the message
                setTimeout(() => {
                    setSuccessMsg(null);
                }, 2000);
            }
        } catch (err) {
            setSuccessMsg("Update failed!");
            setTimeout(() => setSuccessMsg(null), 2000);
        }
    };

    if (isLoading || status === "loading") return (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-[#BCE334] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Canvas...</p>
        </div>
    );

    if (products.length === 0) return (
        <section className="py-20 px-4">
            <div className="max-w-xl mx-auto border-4 border-dashed border-slate-200 rounded-[3rem] p-12 text-center bg-white/50">
                <PackageSearch className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">No Best Sellers</h3>
                <p className="text-slate-400 text-sm mt-2">Initialize your database to show items here.</p>
            </div>
        </section>
    );

    return (
        <section className="py-20 bg-[#FDFEF0] overflow-hidden relative">
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -100, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -100, x: '-50%' }}
                        className="fixed top-10 left-1/2 bg-black text-[#BCE334] px-10 py-4 rounded-full shadow-2xl z-[500] font-black uppercase text-[10px] tracking-widest border border-[#BCE334]/30"
                    >
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
                        Best Sellers <Star className="text-yellow-400 w-8 h-8 fill-yellow-400" />
                    </h2>
                </motion.div>

                <motion.div 
                    variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -12 }}
                            className="bg-white rounded-[3rem] shadow-sm p-6 group text-center relative border border-slate-100"
                        >
                            <div className="relative mb-6">
                                <div className="relative w-full h-52 rounded-[2.5rem] overflow-hidden bg-slate-50">
                                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                                    {product.badge || 'SALE'}
                                </span>

                                {/* --- DYNAMIC ICON SWAP --- */}
                                <div className="absolute -bottom-4 right-6">
                                    {isAdmin ? (
                                        <button
                                            onClick={() => {
                                                setEditingSlot(index);
                                                setTempData(product);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="bg-black text-[#BCE334] p-5 rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-[#BCE334]/20 z-50"
                                        >
                                            <Edit3 className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-black text-[#BCE334] p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-slate-900"
                                        >
                                            <ShoppingCart className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-black text-slate-900 text-xl uppercase tracking-tight">{product.name}</h3>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-100'} />
                                    ))}
                                    <span className="text-[11px] text-slate-400 font-black ml-1">({product.reviews || 0})</span>
                                </div>
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">৳{product.price}</span>
                                    <span className="text-sm text-slate-300 line-through font-bold">৳{product.originalPrice}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* --- ADMIN EDIT MODAL --- */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 relative z-10 shadow-2xl border-4 border-black grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Edit Slot #{editingSlot! + 1}</h2>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Change Item</label>
                                    <select 
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-black transition-all appearance-none cursor-pointer" 
                                        onChange={(e) => {
                                            const item = allInventory.find(i => i.id === e.target.value || (i as any)._id === e.target.value);
                                            if (item) setTempData({ ...tempData, name: item.name, image: item.image, id: item.id || (item as any)._id });
                                        }} 
                                        value={tempData.id}
                                    >
                                        <option value="">Choose from Menu...</option>
                                        {allInventory.map(item => <option key={item.id || (item as any)._id} value={item.id || (item as any)._id}>{item.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-black" placeholder="New Price" value={tempData.price} onChange={(e) => setTempData({...tempData, price: e.target.value})} />
                                    <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-black" placeholder="Old Price" value={tempData.originalPrice} onChange={(e) => setTempData({...tempData, originalPrice: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star} onClick={() => setTempData({...tempData, rating: star})}
                                                className={`p-3 rounded-xl transition-all ${tempData.rating === star ? 'bg-black text-[#BCE334]' : 'bg-slate-100 text-slate-300'}`}
                                            >
                                                <Star size={20} fill={tempData.rating! >= star ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleSaveUpdate} className="w-full bg-black text-[#BCE334] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <Save size={16} /> Update Best Seller
                                </button>
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-center border-l-2 border-slate-50 pl-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-2"><Eye size={12} /> Live Preview</p>
                                <div className="bg-slate-50 w-full rounded-[2.5rem] p-6 text-center border border-slate-100 shadow-inner">
                                    <div className="relative w-full h-40 rounded-3xl overflow-hidden mb-4 bg-white">
                                        {tempData.image && <Image src={tempData.image} alt="Preview" fill className="object-cover" />}
                                    </div>
                                    <h4 className="font-black uppercase text-slate-900 tracking-tight mb-2">{tempData.name || '---'}</h4>
                                    <div className="flex justify-center gap-3">
                                        <span className="text-xl font-black">৳{tempData.price || '0'}</span>
                                        <span className="text-xs text-slate-300 line-through font-bold">৳{tempData.originalPrice || '0'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default BestSelling;