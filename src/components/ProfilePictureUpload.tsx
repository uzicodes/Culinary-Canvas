'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { m as motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Check, Loader2, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userEmail: string;
  userName: string;
  onUploadSuccess: (imageUrl: string) => void;
}

const MAX_FILE_SIZE = 100 * 1024; // 100KB
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.095, // ~97KB to be safe under 100KB
  maxWidthOrHeight: 400,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
};

// Cloudinary unsigned upload configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ProfilePictureUpload({
  currentImage,
  userEmail,
  userName,
  onUploadSuccess
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'compressing' | 'uploading' | 'saving'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadProgress('idle');

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    let processedFile = file;

    // If file is over 100KB, compress it
    if (file.size > MAX_FILE_SIZE) {
      setUploadProgress('compressing');
      try {
        processedFile = await imageCompression(file, COMPRESSION_OPTIONS);

        // Check if compression was successful
        if (processedFile.size > MAX_FILE_SIZE) {
          setError(`File still too large after compression (${(processedFile.size / 1024).toFixed(1)}KB). Please use a smaller image.`);
          setUploadProgress('idle');
          return;
        }
      } catch (compressionError) {
        console.error('Compression failed:', compressionError);
        setError('Failed to compress image. Please try a smaller file.');
        setUploadProgress('idle');
        return;
      }
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(processedFile);

    setSelectedFile(processedFile);
    setUploadProgress('idle');
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !userEmail) return;

    // Validate Cloudinary config
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError('Cloudinary configuration missing. Please check environment variables.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setRateLimitError(null);

    try {
      // Upload directly to Cloudinary (unsigned upload)
      setUploadProgress('uploading');

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'culinary-canvas/user_dp');
      formData.append('public_id', `user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudinaryResult = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryResult.error?.message || 'Upload to Cloudinary failed');
      }

      const imageUrl = cloudinaryResult.secure_url;

      // Update user profile in DB
      setUploadProgress('saving');
      const updateResponse = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          profilePicture: imageUrl,
        }),
      });

      if (updateResponse.status === 429) {
        setRateLimitError('You are performing this action too fast. Please wait a moment.');
        setIsUploading(false);
        setUploadProgress('idle');
        return;
      }

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.error || 'Failed to update profile');
      }

      // Success!
      onUploadSuccess(imageUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadProgress('idle');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    setUploadProgress('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="flex flex-col items-center">
      {/* Profile Picture Container */}
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="w-28 h-28 rounded-2xl overflow-hidden bg-black shadow-xl border-4 border-[#BCE334]/20"
        >
          {displayImage ? (
            <Image
              src={displayImage}
              alt={userName}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              unoptimized={previewUrl ? true : false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-gray-800">
              <span className="text-3xl font-black text-[#BCE334]">
                {getInitials(userName)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Camera Button Overlay */}
        {!previewUrl && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-[#BCE334] p-2.5 rounded-xl shadow-lg hover:bg-[#d4f542] transition-colors"
          >
            <Camera size={16} className="text-black" />
          </motion.button>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-[#BCE334] animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Progress Status */}
      <AnimatePresence>
        {uploadProgress !== 'idle' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#BCE334]"
          >
            {uploadProgress === 'compressing' && '⚡ Optimizing image...'}
            {uploadProgress === 'uploading' && '☁️ Uploading to cloud...'}
            {uploadProgress === 'saving' && '💾 Saving to profile...'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-3 py-2 rounded-lg"
          >
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      {rateLimitError && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">
          {rateLimitError}
        </div>
      )}

      {/* Action Buttons */}
      <AnimatePresence>
        {previewUrl && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              <X size={12} /> Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#BCE334] text-black rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#BCE334]/30 hover:bg-[#d4f542] transition-colors disabled:opacity-50"
            >
              <Check size={12} /> Save Photo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Size Info */}
      {!previewUrl && (
        <p className="mt-3 text-[9px] text-gray-400 font-medium uppercase tracking-wider">
          Max 100KB • JPG, PNG, WebP
        </p>
      )}

      {/* Selected file size indicator */}
      {selectedFile && (
        <p className="mt-1 text-[9px] text-[#BCE334] font-bold uppercase tracking-wider">
          {(selectedFile.size / 1024).toFixed(1)}KB Ready
        </p>
      )}
    </div>
  );
}
