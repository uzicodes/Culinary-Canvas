'use client';

import Image from 'next/image';
import { m as motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { useProfilePictureUpload } from '@/hooks/useProfilePictureUpload';

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userEmail: string;
  userName: string;
  onUploadSuccess: (imageUrl: string) => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function ProfilePictureUpload({ currentImage, userEmail, userName, onUploadSuccess }: ProfilePictureUploadProps) {
  const { state, fileInputRef, handleFileSelect, handleUpload, handleCancel } = useProfilePictureUpload(userEmail, onUploadSuccess);
  
  const displayImage = state.previewUrl || currentImage;

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <motion.div whileHover={{ scale: 1.02 }} className="w-28 h-28 rounded-2xl overflow-hidden bg-black shadow-xl border-4 border-[#BCE334]/20">
          {displayImage ? (
            <Image src={displayImage} alt={userName} width={112} height={112} className="w-full h-full object-cover" unoptimized={state.previewUrl ? true : false} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-gray-800">
              <span className="text-3xl font-black text-[#BCE334]">{getInitials(userName)}</span>
            </div>
          )}
        </motion.div>

        {!state.previewUrl && (
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#BCE334] p-2.5 rounded-xl shadow-lg hover:bg-[#d4f542] transition-colors">
            <Camera size={16} className="text-black" />
          </motion.button>
        )}

        <AnimatePresence>
          {state.isUploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#BCE334] animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input id={`field-profile-pic`} ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileSelect} className="hidden" />

      <AnimatePresence>
        {state.uploadProgress !== 'idle' && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#BCE334]">
            {state.uploadProgress === 'compressing' && '⚡ Optimizing image...'}
            {state.uploadProgress === 'uploading' && '☁️ Uploading to cloud...'}
            {state.uploadProgress === 'saving' && '💾 Saving to profile...'}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-3 py-2 rounded-lg">
            <AlertCircle size={12} /> {state.error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {state.rateLimitError && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">{state.rateLimitError}</div>
      )}

      <AnimatePresence>
        {state.previewUrl && !state.isUploading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4 flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              <X size={12} /> Cancel
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUpload} disabled={state.isUploading} className="flex items-center gap-1.5 px-4 py-2 bg-[#BCE334] text-black rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#BCE334]/30 hover:bg-[#d4f542] transition-colors disabled:opacity-50">
              <Check size={12} /> Save Photo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!state.previewUrl && <p className="mt-3 text-[9px] text-gray-400 font-medium uppercase tracking-wider">Max 100KB • JPG, PNG, WebP</p>}
      {state.selectedFile && <p className="mt-1 text-[9px] text-[#BCE334] font-bold uppercase tracking-wider">{(state.selectedFile.size / 1024).toFixed(1)}KB Ready</p>}
    </div>
  );
}
