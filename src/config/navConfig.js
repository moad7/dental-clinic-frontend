import {
  Calendar,
  LayoutGrid,
  Users,
  UserPlus,
  Stethoscope,
  ClipboardList,
  BriefcaseMedical,
  Hospital,
} from 'lucide-react';

export const NAV_BY_ROLE = {
  patient: [
    { label: '', to: '/patient/dashboard', icon: Hospital },
    { label: 'לוח בקרה', to: '/patient/dashboard', icon: LayoutGrid },
    { label: 'הפגישות שלי', to: '/patient/appointments', icon: Calendar },
    { label: 'הזמן פגישה', to: '/patient/book', icon: UserPlus },
    {
      label: 'תוכניות טיפול',
      to: '/patient/treatment-plans',
      icon: ClipboardList,
    },
  ],
  secretary: [
    { label: '', to: '/secretary/dashboard', icon: Hospital },

    { label: 'לוח בקרה', to: '/secretary/dashboard', icon: LayoutGrid },
    { label: 'פגישות', to: '/secretary/appointments', icon: Calendar },
    { label: 'רופאים', to: '/secretary/doctors', icon: Stethoscope },
    { label: 'חולים', to: '/secretary/patients', icon: Users },
    { label: 'שירותים', to: '/secretary/services', icon: BriefcaseMedical },
  ],
  doctor: [
    { label: '', to: '/doctor/dashboard', icon: Hospital },

    { label: 'לוח בקרה', to: '/doctor/dashboard', icon: LayoutGrid },
    { label: 'לוח זמנים', to: '/doctor/schedule', icon: Calendar },
    { label: 'חולים', to: '/doctor/patients', icon: Users },
  ],
};
