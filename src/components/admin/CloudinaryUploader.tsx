'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UploadCloud, X, Loader2, ImageIcon } from 'lucide-react';

export interface UploadedMedia {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

interface CloudinaryUploaderProps {
  value?: string;
  onChange: (media: UploadedMedia | null) => void;
  folder?: string;
  label?: string;
  className?: string;
}

/**
 * Uploads a single image through /api/media/upload (server-side Cloudinary).
 * The resulting secure URL is stored on the entity (service, project, ...).
 */
export function CloudinaryUploader({
  value,
  onChange,
  folder = 'alrefai-united/general',
  label = 'Image',
  className,
}: CloudinaryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      onChange({
        url: data.data.url,
        publicId: data.data.publicId,
        width: data.data.width,
        height: data.data.height,
      });
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="label">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = '';
        }}
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden border border-neutral-200 group aspect-video"
          >
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" unoptimized={value.startsWith('http')} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange(null)}
                className="opacity-0 group-hover:opacity-100 p-2.5 rounded-full bg-red-500 text-white transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="dropzone"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) upload(file);
            }}
            className={cn(
              'w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer',
              dragOver ? 'border-gold-400 bg-gold-50' : 'border-neutral-300 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/50'
            )}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" aria-hidden="true" />
                <span className="text-body-sm text-neutral-500">Uploading...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <UploadCloud className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="text-body-sm font-medium text-neutral-700">Click to upload or drag &amp; drop</p>
                  <p className="text-caption text-neutral-400 mt-1">JPEG, PNG, WebP, AVIF or GIF — max 10MB</p>
                </div>
                <ImageIcon className="h-4 w-4 text-neutral-300" aria-hidden="true" />
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}
