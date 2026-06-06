'use client'

import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Star, Edit3, X, Save, Loader2, PackageSearch, Eye } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useSession } from 'next-auth/react'

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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
}

const BestSelling = () => {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [allInventory, setAllInventory] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [tempData, setTempData] = useState<Partial<Product>>({});

    // STRICT ROLE CHECK
    const checkAdminPrivilege = useCallback(() => {
        if (status === "authenticated" && session?.user) {
            const user = session.user as any;
            // "admin" role check from your database
            const isRoleAdmin = user?.role?.toLowerCase() === 'admin';

            if (isRoleAdmin) {
                setIsAdmin(true);
                return;
            }
        }
        setIsAdmin(false);
    }, [session, status]);

    useEffect(() => {
        const loadInitialData = async () => {
            checkAdminPrivilege();

            try {
                const [bestRes, itemsRes] = await Promise.all([
                    fetch('/api/best-sellers'),
                    fetch('/api/items')
                ]);
                const bData = await bestRes.json();
                const iData = await itemsRes.json();
                setProducts(Array.isArray(bData) ? bData : []);
                setAllInventory(Array.isArray(iData) ? iData : []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (status !== "loading") {
            loadInitialData();
        }
    }, [session, status, checkAdminPrivilege]);

    const handleAddToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((i: any) => i.id === product.id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartTimestamp', Date.now().toString());
        window.dispatchEvent(new Event('cartUpdated'));
        setSuccessMsg(`${product.name} added to cart!`);
        setTimeout(() => setSuccessMsg(null), 1500);
    };

    const handleSaveUpdate = async () => {
        if (!isAdmin || editingSlot === null) return;
        setRateLimitError(null);
        try {
            const res = await fetch('/api/best-sellers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotIndex: editingSlot, ...tempData })
            });
            if (res.status === 429) {
                setRateLimitError('You are performing this action too fast. Please wait a moment.');
                return;
            }
            if (res.ok) {
                const updated = [...products];
                updated[editingSlot] = { ...updated[editingSlot], ...tempData as Product };
                setProducts(updated);
                setIsEditModalOpen(false);
                setSuccessMsg("Featured slot updated!");
                setTimeout(() => setSuccessMsg(null), 2000);
            }
        } catch (err) {
            setSuccessMsg("Update failed!");
            setTimeout(() => setSuccessMsg(null), 2000);
        }
    };

    if (isLoading || status === "loading") return (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-[#BCE334] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Section...</p>
        </div>
    );

    return (
        <section className="py-20 overflow-hidden relative">
            <AnimatePresence>
                {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -100, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -100, x: '-50%' }} className="fixed top-10 left-1/2 bg-black text-[#BCE334] px-10 py-4 rounded-full shadow-2xl z-[500] font-black uppercase text-[10px] tracking-widest border border-[#BCE334]/30">
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3 uppercase tracking-tighter">
                        <span className="text-green-600">Best</span> <span className="text-red-600">Sellers</span>
                        <motion.span
                            animate={{ rotate: [0, 270, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            style={{ display: 'inline-block' }}
                        >
                            <Star className="text-yellow-400 w-8 h-8 fill-yellow-400" />
                        </motion.span>
                    </h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100px" }}
                        viewport={{ once: true }}
                        className="h-1.5 bg-black/20 mx-auto rounded-full"
                    />
                </div>

                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div key={index} variants={cardVariants} whileHover={{ y: -8 }} className="bg-[#68EFF7] rounded-[3rem] shadow-sm p-6 group text-center relative border border-slate-100">
                            <div className="relative mb-6">
                                <div className="relative w-full h-52 rounded-[2.5rem] overflow-hidden bg-slate-50">
                                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                </div>
                                <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                                    {product.badge || 'HOT'}
                                </span>

                                <div className="absolute -bottom-4 right-6">
                                    {isAdmin ? (
                                        <button onClick={() => { setEditingSlot(index); setTempData(product); setIsEditModalOpen(true); }} className="bg-black text-[#BCE334] p-5 rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-[#BCE334]/20 z-50">
                                            <Edit3 className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleAddToCart(product)} className="bg-black text-[#BCE334] p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-slate-900 flex items-center justify-center">
                                            <ShoppingCart className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-black text-[#29570E] text-xl uppercase tracking-tight">{product.name}</h3>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < product.rating ? 'text-yellow-400 fill-[#949018]' : 'text-slate-100'} />
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">৳ {product.price}</span>
                                    <span className="text-sm text-red-500 line-through font-bold">৳{product.originalPrice}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 relative z-10 shadow-2xl border-4 border-black grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6 text-black font-bold">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Edit Slot #{editingSlot! + 1}</h2>
                                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-black appearance-none cursor-pointer" onChange={(e) => {
                                    const item = allInventory.find(i => i.id === e.target.value || (i as any)._id === e.target.value);
                                    if (item) setTempData({ ...tempData, name: item.name, image: item.image, id: item.id || (item as any)._id });
                                }} value={tempData.id}>
                                    <option value="">Choose from Menu...</option>
                                    {allInventory.map(item => <option key={item.id || (item as any)._id} value={item.id || (item as any)._id}>{item.name}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-black" placeholder="New Price" value={tempData.price} onChange={(e) => setTempData({ ...tempData, price: e.target.value })} />
                                    <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-black" placeholder="Old Price" value={tempData.originalPrice} onChange={(e) => setTempData({ ...tempData, originalPrice: e.target.value })} />
                                </div>
                                {rateLimitError && (
                                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">
                                        {rateLimitError}
                                    </div>
                                )}
                                <button onClick={handleSaveUpdate} className="w-full bg-black text-[#BCE334] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-slate-900 transition-all">
                                    Update Best Seller
                                </button>
                            </div>
                            <div className="hidden md:flex flex-col items-center justify-center border-l-2 border-slate-50 pl-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-2"><Eye size={12} /> Live Preview</p>
                                <div className="bg-slate-50 w-full rounded-[2.5rem] p-6 text-center border border-slate-100 shadow-inner">
                                    <div className="relative w-full h-40 rounded-3xl overflow-hidden mb-4 bg-white">
                                        {tempData.image && <Image src={tempData.image} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
                                    </div>
                                    <h4 className="font-black uppercase text-slate-900 tracking-tight mb-2">{tempData.name || '---'}</h4>
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