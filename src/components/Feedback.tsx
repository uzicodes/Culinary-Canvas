'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Lock } from 'lucide-react';

const MAX_NAME_LENGTH = 50;
const MAX_MESSAGE_WORDS = 100;
const MAX_MESSAGE_CHARS = 600; // ~100 words equivalent

const Feedback = () => {
    const { data: session } = useSession();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'General Feedback',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Auto-fill user data when logged in
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || ''
            }));
        }
    }, [session]);

    const validateEmail = (email: string): boolean => {
        const atCount = (email.match(/@/g) || []).length;
        return atCount === 1 && email.includes('@');
    };

    const countWords = (text: string): number => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [name]: '' }));

        // Validation checks
        if (name === 'name') {
            if (value.length > MAX_NAME_LENGTH) {
                setErrors(prev => ({ ...prev, name: `Name must be ${MAX_NAME_LENGTH} characters or less` }));
                return;
            }
        }

        if (name === 'message') {
            const wordCount = countWords(value);
            if (wordCount > MAX_MESSAGE_WORDS || value.length > MAX_MESSAGE_CHARS) {
                setErrors(prev => ({ ...prev, message: `Message must be ${MAX_MESSAGE_WORDS} words or ${MAX_MESSAGE_CHARS} characters or less` }));
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        const newErrors = { name: '', email: '', message: '' };
        let isValid = true;

        if (formData.name.length > MAX_NAME_LENGTH) {
            newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
            isValid = false;
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email with exactly one @';
            isValid = false;
        }

        const wordCount = countWords(formData.message);
        if (wordCount > MAX_MESSAGE_WORDS || formData.message.length > MAX_MESSAGE_CHARS) {
            newErrors.message = `Message must be ${MAX_MESSAGE_WORDS} words or ${MAX_MESSAGE_CHARS} characters or less`;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                if (session?.user) {
                    setFormData(prev => ({ ...prev, type: 'General Feedback', message: '' }));
                } else {
                    setFormData({ name: '', email: '', type: 'General Feedback', message: '' });
                }
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

    const isLoggedIn = !!session?.user;

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
                            Whether it&apos;s a compliment or a complaint, your feedback helps us craft a better dining experience. We read every message.
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
                                    <div className="relative">
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            maxLength={MAX_NAME_LENGTH}
                                            readOnly={isLoggedIn}
                                            className={`w-full bg-white/60 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all ${errors.name ? 'border-red-400' : 'border-slate-200'
                                                } ${isLoggedIn ? 'bg-slate-100 cursor-not-allowed pr-10' : ''}`}
                                        />
                                        {isLoggedIn && (
                                            <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        )}
                                        {errors.name && (
                                            <p className="text-red-500 text-[8px] font-bold mt-1">{errors.name}</p>
                                        )}
                                        <span className="text-[8px] text-slate-400 absolute right-3 bottom-1">
                                            {!isLoggedIn && `${formData.name.length}/${MAX_NAME_LENGTH}`}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            readOnly={isLoggedIn}
                                            className={`w-full bg-white/60 border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all ${errors.email ? 'border-red-400' : 'border-slate-200'
                                                } ${isLoggedIn ? 'bg-slate-100 cursor-not-allowed pr-10' : ''}`}
                                        />
                                        {isLoggedIn && (
                                            <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        )}
                                        {errors.email && (
                                            <p className="text-red-500 text-[8px] font-bold mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all appearance-none cursor-pointer"
                                >
                                    <option>General Feedback</option>
                                    <option>Complaint about Order</option>
                                    <option>Advice/Suggestion</option>
                                    <option>Compliment</option>
                                </select>
                                <div className="relative">
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Your message..."
                                        className={`w-full bg-white/60 border rounded-2xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all resize-none ${errors.message ? 'border-red-400' : 'border-slate-200'
                                            }`}
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-[8px] font-bold mt-1">{errors.message}</p>
                                    )}
                                    <span className="text-[8px] text-slate-400 absolute right-3 bottom-3">
                                        {countWords(formData.message)}/{MAX_MESSAGE_WORDS} words
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'submitting'}
                                    className="w-full bg-black text-white py-3 rounded-xl font-semibold tracking-wide text-sm shadow-xl disabled:bg-slate-400 flex items-center justify-center gap-3"
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