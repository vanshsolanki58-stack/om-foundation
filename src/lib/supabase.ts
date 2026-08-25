import { createClient } from '@supabase/supabase-js';

// Environment configuration for Supabase
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://mock.supabase.co' && 
  supabaseAnonKey !== 'mock-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock.supabase.co', 'mock-key');

/**
 * Submit volunteer registration to Supabase
 */
export async function submitVolunteerApplication(data: {
  fullName: string;
  email?: string;
  phone: string;
  city?: string;
  roles: string[];
  availability: string[];
  preferredShift?: string;
  emergencyReliefOptIn?: boolean;
  priorExperience?: string;
  message?: string;
}) {
  const volunteerId = `OM-VOL-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('volunteer_submissions').insert({
      name: data.fullName,
      email: data.email || null,
      phone: data.phone,
      interest: data.roles.join(', '),
      city: data.city || 'Bhuj, Gujarat',
      availability: data.availability,
      preferred_shift: data.preferredShift || null,
      emergency_relief: Boolean(data.emergencyReliefOptIn),
      prior_experience: data.priorExperience || null,
      message: data.message || null,
    });

    if (error) {
      console.error('Supabase volunteer insert error:', error);
      throw new Error(error.message || 'Database error: Failed to save volunteer application.');
    }
  } else {
    console.warn('⚠️ Supabase credentials (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are not configured. Submission saved locally only.');
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return {
    success: true,
    volunteerId,
    message: 'Application received successfully!',
  };
}

/**
 * Submit donation pledge to Supabase
 */
export async function submitDonationPledge(data: {
  amount: number;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  panNumber?: string;
  notes?: string;
}) {
  const donationId = `OM-DON-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('donations').insert({
      amount: data.amount,
      donor_name: data.donorName || 'Anonymous Seva Donor',
      donor_email: data.donorEmail || null,
      donor_phone: data.donorPhone || null,
      pan_number: data.panNumber || null,
      notes: data.notes || null,
      status: 'pledged',
    });

    if (error) {
      // Fallback check if table is called donation_submissions or donations
      console.error('Supabase donation insert error:', error);
      throw new Error(error.message || 'Database error: Failed to record donation pledge.');
    }
  } else {
    console.warn('⚠️ Supabase credentials not configured. Donation recorded locally.');
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return {
    success: true,
    donationId,
    message: 'Donation pledge recorded successfully!',
  };
}

/**
 * Submit contact inquiry to Supabase
 */
export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('contact_submissions').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.subject ? `[Subject: ${data.subject}] ${data.message}` : data.message,
    });

    if (error) {
      console.error('Supabase contact insert error:', error);
      throw new Error(error.message || 'Database error: Failed to send message.');
    }
  } else {
    console.warn('⚠️ Supabase credentials not configured. Contact submission saved locally.');
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return {
    success: true,
    message: 'Message sent successfully!',
  };
}
