import React from 'react';
import AllItemsClientView from './AllItemsClientView';

interface MenuItem {
  _id?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/items`, {
      cache: 'no-store', // Ensure fresh items when admins edit or delete items
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch menu items on server:", error);
    return [];
  }
}

export default async function AllProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const initialItems = await getAllMenuItems();

  return <AllItemsClientView initialMenuItems={initialItems} searchParams={searchParams} />;
}