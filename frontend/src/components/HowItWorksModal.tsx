'use client';

import React from 'react';
import { X, Sparkles, ShieldCheck, Radio, CheckCircle2, Play } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatching: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartMatching,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-700">
            <Play className="w-5 h-5 fill-sky-600 text-sky-600" />
            <h2 className="text-lg font-black text-slate-900">How KidSync AI Works</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Interactive preview simulation banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 p-8 text-white text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
            <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
          </div>
          <h3 className="text-lg font-extrabold tracking-tight">KidSync AI: Complete Platform Walkthrough</h3>
          <p className="text-xs text-sky-200 max-w-md mx-auto leading-relaxed">
            See how parent preferences match with verified caregivers and how live monitoring keeps families connected during active care sessions.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-teal-700 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>1. AI Matching</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Deterministic weighted evaluation calculates match compatibility across schedule, budget, experience, and certifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Trust Verification</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Rigorous multi-layer credential auditing, Red Cross pediatric certification verification, and background checks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-700 text-xs font-bold">
              <Radio className="w-4 h-4 text-sky-600" />
              <span>3. Live Stream</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Timestamped check-in alerts, real-time activity updates, photos, and AI Care Intelligence summaries.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartMatching();
            }}
            className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Start Matching Now →
          </button>
        </div>
      </div>
    </div>
  );
};
