export const STATUS_LABELS = {
  in_progress: 'בטיפול',
  completed: 'הושלם',
  cancelled: 'בוטל',
  rejected: 'נדחה',
  pending: 'ממתין',
  confirmed: 'מאושר',
};
export const STATUS_CLASSES = {
  in_progress: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
  rejected: 'rejected',
  pending: 'pending',
  confirmed: 'confirmed',
};
export const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Jerusalem',
  });
};
export const formatPrice = (value) => {
  if (value == null) return '-';
  return `₪${Number(value).toLocaleString('he-IL')}`;
};
export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Jerusalem',
  });
};
export const getInitials = (name = '') => {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('') || 'PT'
  );
};
export const getActivationState = (user, expires) => {
  if (!user?.mustSetPassword) return 'activated';
  if (!expires) return 'unknown';
  const timestamp = new Date(expires).getTime();
  if (Number.isNaN(timestamp)) return 'unknown';
  return timestamp <= Date.now() ? 'expired' : 'valid';
};
