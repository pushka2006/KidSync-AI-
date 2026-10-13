'use client';

import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  MessageSquare, 
  ArrowLeft, 
  Heart, 
  FileCheck2, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Caregiver } from '../types';

interface CaregiverProfileViewProps {
  caregiver: Caregiver;
  onBack: () => void;
  onOpenBookingModal: (caregiverId: number) => void;
}

export const CaregiverProfileView: React.FC<CaregiverProfileViewProps> = ({
  caregiver,
  onBack,
  onOpenBookingModal,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Discovery</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={caregiver.profile_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
              alt={caregiver.full_name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-sky-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{caregiver.full_name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Caregiver
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1 max-w-xl">{caregiver.headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {caregiver.overall_rating} ({caregiver.review_count} verified reviews)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {caregiver.service_area}
                </span>
                <span>·</span>
                <span className="font-medium text-slate-700">{caregiver.experience_years}+ years experience</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="text-left md:text-right shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <p className="text-2xl font-black text-slate-900">${caregiver.hourly_rate} <span className="text-xs font-normal text-slate-500">/ hour</span></p>
            <button
              onClick={() => onOpenBookingModal(caregiver.id)}
              className="mt-3 w-full md:w-auto px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 text-sm transition-all"
            >
              Request Booking
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Bio, Skills & Reviews (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Bio */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">About {caregiver.full_name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {caregiver.bio}
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {caregiver.special_skills?.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Certifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Verified Credentials & Certifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caregiver.certifications?.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{cert.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Issued by: {cert.issuing_org}</p>
                  <p className="text-[10px] text-slate-400">Valid through: {cert.expiry_date || 'Active'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Testimonials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">Verified Parent Reviews</h2>
              </div>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {caregiver.overall_rating} Rating
              </span>
            </div>

            <div className="space-y-3">
              {caregiver.reviews?.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{rev.parent_name}</span>
                      {rev.is_verified_booking && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Verified Booking
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">"{rev.comment}"</p>
                  <p className="text-[10px] text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Availability & Trust Indicators (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trust and Safety Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Trust & Verification Check</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identity & Biometrics Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>State & Federal Background Check Clear</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pediatric First Aid Active</span>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Weekly Available Hours</h3>
            <div className="space-y-1.5 text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-semibold text-slate-700">{day}</span>
                  <span className="text-slate-500 font-medium">
                    {idx < 5 ? '8:00 AM – 7:00 PM' : 'On Request'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenBookingModal(caregiver.id)}
              className="mt-3 w-full py-2.5 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Book {caregiver.full_name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
