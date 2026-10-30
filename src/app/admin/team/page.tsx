'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Plus, Trash2, Loader2, X, Pencil, Save } from 'lucide-react';

interface TeamMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  bioAr?: string;
  bioEn?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm = {
  nameAr: '', nameEn: '', positionAr: '', positionEn: '',
  bioAr: '', bioEn: '', image: '', email: '', phone: '',
  linkedin: '', twitter: '', featured: false, isActive: true, displayOrder: 0,
};

export default function AdminTeamPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team?limit=100');
      const data = await res.json();
      if (data.data) setTeam(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setShowForm(true);
    setForm({
      nameAr: member.nameAr, nameEn: member.nameEn,
      positionAr: member.positionAr, positionEn: member.positionEn,
      bioAr: member.bioAr || '', bioEn: member.bioEn || '',
      image: member.image || '', email: member.email || '', phone: member.phone || '',
      linkedin: member.linkedin || '', twitter: member.twitter || '',
      featured: member.featured, isActive: member.isActive, displayOrder: member.displayOrder,
    });
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
    if (!form.nameAr || !form.nameEn || !form.positionAr || !form.positionEn) {
      setError(rtl ? 'الاسم والمنصب باللغتين مطلوبان' : 'Name and position in both languages are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/team/${editingId}` : '/api/team', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        resetForm();
        fetchTeam();
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
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTeam();
      else alert(t('admin.errorOccurred'));
    } catch {
      alert(t('admin.errorOccurred'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{rtl ? 'الفريق' : 'Team'}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'إدارة أعضاء فريق العمل' : 'Manage team members'}</p>
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
                  <Input label={rtl ? 'الاسم (عربي) *' : 'Name (Arabic) *'} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'الاسم (إنجليزي) *' : 'Name (English) *'} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'المنصب (عربي) *' : 'Position (Arabic) *'} value={form.positionAr} onChange={(e) => setForm({ ...form, positionAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'المنصب (إنجليزي) *' : 'Position (English) *'} value={form.positionEn} onChange={(e) => setForm({ ...form, positionEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label={rtl ? 'نبذة (عربي)' : 'Bio (Arabic)'} value={form.bioAr} onChange={(e) => setForm({ ...form, bioAr: e.target.value })} rows={3} dir="rtl" />
                  <Textarea label={rtl ? 'نبذة (إنجليزي)' : 'Bio (English)'} value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'البريد الإلكتروني' : 'Email'} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <Input label={rtl ? 'الهاتف' : 'Phone'} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <Input label={rtl ? 'لينكدإن' : 'LinkedIn'} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                  <Input label={rtl ? 'تويتر' : 'Twitter'} value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
                  <Input label={rtl ? 'ترتيب العرض' : 'Display Order'} type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} min={0} />
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                    {rtl ? 'عضو مميز' : 'Featured'}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                    {rtl ? 'نشط' : 'Active'}
                  </label>
                </div>
                <CloudinaryUploader label={rtl ? 'الصورة الشخصية' : 'Photo'} folder="alrefai-united/team" value={form.image || undefined} onChange={(media) => setForm({ ...form, image: media?.url || '' })} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={resetForm}>{t('common.cancel')}</Button>
                  <Button type="submit" variant="gold" loading={saving}>
                    {editingId ? <><Save className="h-5 w-5" aria-hidden="true" />{rtl ? 'حفظ التعديلات' : 'Save Changes'}</> : <><Plus className="h-5 w-5" aria-hidden="true" />{rtl ? 'إضافة عضو' : 'Add Member'}</>}
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
        ) : team.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-body text-neutral-500">{rtl ? 'لا يوجد أعضاء بعد' : 'No team members yet'}</p>
          </div>
        ) : (
          team.map((member) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="elevated" padding="lg" className="h-full">
                <div className="flex items-start gap-4">
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image} alt="" className="w-14 h-14 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                      {(rtl ? member.nameAr : member.nameEn).charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="heading-card text-heading-sm text-primary-950 truncate">{rtl ? member.nameAr : member.nameEn}</h3>
                    <p className="text-caption text-neutral-500 truncate">{rtl ? member.positionAr : member.positionEn}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(member)} className="text-primary-700 hover:bg-primary-50" aria-label="Edit">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} disabled={deletingId === member.id} className="text-red-600 hover:bg-red-50" aria-label="Delete">
                      {deletingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                  <Badge variant={member.isActive ? 'success' : 'outline'} size="sm">{member.isActive ? (rtl ? 'نشط' : 'Active') : rtl ? 'غير نشط' : 'Inactive'}</Badge>
                  {member.featured && <Badge variant="gold" size="sm">{rtl ? 'مميز' : 'Featured'}</Badge>}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
