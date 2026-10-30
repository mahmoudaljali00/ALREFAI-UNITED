'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Plus, Trash2, Loader2, Handshake, X, RefreshCw } from 'lucide-react';

interface Client {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  website?: string;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminClientsPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nameAr: '', nameEn: '', logo: '', website: '', featured: false, displayOrder: 0 });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients?limit=100');
      const data = await res.json();
      if (data.data) setClients(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.nameAr || !form.nameEn || !form.logo) {
      setError(rtl ? 'الاسم باللغتين والشعار مطلوبة' : 'Both names and a logo are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ nameAr: '', nameEn: '', logo: '', website: '', featured: false, displayOrder: 0 });
        fetchClients();
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
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
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
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.clients')}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'إدارة شعارات العملاء والشركاء' : 'Manage client and partner logos'}</p>
        </div>
        <Button variant="gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
          {showForm ? t('common.cancel') : t('admin.addNew')}
        </Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="elevated" padding="lg">
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'الاسم (عربي) *' : 'Name (Arabic) *'} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'الاسم (إنجليزي) *' : 'Name (English) *'} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <CloudinaryUploader label={rtl ? 'الشعار *' : 'Logo *'} folder="alrefai-united/clients" value={form.logo || undefined} onChange={(media) => setForm({ ...form, logo: media?.url || '' })} />
                  <div className="space-y-6">
                    <Input label={rtl ? 'الموقع الإلكتروني' : 'Website'} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-body">{t('common.featured')}</span>
                    </label>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                  <Button type="submit" variant="gold" loading={saving}>{rtl ? 'إضافة العميل' : 'Add Client'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{rtl ? 'العميل' : 'Client'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{rtl ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{rtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500" aria-hidden="true" /></td></tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Handshake className="h-10 w-10 mx-auto text-neutral-300 mb-3" aria-hidden="true" />
                    <p className="text-body text-neutral-500">{rtl ? 'لا يوجد عملاء بعد' : 'No clients yet'}</p>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {client.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={client.logo} alt="" className="w-12 h-12 rounded-lg object-contain bg-white border border-neutral-100 p-1" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center"><Handshake className="h-5 w-5 text-primary-500" aria-hidden="true" /></div>
                        )}
                        <div>
                          <div className="font-medium text-neutral-900">{rtl ? client.nameAr : client.nameEn}</div>
                          <div className="text-body-sm text-neutral-500">{rtl ? client.nameEn : client.nameAr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={client.isActive ? 'success' : 'outline'} size="sm">{client.isActive ? (rtl ? 'نشط' : 'Active') : rtl ? 'غير نشط' : 'Inactive'}</Badge>
                      {client.featured && <Badge variant="gold" size="sm" dot className="ms-2">{rtl ? 'مميز' : 'Featured'}</Badge>}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label={t('admin.deleteItem')}
                      >
                        {deletingId === client.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <p className="text-body-sm text-neutral-400 flex items-center gap-2">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        {rtl ? 'يتحدث قسم الشركاء في الصفحة الرئيسية تلقائياً من هذه القائمة.' : 'The homepage partners section updates automatically from this list.'}
      </p>
    </div>
  );
}
