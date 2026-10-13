'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Caregiver } from '../types';
import { api } from '../lib/api';

interface BookingModalProps {
  caregiver: Caregiver;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  caregiver,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [date, setDate] = useState('2026-10-22');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('15:00');
  const [careType, setCareType] = useState('Babysitting');
  const [childrenCount, setChildrenCount] = useState(2);
  const [notes, setNotes] = useState('Nut-free snack and craft project prepared.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate duration & estimate
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const duration = Math.max(1, endHour - startHour);
  const estimatedTotal = duration * caregiver.hourly_rate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

      await api.createBooking({
        caregiver_id: caregiver.id,
        care_type: careType,
        number_of_children: childrenCount,
        start_time: startDateTime,
        end_time: endDateTime,
        notes: notes
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onBookingSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Scheduling conflict detected or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={caregiver.profile_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
              alt={caregiver.full_name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-200"
            />
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Request Booking</h2>
              <p className="text-xs text-slate-500">{caregiver.full_name} · ${caregiver.hourly_rate}/hr</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Care Type</label>
              <select
                value={careType}
                onChange={(e) => setCareType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="Babysitting">Babysitting</option>
                <option value="After School Care">After School Care</option>
                <option value="Recurring Care">Recurring Care</option>
                <option value="Infant Care">Infant Care</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Children Count</label>
              <input
                type="number"
                min="1"
                max="5"
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Booking Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instructions & Care Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, nap times, emergency contacts, gate codes..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            />
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Rate: ${caregiver.hourly_rate}/hr × {duration} hrs</span>
              <span>${estimatedTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Protection & Trust Fee</span>
              <span>$0.00 (Included)</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
              <span>Estimated Total:</span>
              <span className="text-teal-700">${estimatedTotal.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Availability...' : 'Confirm & Request Booking'}
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Free cancellation up to 24 hours prior to session start. Payment processed securely upon booking completion.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
