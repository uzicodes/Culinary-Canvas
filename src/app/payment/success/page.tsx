"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  PackageCheck,
  Home,
  ShoppingBag
} from "lucide-react";
import Header from "@/components/Header";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Get order data FIRST before clearing
    const backendOrder = sessionStorage.getItem("lastOrderResponse");
    const savedOrder = window.localStorage.getItem("orderData");

    let orderData = null;

    if (backendOrder) {
      orderData = JSON.parse(backendOrder);
    } else if (savedOrder) {
      orderData = JSON.parse(savedOrder);
    }

    // Map SSLCommerz response fields to expected fields
    if (orderData) {
      const mappedOrder = {
        ...orderData,
        // Ensure total is mapped from various possible sources
        total: orderData.total || orderData.totalCost || orderData.total_amount || orderData.amount || 0,
        subtotal: orderData.subtotal || orderData.base_amount || 0,
        order_id: orderData.order_id || orderData.orderId || orderData.tran_id || '',
        orderId: orderData.orderId || orderData.order_id || orderData.tran_id || '',
        name: orderData.name || orderData.customerName || orderData.cus_name || '',
        email: orderData.email || orderData.customerEmail || orderData.cus_email || '',
        address: orderData.address || orderData.customerAddress || orderData.cus_add1 || '',
        phone: orderData.phone || orderData.customerPhone || orderData.cus_phone || '',
        orderItems: orderData.orderItems || orderData.itemsOrdered || [],
        itemsOrdered: orderData.itemsOrdered || orderData.orderItems || [],
      };
      setOrder(mappedOrder);
    }

    // Clear the cart AFTER reading order data - small delay to ensure data is set
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem('cart', '[]');
        window.localStorage.removeItem('checkoutData');
        window.localStorage.removeItem('cart');

        // Force update cart count in header
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('cartUpdated'));

        console.log('Cart cleared successfully');
      } catch (e) {
        console.error('Failed to clear cart:', e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    let y = 15;
    doc.setFontSize(20);
    doc.text("INVOICE", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.order_id || order.orderId || "-"}`, 15, y);
    doc.text(`Date: ${order.orderTime ? new Date(order.orderTime).toLocaleString() : "-"}`, 140, y);
    y += 10;
    doc.text(`Customer: ${order.name || "-"}`, 15, y);
    y += 7;
    doc.text(`Email: ${order.email || order.customerEmail || "-"}`, 15, y);
    y += 7;
    doc.text(`Phone: ${order.customerPhone || order.phone || order.mobileNumber || "-"}`, 15, y);
    y += 7;
    doc.text("Delivery Address:", 15, y);
    y += 7;
    const address = order.address || order.customerAddress || "-";
    const addressLines = address.split("\n");
    for (let i = 0; i < addressLines.length; i++) {
      doc.text(addressLines[i], 20, y);
      y += 7;
    }
    y += 3;
    doc.setFontSize(13);
    doc.text("Items Ordered:", 15, y);
    y += 7;
    doc.setFontSize(11);
    doc.setFillColor(230, 230, 230);
    doc.rect(15, y - 5, 180, 8, 'F');
    doc.text("Item", 18, y);
    doc.text("Qty", 90, y);
    doc.text("Price", 120, y);
    doc.text("Total", 160, y);
    y += 7;

    const items = order.orderItems || order.itemsOrdered || [];
    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        const itemName = typeof item === 'object' ? (item.name || "-") : String(item);
        doc.text(itemName, 18, y);
        doc.text(item.quantity ? String(item.quantity) : "-", 90, y);
        doc.text(item.price ? `Tk ${item.price.toFixed(2)}` : "-", 120, y);
        doc.text(item.price && item.quantity ? `Tk ${(item.price * item.quantity).toFixed(2)}` : "-", 160, y);
        y += 7;
      });
    }

    y += 5;
    doc.setFontSize(12);
    doc.text("Summary:", 15, y);
    y += 7;
    let delivery = order.deliveryMethod === "Priority" ? 60 : order.deliveryMethod === "Standard" ? 45 : 0;
    doc.text(order.deliveryMethod ? `Delivery: Tk ${delivery.toFixed(2)}` : "", 15, y);
    doc.text(order.tip !== undefined ? `Tip: Tk ${order.tip.toFixed(2)}` : "", 75, y);
    doc.text(order.subtotal !== undefined ? `Sub Total: Tk ${order.subtotal.toFixed(2)}` : "", 135, y);
    y += 7;
    if (order.total !== undefined) doc.text(`Total: Tk ${(Number(order.total || order.totalCost || order.total_amount || 0)).toFixed(2)}`, 15, y);
    y += 10;
    doc.setFontSize(10);
    doc.text("Thank you for your order!", 105, y, { align: "center" });
    doc.save(`#${order.order_id || order.orderId || "invoice"}.pdf`);
  };

  const expectedTime = (() => {
    if (order?.deliveryMethod) {
      const now = new Date();
      let addMinutes = order.deliveryMethod === 'Standard' ? 45 : order.deliveryMethod === 'Priority' ? 35 : 0;
      if (addMinutes > 0) {
        now.setMinutes(now.getMinutes() + addMinutes);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return '-';
  })();

  return (
    <div className="relative min-h-screen bg-[#F7FBE7] font-sans text-slate-900 pb-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-28 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Confirmation Section */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-lg border border-white text-center"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white rounded-full p-3 shadow-sm"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#6fcf97]" />
                </motion.div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 mb-1 uppercase">
                Order Confirmed
              </h1>
              <p className="text-slate-500 max-w-sm mx-auto mb-6 text-xs font-medium">
                Deliciousness is on the way! Confirmation sent to <span className="text-slate-800 font-bold">{order?.email || order?.customerEmail}</span>.
              </p>

              {/* Steps Tracker */}
              <div className="relative pt-6 pb-4 px-2 max-w-md mx-auto">
                <div className="absolute top-[36px] left-0 w-full h-1 bg-slate-200/50" />
                <div className="flex justify-between relative z-10">
                  {["Confirmed", "Kitchen", "Quality", "Route", "Here"].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-3 border-white shadow-sm ${idx === 0 ? 'bg-[#BCE334]' : 'bg-slate-200'}`}>
                        {idx === 0 ? <PackageCheck className="w-3.5 h-3.5 text-slate-900" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                      </div>
                      <span className={`text-[8px] mt-2 font-black uppercase tracking-widest ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="bg-black text-[#BCE334] px-8 py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Home size={14} /> Back to Home
                </Link>
                <Link
                  href="/all-items"
                  className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} /> Continue Shopping
                </Link>
              </div>
            </motion.div>

            {/* Arrival Status Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#BCE334]/10 p-2.5 rounded-xl">
                  <Clock className="text-slate-900 w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Expected At</p>
                  <p className="text-lg font-black text-slate-800 tracking-tight">{expectedTime}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-slate-900 font-black text-[9px] uppercase tracking-widest hover:gap-3 transition-all">
                Track Live <ChevronRight size={12} />
              </button>
            </motion.div>
          </div>

          {/* Receipt Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-black rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start mb-6">
                <Image src="/without_BG_logo.png" alt="Logo" width={45} height={45} className="object-contain" />
                <button
                  onClick={handleDownloadInvoice}
                  className="bg-[#BCE334] p-2.5 rounded-xl text-black hover:rotate-12 transition-all shadow-lg"
                >
                  <Download size={16} />
                </button>
              </div>
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#BCE334]/60 mb-0.5">Receipt ID</p>
                <h2 className="text-2xl font-black text-white tracking-tighter">#{order?.order_id || order?.orderId || "------"}</h2>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#BCE334]/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-5">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-slate-50 p-1.5 h-fit rounded-lg text-slate-400"><MapPin size={16} /></div>
                  <div className="text-left">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deliver To</h4>
                    <p className="text-xs font-bold text-slate-700 leading-snug mt-0.5">{order?.address || order?.customerAddress}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-5">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">Bill Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Items Subtotal</span>
                    <span className="text-slate-800">৳{(Number(order?.subtotal || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Delivery ({order?.deliveryMethod})</span>
                    <span className="text-slate-800">৳{order?.deliveryMethod === "Priority" ? "60.00" : "45.00"}</span>
                  </div>
                  {(Number(order?.tip || 0) > 0) && (
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Extra Tip</span>
                      <span className="text-green-600 font-bold">৳{(Number(order?.tip || 0)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black border-t-2 border-slate-100 pt-4 mt-4">
                    <span className="tracking-tighter">TOTAL</span>
                    <span className="text-slate-900 tracking-tighter">৳{(Number(order?.total || order?.totalCost || order?.total_amount || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}