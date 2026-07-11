import React from 'react';
import { getServerSession } from 'next-auth/next';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/authOptions';
import ProfileClientView from './ProfileClientView';

import clientPromise from '@/lib/mongodb';

async function getProfileData(email: string, isAdmin: boolean) {
  try {
    if (!email) return { profilePicture: null, profilePictureUpdatedAt: null, totalOrderCount: 0 };
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("MongoDB timeout")), 4000))
    ]);
    const db = client.db("culinary-canvas");
    const [member, ordersCount] = await Promise.all([
      db.collection("members").findOne({ email }),
      !isAdmin ? db.collection("orders").countDocuments({ userEmail: email }) : Promise.resolve(0)
    ]);
    return {
      profilePicture: member?.profilePicture || null,
      profilePictureUpdatedAt: member?.profilePictureUpdatedAt
        ? (member.profilePictureUpdatedAt as Date).toISOString()
        : null,
      totalOrderCount: ordersCount || 0,
    };
  } catch (error) {
    console.error("Failed to fetch profile data on server:", error);
    return { profilePicture: null, profilePictureUpdatedAt: null, totalOrderCount: 0 };
  }
}

export default async function ProfilePage() {
  const session: any = await getServerSession(authOptions as any);

  if (!session?.user) {
    return <ProfileClientView session={null} initialPicture={null} initialPictureUpdatedAt={null} initialOrderCount={0} />;
  }

  const isAdmin = (session.user as any)?.role === 'admin';
  const { profilePicture, profilePictureUpdatedAt, totalOrderCount } = await getProfileData(session.user.email || '', isAdmin);

  return (
    <ProfileClientView 
      session={session} 
      initialPicture={profilePicture}
      initialPictureUpdatedAt={profilePictureUpdatedAt}
      initialOrderCount={totalOrderCount} 
    />
  );
}