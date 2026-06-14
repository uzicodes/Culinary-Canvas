import { useReducer, useCallback, useRef } from 'react';
import imageCompression from 'browser-image-compression';

interface UploadState {
  isUploading: boolean;
  previewUrl: string | null;
  selectedFile: File | null;
  error: string | null;
  rateLimitError: string | null;
  uploadProgress: 'idle' | 'compressing' | 'uploading' | 'saving';
}

type UploadAction =
  | { type: 'SET_UPLOADING', payload: boolean }
  | { type: 'SET_PREVIEW_URL', payload: string | null }
  | { type: 'SET_SELECTED_FILE', payload: File | null }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_RATE_LIMIT_ERROR', payload: string | null }
  | { type: 'SET_PROGRESS', payload: UploadState['uploadProgress'] }
  | { type: 'RESET' };

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case 'SET_UPLOADING': return { ...state, isUploading: action.payload };
    case 'SET_PREVIEW_URL': return { ...state, previewUrl: action.payload };
    case 'SET_SELECTED_FILE': return { ...state, selectedFile: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload };
    case 'SET_RATE_LIMIT_ERROR': return { ...state, rateLimitError: action.payload };
    case 'SET_PROGRESS': return { ...state, uploadProgress: action.payload };
    case 'RESET': return {
      ...state,
      previewUrl: null,
      selectedFile: null,
      error: null,
      rateLimitError: null,
      uploadProgress: 'idle'
    };
    default: return state;
  }
}

const MAX_FILE_SIZE = 100 * 1024; // 100KB
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.095,
  maxWidthOrHeight: 400,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
};

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function useProfilePictureUpload(userEmail: string, onUploadSuccess: (url: string) => void) {
  const [state, dispatch] = useReducer(uploadReducer, {
    isUploading: false,
    previewUrl: null,
    selectedFile: null,
    error: null,
    rateLimitError: null,
    uploadProgress: 'idle'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_PROGRESS', payload: 'idle' });

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
      return;
    }

    let processedFile = file;

    if (file.size > MAX_FILE_SIZE) {
      dispatch({ type: 'SET_PROGRESS', payload: 'compressing' });
      try {
        processedFile = await imageCompression(file, COMPRESSION_OPTIONS);
        if (processedFile.size > MAX_FILE_SIZE) {
          dispatch({ type: 'SET_ERROR', payload: "File still too large after compression. Please use a smaller image." });
          dispatch({ type: 'SET_PROGRESS', payload: 'idle' });
          return;
        }
      } catch (compressionError) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to compress image. Please try a smaller file.' });
        dispatch({ type: 'SET_PROGRESS', payload: 'idle' });
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch({ type: 'SET_PREVIEW_URL', payload: e.target?.result as string });
    };
    reader.readAsDataURL(processedFile);

    dispatch({ type: 'SET_SELECTED_FILE', payload: processedFile });
    dispatch({ type: 'SET_PROGRESS', payload: 'idle' });
  }, []);

  const handleUpload = async () => {
    if (!state.selectedFile || !userEmail) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      dispatch({ type: 'SET_ERROR', payload: 'Cloudinary configuration missing.' });
      return;
    }

    dispatch({ type: 'SET_UPLOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_RATE_LIMIT_ERROR', payload: null });

    try {
      dispatch({ type: 'SET_PROGRESS', payload: 'uploading' });

      const formData = new FormData();
      formData.append('file', state.selectedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'culinary-canvas/user_dp');
      formData.append('public_id', "user_" + userEmail.replace(/[^a-zA-Z0-9]/g, '_') + "_" + Date.now());

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/" + CLOUDINARY_CLOUD_NAME + "/image/upload",
        { method: 'POST', body: formData }
      );

      const cloudinaryResult = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryResult.error?.message || 'Upload to Cloudinary failed');
      }

      const imageUrl = cloudinaryResult.secure_url;

      dispatch({ type: 'SET_PROGRESS', payload: 'saving' });
      const updateResponse = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, profilePicture: imageUrl }),
      });

      if (updateResponse.status === 429) {
        dispatch({ type: 'SET_RATE_LIMIT_ERROR', payload: 'You are performing this action too fast.' });
        dispatch({ type: 'SET_UPLOADING', payload: false });
        dispatch({ type: 'SET_PROGRESS', payload: 'idle' });
        return;
      }

      const updateResult = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(updateResult.error || 'Failed to update profile');
      }

      onUploadSuccess(imageUrl);
      dispatch({ type: 'RESET' });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Upload failed. Please try again.' });
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    state,
    fileInputRef,
    handleFileSelect,
    handleUpload,
    handleCancel
  };
}
