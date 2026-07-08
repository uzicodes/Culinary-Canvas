import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuClientView from './MenuClientView';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

import clientPromise from '@/lib/mongodb';

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("MongoDB timeout")), 4000))
    ]);
    const db = client.db("culinary-canvas");
    const items = await db.collection("items").find({}).toArray();
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Error fetching menu on server:", error);
    return [];
  }
}

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="min-h-screen bg-white pt-28">
      <Header />
      <MenuClientView initialMenuItems={menuItems} />
      <Footer />
    </div>
  );
}