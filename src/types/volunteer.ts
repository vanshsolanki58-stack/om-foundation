export type VolunteerRole = 
  | 'meal_distribution'
  | 'food_prep'
  | 'admin'
  | 'social_media_admin'
  | 'logistics_transport'
  | 'outreach_fundraising'
  | 'teaching_mentorship';

export interface VolunteerRoleOption {
  id: VolunteerRole;
  title: string;
  description: string;
  icon: string;
  badge: string;
}

export interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  customCity?: string;
  ageGroup: string;
  roles: VolunteerRole[];
  availability: string[];
  preferredShift?: string;
  whatsappUpdatesOptIn?: boolean;
  emergencyReliefOptIn: boolean;
  priorExperience?: string;
  message?: string;
}

export interface VolunteerSubmissionResult {
  success: boolean;
  volunteerId?: string;
  message: string;
}
