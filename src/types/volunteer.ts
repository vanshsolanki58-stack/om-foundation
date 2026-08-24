export type VolunteerRole = 
  | 'food_prep'
  | 'meal_distribution'
  | 'logistics_transport'
  | 'outreach_fundraising'
  | 'teaching_mentorship'
  | 'social_media_admin';

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
  ageGroup: string;
  roles: VolunteerRole[];
  availability: string[];
  preferredShift: string;
  emergencyReliefOptIn: boolean;
  priorExperience?: string;
  message?: string;
}

export interface VolunteerSubmissionResult {
  success: boolean;
  volunteerId?: string;
  message: string;
}
