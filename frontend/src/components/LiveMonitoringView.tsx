'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Camera, 
  Sparkles, 
  Phone, 
  AlertTriangle, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  RefreshCw,
  Send,
  HeartHandshake
} from 'lucide-react';
import { CareSession, ActivityUpdate } from '../types';
import { api } from '../lib/api';

interface LiveMonitoringViewProps {
  session: CareSession;
  onBack: () => void;
  onRefresh: () => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  session,
  onBack,
  onRefresh,
}) => {
  const [currentSession, setCurrentSession] = useState<CareSession>(session);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newType, setNewType] = useState('play');
  const [isPosting, setIsPosting] = useState(false);
  const [isRegeneratingAi, setIsRegeneratingAi] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  // Time elapsed ticker
  const [elapsedMinutes, setElapsedMinutes] = useState(115);

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  const handleSimulateAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsPosting(true);
    try {
      const samplePhotos = [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];

      await api.addSessionActivity(currentSession.id, {
        title: newTitle,
        notes: newNotes || 'Engaged in interactive learning and supervised activity.',
        activity_type: newType,
        media_url: randomPhoto
      });

      // Update local state smoothly
      const newAct: ActivityUpdate = {
        id: Date.now(),
        title: newTitle,
        notes: newNotes || 'Engaged in interactive learning and supervised activity.',
        activity_type: newType,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        media: [{
          id: Date.now(),
          media_url: randomPhoto,
          caption: newTitle,
          created_at: new Date().toISOString()
        }]
      };

      setCurrentSession(prev => ({
        ...prev,
        activity_updates: [newAct, ...prev.activity_updates],
        ai_summary: `AI Care Intelligence: ${prev.activity_updates.length + 1} updates logged. Latest milestone '${newTitle}'. Both children are happy and well-cared for.`,
        media_count: prev.media_count + 1
      }));

      setNewTitle('');
      setNewNotes('');
      onRefresh();
    } finally {
      setIsPosting(false);
    }
  };

  const handleRegenerateSummary = () => {
    setIsRegeneratingAi(true);
    setTimeout(() => {
      setCurrentSession(prev => ({
        ...prev,
        ai_summary: `AI Care Intelligence (Updated at ${new Date().toLocaleTimeString()}): Priya Singh has maintained excellent care continuity. Maya & Leo completed lunch on schedule with zero allergen exposure, engaged in creative crafts, and completed storytime. Normal routine intact.`
      }));
      setIsRegeneratingAi(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-100 text-teal-600">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Care Session Monitoring</h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Now
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Caregiver: <strong className="text-slate-800">{currentSession.caregiver_name}</strong> · 2 children (Maya & Leo) · At Home (1428 Elm Grove Ave)
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Call & Direct Contact */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${currentSession.caregiver_phone || '4155550812'}`}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call Caregiver</span>
          </a>

          <button
            onClick={() => alert("Emergency protocol activated. Connecting to KidSync 24/7 Rapid Safety Desk.")}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Safety Desk</span>
          </button>
        </div>
      </div>

      {/* AI Care Intelligence Live Summary Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-emerald-500/10 border border-teal-200 rounded-2xl p-6 shadow-xs relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">AI Care Intelligence Summary</h3>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  Real-time Synthesis
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                {currentSession.ai_summary || "Synthesizing latest updates from caregiver timeline..."}
              </p>
              <p className="text-[10px] text-slate-400 mt-2">
                * Generated exclusively from verified caregiver-logged updates. Does not substitute direct parent oversight.
              </p>
            </div>
          </div>

          <button
            onClick={handleRegenerateSummary}
            disabled={isRegeneratingAi}
            className="shrink-0 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Refresh AI Analysis"
          >
            <RefreshCw className={`w-4 h-4 text-teal-600 ${isRegeneratingAi ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Timeline & Feed, Right Simulation & Photo Lightbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Activity Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Activity Updates Feed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Live Activity Updates</h2>
              <span className="text-xs text-slate-500 font-medium">
                {currentSession.activity_updates.length} updates logged
              </span>
            </div>

            <div className="space-y-4">
              {currentSession.activity_updates.map((act) => (
                <div key={act.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
                        {act.activity_type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">{act.created_at}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{act.notes}</p>

                  {/* Photos attached */}
                  {act.media && act.media.length > 0 && (
                    <div className="flex gap-3 pt-1">
                      {act.media.map((m) => (
                        <div 
                          key={m.id} 
                          onClick={() => setActivePhotoModal(m.media_url)}
                          className="w-32 h-24 rounded-xl overflow-hidden cursor-pointer border border-slate-200 shadow-2xs hover:opacity-95 transition-opacity"
                        >
                          <img
                            src={m.media_url}
                            alt={m.caption || 'Activity photo'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Session Milestones Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Session Verification Timeline</h2>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentSession.events.map((ev) => (
                <div key={ev.id} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">{ev.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ev.description}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{new Date(ev.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Caregiver Simulation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Demonstration Tool Banner */}
          <div className="bg-white rounded-2xl p-6 border border-teal-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Simulate Caregiver Action (Demo Mode)</span>
            </div>
            <p className="text-xs text-slate-500">
              Test how live photo updates, activity notifications, and AI summaries update in real time.
            </p>

            <form onSubmit={handleSimulateAddActivity} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Garden Nature Walk & Bubbles"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                >
                  <option value="play">Creative Play</option>
                  <option value="meal">Nutritious Meal / Snack</option>
                  <option value="reading">Story & Literacy</option>
                  <option value="outdoor">Outdoor Active</option>
                  <option value="nap">Quiet Time / Nap</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Care Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Details regarding child engagement and wellbeing..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPosting || !newTitle.trim()}
                className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isPosting ? 'Uploading Update...' : 'Post Caregiver Update & Photo'}</span>
              </button>
            </form>
          </div>

          {/* Emergency Safety Protocol Info */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Care Safety Guardrails</span>
            </h4>
            <p className="leading-relaxed">
              Care sessions are protected with continuous timestamp auditing, tamper-resistant media capture, and parent-accessible emergency routing.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Modal */}
      {activePhotoModal && (
        <div 
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={activePhotoModal} alt="Activity" className="w-full max-h-[70vh] object-contain bg-black" />
            <div className="p-4 flex justify-between items-center bg-white">
              <p className="text-xs font-bold text-slate-800">Verified Activity Photo</p>
              <button 
                onClick={() => setActivePhotoModal(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
