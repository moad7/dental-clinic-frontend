export const auth = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
export const SESSION_STATUS_OPTIONS = [
  { value: 'pending', label: 'ממתין' },
  { value: 'confirmed', label: 'מאושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
  { value: 'rejected', label: 'נדחה' },
];
export const TREATMENT_STATUS_OPTIONS = [
  { value: 'in_progress', label: 'בטיפול' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
  { value: 'rejected', label: 'נדחה' },
];
export const CREATOR_ROLES = {
  secretary: 'מזכיר/ה',
  doctor: 'רופא/ה',
  patient: 'מטופל/ת',
};
export const SESSION_STATUS_CLASSES = {
  pending: 'is-pending',
  confirmed: 'is-confirmed',
  completed: 'is-completed',
  cancelled: 'is-cancelled',
  rejected: 'is-rejected',
};
export const getSessionStatusLabel = (status) => {
  return SESSION_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
};
