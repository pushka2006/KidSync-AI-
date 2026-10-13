'use client';

import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Download, 
  FileText, 
  Lock,
  ArrowLeft
} from 'lucide-react';
import { PaymentMethod, PaymentTransaction } from '../types';

interface SettingsViewProps {
  paymentMethods: PaymentMethod[];
  transactions: PaymentTransaction[];
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  paymentMethods,
  transactions,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'notifications' | 'security'>('payments');
  const [cards, setCards] = useState<PaymentMethod[]>(paymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardLast4, setNewCardLast4] = useState('');
  const [brand, setBrand] = useState('Visa');

  const [fullName, setFullName] = useState('Sarah Johnson');
  const [phone, setPhone] = useState('+1 (415) 555-0192');
  const [emergencyContact, setEmergencyContact] = useState('Mark Johnson (+1 415-555-0199)');
  const [address, setAddress] = useState('1428 Elm Grove Ave, San Francisco, CA 94107');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardLast4.trim()) return;
    const newCard: PaymentMethod = {
      id: Date.now(),
      brand: brand,
      last4: newCardLast4.slice(-4),
      exp_month: 8,
      exp_year: 2028,
      is_default: false
    };
    setCards([...cards, newCard]);
    setNewCardLast4('');
    setShowAddCard(false);
  };

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Payment Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage parent profile credentials, billing methods, and childcare notifications.</p>

        {/* Tab buttons */}
        <div className="flex border-b border-slate-200 mt-6 gap-6 text-xs font-bold">
          {[
            { id: 'profile', label: 'Parent Profile', icon: User },
            { id: 'payments', label: 'Payment & Invoices', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Privacy', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  active
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Parent Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                disabled
                value="sarah.johnson@kidsync.ai"
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Primary Care Residence</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert("Profile updated successfully!")}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Saved Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Saved Payment Methods</h2>
                <p className="text-xs text-slate-500">Encrypted via Stripe PCI-DSS Level 1 compliance.</p>
              </div>

              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl text-xs border border-teal-200 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Payment Method</span>
              </button>
            </div>

            {/* Add Card Form */}
            {showAddCard && (
              <form onSubmit={handleAddCard} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Test Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={newCardLast4}
                      onChange={(e) => setNewCardLast4(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-lg"
                  >
                    Save Test Card
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {cards.map((pm) => (
                <div key={pm.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                      {pm.brand}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">•••• •••• •••• {pm.last4}</p>
                      <p className="text-[11px] text-slate-400">Expires {pm.exp_month}/{pm.exp_year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {pm.is_default ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRemoveCard(pm.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions & Invoices */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Billing History & Receipts</h2>
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{tx.description}</p>
                    <p className="text-[11px] text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-slate-900">${tx.amount.toFixed(2)} USD</span>
                    <button 
                      onClick={() => alert(`Downloading PDF receipt for transaction ${tx.id}`)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900">Care Notification Channels</h2>
          <div className="space-y-3">
            {[
              { label: 'Caregiver Check-in & Departure Alerts', desc: 'Real-time SMS and push alerts when sessions start or conclude.' },
              { label: 'Activity & Photo Stream Updates', desc: 'Notify immediately when photos or milestone updates are logged.' },
              { label: 'AI Daily Care Summaries', desc: 'Email digest with synthesized care insights after each booking.' },
              { label: 'Billing & Payment Confirmations', desc: 'Invoices sent to sarah.johnson@kidsync.ai.' },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">{pref.label}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{pref.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900">Security & Authentication</h2>
          <div className="p-4 bg-slate-50 rounded-xl space-y-3">
            <p className="font-bold text-slate-800">Password & Sessions</p>
            <p className="text-slate-500">Last password update: 3 months ago. Two-factor authentication (2FA) is enabled via SMS.</p>
            <button
              onClick={() => alert("Password reset instructions sent to sarah.johnson@kidsync.ai")}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 shadow-2xs"
            >
              Request Password Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
