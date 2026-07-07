'use client'

import { useState, useEffect } from 'react'
import { m as motion } from "framer-motion"
// FIXED: Changed ReceiptText to Receipt
import { X, Clock, CreditCard, ShoppingBag, Receipt } from 'lucide-react'

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface MenuItem {
  _id?: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  order_id?: string;
  totalCost: number; // Matches DB
  paymentType: string;
  orderTime: string; // Matches DB
  itemsOrdered: OrderItem[];
}

interface ModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: ModalProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items once on mount to look up prices for old orders
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu items', err);
      }
    };
    fetchMenuItems();
  }, []);

  // Helper function to find item price by name
  const getItemPrice = (itemName: string): number => {
    const menuItem = menuItems.find(
      (m) => m.name.toLowerCase() === itemName.toLowerCase()
    );
    return menuItem?.price || 0;
  };

  if (!order) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black p-6 text-center relative">
          <button aria-label="Close" type="button" onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-[#BCE334] transition-colors">
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-[#BCE334]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Receipt className="text-[#BCE334] w-8 h-8" />
          </div>
          <h3 className="text-[#BCE334] font-black uppercase tracking-tighter text-xl">Order Receipt</h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-widest">
            ID: {order.order_id || order._id?.toString().slice(-6).toUpperCase()}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg"><Clock size={14} className="text-gray-400" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Ordered At</p>
                <p className="text-xs font-bold text-gray-900">
                  {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end text-right">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Payment Method</p>
                <p className="text-xs font-bold text-gray-900 uppercase">{order.paymentType || 'COD'}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg"><CreditCard size={14} className="text-gray-400" /></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={14} className="text-[#BCE334]" />
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Items Purchased</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {order.itemsOrdered?.map((item: any, idx: number) => {
                // Handle both old format (string) and new format (object)
                const isStringItem = typeof item === 'string';
                const itemName = isStringItem ? item : (item.name || 'Unknown Item');
                const itemQuantity = isStringItem ? 1 : (item.quantity || 1);
                // For old orders (string), look up price from menu items
                const itemPrice = isStringItem ? getItemPrice(itemName) : (item.price || 0);
                const itemTotal = itemPrice * itemQuantity;

                return (
                  <div key={isStringItem ? item + idx : (item._id || item.name || idx)} className="flex justify-between items-center bg-[#F7FBE7]/50 p-4 rounded-2xl border border-green-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black text-[#BCE334] rounded-xl flex items-center justify-center text-xs font-black">{itemQuantity}x</div>
                      <p className="text-sm font-bold text-gray-900">{itemName}</p>
                    </div>
                    <p className="text-sm font-black text-black">৳{itemTotal}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-0 bg-[#BCE334] blur-2xl opacity-10 rounded-full" />
            <div className="relative bg-black rounded-[1.5rem] p-5 flex justify-between items-center shadow-xl">
              <span className="text-[#BCE334] font-black uppercase text-xs tracking-widest">Final Amount</span>
              <span className="text-[#BCE334] font-black text-2xl tracking-tighter">৳{order.totalCost}</span>
            </div>
          </div>
        </div>
        <button aria-label="Close" type="button" onClick={onClose} className="w-full py-5 bg-gray-50 hover:bg-gray-100 font-black uppercase text-[10px] tracking-widest text-gray-500 transition-colors border-t border-gray-100">
          Close Receipt
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsModal;