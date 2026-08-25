import React, { useState } from 'react';
import { RoleSelector } from './RoleSelector';
import { VolunteerFormData, VolunteerRole } from '../../types/volunteer';
import { volunteerService } from '../../lib/volunteer-store';
import { sendVolunteerRegistrationEmail } from '../../lib/email-service';
import { notificationService } from '../../lib/notifications';
import { VolunteerSuccessModal } from './VolunteerSuccessModal';
import { Heart, Send, AlertCircle, Sparkles, Mail, MapPin, ShieldAlert } from 'lucide-react';

const GUJARAT_CITIES = [
  // Kutch Region (Primary Hubs)
  'Madhapar (Bhuj)',
  'Bhuj (Kutch)',
  'Gandhidham (Kutch)',
  'Anjar (Kutch)',
  'Mandvi (Kutch)',
  'Mundra (Kutch)',
  'Nakhatrana (Kutch)',
  'Bhachau (Kutch)',
  'Rapar (Kutch)',
  'Naliya / Abdasa (Kutch)',
  // Major Gujarat Cities & Districts
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Bhavnagar',
  'Jamnagar',
  'Junagadh',
  'Gandhinagar',
  'Anand',
  'Nadiad',
  'Morbi',
  'Mehsana',
  'Surendranagar',
  'Bharuch',
  'Navsari',
  'Valsad / Vapi',
  'Porbandar',
  'Patan',
  'Palanpur / Banaskantha',
  'Himatnagar / Sabarkantha',
  'Godhra / Panchmahal',
  'Botad',
  'Amreli',
  'Veraval / Somnath',
  'Other Gujarat City / Village',
];

export const VolunteerForm: React.FC = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Madhapar (Bhuj)',
    customCity: '',
    ageGroup: '18-25',
    roles: ['meal_distribution'] as VolunteerRole[],
    availability: ['Friday Evening Seva (6:00 PM)', 'Sunday Morning Breakfast (8:30 AM)'],
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
      setError('Please select at least one way you would like to help');
      return;
    }
    if (formData.availability.length === 0) {
      setError('Please choose at least one availability preference');
      return;
    }

    const effectiveCity = formData.city === 'Other Gujarat City / Village' && formData.customCity?.trim()
      ? `${formData.customCity.trim()} (Gujarat)`
      : formData.city;

    try {
      setLoading(true);

      const submissionPayload: VolunteerFormData = {
        ...formData,
        city: effectiveCity,
      };

      // Register volunteer in Supabase single source of truth
      const result = await volunteerService.registerVolunteer(submissionPayload);

      // Send email dispatch to admin
      await sendVolunteerRegistrationEmail(submissionPayload, result.id);

      // Trigger automatic in-app notification
      notificationService.addNotification({
        title: 'New Volunteer Registered! 🎉',
        message: `Welcome ${formData.fullName}! Your registration (ID: ${result.id}) from ${effectiveCity} has been confirmed.`,
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
                placeholder="e.g. Ramesh Patel"
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
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City / Location (Gujarat) <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition bg-white"
              >
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {formData.city === 'Other Gujarat City / Village' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specify Your Gujarat City / Village / Taluka <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customCity"
                  required
                  value={formData.customCity || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Khavda, Kothara, Dahisara, Samakhiali..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition"
                />
              </div>
            )}

            <div className="sm:col-span-2">
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
        </div>

        {/* Section 2: Choose Volunteer Roles */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">How Would You Like to Contribute?</h3>
            </div>
            <span className="text-xs text-slate-500">Select one or more</span>
          </div>

          <RoleSelector
            selectedRoles={formData.roles}
            onChange={(roles) => setFormData((prev) => ({ ...prev, roles }))}
          />
        </div>

        {/* Section 3: Availability */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Seva Availability</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                When can you join us for seva?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  'Friday Evening Seva (6:00 PM)',
                  'Sunday Morning Breakfast (8:30 AM)',
                  'Weekend Seva (Sat & Sun)',
                  'Anytime / Whenever Needed (Flexible)',
                ].map((day) => {
                  const active = formData.availability.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleAvailabilityToggle(day)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition ${
                        active
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp Updates Opt-in */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="whatsappOptIn"
                checked={formData.whatsappUpdatesOptIn !== false}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, whatsappUpdatesOptIn: e.target.checked }))
                }
                className="w-4 h-4 mt-0.5 accent-emerald-600 rounded"
              />
              <label htmlFor="whatsappOptIn" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-900 block mb-0.5 flex items-center gap-1.5">
                  <span className="text-emerald-600 font-extrabold text-sm">📱</span>
                  Receive Seva Updates & Shibir Announcements on WhatsApp
                </span>
                Yes, send me WhatsApp updates and reminders for upcoming Friday evening meals, Sunday breakfast seva, and shibirs in Bhuj.
              </label>
            </div>

            {/* Emergency Relief Opt-in */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
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
                Yes, alert me via WhatsApp during emergency food relief drives or sudden food distribution programs in Gujarat.
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
            <h3 className="text-lg font-bold text-slate-900">Message / Prior Seva Experience (Optional)</h3>
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
            <span>Applications are forwarded to <strong>vansh.solanki58@gmail.com</strong></span>
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
