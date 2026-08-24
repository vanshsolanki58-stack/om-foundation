import React, { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { VolunteerFormData } from '../../types/volunteer';
import { volunteerService } from '../../lib/volunteer-store';
import { sendVolunteerRegistrationEmail } from '../../lib/email-service';
import { notificationService } from '../../lib/notifications';
import { VolunteerSuccessModal } from './VolunteerSuccessModal';
import { Heart, Send, AlertCircle, Clock, ShieldAlert, Sparkles, Mail } from 'lucide-react';

export const VolunteerForm: React.FC = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Bhuj, Gujarat',
    ageGroup: '18-25',
    roles: ['meal_distribution'],
    availability: ['Weekends (Sat & Sun)'],
    preferredShift: 'Morning (8:00 AM - 12:00 PM)',
    emergencyReliefOptIn: true,
    priorExperience: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ id: string; name: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityToggle = (option: string) => {
    setFormData((prev) => {
      const exists = prev.availability.includes(option);
      return {
        ...prev,
        availability: exists
          ? prev.availability.filter((a) => a !== option)
          : [...prev.availability, option],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (formData.roles.length === 0) {
      setError('Please select at least one role of interest');
      return;
    }
    if (formData.availability.length === 0) {
      setError('Please choose at least one availability preference');
      return;
    }

    try {
      setLoading(true);

      // Register volunteer in shared reactive store and sync to server
      const result = await volunteerService.registerVolunteer(formData);

      // Send email dispatch to vansh.solanki58@gmail.com
      await sendVolunteerRegistrationEmail(formData, result.id);

      // Trigger automatic in-app notification
      notificationService.addNotification({
        title: 'New Volunteer Registered! 🎉',
        message: `Welcome ${formData.fullName}! Your registration (ID: ${result.id}) has been confirmed and forwarded to admin (vansh.solanki58@gmail.com).`,
        category: 'volunteers',
        actionUrl: '/volunteer',
        actionLabel: 'View Status',
        priority: 'high',
      });

      setSuccessInfo({ id: result.id, name: formData.fullName });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your details and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-amber-100 shadow-xl">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Patel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Madhapar, Bhuj, Gujarat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Choose Volunteer Roles */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">How Would You Like to Help?</h3>
            </div>
            <span className="text-xs text-slate-500">Select one or more</span>
          </div>

          <RoleSelector
            selectedRoles={formData.roles}
            onChange={(roles) => setFormData((prev) => ({ ...prev, roles }))}
          />
        </div>

        {/* Section 3: Availability & Timing */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Availability & Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['Weekends (Sat & Sun)', 'Friday Meals (Women-led)', 'Weekdays', 'Flexible / Any Day'].map((day) => {
                  const active = formData.availability.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleAvailabilityToggle(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${
                        active
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  name="preferredShift"
                  value={formData.preferredShift}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition bg-white"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="Sunday Shibir Shift (8:00 AM - 11:00 AM)">Sunday Shibir Shift (8:00 AM - 11:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age Bracket
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition bg-white"
                >
                  <option value="Under 18">Student (Under 18)</option>
                  <option value="18-25">18 - 25 years</option>
                  <option value="26-40">26 - 40 years</option>
                  <option value="40+">40+ years</option>
                </select>
              </div>
            </div>

            {/* Emergency Relief Opt-in */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="emergencyOptIn"
                checked={formData.emergencyReliefOptIn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, emergencyReliefOptIn: e.target.checked }))
                }
                className="w-4 h-4 mt-0.5 accent-amber-600 rounded"
              />
              <label htmlFor="emergencyOptIn" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-900 block mb-0.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Emergency Food Relief Team Opt-in
                </span>
                Yes, alert me via WhatsApp during emergency food relief operations or sudden food distribution drives in Bhuj.
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Experience / Message */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">Message / Prior Volunteering (Optional)</h3>
          </div>

          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us a little about yourself or any prior experience in community seva..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Applications are automatically notified to <strong>vansh.solanki58@gmail.com</strong></span>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Volunteer Application
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successInfo && (
        <VolunteerSuccessModal
          isOpen={true}
          onClose={() => setSuccessInfo(null)}
          volunteerId={successInfo.id}
          volunteerName={successInfo.name}
          roles={formData.roles}
        />
      )}
    </div>
  );
};
