import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { notificationService } from '../lib/notifications';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    notificationService.addNotification({
      title: 'Inquiry Received',
      message: `Thank you ${formData.name}! Your message regarding "${formData.subject}" has been received by our support team.`,
      category: 'system',
      priority: 'medium',
    });

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Om Foundation
        </h1>
        <p className="text-sm text-slate-600">
          Have questions about partnering with us, sponsoring a meal drive, or coordinating volunteer groups? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reach Us Directly</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs">Headquarters & Kitchen</p>
                  <p className="text-xs">Om Foundation Hub, Sector 14, Gurugram, Haryana 122001</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs">Email</p>
                  <p className="text-xs">contact@omfoundation.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 text-xs">Volunteer Helpline</p>
                  <p className="text-xs">+91 98765 43210 (10 AM - 6 PM)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
            <h4 className="text-sm font-bold text-emerald-950">Looking to Sponsor a Drive?</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              We organize dedicated birthday, anniversary, and corporate sponsored meal distribution drives with full video and photographic documentation.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Volunteer Coordination">Volunteer Coordination</option>
                    <option value="Meal Drive Sponsorship">Meal Drive Sponsorship</option>
                    <option value="Media & Press">Media & Press</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
