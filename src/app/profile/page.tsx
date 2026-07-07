import React from 'react';
import { getServerSession } from 'next-auth/next';
import { headers } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileClientView from './ProfileClientView';

async function getProfileData(email: string, isAdmin: boolean) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';
    
    const [memberRes, ordersRes] = await Promise.all([
      fetch(`${baseUrl}/api/members?email=${encodeURIComponent(email)}`, { cache: 'no-store' }),
      !isAdmin ? fetch(`${baseUrl}/api/orders/my-orders`, { 
        cache: 'no-store',
        headers: { Cookie: cookieHeader }
      }) : Promise.resolve(null)
    ]);

    const memberData = memberRes.ok ? await memberRes.json() : {};
    const ordersData = ordersRes && ordersRes.ok ? await ordersRes.json() : [];

    return {
      profilePicture: memberData.profilePicture || null,
      totalOrderCount: Array.isArray(ordersData) ? ordersData.length : 0,
    };
  } catch (error) {
    console.error("Failed to fetch profile data on server:", error);
    return { profilePicture: null, totalOrderCount: 0 };
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any);

  if (!session?.user) {
    return <ProfileClientView session={null} initialPicture={null} initialOrderCount={0} />;
  }

  const isAdmin = (session.user as any)?.role === 'admin';
  const { profilePicture, totalOrderCount } = await getProfileData(session.user.email || '', isAdmin);

  return (
    <ProfileClientView 
      session={session} 
      initialPicture={profilePicture} 
      initialOrderCount={totalOrderCount} 
    />
  );
}