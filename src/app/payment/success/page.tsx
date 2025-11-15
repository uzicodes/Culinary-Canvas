"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);
  useEffect(() => {
    // Try to get the latest order from sessionStorage (set after order POST response)
    const backendOrder = sessionStorage.getItem("lastOrderResponse");
    if (backendOrder) {
      setOrder(JSON.parse(backendOrder));
    } else {
      // fallback to localStorage (may not have order_id)
      const saved = localStorage.getItem("orderData");
      if (saved) setOrder(JSON.parse(saved));
    }
  }, []);

  // Download invoice as PDF
  const handleDownloadInvoice = async () => {
      if (!order) return;
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont('helvetica', 'normal');
      let y = 15;
      doc.setFontSize(20);
      doc.text("INVOICE", 105, y, { align: "center" });
      y += 10;
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.order_id || order.orderId || "-"}`, 15, y);
      doc.text(`Date: ${order.orderTime ? new Date(order.orderTime).toLocaleString() : "-"}`, 140, y);
      y += 10;
      doc.text(`Customer: ${order.name || "-"}`, 15, y);
      y += 7;
      doc.text(`Email: ${order.email || order.customerEmail || "-"}`, 15, y);
      y += 7;
      doc.text(`Phone: ${order.customerPhone || order.phone || order.mobileNumber || "-"}`, 15, y);
      y += 7;
      doc.text("Delivery Address:", 15, y);
      y += 7;
      const address = order.address || order.customerAddress || "-";
      const addressLines = address.split("\n");
      for (let i = 0; i < addressLines.length; i++) {
        doc.text(addressLines[i], 20, y);
        y += 7;
      }
      y += 3;
      // Table header
      doc.setFontSize(13);
      doc.text("Items Ordered:", 15, y);
      y += 7;
      doc.setFontSize(11);
      doc.setFillColor(230, 230, 230);
      doc.rect(15, y - 5, 180, 8, 'F');
      doc.text("Item", 18, y);
      doc.text("Qty", 90, y);
      doc.text("Price", 120, y);
      doc.text("Total", 160, y);
      y += 7;
      // Table rows
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          doc.text(item.name || "-", 18, y);
          doc.text(item.quantity ? String(item.quantity) : "-", 90, y);
          // Use 'Tk' instead of '৳' to avoid font issues
          doc.text(item.price ? `Tk ${item.price.toFixed(2)}` : "-", 120, y);
          doc.text(item.price && item.quantity ? `Tk ${(item.price * item.quantity).toFixed(2)}` : "-", 160, y);
          y += 7;
        });
      } else if (order.itemsOrdered && Array.isArray(order.itemsOrdered)) {
        order.itemsOrdered.forEach((item: any) => {
          if (typeof item === 'object') {
            doc.text(item.name || "-", 18, y);
            doc.text(item.quantity ? String(item.quantity) : "-", 90, y);
            doc.text(item.price ? `Tk ${item.price.toFixed(2)}` : "-", 120, y);
            doc.text(item.price && item.quantity ? `Tk ${(item.price * item.quantity).toFixed(2)}` : "-", 160, y);
          } else {
            doc.text(String(item), 18, y);
          }
          y += 7;
        });
      }
      y += 5;
      doc.setFontSize(12);
      doc.text("Summary:", 15, y);
      y += 7;
      // Print all summary fields in a single aligned row
      let delivery = order.deliveryMethod === "Priority" ? 60 : order.deliveryMethod === "Standard" ? 45 : 0;
      let deliveryText = order.deliveryMethod ? `Delivery: Tk ${delivery.toFixed(2)}` : "";
      let tipText = order.tip !== undefined ? `Tip: Tk ${order.tip.toFixed(2)}` : "";
      let couponText = order.couponDiscount !== undefined ? `Coupon Discount: Tk ${order.couponDiscount.toFixed(2)}` : "";
      let subTotalText = order.subtotal !== undefined ? `Sub Total: Tk ${order.subtotal.toFixed(2)}` : "";
      // Set x positions for each field for alignment
      let xStart = 15;
      let xDelivery = xStart;
      let xTip = xDelivery + 60;
      let xCoupon = xTip + 60;
      let xSubTotal = xCoupon + 70;
      if (deliveryText) doc.text(deliveryText, xDelivery, y);
      if (tipText) doc.text(tipText, xTip, y);
      if (couponText) doc.text(couponText, xCoupon, y);
      if (subTotalText) doc.text(subTotalText, xSubTotal, y);
      y += 7;
      if (order.total !== undefined) doc.text(`Total: Tk ${order.total.toFixed(2)}`, 15, y);
      y += 10;
      doc.setFontSize(10);
      doc.text("Thank you for your order!", 105, y, { align: "center" });
      const pdfName = `#${order.order_id || order.orderId || "invoice"}.pdf`;
      doc.save(pdfName);
  };
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
          <p className="text-gray-700 text-center mb-4">{order?.order_id || order?.orderId ? (<span>Order <span className="font-bold">#{order.order_id || order.orderId}</span> was placed on <span className="font-bold">{order.orderTime ? new Date(order.orderTime).toLocaleDateString() : "-"}</span> and is currently in progress</span>) : null}</p>
          <div className="flex items-center justify-between mb-2">
            {/* Steps */}
            <div className="flex flex-col items-center flex-1">
              <div className="bg-[#6fcf97] rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 10l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525] text-center block">ORDER CONFIRMED</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525] text-center block">START PRODUCTION</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525] text-center block">QUALITY CHECK</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525] text-center block">DISPATCHED ITEM</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-1"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              </div>
              <span className="text-xs font-bold text-[#c72525] text-center block">PRODUCT DELIVERED</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 text-center mt-2">
            Expected Delivery Time: <span className="font-bold"> 09:30 AM </span>
            <br />
            <a href="#" className="text-blue-600 underline mt-1 inline-block">Track Your Order</a>
          </div>
        </div>
      </div>
      {/* Sidebar */}
  <aside className="w-full md:w-96 shadow-lg p-8 flex flex-col gap-6 border-l border-gray-200 min-h-screen" style={{backgroundColor:'#9DAD39'}}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">ORDER DETAIL</span>
            <button onClick={handleDownloadInvoice} className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold border border-gray-300">Download Invoice</button>
          </div>
          {order?.order_id || order?.orderId ? (<span className="text-2xl font-bold text-gray-800">#{order.order_id || order.orderId}</span>) : null}
        </div>
        <div>
          <div className="font-bold mb-1">DELIVERY ADDRESS</div>
          <div className="text-sm text-gray-700">{order?.address || order?.customerAddress || ""}</div>
        </div>

        <div>
          <div className="font-bold mb-1">CONTACT DETAILS</div>
          <div className="text-sm text-gray-700">
            {order?.email || order?.customerEmail || ""}<br/>
            {order?.customerPhone || order?.phone || order?.mobileNumber || ""}
          </div>
        </div>
        <div>
          <div className="font-bold mb-1">ORDER SUMMARY</div>
          {order?.subtotal !== undefined && <div className="flex justify-between text-sm mb-1"><span>Sub Total</span><span>৳{order.subtotal.toFixed(2)}</span></div>}
          {order?.deliveryMethod && <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span>৳{order.deliveryMethod === "Priority" ? "60.00" : order.deliveryMethod === "Standard" ? "45.00" : "-"}</span></div>}
          {order?.tip !== undefined && <div className="flex justify-between text-sm mb-1"><span>Tip</span><span>৳{order.tip.toFixed(2)}</span></div>}
          {order?.couponDiscount !== undefined && <div className="flex justify-between text-sm mb-1"><span>Coupon Discount</span><span>৳{order.couponDiscount.toFixed(2)}</span></div>}
          <hr className="border-t-2 border-black my-3" />
          {order?.total !== undefined && <div className="flex justify-between text-base font-bold mt-2"><span>Total</span><span>৳{order.total.toFixed(2)}</span></div>}
        </div>
      </aside>
    </div>
  );
}
