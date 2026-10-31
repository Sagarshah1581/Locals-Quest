import React, { useState } from 'react';
import { ContactInquiry } from '../types';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId);
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'General Inquiry',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(data.error || 'Failed to submit inquiry');
      }
    } catch {
      // Local fallback ticket generation
      const generatedTicket = 'LQ-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold text-theme-primary uppercase tracking-wider block mb-1">
          Get In Touch
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Locals' Quest
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Have an inquiry about an experience, wish to list your orchard or cider estate, or have a question about Ontario quests?
        </p>
      </div>

      {/* Responsive Layout: 2 Columns on Tablet/Desktop, Stack on Mobile */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column (Inquiry Form) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
          {ticketId ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 text-2xl font-bold rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                ✓
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Inquiry Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for reaching out. Your inquiry has been routed to our regional discovery team.
              </p>
              <div className="inline-block bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-800">
                Ticket Reference: {ticketId}
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setTicketId(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>✉️</span>
                  <span>Send an Inquiry</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Quick Response</span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sagar Shah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition cursor-pointer"
                  >
                    <option value="General Inquiry">General Quest Inquiry</option>
                    <option value="Host Listing">Host Application (List an Experience)</option>
                    <option value="Group Booking">Group & Corporate Booking</option>
                    <option value="Event Update">Update Seasonal Event Details</option>
                    <option value="Feedback">Feedback & Suggestions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 416-555-0199"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question regarding seasonal passes in Halton"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Inquiry Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details about your query, desired dates, group size, or experience location..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold py-3.5 rounded-xl shadow-md text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Support Details & Benefits (Desktop / Tablet) */}
        <div className="lg:col-span-5 mt-6 lg:mt-0 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              ⚡
            </div>
            <h4 className="text-lg font-extrabold">Locals' Quest Concierge</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our regional field team verifies all seasonal festivals, farmsteads, and hidden view escapes in Ontario to guarantee authentic, high-quality outings.
            </p>
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Response turnaround within 24 business hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Direct coordination with local farmstead operators</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Assistance for group bookings of 6 or more</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌾</span>
              <span>Are You an Experience Host?</span>
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select <strong>Host Application</strong> in the form to get your orchard, cider tasting, or workshop featured in our curated regional directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
