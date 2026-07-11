"use client";

import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Users, BarChart3, Calendar as CalendarIcon, 
  X, ArrowLeft, Eye, Lock, Loader2, 
  ShoppingBag, MapPin, Mail, Clock, Phone, UserCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

interface MemberData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string | null;
  createdAt?: string;
}

export default function AnalyticsPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Members panel state
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [stats, setStats] = useState<any>({
    monthlyRevenue: 0, todayRevenue: 0, totalCustomers: 0, 
    specificDayRevenue: 0, recentOrders: [] 
  });

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonthCount = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  const fetchAnalytics = async (day?: number) => {
    setIsLoading(true);
    try {
      const url = day ? `/api/admin/analytics?day=${day}` : '/api/admin/analytics';
      const res = await fetch(url);
      const json = await res.json();
      setStats(json);
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch('/api/admin/analytics?members=true');
      const json = await res.json();
      if (json.members) {
        setMembers(json.members);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleToggleMembers = () => {
    if (!showMembers && members.length === 0) {
      fetchMembers();
    }
    setShowMembers(!showMembers);
  };

  useEffect(() => {
    fetchAnalytics(selectedDate ?? undefined);
  }, [selectedDate]);

  const toggleOrderDetails = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const DISPLAY_STATS = [
    { 
      id: 'daily-revenue',
      label: selectedDate ? `Revenue: ${currentMonthName.slice(0,3)} ${selectedDate}` : "Today's Revenue", 
      value: `৳${(selectedDate ? (stats?.specificDayRevenue || 0) : (stats?.todayRevenue || 0)).toLocaleString()}`, 
      trend: selectedDate ? "Filtered" : "Live", 
      icon: CalendarIcon, 
      color: "bg-[#BCE334]/10",
      isInteractive: true 
    },
    { 
      id: 'monthly-revenue',
      label: `${currentMonthName} Total`, 
      value: `৳${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
      trend: `Current Month`, 
      icon: DollarSign, 
      color: "bg-white" 
    },
    { 
      id: 'total-customers',
      label: "Total Customers", 
      value: (stats?.totalCustomers || 0).toString(), 
      trend: "Verified", 
      icon: Users, 
      color: "bg-white",
      isCustomerCard: true
    },
    { 
      id: 'avg-order',
      label: "Avg. Order Value", 
      value: stats?.totalCustomers > 0 ? `৳${Math.round((stats?.monthlyRevenue || 0) / (stats?.recentOrders?.length || 1))}` : "৳0", 
      trend: "Live", 
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
            <Link href="/admin/dashboard" className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-black hover:text-[#BCE334]"><ArrowLeft size={18} /></Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Business <span className="text-[#BCE334]">Analytics</span></h1>
              {isLoading && <Loader2 className="animate-spin text-[#BCE334] w-5 h-5" />}
            </div>
          </div>
          {selectedDate && (
            <button aria-label="Clear date filter" type="button" onClick={handleClearFilter} className="px-6 py-3 bg-black text-[#BCE334] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all"><X size={14} /> Clear</button>
          )}
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DISPLAY_STATS.map((stat: any) => (
            <div 
              key={stat.id} 
              onClick={() => stat.isInteractive && setShowCalendar(!showCalendar)} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stat.isInteractive && setShowCalendar(!showCalendar); } }} 
              tabIndex={stat.isInteractive ? 0 : undefined} 
              role={stat.isInteractive ? "button" : undefined} 
              className={`${stat.color} p-6 rounded-[2.5rem] border ${stat.isInteractive ? 'border-[#BCE334] cursor-pointer' : 'border-gray-100'} shadow-sm relative transition-all group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.isInteractive ? 'bg-[#BCE334] text-black' : 'bg-gray-50 text-slate-900'}`}><stat.icon size={22} /></div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isInteractive ? 'bg-black text-[#BCE334]' : 'bg-green-50 text-green-600'}`}>{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{stat.value}</h3>
              
              {/* View All Members button on the Customers card */}
              {stat.isCustomerCard && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); handleToggleMembers(); }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-[#BCE334] rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                >
                  <Users size={12} />
                  {showMembers ? 'Hide Members' : 'View All Members'}
                  <ChevronRight size={10} className={`transition-transform ${showMembers ? 'rotate-90' : ''}`} />
                </motion.button>
              )}
            </div>
          ))}
        </div>

        {/* Members Panel */}
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#BCE334] rounded-2xl">
                      <Users size={18} className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter">All Members</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{members.length} registered users</p>
                    </div>
                  </div>
                  <button
                    aria-label="Close members panel"
                    type="button"
                    onClick={() => setShowMembers(false)}
                    className="p-2.5 bg-gray-50 rounded-xl hover:bg-black hover:text-[#BCE334] transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-[#BCE334] w-8 h-8" />
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xs font-black text-gray-400 uppercase">No members found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {members.map((member) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#fafaf9] p-5 rounded-2xl border border-gray-100 hover:border-[#BCE334]/30 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shadow-lg flex-shrink-0">
                            {member.profilePicture ? (
                              <Image
                                src={member.profilePicture}
                                alt={member.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-gray-800">
                                <span className="text-sm font-black text-[#BCE334]">{getInitials(member.name)}</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-slate-900 truncate">{member.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Mail size={10} className="text-[#BCE334] flex-shrink-0" />
                              <p className="text-[10px] font-bold text-gray-500 truncate">{member.email}</p>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <Phone size={10} className="text-[#BCE334] flex-shrink-0" />
                                <p className="text-[10px] font-bold text-gray-500">{member.phone}</p>
                              </div>
                            )}
                            {member.createdAt && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <Clock size={10} className="text-gray-300 flex-shrink-0" />
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                  Joined {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Picker */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center mb-10">
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#BCE334]/30 shadow-2xl w-full max-w-sm">
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => {
                    const isFuture = day > currentDay;
                    return (
                      <button aria-label="Button" type="button" key={day} disabled={isFuture} onClick={() => { setSelectedDate(day); setShowCalendar(false); }} className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all ${selectedDate === day ? 'bg-black text-[#BCE334]' : isFuture ? 'opacity-20 cursor-not-allowed' : 'bg-gray-50 text-gray-500 hover:bg-[#BCE334] hover:text-black'}`}>
                        {isFuture ? <Lock size={10} /> : day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order History Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
          {/* Table header with filter status */}
          {selectedDate && (
            <div className="bg-black px-8 py-4 flex items-center justify-between">
              <p className="text-[10px] font-black text-[#BCE334] uppercase tracking-widest">
                Showing orders for {currentMonthName} {selectedDate}, {currentYear}
              </p>
              <button
                aria-label="Clear date filter"
                type="button"
                onClick={handleClearFilter}
                className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-[#BCE334] transition-colors flex items-center gap-1.5"
              >
                <X size={10} /> Clear Filter
              </button>
            </div>
          )}

          {isLoading && <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#BCE334] w-10 h-10" /></div>}
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#BCE334] text-[9px] font-black text-black uppercase tracking-widest">
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Bill (৳)</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders?.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      {selectedDate ? `No orders found for ${currentMonthName} ${selectedDate}` : 'No orders yet'}
                    </p>
                  </td>
                </tr>
              )}
              {stats.recentOrders?.map((order: any) => (
                <React.Fragment key={order._id}>
                  <tr className={`hover:bg-gray-50 transition-colors ${expandedOrderId === order._id ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-8 py-6 text-xs font-black">{order.order_id || "N/A"}</td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-gray-800 block">{order.name}</span>
                      <span className="text-[9px] text-gray-400 uppercase font-black">{new Date(order.orderTime).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-black">৳{(order.totalCost || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border ${order.paymentType === 'cod' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'}`}>{order.paymentType || "Paid"}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button aria-label="View order details" type="button" onClick={() => toggleOrderDetails(order._id)} className={`p-2.5 rounded-xl transition-all ${expandedOrderId === order._id ? 'bg-black text-[#BCE334]' : 'bg-gray-50 text-gray-400 hover:text-black'}`}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Detailed View Section */}
                  <AnimatePresence>
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan={5} className="p-0 border-none bg-gray-50/30">
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100">
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Info</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700"><Mail size={14} className="text-[#BCE334]" /> {order.email}</div>
                                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700"><MapPin size={14} className="text-[#BCE334]" /> {order.address || "Not Provided"}</div>
                                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700"><Clock size={14} className="text-[#BCE334]" /> {new Date(order.orderTime).toLocaleTimeString()}</div>
                                </div>
                              </div>
                              <div className="md:col-span-2 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items Ordered ({order.itemsOrdered?.length || 0})</h4>
                                <div className="flex flex-wrap gap-2">
                                  {order.itemsOrdered?.map((item: any, idx: number) => (
                                    <div key={typeof item === 'string' ? item + idx : (item._id || item.name || idx)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                      <ShoppingBag size={12} className="text-[#BCE334]" />
                                      <span className="text-xs font-black uppercase tracking-tighter text-slate-800">{typeof item === 'string' ? item : item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #BCE334; border-radius: 10px; }
      `}</style>
    </div>
  );
}