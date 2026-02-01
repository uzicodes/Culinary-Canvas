"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Utensils, LayoutDashboard, LogOut, TrendingUp, ArrowRight, MessageSquare, X, Mail, Clock, ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function AdminDashboard() {
  const [view, setView] = useState<'menu' | 'feedbacks'>('menu');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/feedback');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'feedbacks') {
      fetchFeedbacks();
    }
  }, [view]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Compliment': return 'bg-green-100 text-green-700';
      case 'Complaint about Order': return 'bg-red-100 text-red-700';
      case 'Advice/Suggestion': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#BCE334] blur-[120px] opacity-10" />
      </div>

      <div className="flex-grow flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-2xl"
        >
          <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
            
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg mb-3">
                <LayoutDashboard className="text-[#BCE334] w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Admin <span className="text-[#BCE334]">Command</span>
              </h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 bg-black/5 px-4 py-1 rounded-full">
                Management Suite
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setView('menu')}
                className={`flex-1 py-3 px-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  view === 'menu' 
                    ? 'bg-black text-[#BCE334]' 
                    : 'bg-white/60 text-gray-600 hover:bg-white'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Utensils size={14} />
                  Manage Menu
                </span>
              </button>
              <button
                onClick={() => setView('feedbacks')}
                className={`flex-1 py-3 px-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  view === 'feedbacks' 
                    ? 'bg-black text-[#BCE334]' 
                    : 'bg-white/60 text-gray-600 hover:bg-white'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <MessageSquare size={14} />
                  Feedbacks
                  {feedbacks.length > 0 && view !== 'feedbacks' && (
                    <span className="bg-[#029FBE] text-white text-[8px] px-2 py-0.5 rounded-full">
                      {feedbacks.length}
                    </span>
                  )}
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {view === 'menu' ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/admin/add-item">
                      <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-black rounded-[2rem] flex flex-col items-center gap-3 cursor-pointer group shadow-md">
                        <PlusCircle className="text-[#BCE334] w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-[#BCE334] font-bold uppercase text-[10px] tracking-widest">ADD New Item</span>
                      </motion.div>
                    </Link>

                    <Link href="/all-items">
                      <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center gap-3 cursor-pointer shadow-sm group hover:border-[#BCE334] transition-colors">
                        <Utensils className="text-black w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-black font-bold uppercase text-[10px] tracking-widest">Manage Menu</span>
                      </motion.div>
                    </Link>

                    {/* ANALYTICS button*/}
                    <Link href="/admin/analytics" className="sm:col-span-2 mt-2">
                      <motion.div 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.98 }}
                        className="p-5 bg-[#BCE334] rounded-[2rem] flex items-center justify-between px-8 cursor-pointer shadow-lg group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-black rounded-xl">
                            <TrendingUp className="text-[#BCE334] w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="text-black font-black uppercase text-[11px] tracking-widest block">Business Analytics</span>
                            <span className="text-black/60 font-bold text-[9px] uppercase tracking-tighter">Revenue & Performance</span>
                          </div>
                        </div>
                        <ArrowRight className="text-black group-hover:translate-x-2 transition-transform" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="feedbacks"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-[#BCE334] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Inbox className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-bold text-sm">No feedbacks yet</p>
                      <p className="text-gray-400 text-xs mt-1">Customer feedbacks will appear here</p>
                    </div>
                  ) : (
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {feedbacks.map((feedback) => (
                        <motion.div
                          key={feedback._id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedFeedback(feedback)}
                          className="p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-[#BCE334] hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-black text-sm text-gray-900 truncate">{feedback.name}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getTypeColor(feedback.type)}`}>
                                  {feedback.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <Clock size={10} />
                                <span>{formatDate(feedback.timestamp)}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#BCE334] group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center px-2">
              <Link href="/profile" className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase hover:text-black transition-colors tracking-widest">
                  Back to Profile
              </Link>
              
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-[9px] font-black uppercase tracking-widest"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback Detail Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFeedback(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-xl text-gray-900">{selectedFeedback.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={12} className="text-gray-400" />
                    <a href={`mailto:${selectedFeedback.email}`} className="text-[#029FBE] text-xs font-bold hover:underline">
                      {selectedFeedback.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getTypeColor(selectedFeedback.type)}`}>
                  {selectedFeedback.type}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock size={10} />
                  {formatDate(selectedFeedback.timestamp)}
                </span>
              </div>

              <div className="bg-[#F7FBE7] rounded-2xl p-4 border border-[#BCE334]/20">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedFeedback.message}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href={`mailto:${selectedFeedback.email}?subject=Re: Your Feedback - Culinary Canvas`}
                  className="bg-[#029FBE] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#028DAA] transition-colors flex items-center gap-2"
                >
                  <Mail size={12} />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}