"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { m as motion, AnimatePresence } from "framer-motion";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedTime = localStorage.getItem('cartTimestamp:v1');
      if (savedTime && (Date.now() - parseInt(savedTime, 10)) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('cart:v1');
        localStorage.removeItem('cartTimestamp:v1');
        return [];
      }
      const savedCart = localStorage.getItem('cart:v1');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateCart = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart:v1", JSON.stringify(updatedItems));
    localStorage.setItem("cartTimestamp:v1", Date.now().toString());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const decreaseQuantity = (id: string) => {
    const updated = cartItems.map((item) =>
      item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    updateCart(updated);
  };

  const increaseQuantity = (id: string) => {
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter((item) => item._id !== id);
    updateCart(updated);
    toast.error("Item removed from Cart");
  };

  const clearCart = () => {
    updateCart([]);
    toast.warn("Cart cleared");
  };

  const handleCheckout = () => {
    if (!session) {
      toast.info("Identification required for checkout");
      setTimeout(() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`), 1500);
      return;
    }
    router.push("/checkout");
  };

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedTime = localStorage.getItem('cartTimestamp:v1');
        if (savedTime && (Date.now() - parseInt(savedTime, 10)) > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('cart:v1');
          localStorage.removeItem('cartTimestamp:v1');
        }
        const savedCart = localStorage.getItem("cart:v1");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FBE7] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-black border-t-[#BCE334] rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7FBE7] text-black pb-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <Header />
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="max-w-7xl mx-auto px-4 pt-32 lg:pt-40">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-12">
          <div className="bg-black p-4 rounded-2xl">
            <FaShoppingBag className="text-[#BCE334] text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Your <span className="text-[#BCE334] bg-black px-2 py-1 rounded-lg">Cart</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1 ml-1">Secure your selections</p>
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-gray-300 backdrop-blur-sm">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-500 mb-8">The cart is currently empty</h2>
            <Link href="/all-items" className="bg-black text-[#BCE334] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform">
              Browse the Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-lg group transition-all hover:border-[#BCE334]"
                  >
                    <div className="relative w-full sm:w-20 h-20 overflow-hidden rounded-xl flex-shrink-0">
                      <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 truncate">{item.name}</h3>
                      <p className="text-[9px] font-bold text-[#BCE334] bg-black inline-block px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.category}
                      </p>
                      <div className="mt-2 sm:hidden flex justify-center items-center">
                        <span className="text-base font-black text-black">৳{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl flex-shrink-0">
                      <button aria-label="Button" type="button" onClick={() => decreaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-[#ef5959] transition-colors"><FaMinus size={8} /></button>
                      <span className="w-6 text-center font-black text-xs">{item.quantity}</span>
                      <button aria-label="Button" type="button" onClick={() => increaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-[#BCE334] transition-colors"><FaPlus size={8} /></button>
                    </div>

                    <div className="hidden sm:block text-right min-w-[80px] flex-shrink-0">
                      <span className="text-base font-black text-black block">৳{item.price}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">per unit</span>
                    </div>

                    <button aria-label="Button" type="button" onClick={() => removeFromCart(item._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <FaTrashAlt size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button aria-label="Button" type="button"
                onClick={clearCart}
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-4 transition-colors bg-red-100 border border-red-200 rounded-2xl px-4 py-2 text-red-500 hover:bg-red-200 hover:text-red-700 shadow-sm"
              >
                <FaTrashAlt size={12} /> Clear Cart
              </button>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-40 border border-white/10">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h2>

                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight text-gray-400 border-b border-white/5 pb-2">
                      <span className="truncate max-w-[150px]">{item.name} <span className="text-[#BCE334]">x{item.quantity}</span></span>
                      <span className="text-white">৳{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-[#BCE334]/30">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Payable</p>
                    <p className="text-4xl font-black text-[#BCE334]">৳{totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-[#BCE334] text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] mt-10 shadow-lg flex items-center justify-center gap-3 group transition-all"
                >
                  Proceed to Payments <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>

                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center mt-6">
                  SSL Secure Verification Guaranteed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}