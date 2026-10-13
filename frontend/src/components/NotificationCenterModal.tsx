'use client';

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Camera, 
  Bell, 
  CheckCheck,
  Calendar
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-0 sm:p-4">
      <div 
        className="bg-white h-full sm:h-auto sm:max-h-[85vh] w-full sm:max-w-md sm:rounded-3xl p-6 shadow-2xl flex flex-col justify-between border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-extrabold text-slate-900">Notification Center</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllRead}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.is_read
                    ? 'bg-slate-50 border-slate-100 opacity-80'
                    : 'bg-sky-50/50 border-sky-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.notification_type === 'booking' ? 'bg-emerald-100 text-emerald-700' :
                  n.notification_type === 'match' ? 'bg-sky-100 text-sky-700' :
                  n.notification_type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {n.notification_type === 'booking' && <CheckCircle2 className="w-4 h-4" />}
                  {n.notification_type === 'match' && <Sparkles className="w-4 h-4" />}
                  {n.notification_type === 'payment' && <CreditCard className="w-4 h-4" />}
                  {n.notification_type === 'activity' && <Camera className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-800">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.created_at}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
          >
            Close Center
          </button>
        </div>
      </div>
    </div>
  );
};
