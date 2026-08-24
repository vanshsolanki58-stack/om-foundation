import { createClient } from '@supabase/supabase-js';

// Safe Supabase client setup: will work with env variables or fallback gracefully in development
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitVolunteerApplication(data: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  roles: string[];
  availability: string[];
  preferredShift: string;
  emergencyReliefOptIn: boolean;
  priorExperience?: string;
  message?: string;
}) {
  try {
    // If Supabase is connected with real credentials:
    if (supabaseUrl && supabaseUrl !== 'https://mock.supabase.co') {
      const { error } = await supabase.from('volunteer_submissions').insert({
        name: data.fullName,
        email: data.email || null,
        phone: data.phone,
        interest: data.roles.join(', '),
        city: data.city,
        availability: data.availability,
        preferred_shift: data.preferredShift,
        emergency_relief: data.emergencyReliefOptIn,
        prior_experience: data.priorExperience || null,
        message: data.message || null,
      });
      if (error) throw error;
    } else {
      // In local dev/mock mode, simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    
    return {
      success: true,
      volunteerId: `OM-VOL-${Math.floor(100000 + Math.random() * 900000)}`,
      message: 'Application received successfully!',
    };
  } catch (err: any) {
    console.error('Submission error:', err);
    throw new Error(err.message || 'Failed to submit application. Please try again.');
  }
}
