import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await req.json();
  const result = await db.collection('members').insertOne({ ...data, createdAt: new Date() });
  return new Response(JSON.stringify({ success: true, userId: result.insertedId }), { status: 201 });
}

export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await req.json();
    
    const { email, profilePicture, ...otherUpdates } = data;
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const updateFields: Record<string, any> = { ...otherUpdates };
    
    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
      updateFields.profilePictureUpdatedAt = new Date();
    }

    const result = await db.collection('members').updateOne(
      { email: email },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Profile updated successfully',
      modifiedCount: result.modifiedCount
    }), { status: 200 });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Update failed' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const member = await db.collection('members').findOne(
      { email: email },
      { projection: { password: 0, resetToken: 0, resetTokenExpiry: 0 } }
    );

    if (!member) {
      return new Response(JSON.stringify({ profilePicture: null, notFound: true }), { status: 200 });
    }

    return new Response(JSON.stringify(member), { status: 200 });
  } catch (error: any) {
    console.error('Get member error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch member' }), { status: 500 });
  }
}