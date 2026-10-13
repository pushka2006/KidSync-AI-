'use client';

import React from 'react';
import { Search, Bell, Sparkles, Home } from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onOpenIntake: () => void;
  onNavigateHome: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  unreadCount = 3,
  onOpenIntake,
  onNavigateHome,
}) => {
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-transparent border-b border-slate-200/60 sticky top-0 z-20 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search caregivers, bookings, or anything..."
          className="w-full pl-11 pr-4 py-2.5 bg-white/90 border border-slate-200/90 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        <button
          onClick={onNavigateHome}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white/80 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          title="View Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-sky-600" />
          <span>Marketing Site</span>
        </button>

        <button
          onClick={onOpenIntake}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:opacity-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Match</span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white shadow-2xs transition-all"
          title="Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User preview */}
        <div className="flex items-center gap-3 pl-2">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
            alt="Sarah Johnson"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20 shadow-xs"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Sarah Johnson</p>
            <p className="text-[12px] text-slate-500 font-medium">Parent</p>
          </div>
        </div>
      </div>
    </header>
  );
};
