'use client';

import React from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  MessageSquare, 
  Radio, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Baby
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNotifications,
  unreadCount = 3
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'matching', label: 'Matching', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'monitoring', label: 'Live Monitoring', icon: Radio },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0e172e] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800/60 shadow-xl">
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => setCurrentTab('landing')}
          className="p-6 cursor-pointer group flex items-start gap-3 transition-opacity hover:opacity-90"
        >
          {/* Logo badge icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0">
            <Baby className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">KidSync</span>
              <span className="text-xl font-bold text-sky-400 font-sans">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">
              Trusted Care. Brighter Tomorrows.
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-3.5 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0284c7] text-white shadow-md shadow-sky-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile & Log out at bottom */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <div 
          onClick={() => setCurrentTab('settings')}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
              alt="Sarah Johnson"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400/30"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-white leading-tight">Sarah Johnson</p>
              <p className="text-[12px] text-slate-400 font-medium">Parent</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <button 
          onClick={() => setCurrentTab('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
