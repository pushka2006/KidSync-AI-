'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopHeader } from '../components/TopHeader';
import { DashboardView } from '../components/DashboardView';
import { IntakeWizardView } from '../components/IntakeWizardView';
import { MatchResultsView } from '../components/MatchResultsView';
import { CaregiverProfileView } from '../components/CaregiverProfileView';
import { LiveMonitoringView } from '../components/LiveMonitoringView';
import { SettingsView } from '../components/SettingsView';
import { BookingsView } from '../components/BookingsView';
import { LandingPageView } from '../components/LandingPageView';
import { BookingModal } from '../components/BookingModal';
import { NotificationCenterModal } from '../components/NotificationCenterModal';
import { HowItWorksModal } from '../components/HowItWorksModal';

import { 
  DashboardData, 
  Caregiver, 
  MatchResultItem, 
  MatchingIntakePayload,
  PaymentMethod,
  PaymentTransaction,
  NotificationItem
} from '../types';
import { api, initialDashboardData } from '../lib/api';
import { MessageSquare, Send, ShieldAlert, HelpCircle } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [bookingCaregiver, setBookingCaregiver] = useState<Caregiver | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Payments data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Matching Intake state & results
  const [matchResults, setMatchResults] = useState<MatchResultItem[]>(initialDashboardData.recommended_matches);
  const [criteriaSummary, setCriteriaSummary] = useState(initialDashboardData.preferences_summary);

  // Messaging state
  const [activeChatCaregiver, setActiveChatCaregiver] = useState('Priya Singh');
  const [messagesList, setMessagesList] = useState([
    { sender: 'Priya Singh', text: 'Hi Sarah! Maya and Leo just finished their afternoon snack. All allergen rules strictly adhered to.', time: '2:35 PM' },
    { sender: 'Sarah Johnson', text: 'Thank you so much Priya! Does Maya need help with her drawing craft?', time: '2:38 PM' },
    { sender: 'Priya Singh', text: 'She is doing wonderful! She drew our cat and is building legos with Leo right now. Will post a photo update shortly.', time: '2:40 PM' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Initial load
  useEffect(() => {
    async function loadData() {
      const d = await api.getDashboard();
      setDashboardData(d);

      const cgs = await api.getCaregivers();
      setCaregivers(cgs);
      if (cgs.length > 0) {
        setSelectedCaregiver(cgs[0]);
      }

      const pms = await api.getPaymentMethods();
      setPaymentMethods(pms);

      const txs = await api.getPaymentTransactions();
      setTransactions(txs);
    }
    loadData();
  }, []);

  const refreshAllData = async () => {
    const d = await api.getDashboard();
    setDashboardData(d);
  };

  const handleOpenIntake = () => {
    setCurrentTab('wizard');
  };

  const handleSelectCaregiver = (caregiverId: number) => {
    const cg = caregivers.find(c => c.id === caregiverId) || caregivers[0];
    if (cg) {
      setSelectedCaregiver(cg);
      setCurrentTab('caregiver-detail');
    }
  };

  const handleOpenBookingModal = (caregiverId: number) => {
    const cg = caregivers.find(c => c.id === caregiverId) || caregivers[0];
    if (cg) {
      setBookingCaregiver(cg);
    }
  };

  const handleSubmitIntake = async (payload: MatchingIntakePayload) => {
    const res = await api.submitMatchingIntake(payload);
    setMatchResults(res.results);
    setCriteriaSummary(res.criteria_summary);
    setCurrentTab('match-results');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessagesList([...messagesList, {
      sender: 'Sarah Johnson',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessageInput('');
  };

  // If user navigated to marketing landing page
  if (currentTab === 'landing') {
    return (
      <LandingPageView
        onFindCareNow={() => setCurrentTab('wizard')}
        onGoToDashboard={() => setCurrentTab('dashboard')}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-800 flex overflow-hidden font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Persistent Dark Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        unreadCount={dashboardData.unread_notifications_count}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          unreadCount={dashboardData.unread_notifications_count}
          onOpenIntake={handleOpenIntake}
          onNavigateHome={() => setCurrentTab('landing')}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {/* TAB 1: Dashboard (Pixel-perfect match of reference image) */}
          {currentTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              onOpenIntake={handleOpenIntake}
              onOpenLiveMonitoring={() => setCurrentTab('monitoring')}
              onSelectCaregiver={handleSelectCaregiver}
              onViewAllBookings={() => setCurrentTab('bookings')}
              onViewAllMatches={() => setCurrentTab('match-results')}
              onViewAllNotifications={() => setIsNotificationCenterOpen(true)}
              onOpenBookingModal={handleOpenBookingModal}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            />
          )}

          {/* TAB 2: AI Matching Intake Wizard */}
          {(currentTab === 'matching' || currentTab === 'wizard') && (
            <IntakeWizardView
              onSubmitIntake={handleSubmitIntake}
              onCancel={() => setCurrentTab('dashboard')}
            />
          )}

          {/* TAB 3: Explainable Match Results */}
          {currentTab === 'match-results' && (
            <MatchResultsView
              results={matchResults}
              criteriaSummary={criteriaSummary}
              onSelectCaregiver={handleSelectCaregiver}
              onRequestBooking={handleOpenBookingModal}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          )}

          {/* TAB 4: Caregiver Detail Profile */}
          {currentTab === 'caregiver-detail' && selectedCaregiver && (
            <CaregiverProfileView
              caregiver={selectedCaregiver}
              onBack={() => setCurrentTab('dashboard')}
              onOpenBookingModal={handleOpenBookingModal}
            />
          )}

          {/* TAB 5: Live Monitoring & Activity Stream */}
          {currentTab === 'monitoring' && dashboardData.active_session && (
            <LiveMonitoringView
              session={dashboardData.active_session}
              onBack={() => setCurrentTab('dashboard')}
              onRefresh={refreshAllData}
            />
          )}

          {/* TAB 6: Bookings View */}
          {currentTab === 'bookings' && (
            <BookingsView
              bookings={dashboardData.upcoming_bookings}
              onBack={() => setCurrentTab('dashboard')}
              onSelectCaregiver={handleSelectCaregiver}
              onRefresh={refreshAllData}
            />
          )}

          {/* TAB 7: Account & Payment Settings */}
          {currentTab === 'settings' && (
            <SettingsView
              paymentMethods={paymentMethods}
              transactions={transactions}
              onBack={() => setCurrentTab('dashboard')}
            />
          )}

          {/* TAB 8: Direct Messages */}
          {currentTab === 'messages' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-[75vh] flex flex-col justify-between">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
                    alt={activeChatCaregiver}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeChatCaregiver}</h3>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active In-Session Caregiver
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentTab('monitoring')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-xl border border-teal-200"
                >
                  View Live Monitoring →
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {messagesList.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'Sarah Johnson' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'Sarah Johnson'
                          ? 'bg-[#0284c7] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Send a private, encrypted care message..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: Help & Support */}
          {currentTab === 'help' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-2 text-sky-700">
                <HelpCircle className="w-6 h-6 text-sky-600" />
                <h1 className="text-2xl font-black text-slate-900">Help & Support Center</h1>
              </div>
              <p className="text-xs text-slate-500">Need immediate assistance with a caregiver or your booking schedule?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h3 className="font-bold text-slate-900">24/7 Rapid Safety Desk</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Direct access to childcare specialists and emergency coordination at all times during active sessions.
                  </p>
                  <p className="font-bold text-sky-700">+1 (800) 555-KIDS</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h3 className="font-bold text-slate-900">Caregiver Verification Guidelines</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Learn about our 4-point verification check including identity, biometrics, state background checks, and CPR certification.
                  </p>
                  <button 
                    onClick={() => setIsHowItWorksOpen(true)}
                    className="text-sky-600 font-bold hover:underline"
                  >
                    View Verification Process →
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {bookingCaregiver && (
        <BookingModal
          caregiver={bookingCaregiver}
          isOpen={!!bookingCaregiver}
          onClose={() => setBookingCaregiver(null)}
          onBookingSuccess={refreshAllData}
        />
      )}

      {/* Notification Center Modal */}
      <NotificationCenterModal
        notifications={dashboardData.recent_notifications}
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          refreshAllData();
        }}
        onMarkAllRead={async () => {
          await fetch('http://localhost:8000/api/notifications/mark-all-read', { method: 'POST' }).catch(() => {});
          refreshAllData();
        }}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartMatching={() => {
          setIsHowItWorksOpen(false);
          setCurrentTab('wizard');
        }}
      />
    </div>
  );
}
