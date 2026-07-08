"use client";

import { m as motion } from "framer-motion";
import Script from 'next/script';
import { ShieldCheck, Smartphone, DollarSign, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { usePayment } from '@/hooks/usePayment';
import { DeliveryOptions, PromoSection, PaymentMethods, OrderSummaryDetails } from './components/PaymentComponents';

export default function PaymentPage() {
    const { state, dispatch, subtotal, deliveryFee, total, handleSubmit } = usePayment();

    return (
        <div className="relative min-h-screen bg-[#F7FBE7] text-black">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            <Script
                src="https://sandbox.sslcommerz.com/embed.min.js"
                strategy="beforeInteractive"
                onLoad={() => dispatch({ type: 'SET_SSLCZ_READY', payload: true })}
            />
            <Header />

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-10 md:pt-28">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
                    <div className="bg-black p-2.5 rounded-xl shadow-lg">
                        <ShieldCheck className="text-[#BCE334] text-lg md:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Secure <span className="text-[#BCE334] bg-black px-1.5 rounded-md">Payment</span></h1>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">Cart payment</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8">
                    <div className="order-1 lg:col-span-7 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <DeliveryOptions method={state.deliveryMethod} setMethod={(v) => dispatch({ type: 'SET_DELIVERY', payload: v })} />
                            <PromoSection couponCode={state.couponCode} setCouponCode={(v) => dispatch({ type: 'SET_COUPON_CODE', payload: v })} subtotal={subtotal} setCouponDiscount={(v) => dispatch({ type: 'SET_COUPON_DISCOUNT', payload: v })} />
                        </div>

                        <PaymentMethods method={state.paymentMethod} setMethod={(v) => dispatch({ type: 'SET_PAYMENT_METHOD', payload: v })} />

                        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                <DollarSign size={12} className="text-black" /> Add Courier Tip (Optional)
                            </h2>
                            <div className="flex gap-2">
                                {[20, 30, 50].map(amount => (
                                    <button aria-label={`Add tip amount ৳${amount}`} key={amount} type="button" onClick={() => dispatch({ type: 'SET_TIP', payload: state.tip === amount ? 0 : amount })} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${state.tip === amount ? 'bg-black text-[#BCE334]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                        ৳{amount}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                <Smartphone size={12} className="text-black" /> Mobile Number
                            </h2>
                            <input id="field-mobile" aria-label="Mobile Number" type="text" value={state.mobileNumber} onChange={(e) => dispatch({ type: 'SET_MOBILE', payload: e.target.value })} required className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] rounded-xl p-3 text-xs font-bold outline-none" />
                        </section>
                    </div>

                    <div className="order-2 lg:col-span-5">
                        <OrderSummaryDetails cartItems={state.cartItems} subtotal={subtotal} deliveryFee={deliveryFee} tip={state.tip} couponDiscount={state.couponDiscount} total={total} />

                        {state.rateLimitError && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-[10px] font-bold text-center">
                                {state.rateLimitError}
                            </div>
                        )}

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={state.isProcessing} type="submit" className="w-full bg-black text-[#BCE334] mt-5 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[#BCE334]/20 transition-all">
                            {state.isProcessing ? 'Processing...' : 'Confirm Order'} <ArrowRight size={14} />
                        </motion.button>
                        
                        <div className="mt-4 text-center">
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                <ShieldCheck size={10} /> Powered By <span className="text-blue-500 font-black">SSLCOMMERZ</span>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}