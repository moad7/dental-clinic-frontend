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
  'חדרה',
  'חולון',
  'חיפה',
  'טבריה',
  'טייבה',
  'טירה',
  'ירושלים',
  'לוד',
  'מגדל העמק',
  'מודיעין',
  'נהריה',
  'נצרת',
  'נס ציונה',
  'נתיבות',
  'נתניה',
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
  'תל אביב-יפו',
  'טמרה',
  'סחנין',
];
