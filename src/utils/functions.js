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
