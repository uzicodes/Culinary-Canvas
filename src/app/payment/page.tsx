"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Truck, 
  CreditCard, 
  DollarSign, 
  Ticket, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  Banknote
} from 'lucide-react';
import Header from '@/components/Header';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function PaymentPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [tip, setTip] = useState<number>(0);
    const [customTip, setCustomTip] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState('+880');
    const [cardNumber, setCardNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');  
    const [customerAddress, setCustomerAddress] = useState(''); 
    const [couponCode, setCouponCode] = useState(''); 
    const [couponDiscount, setCouponDiscount] = useState(0); 
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        const parsed: CartItem[] = saved ? JSON.parse(saved) : [];
        setCartItems(parsed);

        const checkoutData = localStorage.getItem('checkoutData');
        if (checkoutData) {
            const parsedData = JSON.parse(checkoutData);
            setCustomerName(parsedData.name);  
            setCustomerEmail(parsedData.email); 
            setMobileNumber(parsedData.phone); 
            setCustomerAddress(parsedData.address); 
        }
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = deliveryMethod === 'Priority' ? 60 : 45;
    const totalBeforeCoupon = subtotal + deliveryFee + tip;
    const total = totalBeforeCoupon - couponDiscount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryMethod || !paymentMethod) {
            alert('Please select all required options.');
            return;
        }

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
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Failed to confirm order');
            
            // Get server response with generated order ID
            const serverOrder = await response.json();
            
            // Store the complete order data with server-generated ID
            // Only store after server confirmation to ensure ID integrity
            const confirmedOrderData = {
                ...orderData,
                order_id: serverOrder.order_id,
                orderId: serverOrder.order_id,
                orderTime: serverOrder.orderTime,
                name: customerName,
                email: customerEmail,
            };
            
            // Store in both localStorage and sessionStorage for success page
            localStorage.setItem('orderData', JSON.stringify(confirmedOrderData));
            sessionStorage.setItem('lastOrderResponse', JSON.stringify(serverOrder));
            
            router.push('/payment/success');
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const formatCardInput = (value: string) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    return (
        <div className="min-h-screen bg-[#F7FBE7] text-black">
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
                                <select
                                    value={deliveryMethod}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                    required
                                    className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] rounded-xl p-3 text-xs font-bold outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select delivery type </option>
                                    <option value="Standard">Standard (৳45)</option>
                                    <option value="Priority">Priority (৳60)</option>
                                </select>
                            </section>

                            {/* Promo Pod */}
                            <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
                                <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                                    <Ticket size={12} className="text-black" /> Apply Promo 
                                </h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="CODE"
                                        className="flex-1 bg-black/5 border-none rounded-xl p-3 text-xs font-bold outline-none min-w-0"
                                    />
                                    <button
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
                                        <button
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
                                            <input
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
                                        <button
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
                                    <input
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

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-[#BCE334] text-black py-3.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] mt-6 shadow-lg flex items-center justify-center gap-2 group transition-all"
                            >
                                Confirm Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}