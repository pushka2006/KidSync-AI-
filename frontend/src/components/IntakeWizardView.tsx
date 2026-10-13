'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MatchingIntakePayload } from '../types';

interface IntakeWizardViewProps {
  onSubmitIntake: (payload: MatchingIntakePayload) => Promise<void>;
  onCancel: () => void;
}

export const IntakeWizardView: React.FC<IntakeWizardViewProps> = ({
  onSubmitIntake,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [careType, setCareType] = useState('Babysitting');
  const [childAgeRange, setChildAgeRange] = useState('Toddler (2-4 yrs), School-age (5-8 yrs)');
  const [numberOfChildren, setNumberOfChildren] = useState(2);
  const [startDate, setStartDate] = useState('2026-10-16');
  const [isRecurring, setIsRecurring] = useState(true);

  const [locationArea, setLocationArea] = useState('San Francisco, CA');
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [requiredLanguages, setRequiredLanguages] = useState<string[]>(['English']);
  const [experienceLevel, setExperienceLevel] = useState('3+ years');

  const [minBudget, setMinBudget] = useState(15);
  const [maxBudget, setMaxBudget] = useState(25);
  const [flexibleBudget, setFlexibleBudget] = useState(true);

  const [scheduleDays, setScheduleDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu']);
  const [scheduleTimeRange, setScheduleTimeRange] = useState('3:00 PM - 7:00 PM');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 9 PM)']);

  const [requiredCertifications, setRequiredCertifications] = useState<string[]>(['Pediatric CPR / First Aid']);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>(['Non-smoker', 'Allergen-conscious']);

  const stepsList = [
    { number: 1, title: 'Care Needs' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Budget' },
    { number: 4, title: 'Schedule' },
    { number: 5, title: 'Safety & Specs' },
    { number: 6, title: 'Review' },
  ];

  const toggleDay = (day: string) => {
    if (scheduleDays.includes(day)) {
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const toggleLang = (lang: string) => {
    if (requiredLanguages.includes(lang)) {
      setRequiredLanguages(requiredLanguages.filter(l => l !== lang));
    } else {
      setRequiredLanguages([...requiredLanguages, lang]);
    }
  };

  const toggleCert = (cert: string) => {
    if (requiredCertifications.includes(cert)) {
      setRequiredCertifications(requiredCertifications.filter(c => c !== cert));
    } else {
      setRequiredCertifications([...requiredCertifications, cert]);
    }
  };

  const toggleReq = (req: string) => {
    if (specialRequirements.includes(req)) {
      setSpecialRequirements(specialRequirements.filter(r => r !== req));
    } else {
      setSpecialRequirements([...specialRequirements, req]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: MatchingIntakePayload = {
        care_type: careType,
        child_age_range: childAgeRange,
        number_of_children: numberOfChildren,
        start_date: startDate,
        is_recurring: isRecurring,
        min_budget: minBudget,
        max_budget: maxBudget,
        currency: 'USD',
        location_area: locationArea,
        max_distance_km: maxDistanceKm,
        required_languages: requiredLanguages,
        required_certifications: requiredCertifications,
        schedule_days: scheduleDays,
        schedule_time_range: scheduleTimeRange,
        special_requirements: specialRequirements,
      };

      await onSubmitIntake(payload);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Banner & Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Care Matching Intake</h1>
              <p className="text-xs text-slate-500">Step {step} of 6: {stepsList[step - 1].title}</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Exit Wizard
          </button>
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-6 gap-2">
          {stepsList.map((s) => {
            const isPassed = s.number < step;
            const isCurrent = s.number === step;
            return (
              <div key={s.number} className="space-y-1.5 text-center">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isPassed ? 'bg-teal-500' : isCurrent ? 'bg-sky-600' : 'bg-slate-100'
                  }`} 
                />
                <span className={`text-[11px] font-semibold hidden sm:block ${
                  isCurrent ? 'text-sky-700' : isPassed ? 'text-teal-600' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs min-h-[440px] flex flex-col justify-between">
        {/* Step 1: Care Needs */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tell Us Your Care Needs</h2>
              <p className="text-xs text-slate-500 mt-1">Select the type of care arrangement and child details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Care Type</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Babysitting', 'After School Care', 'Recurring Care', 'Infant Care'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCareType(t)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        careType === t
                          ? 'border-sky-500 bg-sky-50/60 text-sky-800 font-bold shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Number of Children</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNumberOfChildren(n)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        numberOfChildren === n
                          ? 'border-sky-500 bg-sky-500 text-white shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {n} {n === 1 ? 'Child' : 'Children'}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Age Group</label>
                  <select
                    value={childAgeRange}
                    onChange={(e) => setChildAgeRange(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Infant (0-1 yr)">Infant (0-1 yr)</option>
                    <option value="Toddler (2-4 yrs), School-age (5-8 yrs)">Toddler (2-4 yrs) & School-age (5-8 yrs)</option>
                    <option value="Pre-school (4-6 yrs)">Pre-school (4-6 yrs)</option>
                    <option value="School-age (6-12 yrs)">School-age (6-12 yrs)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Preferred Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Care Cadence</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecurring(true)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isRecurring ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Recurring Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecurring(false)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      !isRecurring ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    One-time Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location and Preferences */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Location & Distance Radius</h2>
              <p className="text-xs text-slate-500 mt-1">Specify your neighborhood and maximum travel radius.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Service Location / Area</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Noe Valley / Mission)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Your exact street address will never be shared publicly.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Preferred Travel Distance</label>
                  <span className="text-xs font-bold text-sky-700">Within {maxDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Preferred Languages</label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'Mandarin', 'French', 'Hindi', 'German'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLang(lang)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        requiredLanguages.includes(lang)
                          ? 'border-sky-500 bg-sky-500 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hourly Rate Budget</h2>
              <p className="text-xs text-slate-500 mt-1">Set your preferred hourly compensation range.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Budget Range</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    ${minBudget} – ${maxBudget} <span className="text-sm font-normal text-slate-500">/ hour (USD)</span>
                  </p>
                </div>

                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                  Fair Market Range
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Rate ($/hr)</label>
                  <input
                    type="number"
                    min="10"
                    max={maxBudget}
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Rate ($/hr)</label>
                  <input
                    type="number"
                    min={minBudget}
                    max="60"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="flexible"
                  checked={flexibleBudget}
                  onChange={(e) => setFlexibleBudget(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="flexible" className="text-xs text-slate-600 cursor-pointer">
                  Show top-tier caregivers slightly above maximum (+10-15%) if match quality is exceptional
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Availability Grid */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Weekly Availability Schedule</h2>
              <p className="text-xs text-slate-500 mt-1">Select the days and time windows when you require childcare.</p>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Required Days</label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isSelected = scheduleDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'border-sky-500 bg-[#0284c7] text-white shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time windows */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Time Windows</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Morning (8 AM - 12 PM)', label: 'Morning', hours: '8:00 AM – 12:00 PM' },
                  { id: 'Afternoon (12 PM - 5 PM)', label: 'Afternoon', hours: '12:00 PM – 5:00 PM' },
                  { id: 'Evening (5 PM - 9 PM)', label: 'Evening', hours: '5:00 PM – 9:00 PM' },
                ].map((slot) => {
                  const active = selectedTimeSlots.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        if (active) setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot.id));
                        else setSelectedTimeSlots([...selectedTimeSlots, slot.id]);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        active
                          ? 'border-teal-500 bg-teal-50/60 text-teal-900 font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{slot.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{slot.hours}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specific Time Window Description</label>
              <input
                type="text"
                value={scheduleTimeRange}
                onChange={(e) => setScheduleTimeRange(e.target.value)}
                placeholder="e.g. 3:00 PM - 7:00 PM"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              />
            </div>
          </div>
        )}

        {/* Step 5: Special Requirements */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Certifications & Safety Preferences</h2>
              <p className="text-xs text-slate-500 mt-1">Specify verification criteria and household safety preferences.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Mandatory Certifications</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Pediatric CPR / First Aid',
                  'Montessori Early Childhood',
                  'Child Nutrition & Cooking',
                  'Water Safety / Lifeguard',
                  'Special Needs Support (Neurodiversity)'
                ].map((cert) => {
                  const checked = requiredCertifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCert(cert)}
                      className={`p-3 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                        checked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cert}</span>
                      {checked && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Household & Safety Instructions</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Non-smoker',
                  'Allergen-conscious',
                  'Pet-friendly',
                  'Homework tutor capable',
                  'Clean driving record',
                  'Comfortable with indoor cameras'
                ].map((req) => (
                  <button
                    key={req}
                    type="button"
                    onClick={() => toggleReq(req)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      specialRequirements.includes(req)
                        ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Review Your Matching Request</h2>
              <p className="text-xs text-slate-500 mt-1">Review your childcare criteria before our AI runs the weighted matching algorithm.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Care Needs</span>
                  <button onClick={() => setStep(1)} className="text-sky-600 hover:underline">Edit</button>
                </div>
                <p><strong className="text-slate-600">Type:</strong> {careType}</p>
                <p><strong className="text-slate-600">Children:</strong> {numberOfChildren} ({childAgeRange})</p>
                <p><strong className="text-slate-600">Start Date:</strong> {startDate}</p>
                <p><strong className="text-slate-600">Cadence:</strong> {isRecurring ? 'Weekly Recurring' : 'Single Session'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Schedule & Budget</span>
                  <button onClick={() => setStep(3)} className="text-sky-600 hover:underline">Edit</button>
                </div>
                <p><strong className="text-slate-600">Days:</strong> {scheduleDays.join(', ')}</p>
                <p><strong className="text-slate-600">Hours:</strong> {scheduleTimeRange}</p>
                <p><strong className="text-slate-600">Budget:</strong> ${minBudget} - ${maxBudget}/hour</p>
                <p><strong className="text-slate-600">Location:</strong> {locationArea} (within {maxDistanceKm} km)</p>
              </div>
            </div>

            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Transparent Explainable Matching</p>
                <p className="text-[11px] text-teal-700 mt-0.5">
                  Our system evaluates available caregivers based on 30% schedule alignment, 25% experience relevance, 20% budget fit, 15% verified credentials, and 10% language & household preferences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-teal-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'AI Scoring in Progress...' : 'Run AI Matching'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
