"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Utensils, ArrowLeft, CheckCircle, Upload, AlignLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function AddItemPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Burgers", 
    description: ""
  });

  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        // 'folder' is an allowed parameter for unsigned uploads
        folder: "culinary-canvas/items", 
        theme: "minimal",
        colors: { primary: "#BCE334" },
        // REMOVED BOTH: use_filename and unique_filename to avoid any conflict
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          // Cloudinary will now generate its own safe ID like 'hluwiapjhw5zxmajot0s'
          setImageUrl(result.info.secure_url);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image first!");
    
    setLoading(true);
    try {
      const res = await fetch("/api/items/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensures price is saved as a number for your 'Low to High' sorting logic
        body: JSON.stringify({ 
          ...formData, 
          price: Number(formData.price), 
          image: imageUrl 
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setImageUrl("");
        setFormData({ name: "", price: "", category: "Burgers", description: "" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#F7FBE7] py-20">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
          
          <div className="flex justify-between items-center mb-8">
            <Link href="/all-items" className="p-2 bg-black text-[#BCE334] rounded-xl hover:scale-110 transition-transform">
              <ArrowLeft size={18} />
            </Link>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              Add To <span className="text-sky-600">Menu</span>
            </h2>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cloudinary Image Upload with Folder Logic */}
            <div 
              onClick={handleUpload}
              className={`border-2 border-dashed rounded-[2rem] p-8 cursor-pointer flex flex-col items-center gap-2 transition-all
                ${imageUrl ? 'border-[#BCE334] bg-[#BCE334]/5' : 'border-gray-200 hover:border-sky-600'}`}
            >
import Image from "next/image";
                <Image src={imageUrl} width={400} height={160} className="h-40 w-full object-cover rounded-[1.5rem] shadow-lg" alt="Preview" />
              ) : (
                <>
                  <Upload className="text-gray-400" size={30} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Upload Dish Image<br/>
                    <span className="text-sky-500 font-bold">(Auto-saves to culinary-canvas/items)</span>
                  </span>
                </>
              )}
            </div>

            {/* Dish Name */}
            <div className="relative group">
              <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600" />
              <input 
                required 
                placeholder="Dish Name" 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#BCE334] transition-all shadow-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              {/* Price Field */}
              <div className="relative flex-1 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400 group-focus-within:text-sky-600">৳</span>
                <input 
                  type="number" 
                  required 
                  placeholder="Price" 
                  className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#BCE334] transition-all shadow-sm"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative flex-1 group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600" />
                <select 
                  className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#BCE334] appearance-none cursor-pointer shadow-sm"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Burgers</option>
                  <option>Pizza</option>
                  <option>Fast-Food</option>
                  <option>Set Menus</option>
                  <option>Appetizers</option>
                  <option>Chinese</option>
                  <option>Italian</option>
                  <option>Traditional</option>
                  <option>Pakistani</option>
                  <option>Coffee</option>
                  <option>Desserts</option>
                  <option>Drinks & Beverages</option>
                </select>
              </div>
            </div>

            {/* Description Area */}
            <div className="relative group">
              <AlignLeft className="absolute left-4 top-5 w-4 h-4 text-gray-400 group-focus-within:text-sky-600" />
              <textarea 
                placeholder="Write a delicious description for this item..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#BCE334] transition-all min-h-[120px] resize-none shadow-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 justify-center text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50 py-2 rounded-xl border border-green-100">
                  <CheckCircle size={14} /> Menu & Cloudinary Updated!
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={loading} 
              className="w-full bg-black text-[#BCE334] py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              {loading ? "Syncing with Cloudinary..." : "Add to Kitchen Menu"} <Plus size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}