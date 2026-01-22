"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Users, BarChart3, Calendar as CalendarIcon, 
  X, ArrowLeft, Eye, Lock, Download, Loader2
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AnalyticsPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<any>({
    monthlyRevenue: 0, todayRevenue: 0, totalCustomers: 0, 
    specificDayRevenue: 0, recentOrders: [] 
  });

  const today = new Date();
  const currentDay = today.getDate(); 
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const fetchAnalytics = async (day?: number) => {
    setIsLoading(true);
    try {
      const url = day ? `/api/admin/analytics?day=${day}` : '/api/admin/analytics';
      const res = await fetch(url);
      if (!res.ok) throw new Error("API Response Error");
      const json = await res.json();
      setStats(json);
    } catch (error) {
      console.error("UI Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);
  useEffect(() => { if (selectedDate) fetchAnalytics(selectedDate); }, [selectedDate]);

  const DISPLAY_STATS = [
    { 
      label: selectedDate ? `Revenue: ${currentMonthName.slice(0,3)} ${selectedDate}` : "Today's Revenue", 
      value: `৳${(selectedDate ? (stats?.specificDayRevenue || 0) : (stats?.todayRevenue || 0)).toLocaleString()}`, 
      trend: selectedDate ? "Filtered" : "Live", 
      icon: CalendarIcon, 
      color: "bg-[#BCE334]/10",
      isInteractive: true 
    },
    { 
      label: `${currentMonthName} Total`, 
      value: `৳${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
      trend: `Current Month`, 
      icon: DollarSign, 
      color: "bg-white" 
    },
    { 
      label: "Total Customers", 
      value: (stats?.totalCustomers || 0).toString(), 
      trend: "Count", 
      icon: Users, 
      color: "bg-white" 
    },
    { 
      label: "Avg. Order Value", 
      value: stats?.totalCustomers > 0 ? `৳${Math.round((stats?.monthlyRevenue || 0) / stats.totalCustomers)}` : "৳0", 
      trend: "Month", 
      icon: BarChart3, 
      color: "bg-white" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 font-sans text-left">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-32">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"><ArrowLeft size={18} /></Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Business <span className="text-[#BCE334]">Analytics</span></h1>
              {isLoading && <Loader2 className="animate-spin text-[#BCE334] w-5 h-5" />}
            </div>
          </div>
          {selectedDate && (
            <button onClick={() => { setSelectedDate(null); fetchAnalytics(); }} className="px-6 py-3 bg-black text-[#BCE334] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all hover:scale-105"><X size={14} /> Clear</button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DISPLAY_STATS.map((stat, i) => (
            <div key={i} onClick={() => stat.isInteractive && setShowCalendar(!showCalendar)} className={`${stat.color} p-6 rounded-[2.5rem] border ${stat.isInteractive ? 'border-[#BCE334] cursor-pointer' : 'border-gray-100'} shadow-sm relative transition-all`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.isInteractive ? 'bg-[#BCE334] text-black' : 'bg-gray-50 text-slate-900'}`}><stat.icon size={22} /></div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isInteractive ? 'bg-black text-[#BCE334]' : 'bg-green-50 text-green-600'}`}>{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showCalendar && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center mb-10">
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#BCE334]/30 shadow-2xl w-full max-w-sm">
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => {
                    const isFuture = day > currentDay;
                    return (
                      <button key={day} disabled={isFuture} onClick={() => { setSelectedDate(day); setShowCalendar(false); }} className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all ${selectedDate === day ? 'bg-black text-[#BCE334]' : isFuture ? 'opacity-20 cursor-not-allowed' : 'bg-gray-50 text-gray-500 hover:bg-[#BCE334] hover:text-black'}`}>
                        {isFuture ? <Lock size={10} /> : day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
          {isLoading && <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#BCE334] w-10 h-10" /></div>}
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest"><th className="px-8 py-6">Order ID</th><th className="px-8 py-6">Customer</th><th className="px-8 py-6">Bill (৳)</th><th className="px-8 py-6">Payment</th><th className="px-8 py-6 text-right">View</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders?.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 text-xs font-black">{order.order_id || order.orderId}</td>
                  <td className="px-8 py-6"><span className="text-xs font-bold text-gray-800 block">{order.name}</span><span className="text-[9px] text-gray-400 uppercase font-black">{new Date(order.orderTime).toLocaleDateString()}</span></td>
                  <td className="px-8 py-6 text-xs font-black">{(order.totalCost || 0).toLocaleString()}</td>
                  <td className="px-8 py-6"><span className={`text-[8px] font-black px-4 py-1.5 rounded-full border ${order.paymentType === 'cod' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>{order.paymentType || "Paid"}</span></td>
                  <td className="px-8 py-6 text-right"><Eye size={16} className="text-gray-300 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}