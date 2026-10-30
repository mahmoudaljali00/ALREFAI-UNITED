'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Mail, MailOpen, Loader2, X, Reply, Trash2, Calendar } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact?limit=50');
      const data = await res.json();
      if (data.data) {
        setMessages(data.data);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, isRead: true, isReplied: msg.isReplied }),
        });
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const markReplied = async (msg: Message) => {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, isRead: true, isReplied: !msg.isReplied }),
      });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isReplied: !m.isReplied } : m)));
      if (selected?.id === msg.id) setSelected({ ...msg, isReplied: !msg.isReplied });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) return;
    setDeletingId(id);
    try {
      // ContactMessage deletion is done through the API using PUT (no DELETE endpoint) — mark deleted via UI only
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' }).catch(() => null);
      if (res && res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSelected(null);
      } else {
        alert(rtl ? 'لا يمكن حذف الرسائل حالياً' : 'Message deletion is not available yet');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.messages')}</h1>
          <p className="text-body text-neutral-600 mt-1">
            {rtl ? 'رسائل نموذج التواصل من الموقع' : 'Contact form submissions from the website'} — {unreadCount} {rtl ? 'غير مقروءة' : 'unread'}
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500" aria-hidden="true" /></div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="h-10 w-10 mx-auto text-neutral-300 mb-3" aria-hidden="true" />
              <p className="text-body text-neutral-500">{rtl ? 'لا توجد رسائل' : 'No messages'}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-start p-5 hover:bg-neutral-50 transition-colors ${selected?.id === msg.id ? 'bg-primary-50' : ''} ${!msg.isRead ? 'border-s-4 border-gold-400' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className={`font-medium text-sm ${!msg.isRead ? 'text-primary-950' : 'text-neutral-700'}`}>
                    {msg.name}
                  </span>
                  <span className="text-caption text-neutral-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString(rtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <p className="text-body-sm text-neutral-600 truncate font-medium">{msg.subject}</p>
                <p className="text-body-sm text-neutral-500 truncate">{msg.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  {!msg.isRead ? <Mail className="h-3.5 w-3.5 text-gold-500" aria-hidden="true" /> : <MailOpen className="h-3.5 w-3.5 text-neutral-300" aria-hidden="true" />}
                  {msg.isReplied && <Badge variant="success" size="sm"><Reply className="h-3 w-3" aria-hidden="true" />{rtl ? 'تم الرد' : 'Replied'}</Badge>}
                </div>
              </button>
            ))
          )}
        </motion.div>

        {/* Detail */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 lg:p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="heading-card text-heading-lg text-primary-950">{selected.subject}</h2>
                    <p className="text-body-sm text-neutral-500 mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {new Date(selected.createdAt).toLocaleString(rtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(null)} aria-label={t('common.cancel')}>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>

                <dl className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: rtl ? 'الاسم' : 'Name', value: selected.name },
                    { label: rtl ? 'البريد الإلكتروني' : 'Email', value: selected.email },
                    { label: rtl ? 'الهاتف' : 'Phone', value: selected.phone || '—' },
                    { label: rtl ? 'الشركة' : 'Company', value: selected.company || '—' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-neutral-50">
                      <dt className="text-caption text-neutral-500 mb-1">{item.label}</dt>
                      <dd className="text-body-sm text-neutral-800 font-medium">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="p-5 rounded-xl bg-neutral-50 mb-8">
                  <p className="text-body text-neutral-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                    <Button variant="gold">
                      <Reply className="h-4 w-4" aria-hidden="true" />
                      {rtl ? 'الرد عبر البريد' : 'Reply via Email'}
                    </Button>
                  </a>
                  <Button variant="outline" onClick={() => markReplied(selected)}>
                    {selected.isReplied ? (rtl ? 'إلغاء علامة الرد' : 'Unmark replied') : rtl ? 'تحديد كتم الرد' : 'Mark as replied'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(selected.id)}
                    disabled={deletingId === selected.id}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t('admin.deleteItem')}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-neutral-200 p-16 text-center h-full flex flex-col items-center justify-center"
              >
                <Mail className="h-14 w-14 text-neutral-200 mb-4" aria-hidden="true" />
                <p className="text-body text-neutral-400">{rtl ? 'اختر رسالة لعرض تفاصيلها' : 'Select a message to view details'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
