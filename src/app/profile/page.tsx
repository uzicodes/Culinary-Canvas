'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircle, Lock, ArrowRight, ShieldCheck, ShoppingBag, Clock, CreditCard, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useSession, signOut } from 'next-auth/react'
// FIXED: Added missing import
import OrderDetailsModal from '@/components/OrderDetailsModal'

export default function ProfilePage() {
  const { data: session } = useSession();
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const toggleOrders = async () => {
    if (!showOrders && orders.length === 0) {
      setIsLoadingOrders(true);
      try {
        const res = await fetch('/api/orders/my-orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    setShowOrders(!showOrders);
  };

  if (!session) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <div className="fixed inset-0 w-full h-full -z-10">
          <Image src="/gradient.png" alt="Background" fill className="object-cover w-full h-full blur-xl opacity-60" priority />
        </div>
        <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <UserCircle className="text-[#BCE334] w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Your Profile <span className="text-gray-500">Awaits</span></h2>
              <div className="mt-6 space-y-3">
                <Link href="/login" className="block">
                  <motion.button whileHover={{ scale: 1.02 }} className="w-full bg-[#BCE334] text-black py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-2">
                    Login to Account <ArrowRight size={14} />
                  </motion.button>
                </Link>
                <Link href="/admin-login">
                  <button className="mt-6 inline-flex items-center gap-2 px-8 py-2.5 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest bg-black text-[#BCE334]">
                    <ShieldCheck size={14} /> Admin Portal
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBE7]">
      <Header />
      <div className="flex-grow flex flex-col items-center p-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 text-center relative overflow-hidden">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image src={session?.user?.image || '/default-avatar.png'} alt="User" fill className="object-cover rounded-full border-4 border-[#BCE334]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-1">{session?.user?.name}</h2>
            <p className="text-sm text-gray-500 font-bold mb-6">{session?.user?.email}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={toggleOrders} whileHover={{ scale: 1.02 }} className="bg-[#BCE334] text-black px-8 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-2">
                <ShoppingBag size={14} /> {showOrders ? "Hide Orders" : "My Orders"}
              </motion.button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-black text-[#BCE334] px-8 py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg">Logout</button>
            </div>

            <AnimatePresence>
              {showOrders && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-8 pt-8 border-t border-gray-100 text-left">
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter mb-6 flex items-center gap-2"><Clock size={18} className="text-[#BCE334]" /> History</h3>
                  {isLoadingOrders ? (
                    <div className="py-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">Fetching...</div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {orders.map((order: any) => (
                        <div key={order._id} className="bg-[#F1F8E9] p-5 rounded-3xl border border-green-100 group transition-all">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] bg-black text-[#BCE334] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                              {/* FIXED: Targeting order_id and fallback */}
                              ID: {order.order_id || order._id?.toString().slice(-6).toUpperCase()}
                            </span>
                            <span className="text-xl font-black text-[#050BB3]">
                              {/* FIXED: Targeting totalCost instead of cost */}
                              ৳{order.totalCost || '0'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                            <div className="flex items-center gap-2"><CreditCard size={12} className="text-[#BCE334]" />{order.paymentType || 'COD'}</div>
                            <div className="flex items-center gap-2 justify-end"><Clock size={12} className="text-[#BCE334]" />{order.orderTime ? new Date(order.orderTime).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase">{order.itemsOrdered?.length || 0} Items Placed</p>
                            <button onClick={() => setSelectedOrder(order)} className="text-[10px] font-black text-black flex items-center gap-1 hover:text-[#BCE334] transition-colors">
                              VIEW DETAILS <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs font-black text-gray-400 uppercase">Your canvas is empty.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
      <Footer />
      <style jsx global>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #BCE334; border-radius: 10px; }`}</style>
    </div>
  );
}