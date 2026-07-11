"use client";

import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Users, BarChart3, Calendar as CalendarIcon, 
  X, ArrowLeft, Eye, Lock, Loader2, 
  ShoppingBag, MapPin, Mail, Clock, Phone, ChevronRight,
  Sun, Moon
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
  const [darkMode, setDarkMode] = useState(false);
  
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

  // ── Dark mode token map ────────────────────────────────────────
  const dm = darkMode;
  const t = {
    pageBg: dm ? 'bg-[#0f0f0f]' : 'bg-[#fafaf9]',
    cardBg: dm ? 'bg-[#1a1a1a]' : 'bg-white',
    cardBorder: dm ? 'border-[#2a2a2a]' : 'border-gray-100',
    cardHover: dm ? 'hover:bg-[#222]' : 'hover:bg-gray-50',
    text: dm ? 'text-gray-100' : 'text-slate-900',
    textMuted: dm ? 'text-gray-500' : 'text-gray-400',
    textSub: dm ? 'text-gray-400' : 'text-gray-500',
    textBody: dm ? 'text-gray-300' : 'text-gray-800',
    textBodySub: dm ? 'text-gray-400' : 'text-slate-700',
    iconBg: dm ? 'bg-[#252525] text-gray-300' : 'bg-gray-50 text-slate-900',
    panelBg: dm ? 'bg-[#151515]' : 'bg-white',
    panelItemBg: dm ? 'bg-[#1a1a1a]' : 'bg-[#fafaf9]',
    badgeBg: dm ? 'bg-[#1a2e05] text-[#BCE334]' : 'bg-green-50 text-green-600',
    overlayBg: dm ? 'bg-[#0f0f0f]/60' : 'bg-white/40',
    calBg: dm ? 'bg-[#1a1a1a]' : 'bg-white',
    calDayBg: dm ? 'bg-[#252525] text-gray-400' : 'bg-gray-50 text-gray-500',
    tableDivide: dm ? 'divide-[#252525]' : 'divide-gray-50',
    expandedBg: dm ? 'bg-[#151515]' : 'bg-gray-50/30',
    expandedBorder: dm ? 'border-[#2a2a2a]' : 'border-gray-100',
    expandedItemBg: dm ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-100',
    codBadge: dm ? 'bg-orange-950 text-orange-400 border-orange-900' : 'bg-orange-50 text-orange-600 border-orange-100',
    paidBadge: dm ? 'bg-green-950 text-green-400 border-green-900' : 'bg-green-50 text-green-600 border-green-100',
    backBtn: dm ? 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300' : 'bg-white border-gray-100',
    eyeBtn: dm ? 'bg-[#252525] text-gray-400 hover:text-white' : 'bg-gray-50 text-gray-400 hover:text-black',
    closeBtn: dm ? 'bg-[#252525] hover:bg-[#BCE334] hover:text-black text-gray-400' : 'bg-gray-50 hover:bg-black hover:text-[#BCE334]',
    revenueCardBg: dm ? 'bg-[#1a2e05]/40' : 'bg-[#BCE334]/10',
  };

  const DISPLAY_STATS = [
    { 
      id: 'daily-revenue',
      label: selectedDate ? `Revenue: ${currentMonthName.slice(0,3)} ${selectedDate}` : "Today's Revenue", 
      value: `৳${(selectedDate ? (stats?.specificDayRevenue || 0) : (stats?.todayRevenue || 0)).toLocaleString()}`, 
      trend: selectedDate ? "Filtered" : "Live", 
      icon: CalendarIcon, 
      isInteractive: true 
    },
    { 
      id: 'monthly-revenue',
      label: `${currentMonthName} Total`, 
      value: `৳${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
      trend: `Current Month`, 
      icon: DollarSign
    },
    { 
      id: 'total-customers',
      label: "Total Customers", 
      value: (stats?.totalCustomers || 0).toString(), 
      icon: Users
    },
    { 
      id: 'avg-order',
      label: "Avg. Order Value", 
      value: stats?.totalCustomers > 0 ? `৳${Math.round((stats?.monthlyRevenue || 0) / (stats?.recentOrders?.length || 1))}` : "৳0", 
      icon: BarChart3
    },
  ];

  return (
    <div className={`min-h-screen ${t.pageBg} pb-20 font-sans text-left transition-colors duration-300`}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-32">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className={`p-3 ${t.backBtn} rounded-2xl border shadow-sm transition-all hover:bg-black hover:text-[#BCE334]`}><ArrowLeft size={18} /></Link>
            <div className="flex items-center gap-3">
              <h1 className={`text-3xl font-black uppercase tracking-tighter ${t.text}`}>Business <span className="text-[#BCE334]">Analytics</span></h1>
              {isLoading && <Loader2 className="animate-spin text-[#BCE334] w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Compact Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {DISPLAY_STATS.map((stat: any) => {
            const isRevenue = stat.id === 'daily-revenue';
            const cardBg = isRevenue ? t.revenueCardBg : t.cardBg;
            const cardBorder = isRevenue ? 'border-[#BCE334]' : t.cardBorder;

            return (
              <div 
                key={stat.id} 
                onClick={() => stat.isInteractive && setShowCalendar(!showCalendar)} 
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stat.isInteractive && setShowCalendar(!showCalendar); } }} 
                tabIndex={stat.isInteractive ? 0 : undefined} 
                role={stat.isInteractive ? "button" : undefined} 
                className={`${cardBg} px-5 py-4 rounded-2xl border ${cardBorder} ${stat.isInteractive ? 'cursor-pointer' : ''} shadow-sm relative transition-all group`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.isInteractive ? 'bg-[#BCE334] text-black' : t.iconBg}`}><stat.icon size={16} /></div>
                  
                  {/* Total Customers: compact members toggle */}
                  {stat.id === 'total-customers' ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleMembers(); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black text-[#BCE334] text-[9px] font-black uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                      <Users size={10} />
                      {showMembers ? 'Hide' : 'View All'}
                      <ChevronRight size={8} className={`transition-transform ${showMembers ? 'rotate-90' : ''}`} />
                    </button>
                  ) : stat.id === 'avg-order' ? (
                    /* Avg Order Value: dark/light mode toggle */
                    <button
                      type="button"
                      aria-label="Toggle dark mode"
                      onClick={(e) => { e.stopPropagation(); setDarkMode(!darkMode); }}
                      className={`p-2 rounded-xl transition-all ${dm ? 'bg-[#BCE334] text-black hover:bg-[#d4f542]' : 'bg-black text-[#BCE334] hover:bg-gray-800'}`}
                    >
                      {dm ? <Sun size={12} /> : <Moon size={12} />}
                    </button>
                  ) : stat.trend ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-black text-[#BCE334]">{stat.trend}</span>
                      {/* Small red clear filter button under Filtered badge */}
                      {stat.id === 'daily-revenue' && selectedDate && (
                        <button
                          type="button"
                          aria-label="Clear filter"
                          onClick={(e) => { e.stopPropagation(); handleClearFilter(); }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500 text-white text-[8px] font-black uppercase tracking-wider hover:bg-red-600 transition-colors"
                        >
                          <X size={8} /> Clear
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
                <p className={`text-[9px] font-black ${t.textMuted} uppercase tracking-widest`}>{stat.label}</p>
                <h3 className={`text-xl font-black ${t.text} tracking-tighter mt-0.5`}>{stat.value}</h3>
              </div>
            );
          })}
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
              <div className={`${t.panelBg} rounded-[2.5rem] border ${t.cardBorder} shadow-sm p-8 relative transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#BCE334] rounded-2xl">
                      <Users size={18} className="text-black" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-black uppercase tracking-tighter ${t.text}`}>All Members</h3>
                      <p className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-widest`}>{members.length} registered users</p>
                    </div>
                  </div>
                  <button
                    aria-label="Close members panel"
                    type="button"
                    onClick={() => setShowMembers(false)}
                    className={`p-2.5 rounded-xl transition-all ${t.closeBtn}`}
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
                    <p className={`text-xs font-black ${t.textMuted} uppercase`}>No members found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {members.map((member) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${t.panelItemBg} p-5 rounded-2xl border ${t.cardBorder} hover:border-[#BCE334]/30 transition-all group`}
                      >
                        <div className="flex items-start gap-4">
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
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-black ${t.text} truncate`}>{member.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Mail size={10} className="text-[#BCE334] flex-shrink-0" />
                              <p className={`text-[10px] font-bold ${t.textSub} truncate`}>{member.email}</p>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <Phone size={10} className="text-[#BCE334] flex-shrink-0" />
                                <p className={`text-[10px] font-bold ${t.textSub}`}>{member.phone}</p>
                              </div>
                            )}
                            {member.createdAt && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <Clock size={10} className={`${t.textMuted} flex-shrink-0`} />
                                <p className={`text-[9px] font-bold ${t.textMuted} uppercase tracking-wider`}>
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
              <div className={`${t.calBg} p-6 rounded-[2.5rem] border border-[#BCE334]/30 shadow-2xl w-full max-w-sm transition-colors duration-300`}>
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => {
                    const isFuture = day > currentDay;
                    return (
                      <button aria-label="Button" type="button" key={day} disabled={isFuture} onClick={() => { setSelectedDate(day); setShowCalendar(false); }} className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all ${selectedDate === day ? 'bg-black text-[#BCE334]' : isFuture ? 'opacity-20 cursor-not-allowed' : `${t.calDayBg} hover:bg-[#BCE334] hover:text-black`}`}>
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
        <div className={`${t.cardBg} rounded-[2.5rem] border ${t.cardBorder} shadow-sm overflow-hidden relative min-h-[400px] transition-colors duration-300`}>
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

          {isLoading && <div className={`absolute inset-0 ${t.overlayBg} backdrop-blur-sm z-10 flex items-center justify-center`}><Loader2 className="animate-spin text-[#BCE334] w-10 h-10" /></div>}
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
            <tbody className={`${t.tableDivide} divide-y`}>
              {stats.recentOrders?.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <p className={`text-xs font-black ${t.textMuted} uppercase tracking-wider`}>
                      {selectedDate ? `No orders found for ${currentMonthName} ${selectedDate}` : 'No orders yet'}
                    </p>
                  </td>
                </tr>
              )}
              {stats.recentOrders?.map((order: any) => (
                <React.Fragment key={order._id}>
                  <tr className={`${t.cardHover} transition-colors ${expandedOrderId === order._id ? (dm ? 'bg-[#1a1a1a]' : 'bg-gray-50/50') : ''}`}>
                    <td className={`px-8 py-6 text-xs font-black ${t.text}`}>{order.order_id || "N/A"}</td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-bold ${t.textBody} block`}>{order.name}</span>
                      <span className={`text-[9px] ${t.textMuted} uppercase font-black`}>{new Date(order.orderTime).toLocaleDateString()}</span>
                    </td>
                    <td className={`px-8 py-6 text-xs font-black ${t.text}`}>৳{(order.totalCost || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border ${order.paymentType === 'cod' ? t.codBadge : t.paidBadge}`}>{order.paymentType || "Paid"}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button aria-label="View order details" type="button" onClick={() => toggleOrderDetails(order._id)} className={`p-2.5 rounded-xl transition-all ${expandedOrderId === order._id ? 'bg-black text-[#BCE334]' : t.eyeBtn}`}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Detailed View Section */}
                  <AnimatePresence>
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan={5} className={`p-0 border-none ${t.expandedBg}`}>
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className={`px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t ${t.expandedBorder}`}>
                              <div className="space-y-4">
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Customer Info</h4>
                                <div className="space-y-3">
                                  <div className={`flex items-center gap-3 text-xs font-bold ${t.textBodySub}`}><Mail size={14} className="text-[#BCE334]" /> {order.email}</div>
                                  <div className={`flex items-center gap-3 text-xs font-bold ${t.textBodySub}`}><MapPin size={14} className="text-[#BCE334]" /> {order.address || "Not Provided"}</div>
                                  <div className={`flex items-center gap-3 text-xs font-bold ${t.textBodySub}`}><Clock size={14} className="text-[#BCE334]" /> {new Date(order.orderTime).toLocaleTimeString()}</div>
                                </div>
                              </div>
                              <div className="md:col-span-2 space-y-4">
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Items Ordered ({order.itemsOrdered?.length || 0})</h4>
                                <div className="flex flex-wrap gap-2">
                                  {order.itemsOrdered?.map((item: any, idx: number) => (
                                    <div key={typeof item === 'string' ? item + idx : (item._id || item.name || idx)} className={`flex items-center gap-2 px-4 py-2 ${t.expandedItemBg} border rounded-2xl shadow-sm`}>
                                      <ShoppingBag size={12} className="text-[#BCE334]" />
                                      <span className={`text-xs font-black uppercase tracking-tighter ${t.text}`}>{typeof item === 'string' ? item : item.name}</span>
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