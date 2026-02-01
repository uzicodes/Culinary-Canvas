'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';

const Feedback = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'General Feedback',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', type: 'General Feedback', message: '' });
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section className="py-10 px-4 bg-gradient-to-br from-green-100 to-green-200">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-white shadow-2xl flex flex-col lg:flex-row gap-8"
                >
                    {/* Left Side: Info */}
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#BCE334]/20 text-slate-800 px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-widest">
                            <MessageSquare size={14} />
                            <span>Voice Your Thoughts</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                            Help us <br /> <span className="text-red-600">Sharpen</span> <span className="text-green-600">the Canvas</span>
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed max-w-sm">
                            Whether it's a compliment or a complaint, your feedback helps us craft a better dining experience. We read every message.
                        </p>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-[#BCE334] rounded-full flex items-center justify-center text-black shadow-lg">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase">Message Received!</h3>
                                <p className="text-slate-500 font-bold">Thank you for helping us grow.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-[#029FBE] font-black uppercase text-xs tracking-widest hover:underline"
                                >
                                    Send another
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold"
                                    >
                                        Something went wrong. Please try again.
                                    </motion.div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="NAME"
                                        className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all"
                                    />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="EMAIL"
                                        className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all"
                                    />
                                </div>
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all appearance-none cursor-pointer"
                                >
                                    <option>General Feedback</option>
                                    <option>Complaint about Order</option>
                                    <option>Advice/Suggestion</option>
                                    <option>Compliment</option>
                                </select>
                                <textarea
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="YOUR MESSAGE..."
                                    className="w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-4 text-[10px] font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all resize-none"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'submitting'}
                                    className="w-full bg-black text-white py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl disabled:bg-slate-400 flex items-center justify-center gap-3"
                                >
                                    {status === 'submitting' ? 'Processing...' : 'Send to Us'}
                                    <Send size={14} />
                                </motion.button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Feedback;