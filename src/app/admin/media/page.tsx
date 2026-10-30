'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Trash2, Loader2, Copy, Check, Images, RefreshCw } from 'lucide-react';

interface MediaItem {
  id: string;
  originalName: string;
  url: string;
  publicId?: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  uploadedBy?: { name?: string; email: string };
}

export default function AdminMediaPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const searchRef = useRef(search);
  searchRef.current = search;

  const fetchMedia = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '60' });
      if (q) params.set('search', q);
      const res = await fetch(`/api/media?${params}`);
      const data = await res.json();
      if (data.data) setMedia(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== id));
      else alert(t('admin.errorOccurred'));
    } catch {
      alert(t('admin.errorOccurred'));
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.media')}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'مكتبة الوسائط — Cloudinary' : 'Media library — powered by Cloudinary'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => fetchMedia(searchRef.current)} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="gold" onClick={() => setUploadOpen(!uploadOpen)}>
            {uploadOpen ? (rtl ? 'إغلاق' : 'Close') : rtl ? 'رفع صورة' : 'Upload Image'}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {uploadOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <CloudinaryUploader
                label={rtl ? 'صورة جديدة' : 'New image'}
                folder="alrefai-united/general"
                onChange={(media) => {
                  if (media) {
                    setUploadOpen(false);
                    fetchMedia(searchRef.current);
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <div className="max-w-sm w-full">
          <Input
            placeholder={rtl ? 'بحث في الوسائط...' : 'Search media...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchMedia(search);
            }}
          />
        </div>
        <Button variant="outline" size="md" onClick={() => fetchMedia(search)}>
          {rtl ? 'بحث' : 'Search'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" /></div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
          <Images className="h-14 w-14 mx-auto text-neutral-200 mb-4" aria-hidden="true" />
          <p className="text-body text-neutral-500">{rtl ? 'لا توجد ملفات بعد — ارفع صورتك الأولى' : 'No media yet — upload your first image'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 10) * 0.04 }}
              className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-body-sm font-medium text-neutral-800 truncate" title={item.originalName}>{item.originalName}</p>
                <p className="text-caption text-neutral-400 mt-0.5">
                  {item.width && item.height ? `${item.width}×${item.height}` : ''} · {formatSize(item.size)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(item)} aria-label="Copy URL" className="flex-1 justify-center">
                    {copiedId === item.id ? <Check className="h-4 w-4 text-green-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="flex-1 justify-center text-red-600 hover:bg-red-50"
                    aria-label={t('admin.deleteItem')}
                  >
                    {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
