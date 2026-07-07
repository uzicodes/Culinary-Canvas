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

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/items`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
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