import textDictionary from '../dictionary/text';
import validator from 'validator';

export const validatePassword = (password) => {
  const rules = [
    {
      condition: (password) =>
        validator.isLength(password, { min: 8, max: 32 }),
      message: textDictionary.passwordCheckLength,
    },
    {
      condition: (password) => /[A-Z]/.test(password),
      message: textDictionary.passwordCheckUppercase,
    },

    {
      condition: (password) => /[0-9]/.test(password),
      message: textDictionary.passwordCheckNumber,
    },

    {
      condition: (password) => !/\s/.test(password),
      message: textDictionary.passwordCheckNoSpaces,
    },
    // {
    //   condition: (password) => /[a-z]/.test(password),
    //   message: textDictionary.passwordCheckLowercase,
    // },
    //     // {
    //   condition: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    //   message: textDictionary.passwordCheckSpecialCharacter,
    // },
  ];

  return rules.map((rule) => ({
    message: rule.message,
    isMet: rule.condition(password),
  }));
};
export const formatAppointmentDate = (date, time) => {
  const dateObj = new Date(date);

  const formattedDate = dateObj.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
  });

  return `${formattedDate}, ${time}`;
};

export const israelCities = [
  'אום אל-פחם',
  'אילת',
  'אשדוד',
  'אשקלון',
  'באקה אל-גרבייה',
  'באר שבע',
  'בית שאן',
  'בית שמש',
  'בת ים',
  'גבעתיים',
  'דימונה',
  'הוד השרון',
  'הרצליה',
  'חורה',
  'חולון',
  'חיפה',
  'טבריה',
  'טייבה',
  'טירה',
  'כסיפה',
  'ירושלים',
  'לקיה',
  'לוד',
  'מגדל העמק',
  'מודיעין',
  'נהריה',
  'נצרת',
  'נס ציונה',
  'נתיבות',
  'נתניה',
  'ערערה בנגב',
  'עכו',
  'עפולה',
  'עראבה',
  'ערד',
  'פתח תקווה',
  'צפת',
  'קלנסווה',
  'קריית גת',
  'קריית שמונה',
  'ראשון לציון',
  'רהט',
  'רמלה',
  'רמת גן',
  'רעננה',
  'שדרות',
  'שפרעם',
  'שגב שלום',
  'תל שבע',
  'תל אביב-יפו',
  'טמרה',
  'סחנין',
];
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
};

export const getStatusStyle = (type, status) => {
  const treatmentStatuses = {
    in_progress: {
      text: 'בטיפול',
      color: '#9A3412',
      bg: '#FFEDD5',
    },
    completed: {
      text: 'הטיפול הושלם',
      color: '#166534',
      bg: '#DCFCE7',
    },
    cancelled: {
      text: 'הטיפול בוטל',
      color: '#991B1B',
      bg: '#FEE2E2',
    },
    rejected: {
      text: 'הטיפול נדחה',
      color: '#9A3412',
      bg: '#FFEDD5',
    },
  };

  const sessionStatuses = {
    pending: {
      text: 'ממתין לאישור',
      color: '#92400E',
      bg: '#FEF3C7',
    },
    confirmed: {
      text: 'הפגישה אושרה',
      color: '#1D4ED8',
      bg: '#DBEAFE',
    },
    completed: {
      text: 'הפגישה הושלמה',
      color: '#166534',
      bg: '#DCFCE7',
    },
    cancelled: {
      text: 'הפגישה בוטלה',
      color: '#991B1B',
      bg: '#FEE2E2',
    },
    rejected: {
      text: 'הפגישה נדחתה',
      color: '#9A3412',
      bg: '#FFEDD5',
    },
  };

  const statuses = type === 'treatment' ? treatmentStatuses : sessionStatuses;

  return (
    statuses[status] || {
      text: status || 'לא ידוע',
      color: '#4B5563',
      bg: '#F3F4F6',
    }
  );
};
