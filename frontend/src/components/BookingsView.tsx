'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Check, 
  Clock, 
  ArrowLeft, 
  X, 
  AlertCircle, 
  User, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../lib/api';

interface BookingsViewProps {
  bookings: Booking[];
  onBack: () => void;
  onSelectCaregiver: (caregiverId: number) => void;
  onRefresh: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onBack,
  onSelectCaregiver,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'scheduled'>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await api.cancelBooking(id);
      onRefresh();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Care Bookings</h1>
          <p className="text-xs text-slate-500 mt-1">Review upcoming childcare sessions, booking states, and arrangements.</p>
        </div>

        {/* Status Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['all', 'confirmed', 'pending', 'scheduled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === tab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={b.caregiver_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                alt={b.caregiver_name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-100 shadow-2xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{b.caregiver_name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    b.status === 'pending' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{b.care_type} · {b.number_of_children} children</p>
                <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  {new Date(b.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · 9:00 AM - 5:00 PM
                </p>
                {b.notes && (
                  <p className="text-[11px] text-slate-400 italic">Notes: "{b.notes}"</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right pr-2">
                <p className="text-sm font-bold text-slate-900">${b.total_amount.toFixed(2)} USD</p>
                <p className="text-[11px] text-slate-400">${b.hourly_rate}/hr</p>
              </div>

              <button
                onClick={() => onSelectCaregiver(b.caregiver_id)}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200"
              >
                Caregiver Profile
              </button>

              {b.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelBooking(b.id)}
                  disabled={cancellingId === b.id}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                >
                  {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
