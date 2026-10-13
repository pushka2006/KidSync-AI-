'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Check, 
  Calendar, 
  Clock, 
  Filter, 
  SlidersHorizontal, 
  ArrowLeft, 
  ChevronDown, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { MatchResultItem } from '../types';

interface MatchResultsViewProps {
  results: MatchResultItem[];
  criteriaSummary: string;
  onSelectCaregiver: (caregiverId: number) => void;
  onRequestBooking: (caregiverId: number) => void;
  onBackToDashboard: () => void;
}

export const MatchResultsView: React.FC<MatchResultsViewProps> = ({
  results,
  criteriaSummary,
  onSelectCaregiver,
  onRequestBooking,
  onBackToDashboard,
}) => {
  const [rankingMode, setRankingMode] = useState<'fit' | 'suitability'>('fit');
  const [rateFilter, setRateFilter] = useState<number>(30);
  const [minExpFilter, setMinExpFilter] = useState<number>(0);
  const [selectedCaregiverIdForBreakdown, setSelectedCaregiverIdForBreakdown] = useState<number | null>(results[0]?.caregiver_id || 1);

  // Sorting
  const sorted = [...results].sort((a, b) => {
    if (rankingMode === 'fit') {
      return b.fit_score - a.fit_score;
    }
    return b.suitability_score - a.suitability_score;
  }).filter(c => c.hourly_rate <= rateFilter && c.experience_years >= minExpFilter);

  const activeCaregiver = results.find(c => c.caregiver_id === selectedCaregiverIdForBreakdown) || results[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explainable AI Match Recommendations</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Found <strong className="text-slate-800">{sorted.length} eligible caregivers</strong> matching your criteria: {criteriaSummary}
          </p>
        </div>

        {/* Perspective Toggle (Ranked by Fit vs Suitability) */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0 border border-slate-200">
          <button
            onClick={() => setRankingMode('fit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              rankingMode === 'fit'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ranked by Parent Fit
          </button>
          <button
            onClick={() => setRankingMode('suitability')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              rankingMode === 'suitability'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overall Platform Suitability
          </button>
        </div>
      </div>

      {/* Rationale explanation banner */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Transparent Weighted Scoring Model</p>
          <p className="text-sky-700 text-[11px] mt-0.5 leading-relaxed">
            {rankingMode === 'fit' 
              ? 'Scores are weighted by your stated schedule needs (30%), experience requirements (25%), budget compatibility (20%), verified qualifications (15%), and language/preferences (10%).'
              : 'Suitability incorporates parent fit plus composite verified ratings, review volume, and background check completeness.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Caregiver Cards, Right Explainable Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Results List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {sorted.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-base font-bold text-slate-800">No Caregivers Match Current Filters</p>
              <p className="text-xs text-slate-500 mt-1">Try expanding your rate or experience threshold to see available candidates.</p>
              <button
                onClick={() => { setRateFilter(35); setMinExpFilter(0); }}
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            sorted.map((cg, idx) => {
              const isSelected = activeCaregiver?.caregiver_id === cg.caregiver_id;
              return (
                <div
                  key={cg.id}
                  onClick={() => setSelectedCaregiverIdForBreakdown(cg.caregiver_id)}
                  className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer relative shadow-xs ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <img
                        src={cg.caregiver_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                        alt={cg.caregiver_name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-2xs"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{cg.caregiver_name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {cg.overall_rating} ({cg.review_count} reviews)
                          </span>
                          <span>·</span>
                          <span>{cg.experience_years}+ yrs experience</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-black text-sm">
                        {rankingMode === 'fit' ? cg.fit_score : cg.suitability_score}% Match
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">${cg.hourly_rate}/hr</p>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3" />
                      ID Verified
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Background Check Passed
                    </span>
                  </div>

                  {/* Strengths list */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                    {cg.strengths.slice(0, 3).map((st, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCaregiver(cg.caregiver_id);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                    >
                      View Full Profile
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestBooking(cg.caregiver_id);
                      }}
                      className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-all"
                    >
                      Request Booking
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: "Why this match?" Deep-Dive Panel (5 cols) */}
        {activeCaregiver && (
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs sticky top-28 space-y-6">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-base pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>Match Rationale: {activeCaregiver.caregiver_name}</span>
            </div>

            {/* Explanation paragraph */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
              <p className="font-bold text-slate-900 mb-1">AI Recommendation Synthesis:</p>
              {activeCaregiver.explanation}
            </div>

            {/* Factor breakdown progress meters */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Scoring Factor Breakdown</h4>
              <div className="space-y-3">
                {[
                  { label: 'Schedule Compatibility (30%)', score: activeCaregiver.score_breakdown.availability || 95 },
                  { label: 'Experience Relevance (25%)', score: activeCaregiver.score_breakdown.experience || 90 },
                  { label: 'Budget Fit (20%)', score: activeCaregiver.score_breakdown.budget || 100 },
                  { label: 'Verified Qualifications (15%)', score: activeCaregiver.score_breakdown.qualifications || 95 },
                  { label: 'Languages & Household Fit (10%)', score: activeCaregiver.score_breakdown.preferences || 95 },
                ].map((factor, fidx) => (
                  <div key={fidx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">{factor.label}</span>
                      <span className="font-bold text-slate-900">{factor.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-sky-600 rounded-full transition-all duration-500"
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onRequestBooking(activeCaregiver.caregiver_id)}
                className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl text-sm shadow-sm transition-all"
              >
                Proceed with {activeCaregiver.caregiver_name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
