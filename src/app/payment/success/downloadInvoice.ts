import jsPDF from "jspdf";

export function downloadInvoice(order: any) {
  const doc = new jsPDF();
  let y = 15;
  doc.setFontSize(18);
  doc.text("ORDER DETAIL", 15, y);
  y += 10;
  doc.setFontSize(14);
  doc.text(`#${order?.orderId || "2059666"}`, 15, y);
  y += 12;
  doc.setFontSize(12);
  doc.text("DELIVERY ADDRESS", 15, y);
  y += 7;
  doc.text(order?.customerAddress || "Vvip Addresses, Raj Nagar Extension Road\nRaj Nagar Extension Ghaziabad\nlondon 201001 India", 15, y);
  y += 18;
  doc.text("BILLING ADDRESS", 15, y);
  y += 7;
  doc.text(order?.customerAddress || "Vvip Addresses, Raj Nagar Extension Road\nRaj Nagar Extension Ghaziabad\nlondon 201001 India", 15, y);
  y += 18;
  doc.text("CONTACT DETAILS", 15, y);
  y += 7;
  doc.text((order?.customerEmail || "email@company.com") + "\n" + (order?.customerPhone || "+91-987 000 0000"), 15, y);
  y += 14;
  doc.text("ORDER SUMMARY", 15, y);
  y += 7;
  doc.text(`Sub Total: ৳${order?.subtotal?.toFixed(2) ?? "-"}`, 15, y);
  y += 7;
  doc.text(`Delivery: ৳${order?.deliveryMethod === "Priority" ? "60.00" : order?.deliveryMethod === "Standard" ? "45.00" : "-"}`, 15, y);
  y += 7;
  doc.text(`Tip: ৳${order?.tip?.toFixed(2) ?? "0.00"}`, 15, y);
  y += 7;
  doc.text(`Coupon Discount: ৳${order?.couponDiscount?.toFixed(2) ?? "0.00"}`, 15, y);
  y += 7;
  doc.text(`Total: ৳${order?.total?.toFixed(2) ?? "-"}`, 15, y);
  doc.save("invoice.pdf");
}
