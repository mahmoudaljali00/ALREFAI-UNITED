'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Plus, Trash2, Loader2, X, Pencil, Save, Newspaper, Calendar } from 'lucide-react';

interface Post {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr?: string;
  excerptEn?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  categoryId?: string;
  category?: { id: string; nameAr: string; nameEn: string; slug: string };
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

const emptyForm = {
  titleAr: '', titleEn: '',
  excerptAr: '', excerptEn: '',
  contentAr: '', contentEn: '',
  featuredImage: '', categoryId: '', status: 'DRAFT' as Post['status'],
};

export default function AdminNewsPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?limit=100');
      const data = await res.json();
      if (data.data) setPosts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/public/categories');
      const data = await res.json();
      if (data.data) setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setShowForm(true);
    setForm({
      titleAr: post.titleAr, titleEn: post.titleEn,
      excerptAr: post.excerptAr || '', excerptEn: post.excerptEn || '',
      contentAr: '', contentEn: '',
      featuredImage: post.featuredImage || '',
      categoryId: post.categoryId || '',
      status: post.status,
    });
    // Load full content via detail endpoint
    fetch(`/api/news/${post.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setForm((f) => ({ ...f, contentAr: d.data.contentAr || '', contentEn: d.data.contentEn || '' }));
      })
      .catch(() => undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.titleAr || !form.titleEn || !form.contentAr || !form.contentEn) {
      setError(rtl ? 'العنوان والمحتوى باللغتين مطلوبان' : 'Title and content in both languages are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/news/${editingId}` : '/api/news', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || null,
          publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        resetForm();
        fetchPosts();
      } else {
        const data = await res.json();
        setError(data.error || t('admin.errorOccurred'));
      }
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
      else alert(t('admin.errorOccurred'));
    } catch {
      alert(t('admin.errorOccurred'));
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: Post['status']) => {
    const map = {
      PUBLISHED: { variant: 'success' as const, ar: 'منشور', en: 'Published' },
      DRAFT: { variant: 'outline' as const, ar: 'مسودة', en: 'Draft' },
      ARCHIVED: { variant: 'gold' as const, ar: 'مؤرشف', en: 'Archived' },
    };
    const s = map[status];
    return <Badge variant={s.variant} size="sm">{rtl ? s.ar : s.en}</Badge>;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{rtl ? 'الأخبار' : 'News'}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'إدارة المقالات والأخبار' : 'Manage articles and news'}</p>
        </div>
        <Button variant="gold" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? <X className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
          {showForm ? t('common.cancel') : t('admin.addNew')}
        </Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="elevated" padding="lg">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'العنوان (عربي) *' : 'Title (Arabic) *'} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'العنوان (إنجليزي) *' : 'Title (English) *'} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label={rtl ? 'المقتطف (عربي)' : 'Excerpt (Arabic)'} value={form.excerptAr} onChange={(e) => setForm({ ...form, excerptAr: e.target.value })} rows={2} dir="rtl" />
                  <Textarea label={rtl ? 'المقتطف (إنجليزي)' : 'Excerpt (English)'} value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} rows={2} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label={rtl ? 'المحتوى (عربي) *' : 'Content (Arabic) *'} value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={8} required dir="rtl" />
                  <Textarea label={rtl ? 'المحتوى (إنجليزي) *' : 'Content (English) *'} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={8} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="label">{rtl ? 'التصنيف' : 'Category'}</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="input"
                    >
                      <option value="">{rtl ? 'بدون تصنيف' : 'No category'}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{rtl ? c.nameAr : c.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">{rtl ? 'الحالة' : 'Status'}</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Post['status'] })}
                      className="input"
                    >
                      <option value="DRAFT">{rtl ? 'مسودة' : 'Draft'}</option>
                      <option value="PUBLISHED">{rtl ? 'منشور' : 'Published'}</option>
                      <option value="ARCHIVED">{rtl ? 'مؤرشف' : 'Archived'}</option>
                    </select>
                  </div>
                </div>
                <CloudinaryUploader label={rtl ? 'الصورة البارزة' : 'Featured Image'} folder="alrefai-united/news" value={form.featuredImage || undefined} onChange={(media) => setForm({ ...form, featuredImage: media?.url || '' })} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={resetForm}>{t('common.cancel')}</Button>
                  <Button type="submit" variant="gold" loading={saving}>
                    {editingId ? <><Save className="h-5 w-5" aria-hidden="true" />{rtl ? 'حفظ التعديلات' : 'Save Changes'}</> : <><Plus className="h-5 w-5" aria-hidden="true" />{rtl ? 'إضافة مقال' : 'Add Post'}</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" /></div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Newspaper className="h-10 w-10 mx-auto text-neutral-300 mb-3" aria-hidden="true" />
            <p className="text-body text-neutral-500">{rtl ? 'لا توجد مقالات بعد' : 'No posts yet'}</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="elevated" padding="none" className="h-full overflow-hidden flex flex-col">
                <div className="relative aspect-video bg-primary-100">
                  {post.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.featuredImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="h-10 w-10 text-primary-300" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">{statusBadge(post.status)}</div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="heading-card text-heading-sm text-primary-950 line-clamp-2 mb-2">
                    {rtl ? post.titleAr : post.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-caption text-neutral-500 mb-4">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(rtl ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    {post.category && <span className="text-gold-600">• {rtl ? post.category.nameAr : post.category.nameEn}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-neutral-100">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(post)} className="text-primary-700 hover:bg-primary-50">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      {rtl ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} disabled={deletingId === post.id} className="text-red-600 hover:bg-red-50 ms-auto" aria-label={t('admin.deleteItem')}>
                      {deletingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
