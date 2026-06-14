"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { m as motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import Script from 'next/script';
import {
    Truck,
    CreditCard,
    DollarSign,
    Ticket,
    CheckCircle2,
    Smartphone,
    ArrowRight,
    ShieldCheck,
    Banknote,
    ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';

// Declare global interface for SSLCommerz
declare global {
    interface Window {
        sslcz_init?: (config: { sessionkey: string; callback?: (data: any) => void }) => void;
    }
}

interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function PaymentPage() {
    const [cartItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('cart:v1');
        return saved ? JSON.parse(saved) : [];
    });
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [tip, setTip] = useState<number>(0);
    const [customTip, setCustomTip] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState(() => {
        if (typeof window === 'undefined') return '+880';
        try {
            const checkoutData = localStorage.getItem('checkoutData:v1');
            if (checkoutData) return JSON.parse(checkoutData).phone || '+880';
        } catch { /* ignore */ }
        return '+880';
    });
    const [cardNumber, setCardNumber] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);
    const [sslczReady, setSslczReady] = useState(false);
    const router = useRouter();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = deliveryMethod === 'Priority' ? 60 : 45;
    const totalBeforeCoupon = subtotal + deliveryFee + tip;
    const total = totalBeforeCoupon - couponDiscount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRateLimitError(null);
        if (!deliveryMethod || !paymentMethod) {
            alert('Please select all required options.');
            return;
        }

        const isOnlinePayment = paymentMethod === 'Bkash' || paymentMethod === 'Nagad' || paymentMethod === 'Card/Debit Card';

        setIsProcessing(true);

        let customerName = '';
        let customerEmail = '';
        let customerAddress = '';
        try {
            const checkoutData = localStorage.getItem('checkoutData:v1');
            if (checkoutData) {
                const parsed = JSON.parse(checkoutData);
                customerName = parsed.name || '';
                customerEmail = parsed.email || '';
                customerAddress = parsed.address || '';
            }
        } catch { /* ignore */ }

        let finalCouponDiscount = couponDiscount;
        if (couponCode === 'CC10' || couponCode === 'BITE10') {
            finalCouponDiscount = subtotal * 0.10;
        }

        const orderData = {
            customerName, customerEmail,
            customerPhone: mobileNumber,
            customerAddress, orderItems: cartItems,
            deliveryMethod, paymentMethod, tip,
            subtotal, couponCode,
            total: totalBeforeCoupon - finalCouponDiscount,
            couponDiscount: finalCouponDiscount,
        };

        try {
            // Step 1: Create order in database first
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.status === 429) {
                setRateLimitError('You are performing this action too fast. Please wait a moment.');
                setIsProcessing(false);
                return;
            }

            if (!response.ok) throw new Error('Failed to confirm order');

            // Get server response with generated order ID
            const serverOrder = await response.json();

            // Store the complete order data with server-generated ID
            const confirmedOrderData = {
                ...orderData,
                order_id: serverOrder.order_id,
                orderId: serverOrder.order_id,
                orderTime: serverOrder.orderTime,
                name: customerName,
                email: customerEmail,
            };

            // Store in both localStorage and sessionStorage for success page
            localStorage.setItem('orderData:v1', JSON.stringify(confirmedOrderData));
            sessionStorage.setItem('lastOrderResponse', JSON.stringify(serverOrder));

            // Step 2: Check if online payment is required
            if (isOnlinePayment) {
                // Initialize SSLCommerz payment session
                const paymentInitResponse = await fetch('/api/payment/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: serverOrder.order_id,
                        total: orderData.total,
                        customerName,
                        customerEmail,
                        address: customerAddress,
                        phone: mobileNumber,
                    }),
                });

                if (paymentInitResponse.status === 429) {
                    setRateLimitError('You are performing this action too fast. Please wait a moment.');
                    setIsProcessing(false);
                    return;
                }

                const paymentResult = await paymentInitResponse.json();

                if (paymentResult.status === 'SUCCESS' && paymentResult.sessionkey) {
                    // Trigger SSLCommerz EasyCheckout popup
                    // Use a small delay to ensure script is fully initialized
                    const triggerPayment = () => {
                        if (typeof window !== 'undefined' && (window as any).EasycheckoutPay) {
                            (window as any).EasycheckoutPay({
                                sessionkey: paymentResult.sessionkey,
                                onSuccess: (data: any) => {
                                    console.log('Payment Success:', data);
                                    router.push('/payment/success');
                                },
                                onFail: (data: any) => {
                                    console.log('Payment Failed:', data);
                                    router.push('/checkout?payment=failed');
                                },
                                onCancel: () => {
                                    console.log('Payment Cancelled');
                                    setIsProcessing(false);
                                    router.push('/checkout?payment=cancelled');
                                }
                            });
                        } else if (typeof window !== 'undefined' && (window as any).sslcz_init) {
                            (window as any).sslcz_init({
                                sessionkey: paymentResult.sessionkey,
                                callback: (data: any) => {
                                    if (data.status === 'VALID' || data.status === 'VALIDATED') {
                                        router.push('/payment/success');
                                    } else if (data.status === 'FAILED') {
                                        router.push('/checkout?payment=failed');
                                    } else if (data.status === 'CANCELLED') {
                                        router.push('/checkout?payment=cancelled');
                                    }
                                }
                            });
                        } else if (paymentResult.GatewayPageURL) {
                            // Fallback: redirect to SSLCommerz gateway page
                            window.location.href = paymentResult.GatewayPageURL;
                        } else {
                            alert('Payment gateway could not be loaded. Please try again.');
                            setIsProcessing(false);
                        }
                    };

                    // Try immediately, or wait a bit for script to initialize
                    setTimeout(triggerPayment, 100);
                } else {
                    throw new Error(paymentResult.error || 'Failed to initialize payment');
                }
            } else {
                // Cash on Delivery - redirect directly to success page
                router.push('/payment/success');
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCardInput = (value: string) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    return (
        <div className="relative min-h-screen bg-[#F7FBE7] text-black">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            {/* SSLCommerz EasyCheckout Script */}
            <Script
                src="https://sandbox.sslcommerz.com/embed.min.js"
                strategy="beforeInteractive"
                onLoad={() => {
                    console.log('SSLCommerz script loaded');
                    console.log('EasycheckoutPay available:', typeof (window as any).EasycheckoutPay);
                    console.log('sslcz_init available:', typeof (window as any).sslcz_init);
                    setSslczReady(true);
                }}
                onError={(e) => {
                    console.error('Failed to load SSLCommerz script:', e);
                }}
            />
            <Header />

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-10 md:pt-28">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <div className="bg-black p-2.5 rounded-xl shadow-lg">
                        <ShieldCheck className="text-[#BCE334] text-lg md:text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Secure <span className="text-[#BCE334] bg-black px-1.5 rounded-md">Payment</span></h1>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">Cart payment</p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8">
                    {/* Left Section: Inputs */}
                    <div className="order-1 lg:col-span-7 space-y-4">

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Delivery type Pod */}
                            <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                                <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                    <Truck size={12} className="text-black" /> Delivery type
                                </h2>
                                <div className="relative">
                                    <select
                                        value={deliveryMethod}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        required
                                        className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] rounded-xl p-3 pr-10 text-xs font-bold outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select delivery type </option>
                                        <option value="Standard">Standard (৳45)</option>
                                        <option value="Priority">Priority (৳60)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </section>

                            {/* Promo Pod */}
                            <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                                <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                    <Ticket size={12} className="text-black" /> Apply Promo
                                </h2>
                                <div className="flex gap-2">
                                    <input id={`field-${0}`}
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="CODE"
                                        className="flex-1 bg-black/5 border-none rounded-xl p-3 text-xs font-bold outline-none min-w-0"
                                    />
                                    <button aria-label="Button"
                                        type="button"
                                        onClick={() => {
                                            if (couponCode === 'CC10' || couponCode === 'BITE10') {
                                                setCouponDiscount(subtotal * 0.10);
                                                alert('Token Authenticated!');
                                            } else {
                                                setCouponDiscount(0);
                                                alert('Invalid Token');
                                            }
                                        }}
                                        className="bg-black text-[#BCE334] px-3 rounded-xl text-[9px] font-black uppercase"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Payment Pod */}
                        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-4">
                            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                <CreditCard size={12} className="text-black" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['Cash', 'Bkash', 'Nagad', 'Card'].map((method) => {
                                    const fullMethod = method === 'Cash' ? 'Cash on Delivery' : method === 'Card' ? 'Card/Debit Card' : method;
                                    let customBg = '';
                                    let customText = '';
                                    let customBorder = 'border-transparent';
                                    if (paymentMethod === fullMethod) {
                                        customBg = 'bg-black';
                                        customText = 'text-[#BCE334]';
                                        customBorder = 'border-black';
                                    } else {
                                        if (method === 'Cash') {
                                            customBg = 'bg-green-100';
                                        } else if (method === 'Bkash') {
                                            customBg = 'bg-pink-100';
                                        } else if (method === 'Nagad') {
                                            customBg = 'bg-orange-100';
                                        } else if (method === 'Card') {
                                            customBg = 'bg-blue-100';
                                        }
                                        customText = 'text-black';
                                    }
                                    return (
                                        <button aria-label="Button"
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(fullMethod)}
                                            className={`p-2 sm:p-3 rounded-xl border-2 text-[8px] font-black uppercase tracking-tighter transition-all ${customBg} ${customText} ${customBorder} hover:border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1`}
                                        >
                                            {method === 'Cash' && <Banknote size={16} className="sm:w-5 sm:h-5" />}
                                            {method === 'Bkash' && <Image src="/bkash.svg" alt="Bkash" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            {method === 'Nagad' && <Image src="/nagad.svg" alt="Nagad" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            {method === 'Card' && <Image src="/visa.svg" alt="Card" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            <span>{method}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence mode="wait">
                                {(paymentMethod === 'Bkash' || paymentMethod === 'Nagad' || paymentMethod === 'Card/Debit Card') && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2">
                                        <div className="relative">
                                            {paymentMethod.includes('Card') ? <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} /> : <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />}
                                            <input id={`field-${0}`}
                                                type="text"
                                                value={paymentMethod.includes('Card') ? cardNumber : mobileNumber}
                                                onChange={(e) => paymentMethod.includes('Card') ? setCardNumber(formatCardInput(e.target.value)) : setMobileNumber(e.target.value)}
                                                placeholder={paymentMethod.includes('Card') ? "XXXX XXXX XXXX XXXX" : `Enter ${paymentMethod} number`}
                                                className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] rounded-xl p-3 pl-10 text-xs font-bold outline-none"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Tips section */}
                        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                <DollarSign size={12} className="text-black" /> Tip your Rider
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    {[10, 20, 30].map((amt) => (
                                        <button aria-label="Button"
                                            key={amt}
                                            type="button"
                                            onClick={() => { setTip(amt); setCustomTip(''); }}
                                            className={`w-9 h-8 rounded-lg text-[8px] font-black transition-all ${tip === amt ? 'bg-black text-[#BCE334]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            ৳{amt}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">৳</span>
                                    <input id={`field-${0}`}
                                        type="number"
                                        value={customTip}
                                        onChange={(e) => setCustomTip(e.target.value)}
                                        onBlur={() => setTip(parseFloat(customTip) || 0)}
                                        placeholder="Custom amount"
                                        className="w-full bg-black/5 border-none rounded-xl p-2.5 pl-6 text-[10px] font-black outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Section: Summary */}
                    <div className="order-2 lg:col-span-5">
                        <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl lg:sticky lg:top-28 border border-white/10">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4 pb-3 border-b border-white/10">Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Base Amount</span>
                                    <span className="text-white">৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Delivery Fee</span>
                                    <span className="text-white">৳{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Tips</span>
                                    <span className="text-[#BCE334]">৳{tip.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Token Value</span>
                                        <span className="text-red-400">-৳{couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t-2 border-dashed border-[#BCE334]/30">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Total Payable</p>
                                        <p className="text-3xl font-black text-[#BCE334]">৳{total.toFixed(2)}</p>
                                    </div>
                                    <CheckCircle2 size={20} className="text-[#BCE334] mb-1" />
                                </div>
                            </div>

                            {rateLimitError && (
                                <div className="mt-4 mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">
                                    {rateLimitError}
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full bg-[#BCE334] text-black py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-6 shadow-lg flex items-center justify-center gap-2 group transition-all ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}