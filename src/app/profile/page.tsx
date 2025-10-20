"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const user = {
  name: "Utsho Heaven Chowdhury",
  email: "utshozi11@email.com",
  avatar: "/profile-avatar.png", // Place a default avatar in public/
  phone: "+1 234 567 8901",
  address: "123 Main St, Springfield, USA",
  joined: "March 2024",
  orders: 12,
  favorites: 5,
  loyaltyPoints: 20,
};

const ProfilePage = () => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(user);
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    address: profile.address,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    setProfile({ ...profile, ...form });
    setEditing(false);
  };
  const handleCancel = () => {
    setForm({ name: profile.name, phone: profile.phone, address: profile.address });
    setEditing(false);
  };

  return (
    <>
      <Header />
  <section className="relative min-h-screen pt-16 pb-10 px-4 flex items-start justify-center">
      {/* Full-page Gradient background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image src="/gradient.png" alt="Gradient background" fill className="w-full h-full object-cover" priority />
      </div>
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 flex flex-col items-center relative max-w-2xl w-full mx-auto">
        <div className="relative w-28 h-28 mb-4">
          <Image
            src={user.avatar}
            alt="Profile Avatar"
            fill
            className="rounded-full object-cover border-4 border-primary-500"
            priority
          />
        </div>
  <h2 className="text-2xl font-bold mb-1 text-black">
    {editing ? (
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border rounded px-2 py-1 w-full max-w-xs bg-white"
      />
    ) : (
      profile.name
    )}
  </h2>
        <p className="text-gray-500 mb-2">{user.email}</p>
        <div className="flex gap-4 mb-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            {user.loyaltyPoints} Loyalty Points
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            {user.orders} Orders
          </span>

        </div>
        <div className="w-full border-t pt-4 mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">Phone:</span>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full max-w-xs bg-white"
              />
            ) : (
              <span className="text-gray-900">{profile.phone}</span>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">Address:</span>
            {editing ? (
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full max-w-xs bg-white"
              />
            ) : (
              <span className="text-gray-900 text-right max-w-[60%] truncate">{profile.address}</span>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">Member Since:</span>
            <span className="text-gray-900">{user.joined}</span>
          </div>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-6">
          {editing ? (
            <>
              <button onClick={handleSave} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">Save</button>
              <button onClick={handleCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">Edit Profile</button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">View Order History</button>
              <button onClick={() => {
                /* Log out logic here if needed */
                router.push('/');
              }} className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto">Log Out</button>
            </>
          )}
        </div>
      </div>
      </section>
    </>
  );
};

export default ProfilePage;
