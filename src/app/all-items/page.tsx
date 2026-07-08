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

import clientPromise from '@/lib/mongodb';

async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("MongoDB timeout")), 4000))
    ]);
    const db = client.db("culinary-canvas");
    const items = await db.collection("items").find({}).toArray();
    return structuredClone(items.map((item: any) => ({ ...item, _id: item._id ? item._id.toString() : undefined })));
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