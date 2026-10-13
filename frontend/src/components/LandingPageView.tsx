'use client';

import React from 'react';
import { 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Radio, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Lock, 
  Check, 
  Users,
  ChevronRight
} from 'lucide-react';

interface LandingPageViewProps {
  onFindCareNow: () => void;
  onGoToDashboard: () => void;
  onOpenHowItWorks: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onFindCareNow,
  onGoToDashboard,
  onOpenHowItWorks,
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToDashboard}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Baby className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">KidSync</span>
              <span className="text-xl font-bold text-sky-600 font-sans">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Trusted Care. Brighter Tomorrows.
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#safety" className="hover:text-slate-900 transition-colors">Safety & Trust</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToDashboard}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Log In (Demo)
          </button>
          <button
            onClick={onFindCareNow}
            className="px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Find Care Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Generation Childcare Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Find Care <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">
                You Can Trust.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Personalized caregiver discovery, 100% verified credentials, and real-time live monitoring. Experience stress-free childcare matched precisely to your family's schedule and values.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onFindCareNow}
                className="px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 text-sm transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Find Care Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToDashboard}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-2xs text-sm transition-all cursor-pointer"
              >
                View Live Parent Dashboard →
              </button>
            </div>

            {/* Trust badges */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Multi-state Background Checks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-700">Pediatric CPR Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-700">Live Photo & Check-in Stream</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 ring-1 ring-slate-200">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="Mother and toddler"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                        94%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Aarti Sharma Matched!</p>
                        <p className="text-[11px] text-slate-500">Available Mon-Thu · Red Cross CPR</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">$18/hr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Cards (Section 4C) */}
      <section id="features" className="px-6 lg:px-12 py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built on Transparency, Trust & Love</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every feature is engineered to provide peace of mind while your children receive the highest quality of loving, personalized attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Key Care Propositions */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Key Care Propositions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized discovery driven by transparent weighted criteria. Specify age groups, dietary restrictions, language needs, and exact weekly hours with zero guesswork.
              </p>
            </div>

            {/* Card 2: Trust and Safety */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Trust and Safety</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive criminal history, identity verification, and authentic credential validation. Only caregivers who pass full review receive verified badges.
              </p>
            </div>

            {/* Card 3: Warm Care Highlights */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Warm Care Highlights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stay connected through live timeline events, timestamped arrival check-ins, photo moments, and real-time AI Care summaries of daily routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">How KidSync AI Works</h2>
            <p className="text-xs text-slate-500">From intake to live monitoring in three seamless steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Share Your Care Needs', desc: 'Complete our 6-step intake wizard with your budget, location, child ages, and weekly schedule.' },
              { step: '2', title: 'Get Explainable AI Matches', desc: 'Review ranked caregivers with 0-100% factor breakdowns: budget fit, experience, and certifications.' },
              { step: '3', title: 'Book & Monitor Live', desc: 'Confirm your booking with double-booking prevention, then watch real-time check-ins and photos.' },
            ].map((st) => (
              <div key={st.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {st.step}
                </div>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onFindCareNow}
              className="px-8 py-3.5 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Start Intake Matching Now →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ & Trust Footer */}
      <footer id="faq" className="bg-[#0e172e] text-slate-400 py-16 px-6 lg:px-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Baby className="w-6 h-6 text-sky-400" />
              <span className="text-lg font-bold text-white">KidSync AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering parents with verified childcare discovery, transparent match scoring, and live care monitoring.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={onFindCareNow} className="hover:text-white">AI Matching Intake</button></li>
              <li><button onClick={onGoToDashboard} className="hover:text-white">Parent Dashboard</button></li>
              <li><button onClick={onGoToDashboard} className="hover:text-white">Live Monitoring</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li><span>Background Verification</span></li>
              <li><span>Pediatric CPR Protocols</span></li>
              <li><span>Privacy & Geolocation Controls</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support</h4>
            <p className="text-xs text-slate-400">24/7 Rapid Safety Desk: +1 (800) 555-KIDS</p>
            <p className="text-xs text-slate-400 mt-1">support@kidsync.ai</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 KidSync AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
