import React from 'react';
import { VolunteerRole, VolunteerRoleOption } from '../../types/volunteer';
import { Utensils, ChefHat, ClipboardList, Check } from 'lucide-react';

export const ROLE_OPTIONS: VolunteerRoleOption[] = [
  {
    id: 'meal_distribution',
    title: 'Meal Serving',
    description: 'Directly serve hot, nutritious meals with love and dignity to people and families in need.',
    icon: 'utensils',
    badge: 'अन्न सेवा',
  },
  {
    id: 'food_prep',
    title: 'Food Prep',
    description: 'Assist in the sacred community kitchen with cooking, chopping, hygiene checks, and packaging.',
    icon: 'chef-hat',
    badge: 'भोजन निर्माण',
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Help coordinate drives, manage volunteer communication, keep photo records, and assist operations.',
    icon: 'clipboard-list',
    badge: 'व्यवस्था एवं समन्वय',
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
      case 'chef-hat':
        return <ChefHat className="w-5 h-5" />;
      default:
        return <ClipboardList className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRoles.includes(option.id);
          return (
            <div
              key={option.id}
              onClick={() => toggleRole(option.id)}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {getIcon(option.icon)}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="text-base font-bold text-slate-900">
                    {option.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800">
                    {option.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
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
