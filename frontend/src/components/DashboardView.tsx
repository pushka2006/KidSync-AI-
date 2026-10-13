'use client';

import React from 'react';
import { 
  Sparkles, 
  Search, 
  Play, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  Bell, 
  Clock, 
  ShieldCheck, 
  Radio, 
  ChevronRight, 
  CreditCard, 
  Camera, 
  Star,
  Users,
  HeartHandshake,
  Check,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { DashboardData, Caregiver, MatchResultItem } from '../types';

interface DashboardViewProps {
  data: DashboardData;
  onOpenIntake: () => void;
  onOpenLiveMonitoring: () => void;
  onSelectCaregiver: (caregiverId: number) => void;
  onViewAllBookings: () => void;
  onViewAllMatches: () => void;
  onViewAllNotifications: () => void;
  onOpenBookingModal: (caregiverId: number) => void;
  onOpenHowItWorks: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onOpenIntake,
  onOpenLiveMonitoring,
  onSelectCaregiver,
  onViewAllBookings,
  onViewAllMatches,
  onViewAllNotifications,
  onOpenBookingModal,
  onOpenHowItWorks,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Row: Hero Banner & Quick AI Matching Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Hero Banner (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100/60 rounded-2xl p-8 border border-sky-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
          {/* Decorative background circle */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Upper content */}
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Good Morning, Sarah!
            </h1>
            <p className="mt-2.5 text-slate-600 text-[14px] leading-relaxed">
              Find the right care for your little ones with trusted caregivers, AI-powered matching and real-time updates.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onOpenIntake}
                className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2.5 transition-all transform active:scale-95 text-sm cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Care Now</span>
              </button>

              <button
                onClick={onOpenHowItWorks}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
                <span>Watch How It Works</span>
              </button>
            </div>
          </div>

          {/* Right hero image & handwritten badge */}
          <div className="hidden sm:block absolute right-6 bottom-0 w-80 h-full pointer-events-none">
            <div className="relative h-full flex items-end justify-end">
              {/* Handwritten badge */}
              <div className="absolute top-6 left-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-sky-200/70 shadow-xs rotate-[-3deg]">
                <p className="text-xs font-bold text-sky-700 flex items-center gap-1 font-serif italic">
                  Happy Kids, Happy Parents ♡
                </p>
              </div>

              {/* Mother & daughter photo */}
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                alt="Mother and daughter"
                className="h-[92%] object-contain object-bottom drop-shadow-md rounded-t-2xl"
              />
            </div>
          </div>
        </div>

        {/* Quick AI Matching Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-600 font-bold text-base">
              <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-100">
                <Sparkles className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-slate-900 font-bold">Quick AI Matching</span>
            </div>

            <p className="mt-2 text-[13px] text-slate-500 leading-normal">
              Tell us what you need and let our AI find the perfect caregiver match for your family.
            </p>

            <button
              onClick={onOpenIntake}
              className="mt-4 w-full py-2.5 px-4 bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Start Matching</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Step diagram */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-600">1. Share Needs</span>
            </div>

            <div className="w-6 h-0.5 bg-slate-200 mb-4" />

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 mb-1">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-600">2. AI Matches</span>
            </div>

            <div className="w-6 h-0.5 bg-slate-200 mb-4" />

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 mb-1">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-slate-600">3. Book & Relax</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 4 Summary Metric Cards & Small Active Session Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Metric 1: Upcoming Bookings */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-500">Upcoming Bookings</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{data.upcoming_bookings_count}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Next: Tomorrow, 9:00 AM</p>
          </div>
        </div>

        {/* Metric 2: Completed Sessions */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-500">Completed Sessions</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{data.completed_sessions_count}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">This Month</p>
          </div>
        </div>

        {/* Metric 3: Pending Requests */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-500">Pending Requests</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{data.pending_requests_count}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Needs Your Action</p>
          </div>
        </div>

        {/* Metric 4: Unread Notifications */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/70 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-500">Unread Notifications</p>
            <p className="text-2xl font-bold text-slate-900 leading-tight">{data.unread_notifications_count}</p>
            <button 
              onClick={onViewAllNotifications}
              className="text-[11px] text-sky-600 hover:underline font-medium mt-0.5 block"
            >
              View All
            </button>
          </div>
        </div>

        {/* Metric 5: Active Care Sessions (Span or 5th card) */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-white rounded-2xl p-4.5 border border-slate-200/70 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-slate-500">Active Care Sessions</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 leading-tight">{data.active_sessions_count}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Now
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onOpenLiveMonitoring}
            className="text-xs text-sky-600 font-semibold hover:underline flex items-center"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Row 3: 3-Column Content Layout (Matching reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Upcoming Bookings (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Upcoming Bookings</span>
            </div>
            <button 
              onClick={onViewAllBookings}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {data.upcoming_bookings.map((b) => (
              <div 
                key={b.id} 
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.caregiver_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                      alt={b.caregiver_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-2xs"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{b.caregiver_name}</p>
                      <p className="text-xs text-slate-500">{b.care_type} · {b.number_of_children} {b.number_of_children === 1 ? 'child' : 'children'}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  {b.status === 'confirmed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      Confirmed
                    </span>
                  )}
                  {b.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                  {b.status === 'scheduled' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      <Calendar className="w-3 h-3" />
                      Scheduled
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(b.start_time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} · 9:00 AM - 5:00 PM
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCaregiver(b.caregiver_id)}
                    className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Active Care Session & Recent Notifications (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Care Session Card */}
          {data.active_session && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs relative overflow-hidden">
              {/* Header with pulsing green Live badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <div className="p-1 rounded-lg bg-teal-50 border border-teal-100">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <span>Active Care Session</span>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
              </div>

              {/* Caregiver Profile snippet */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={data.active_session.caregiver_avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"}
                    alt={data.active_session.caregiver_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-xs"
                  />
                  <div>
                    <p className="text-base font-bold text-slate-900">{data.active_session.caregiver_name}</p>
                    <p className="text-xs text-slate-500">Caregiver</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  In Progress
                </span>
              </div>

              {/* Session Meta */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">Today, 2:00 PM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>2 children · At Home</span>
                </div>
              </div>

              {/* View Live Monitoring Button */}
              <button
                onClick={onOpenLiveMonitoring}
                className="mt-4 w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>View Live Monitoring</span>
              </button>
            </div>
          )}

          {/* Recent Notifications Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Bell className="w-4 h-4 text-sky-600" />
                <span>Recent Notifications</span>
              </div>
              <button 
                onClick={onViewAllNotifications}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3.5">
              {data.recent_notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    n.notification_type === 'booking' ? 'bg-emerald-50 text-emerald-600' :
                    n.notification_type === 'match' ? 'bg-sky-50 text-sky-600' :
                    n.notification_type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {n.notification_type === 'booking' && <CheckCircle2 className="w-4 h-4" />}
                    {n.notification_type === 'match' && <Sparkles className="w-4 h-4" />}
                    {n.notification_type === 'payment' && <CreditCard className="w-4 h-4" />}
                    {n.notification_type === 'activity' && <Camera className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <span className="text-[11px] text-slate-400">{n.created_at}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: AI Matching Results (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI Matching Results</span>
              </div>
              <button 
                onClick={onViewAllMatches}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                View All →
              </button>
            </div>

            {/* Criteria Pill */}
            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-sky-800 leading-tight mb-4 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span>Based on your preferences: {data.preferences_summary}</span>
            </div>

            {/* Top 3 Caregiver Matches */}
            <div className="space-y-4">
              {data.recommended_matches.map((cg, idx) => (
                <div 
                  key={cg.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Ranking badge */}
                      <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-sky-500' : 'bg-purple-500'
                      }`}>
                        {idx + 1}
                      </span>

                      <img
                        src={cg.caregiver_avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"}
                        alt={cg.caregiver_name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-2xs"
                      />

                      <div>
                        <p className="text-sm font-bold text-slate-800">{cg.caregiver_name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {cg.overall_rating} ({cg.review_count})
                          </span>
                          <span>·</span>
                          <span>{cg.experience_years}+ yrs exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Match Score Ring */}
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-teal-500 bg-teal-50/50 text-[11px] font-bold text-teal-700 shadow-2xs">
                        {cg.overall_score}%
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">Match Score</p>
                    </div>
                  </div>

                  {/* Verification badges & rate */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <Check className="w-2.5 h-2.5" />
                        Verified
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Background Check
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-800">${cg.hourly_rate}/hr</span>
                  </div>

                  {/* View Profile Action */}
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => onSelectCaregiver(cg.caregiver_id)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer: "Why these matches?" explanation card */}
          <div 
            onClick={onViewAllMatches}
            className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer transition-all flex items-center justify-between text-xs text-slate-600"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Why these matches?</p>
                <p className="text-[11px] text-slate-500">Based on your preferences for experience, availability, location, budget and qualifications.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
