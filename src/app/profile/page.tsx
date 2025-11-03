"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const defaultUser = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "/profile-avatar.png",
    phone: "",
    address: "",
    joined: "",
    orders: 0,
    favorites: 0,
    loyaltyPoints: 0,
  };
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(defaultUser);
  const [form, setForm] = useState({
    name: defaultUser.name,
    phone: defaultUser.phone,
    address: defaultUser.address,
    avatar: defaultUser.avatar,
    email: defaultUser.email,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setForm({ ...form, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = () => {
    setProfile({ ...profile, ...form });
    setEditing(false);
    setAvatarPreview(null);
  };
  const handleCancel = () => {
    setForm({ name: profile.name, phone: profile.phone, address: profile.address, avatar: profile.avatar, email: profile.email });
    setEditing(false);
    setAvatarPreview(null);
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">Please login to view your profile</h2>
          <p className="mb-6 text-gray-700">If you don&apos;t have an account, please register below.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Login</Link>
            <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Register</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Header />
      <section className="relative min-h-screen pt-16 pb-10 px-4 flex items-start justify-center">
        {/* Full-page Gradient background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image src="/gradient.png" alt="Gradient background" fill className="w-full h-full object-cover" priority />
      </div>
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 flex flex-col items-center relative max-w-2xl w-full mx-auto">
        <div className="flex items-center mb-4">
          <div className="relative w-28 h-28">
            <Image
              src={avatarPreview || profile.avatar}
              alt="Profile Avatar"
              fill
              className="rounded-full object-cover border-4 border-primary-500"
              priority
            />
          </div>
          {editing && (
            <div className="ml-6 flex flex-col items-start">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2 text-xs"
              />
              <span className="text-xs text-gray-500 mt-1">Change profile picture</span>
            </div>
          )}
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
        <p className="text-gray-500 mb-2">{profile.email}</p>
        <div className="flex gap-4 mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            {profile.orders} Orders
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
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{profile.email}</span>
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
              <span className="text-gray-900 text-right max-w-[60%] truncate">{profile.address || ""}</span>
            )}
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">Member Since:</span>
            <span className="text-gray-900">{profile.joined}</span>
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
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-6 rounded-lg transition-colors w-full sm:w-auto"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
      </section>
    </>
  );
};

export default ProfilePage;
