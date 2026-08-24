import React from 'react';
import { VolunteerRole, VolunteerRoleOption } from '../../types/volunteer';
import { Utensils, Truck, Megaphone, BookOpen, Share2, ShieldCheck, Check } from 'lucide-react';

export const ROLE_OPTIONS: VolunteerRoleOption[] = [
  {
    id: 'meal_distribution',
    title: 'Meal Distribution & Serving',
    description: 'Directly serve hot, nutritious meals to individuals and families at our drive locations.',
    icon: 'utensils',
    badge: 'High Impact',
  },
  {
    id: 'food_prep',
    title: 'Food Preparation & Packaging',
    description: 'Assist in kitchen cooking, packing meal boxes, hygiene checks, and portioning.',
    icon: 'shield',
    badge: 'Morning Shift',
  },
  {
    id: 'logistics_transport',
    title: 'Logistics & Transportation',
    description: 'Help transport meals, ingredients, and supplies between kitchens and distribution points.',
    icon: 'truck',
    badge: 'Vehicle Preferred',
  },
  {
    id: 'outreach_fundraising',
    title: 'Community Outreach & Donor Relations',
    description: 'Connect with local communities, identify needy clusters, and help coordinate donor partnerships.',
    icon: 'megaphone',
    badge: 'Flexible',
  },
  {
    id: 'teaching_mentorship',
    title: 'Child Nutrition & Mentorship',
    description: 'Engage children at community centers with basic learning, hygiene education, and activities.',
    icon: 'book',
    badge: 'Weekends',
  },
  {
    id: 'social_media_admin',
    title: 'Media, Photography & Admin',
    description: 'Photograph meal distribution drives, verify counts, document stories, and assist administrative operations.',
    icon: 'share',
    badge: 'Creative & Tech',
  },
];

interface RoleSelectorProps {
  selectedRoles: VolunteerRole[];
  onChange: (roles: VolunteerRole[]) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRoles, onChange }) => {
  const toggleRole = (role: VolunteerRole) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'utensils':
        return <Utensils className="w-5 h-5" />;
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'megaphone':
        return <Megaphone className="w-5 h-5" />;
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'share':
        return <Share2 className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRoles.includes(option.id);
          return (
            <div
              key={option.id}
              onClick={() => toggleRole(option.id)}
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getIcon(option.icon)}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {option.badge}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  {option.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
