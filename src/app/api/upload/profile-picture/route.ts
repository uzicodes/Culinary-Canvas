import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  version: number;
}

export async function POST(request: Request) {
  try {
    // ── 1. Authenticate via session ──────────────────────────────
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    const userEmail = session.user.email as string;

    // ── 2. Parse & validate file ─────────────────────────────────
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 100KB. Your file: ${(file.size / 1024).toFixed(1)}KB` },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // ── 3. Upload to Cloudinary with Fixed Public ID ─────────────
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'culinary-canvas/user_dp',
          public_id: `user_${userId}`,    // Fixed, deterministic ID — overwrites previous
          overwrite: true,                  // Replace the existing asset in-place
          invalidate: true,                 // Purge CDN cache globally so new image serves instantly
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' },
          ],
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as unknown as CloudinaryUploadResult);
        }
      ).end(buffer);
    });

    // ── 4. Update MongoDB atomically ─────────────────────────────
    const now = new Date();

    const client = await clientPromise;
    const db = client.db('culinary-canvas');

    const updateResult = await db.collection('members').updateOne(
      { email: userEmail },
      {
        $set: {
          profilePicture: uploadResult.secure_url,
          profilePictureUpdatedAt: now,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // ── 5. Return result with timestamp for cache-busting ────────
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      profilePictureUpdatedAt: now.toISOString(),
    });

  } catch (error: any) {
    console.error('Profile picture upload failed:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
