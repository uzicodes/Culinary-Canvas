"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  Calendar as CalendarIcon, 
  X,
  ArrowLeft,
  Eye,
  Lock,
  Download,
  Loader2,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AnalyticsPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for real-time data from MongoDB
  const [stats, setStats] = useState<any>({
    monthlyRevenue: 0,
    todayRevenue: 0,
    totalCustomers: 0, // This now reflects the 'members' collection
    specificDayRevenue: 0,
    recentOrders: [] 
  });

  const today = new Date();
  const currentDay = today.getDate(); // Today is Jan 22
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  // Handle various month lengths (30, 31, 28 days)
  const daysInMonthCount = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAnalytics(selectedDate);
    }
  }, [selectedDate]);

  const DISPLAY_STATS = [
    { 
      // This card handles Daily logic and the Calendar toggle
      label: selectedDate ? `Revenue: ${currentMonthName.slice(0,3)} ${selectedDate}` : "Today's Revenue", 
      value: `৳${(selectedDate ? (stats?.specificDayRevenue || 0) : (stats?.todayRevenue || 0)).toLocaleString()}`, 
      trend: selectedDate ? "Filtered" : "Live", 
      icon: CalendarIcon, 
      color: "bg-[#BCE334]/10",
      isInteractive: true 
    },
    { 
      // Always shows total month calculation
      label: `${currentMonthName} Total`, 
      value: `৳${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
      trend: `Upto ${currentDay}`, 
      icon: DollarSign, 
      color: "bg-white" 
    },
    { 
      // Reflects successful account creations from 'members' collection
      label: "Total Customers", 
      value: (stats?.totalCustomers || 0).toString(), 
      trend: "Verified", 
      icon: Users, 
      color: "bg-white" 
    },
    { 
      label: "Avg. Order Value", 
      value: stats?.totalCustomers > 0 
        ? `৳${Math.round((stats?.monthlyRevenue || 0) / (stats?.recentOrders?.length || 1))}` 
        : "৳0", 
      trend: "Month", 
      icon: BarChart3, 
      color: "bg-white" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 font-sans text-left">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-32">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="p-3 bg-white rounded-2xl border border-gray-100 hover:bg-black hover:text-[#BCE334] transition-all shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black uppercase tracking-tighter">Business <span className="text-[#BCE334]">Analytics</span></h1>
                  {isLoading && <Loader2 className="animate-spin text-[#BCE334] w-5 h-5" />}
                </div>
            </div>
            {selectedDate && (
                <button 
                    onClick={() => { setSelectedDate(null); fetchAnalytics(); }}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-[#BCE334] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                    <X size={14} /> Clear Selection
                </button>
            )}
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DISPLAY_STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => stat.isInteractive && setShowCalendar(!showCalendar)}
              className={`${stat.color} p-6 rounded-[2.5rem] border ${stat.isInteractive ? 'border-[#BCE334] cursor-pointer hover:shadow-lg' : 'border-gray-100'} shadow-sm relative transition-all group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.isInteractive ? 'bg-[#BCE334] text-black' : 'bg-gray-50 text-slate-900'}`}>
                    <stat.icon size={22} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isInteractive ? 'bg-black text-[#BCE334]' : 'bg-green-50 text-green-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-1">
                {stat.value}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Compact Date Selection */}
        <AnimatePresence>
            {showCalendar && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center mb-10">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-[#BCE334]/30 shadow-2xl w-full max-w-sm">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">{currentMonthName} {currentYear}</span>
                            <button onClick={() => setShowCalendar(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map((day) => {
                                const isFuture = day > currentDay; 
                                return (
                                    <button
                                        key={day}
                                        disabled={isFuture}
                                        onClick={() => { setSelectedDate(day); setShowCalendar(false); }}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all relative
                                            ${selectedDate === day ? 'bg-black text-[#BCE334] shadow-lg scale-110' : isFuture ? 'bg-gray-50 text-gray-200 cursor-not-allowed opacity-50' : 'bg-gray-50 text-gray-500 hover:bg-[#BCE334] hover:text-black hover:scale-105'}`}
                                    >
                                        {isFuture ? <Lock size={10} /> : day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Real-time Order Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black uppercase tracking-tighter">Order History Log</h2>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                    <Download size={14} /> Export CSV
                </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#BCE334] w-10 h-10" />
                  </div>
                )}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-6 text-left">Order ID</th>
                            <th className="px-8 py-6 text-left">Customer</th>
                            <th className="px-8 py-6 text-left">Bill (৳)</th>
                            <th className="px-8 py-6 text-left">Payment</th>
                            <th className="px-8 py-6 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {stats.recentOrders?.map((order: any) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6 text-xs font-black">{order.order_id || order.orderId}</td>
                                <td className="px-8 py-6 text-left">
                                    <span className="text-xs font-bold text-gray-800 block">{order.name}</span>
                                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                                        {new Date(order.orderTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-xs font-black text-slate-700">{(order.totalCost || 0).toLocaleString()}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${order.paymentType === 'cod' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                      {order.paymentType || "Online"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-black hover:bg-[#BCE334] transition-all"><Eye size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="space-y-6">
              <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#BCE334] mb-10">Sales Attribution</h3>
                  <div className="space-y-10 relative z-10">
                      {[{ name: "Burgers", pct: 85 }, { name: "Pizza", pct: 60 }, { name: "Set Menu", pct: 45 }].map((cat, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-xs font-black uppercase mb-3">
                                  <span>{cat.name}</span>
                                  <span className="text-[#BCE334]">{cat.pct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} className="h-full bg-[#BCE334]" />
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#BCE334]/5 rounded-full blur-3xl" />
              </div>

              <div className="bg-[#BCE334] p-8 rounded-[2.5rem] shadow-lg flex items-center justify-between group cursor-pointer transition-transform hover:scale-[1.02]">
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/60">Generate Report</p>
                      <h4 className="text-lg font-black text-black tracking-tighter uppercase">Quarterly Review</h4>
                  </div>
                  <div className="bg-black p-3 rounded-2xl text-[#BCE334] group-hover:rotate-12 transition-transform"><TrendingUp size={20} /></div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}