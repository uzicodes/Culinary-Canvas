import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface PaymentState {
    cartItems: CartItem[];
    deliveryMethod: string;
    paymentMethod: string;
    tip: number;
    customTip: string;
    mobileNumber: string;
    cardNumber: string;
    couponCode: string;
    couponDiscount: number;
    isProcessing: boolean;
    rateLimitError: string | null;
    sslczReady: boolean;
}

type PaymentAction = 
    | { type: 'SET_CART_ITEMS', payload: CartItem[] }
    | { type: 'SET_DELIVERY', payload: string }
    | { type: 'SET_PAYMENT_METHOD', payload: string }
    | { type: 'SET_TIP', payload: number }
    | { type: 'SET_CUSTOM_TIP', payload: string }
    | { type: 'SET_MOBILE', payload: string }
    | { type: 'SET_CARD_NUMBER', payload: string }
    | { type: 'SET_COUPON_CODE', payload: string }
    | { type: 'SET_COUPON_DISCOUNT', payload: number }
    | { type: 'SET_PROCESSING', payload: boolean }
    | { type: 'SET_ERROR', payload: string | null }
    | { type: 'SET_SSLCZ_READY', payload: boolean };

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
    switch (action.type) {
        case 'SET_CART_ITEMS': return { ...state, cartItems: action.payload };
        case 'SET_DELIVERY': return { ...state, deliveryMethod: action.payload };
        case 'SET_PAYMENT_METHOD': return { ...state, paymentMethod: action.payload };
        case 'SET_TIP': return { ...state, tip: action.payload };
        case 'SET_CUSTOM_TIP': return { ...state, customTip: action.payload };
        case 'SET_MOBILE': return { ...state, mobileNumber: action.payload };
        case 'SET_CARD_NUMBER': return { ...state, cardNumber: action.payload };
        case 'SET_COUPON_CODE': return { ...state, couponCode: action.payload };
        case 'SET_COUPON_DISCOUNT': return { ...state, couponDiscount: action.payload };
        case 'SET_PROCESSING': return { ...state, isProcessing: action.payload };
        case 'SET_ERROR': return { ...state, rateLimitError: action.payload };
        case 'SET_SSLCZ_READY': return { ...state, sslczReady: action.payload };
        default: return state;
    }
}

export function usePayment() {
    const router = useRouter();

    const [state, dispatch] = useReducer(paymentReducer, {
        cartItems: [],
        deliveryMethod: '',
        paymentMethod: '',
        tip: 0,
        customTip: '',
        mobileNumber: '+880',
        cardNumber: '',
        couponCode: '',
        couponDiscount: 0,
        isProcessing: false,
        rateLimitError: null,
        sslczReady: false
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart:v1');
            if (saved) dispatch({ type: 'SET_CART_ITEMS', payload: JSON.parse(saved) });

            try {
                const checkoutData = localStorage.getItem('checkoutData:v1');
                if (checkoutData) {
                    const phone = JSON.parse(checkoutData).phone;
                    if (phone) dispatch({ type: 'SET_MOBILE', payload: phone });
                }
            } catch { /* ignore */ }
        }
    }, []);

    const subtotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = state.deliveryMethod === 'Priority' ? 60 : 45;
    const totalBeforeCoupon = subtotal + deliveryFee + state.tip;
    const total = totalBeforeCoupon - state.couponDiscount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SET_ERROR', payload: null });

        if (!state.deliveryMethod || !state.paymentMethod) {
            alert('Please select all required options.');
            return;
        }

        const isOnlinePayment = state.paymentMethod === 'Bkash' || state.paymentMethod === 'Nagad' || state.paymentMethod === 'Card/Debit Card';
        dispatch({ type: 'SET_PROCESSING', payload: true });

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

        let finalCouponDiscount = state.couponDiscount;
        if (state.couponCode === 'CC10' || state.couponCode === 'BITE10') {
            finalCouponDiscount = subtotal * 0.10;
        }

        const orderData = {
            customerName, customerEmail,
            customerPhone: state.mobileNumber,
            customerAddress, orderItems: state.cartItems,
            deliveryMethod: state.deliveryMethod, paymentMethod: state.paymentMethod, tip: state.tip,
            subtotal, couponCode: state.couponCode,
            total: totalBeforeCoupon - finalCouponDiscount,
            couponDiscount: finalCouponDiscount,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.status === 429) {
                dispatch({ type: 'SET_ERROR', payload: 'You are performing this action too fast. Please wait a moment.' });
                dispatch({ type: 'SET_PROCESSING', payload: false });
                return;
            }

            if (!response.ok) throw new Error('Failed to confirm order');

            const serverOrder = await response.json();

            const confirmedOrderData = {
                ...orderData,
                order_id: serverOrder.order_id,
                orderId: serverOrder.order_id,
                orderTime: serverOrder.orderTime,
                name: customerName,
                email: customerEmail,
            };

            localStorage.setItem('orderData:v1', JSON.stringify(confirmedOrderData));
            sessionStorage.setItem('lastOrderResponse:v1', JSON.stringify(serverOrder));

            if (isOnlinePayment) {
                const paymentInitResponse = await fetch('/api/payment/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: serverOrder.order_id,
                        total: orderData.total,
                        customerName,
                        customerEmail,
                        address: customerAddress,
                        phone: state.mobileNumber,
                    }),
                });

                if (paymentInitResponse.status === 429) {
                    dispatch({ type: 'SET_ERROR', payload: 'You are performing this action too fast. Please wait a moment.' });
                    dispatch({ type: 'SET_PROCESSING', payload: false });
                    return;
                }

                const paymentResult = await paymentInitResponse.json();

                if (paymentResult.status === 'SUCCESS' && paymentResult.sessionkey) {
                    const triggerPayment = () => {
                        if (typeof window !== 'undefined' && (window as any).EasycheckoutPay) {
                            (window as any).EasycheckoutPay({
                                sessionkey: paymentResult.sessionkey,
                                onSuccess: (data: any) => { router.push('/payment/success'); },
                                onFail: (data: any) => { router.push('/checkout?payment=failed'); },
                                onCancel: () => {
                                    dispatch({ type: 'SET_PROCESSING', payload: false });
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
                            window.location.href = paymentResult.GatewayPageURL;
                        } else {
                            alert('Payment gateway could not be loaded. Please try again.');
                            dispatch({ type: 'SET_PROCESSING', payload: false });
                        }
                    };
                    setTimeout(triggerPayment, 100);
                } else {
                    throw new Error(paymentResult.error || 'Failed to initialize payment');
                }
            } else {
                router.push('/payment/success');
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            dispatch({ type: 'SET_PROCESSING', payload: false });
        }
    };

    return {
        state,
        dispatch,
        subtotal,
        deliveryFee,
        total,
        handleSubmit
    };
}
