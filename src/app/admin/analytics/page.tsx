"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  Calendar as CalendarIcon, 
  X,
  ArrowLeft,
  Eye,
  Lock
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AnalyticsPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Logic for Real-Time Date Constraint
  const today = new Date();
  const currentDay = today.getDate(); // Today is 22
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const getRevenueForDate = (day: number) => (day * 450 + 8000).toLocaleString();

  const STATS = [
    { label: "Today's Revenue", value: "৳12,450", trend: "+14%", icon: DollarSign, color: "bg-white" },
    { 
      label: "Monthly Revenue", 
      value: selectedDate ? `৳${getRevenueForDate(selectedDate)}` : "৳384,200", 
      trend: selectedDate ? `Jan ${selectedDate}` : "+8%", 
      icon: CalendarIcon, 
      color: "bg-[#BCE334]/10",
      isInteractive: true 
    },
    { label: "Total Customers", value: "1,240", trend: "+22%", icon: Users, color: "bg-white" },
    { label: "Avg. Order Value", value: "৳850", trend: "-2%", icon: BarChart3, color: "bg-white" },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20 font-sans text-left">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-32">
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="p-3 bg-white rounded-2xl border border-gray-100 hover:bg-black hover:text-[#BCE334] transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Business <span className="text-[#BCE334]">Analytics</span></h1>
            </div>
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-[#BCE334] rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                    <X size={14} /> Reset to Monthly
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => stat.isInteractive && setShowCalendar(!showCalendar)}
              className={`${stat.color} p-6 rounded-[2.5rem] border ${stat.isInteractive ? 'border-[#BCE334] cursor-pointer hover:shadow-md' : 'border-gray-100'} shadow-sm relative transition-all`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.isInteractive ? 'bg-[#BCE334] text-black' : 'bg-gray-50 text-slate-900'}`}>
                    <stat.icon size={22} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-black text-[#BCE334]'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{stat.value}</h3>
              {stat.isInteractive && !selectedDate && <div className="absolute top-3 right-3 w-2 h-2 bg-[#BCE334] rounded-full animate-ping" />}
            </motion.div>
          ))}
        </div>

        {/* COMPACT REAL-TIME CONSTRAINED CALENDAR */}
        <AnimatePresence>
            {showCalendar && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center mb-10"
                >
                    <div className="bg-white p-5 rounded-[2rem] border border-[#BCE334]/30 shadow-2xl w-full max-w-sm">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="font-black uppercase tracking-widest text-[10px] text-gray-400">
                                {currentMonthName} {currentYear}
                            </span>
                            <button onClick={() => setShowCalendar(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {daysInMonth.map((day) => {
                                const isFuture = day > currentDay; // Block dates after 22
                                return (
                                    <button
                                        key={day}
                                        disabled={isFuture}
                                        onClick={() => {
                                            setSelectedDate(day);
                                            setShowCalendar(false);
                                        }}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all relative group
                                            ${selectedDate === day 
                                                ? 'bg-black text-[#BCE334] shadow-lg' 
                                                : isFuture 
                                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                    : 'bg-gray-50 text-gray-500 hover:bg-[#BCE334] hover:text-black'
                                            }`}
                                    >
                                        {isFuture ? <Lock size={10} className="opacity-40" /> : day}
                                        
                                        {/* Tooltip for future dates */}
                                        {isFuture && (
                                            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[8px] px-2 py-1 rounded-md whitespace-nowrap">
                                                No data yet
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Order Log Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tighter px-2">
                {selectedDate ? `Log for Jan ${selectedDate}` : "Complete Order History"}
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Order ID</th>
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Amount</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[1, 2, 3].map((_, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-5 text-xs font-black">#88{idx}4</td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-bold text-gray-800 block">Verified Customer</span>
                                    <span className="text-[9px] text-gray-400 uppercase font-black">Jan {selectedDate || '22'}</span>
                                </td>
                                <td className="px-8 py-5 text-xs font-black">৳1,450</td>
                                <td className="px-8 py-5">
                                    <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">Paid</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-black hover:bg-[#BCE334] transition-all">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="space-y-6">
              <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#BCE334] mb-8">Revenue Attribution</h3>
                  <div className="space-y-8">
                      {["Burgers", "Pizza", "Coffee"].map((cat, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                  <span>{cat}</span>
                                  <span className="text-[#BCE334]">{80 - (i*15)}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${80 - (i*15)}%` }} className="h-full bg-[#BCE334]" />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}