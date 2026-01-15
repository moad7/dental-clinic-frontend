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
    {
      id: 'patient-home-icon',
      label: '',
      to: '/patient/dashboard',
      icon: Hospital,
    },
    {
      id: 'patient-dashboard',
      label: 'לוח בקרה',
      to: '/patient/dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'patient-appointments',
      label: 'הפגישות שלי',
      to: '/patient/appointments',
      icon: Calendar,
    },
    {
      id: 'patient-book',
      label: 'הזמן פגישה',
      to: '/patient/book',
      icon: UserPlus,
    },
    {
      id: 'patient-treatments',
      label: 'תוכניות טיפול',
      to: '/patient/treatment-plans',
      icon: ClipboardList,
    },
  ],

  secretary: [
    {
      id: 'secretary-home-icon',
      label: '',
      to: '/secretary/dashboard',
      icon: Hospital,
    },
    {
      id: 'secretary-dashboard',
      label: 'לוח בקרה',
      to: '/secretary/dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'secretary-meetings',
      label: 'פגישות',
      to: '/secretary/meetingsManagement',
      icon: Calendar,
    },
    {
      id: 'secretary-doctors',
      label: 'רופאים',
      to: '/secretary/doctorsManagement',
      icon: Stethoscope,
    },
    {
      id: 'secretary-patients',
      label: 'חולים',
      to: '/secretary/patientsManagement',
      icon: Users,
    },
    {
      id: 'secretary-services',
      label: 'שירותים',
      to: '/secretary/servicesManagement',
      icon: BriefcaseMedical,
    },
  ],

  doctor: [
    {
      id: 'doctor-home-icon',
      label: '',
      to: '/doctor/dashboard',
      icon: Hospital,
    },
    {
      id: 'doctor-dashboard',
      label: 'לוח בקרה',
      to: '/doctor/dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'doctor-schedule',
      label: 'לוח זמנים',
      to: '/doctor/schedule',
      icon: Calendar,
    },
    {
      id: 'doctor-patients',
      label: 'חולים',
      to: '/doctor/patients',
      icon: Users,
    },
  ],
};
