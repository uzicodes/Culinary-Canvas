import { Truck, Ticket, CreditCard, CheckCircle2, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function DeliveryOptions({ method, setMethod }: { method: string, setMethod: (v: string) => void }) {
    return (
        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                <Truck size={12} className="text-black" /> Delivery type
            </h2>
            <div className="relative">
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
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
    );
}

export function PromoSection({ 
    couponCode, setCouponCode, subtotal, setCouponDiscount 
}: { 
    couponCode: string, setCouponCode: (v: string) => void, subtotal: number, setCouponDiscount: (v: number) => void 
}) {
    return (
        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-3">
            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                <Ticket size={12} className="text-black" /> Apply Promo
            </h2>
            <div className="flex gap-2">
                <input id={`field-promo`}
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CODE"
                    className="flex-1 bg-black/5 border-none rounded-xl p-3 text-xs font-bold outline-none min-w-0"
                />
                <button aria-label="Apply Promo"
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
    );
}

export function PaymentMethods({ 
    method, setMethod 
}: { 
    method: string, setMethod: (v: string) => void 
}) {
    return (
        <section className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-md space-y-4">
            <h2 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                <CreditCard size={12} className="text-black" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Cash', 'Bkash', 'Nagad', 'Card'].map((m) => {
                    const fullMethod = m === 'Cash' ? 'Cash on Delivery' : m === 'Card' ? 'Card/Debit Card' : m;
                    let customBg = '';
                    let customText = '';
                    let customBorder = 'border-transparent';
                    if (method === fullMethod) {
                        customBg = 'bg-black';
                        customText = 'text-[#BCE334]';
                        customBorder = 'border-black';
                    } else {
                        if (m === 'Cash') customBg = 'bg-green-100';
                        else if (m === 'Bkash') customBg = 'bg-pink-100';
                        else if (m === 'Nagad') customBg = 'bg-orange-100';
                        else if (m === 'Card') customBg = 'bg-blue-100';
                        customText = 'text-black';
                    }
                    return (
                        <button aria-label={m}
                            key={m}
                            type="button"
                            onClick={() => setMethod(fullMethod)}
                            className={`relative py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${customBg} ${customText} ${customBorder} hover:scale-105 active:scale-95`}
                        >
                            {m}
                            {method === fullMethod && (
                                <div className="absolute -top-1 -right-1 bg-[#BCE334] text-black rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 size={10} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export function OrderSummaryDetails({ 
    cartItems, subtotal, deliveryFee, tip, couponDiscount, total 
}: { 
    cartItems: any[], subtotal: number, deliveryFee: number, tip: number, couponDiscount: number, total: number 
}) {
    return (
        <section className="bg-black text-white p-6 rounded-[2rem] shadow-2xl space-y-4 sticky top-32 border border-[#BCE334]/20">
            <h2 className="text-lg font-black uppercase tracking-tighter border-b border-white/10 pb-4">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#BCE334] text-black w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                            <span className="text-xs font-bold truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="text-xs font-black">৳{item.price * item.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-bold text-gray-400">
                <div className="flex justify-between"><span>Subtotal</span><span>৳{subtotal}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>৳{deliveryFee}</span></div>
                {tip > 0 && <div className="flex justify-between"><span>Courier Tip</span><span>৳{tip}</span></div>}
                {couponDiscount > 0 && <div className="flex justify-between text-[#BCE334]"><span>Promo Applied</span><span>-৳{couponDiscount.toFixed(2)}</span></div>}
            </div>

            <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#BCE334]">Total</span>
                    <span className="text-2xl font-black tracking-tighter">৳{total.toFixed(2)}</span>
                </div>
            </div>
        </section>
    );
}
