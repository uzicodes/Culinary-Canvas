"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem("orderData");
    if (saved) setOrder(JSON.parse(saved));
  }, []);
  return (
    <div className="min-h-screen bg-[#6fcf97] flex flex-col md:flex-row items-start justify-center">
      {/* Main confirmation section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-lg relative">
          {/* Animated confetti (simple dots) */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center">
            {/* Dots for confetti */}
            <span className="absolute top-2 left-6 w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span className="absolute top-8 left-2 w-2 h-2 bg-pink-400 rounded-full"></span>
            <span className="absolute top-16 left-10 w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="absolute top-4 right-6 w-2 h-2 bg-purple-400 rounded-full"></span>
            <span className="absolute bottom-2 right-8 w-2 h-2 bg-orange-400 rounded-full"></span>
          </div>
          {/* Checkmark */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#6fcf97" />
            <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#395C39] text-center mb-2">YOUR ORDER IS CONFIRMED !</h1>
        <p className="text-[#394DAD] text-center mb-8 max-w-md">We will be sending you an email confirmation shortly</p>
        {/* Progress tracker */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mb-8">
          <p className="text-gray-700 text-center mb-4">Order <span className="font-bold">#2059666</span> was placed on <span className="font-bold">January 13, 2021</span> and is currently in progress</p>
          <div className="flex items-center justify-between mb-2">
            {/* Steps */}
            <div className="flex flex-col items-center flex-1">
              <div className="bg-[#6fcf97] rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 10l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525]">ORDER CONFIRMED</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400">START PRODUCTION</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400">QUALITY CHECK</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400">DISPATCHED ITEM</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-gray-400">PRODUCT DELIVERED</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 text-center mt-2">Expected Delivery Date: <span className="font-bold">16 January 2021</span> <a href="#" className="text-blue-600 underline ml-2">Track Your Order</a></div>
        </div>
      </div>
      {/* Sidebar */}
  <aside className="w-full md:w-96 shadow-lg p-8 flex flex-col gap-6 border-l border-gray-200 min-h-screen" style={{backgroundColor:'#9DAD39'}}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">ORDER DETAIL</span>
            <button className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold border border-gray-300">Download Invoice</button>
          </div>
          <span className="text-2xl font-bold text-gray-800">#2059666</span>
        </div>
        <div>
          <div className="font-bold mb-1">DELIVERY ADDRESS</div>
          <div className="text-sm text-gray-700">Vvip Addresses, Raj Nagar Extension Road<br/>Raj Nagar Extension Ghaziabad<br/>london 201001 India</div>
        </div>
        <div>
          <div className="font-bold mb-1">BILLING ADDRESS</div>
          <div className="text-sm text-gray-700">Vvip Addresses, Raj Nagar Extension Road<br/>Raj Nagar Extension Ghaziabad<br/>london 201001 India</div>
        </div>
        <div>
          <div className="font-bold mb-1">CONTACT DETAILS</div>
          <div className="text-sm text-gray-700">email@company.com<br/>+91-987 000 0000<br/>+91-987 000 0000</div>
        </div>
        <div>
          <div className="font-bold mb-1">ORDER SUMMARY{order?.orderItems ? ` (${order.orderItems.length})` : ""}</div>
          <div className="flex justify-between text-sm mb-1"><span>Sub Total</span><span>৳{order?.subtotal?.toFixed(2) ?? "-"}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span>৳{order?.deliveryMethod === "Priority" ? "60.00" : order?.deliveryMethod === "Standard" ? "45.00" : "-"}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Tip</span><span>৳{order?.tip?.toFixed(2) ?? "0.00"}</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Coupon Discount</span><span>৳{order?.couponDiscount?.toFixed(2) ?? "0.00"}</span></div>
          <div className="flex justify-between text-base font-bold mt-2"><span>Total</span><span>৳{order?.total?.toFixed(2) ?? "-"}</span></div>
        </div>
      </aside>
    </div>
  );
}
