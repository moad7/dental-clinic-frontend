import { toast } from 'react-toastify';
export const ERROR_MESSAGES = {
  /*
   * ========================================
   * General
   * ========================================
   */
  'Something went wrong': 'אירעה שגיאה, נסה שוב',
  'Internal server error': 'אירעה שגיאה בשרת',
  'Failed to load data': 'אירעה שגיאה בטעינת הנתונים',
  Unauthorized: 'אין הרשאה לבצע פעולה זו',
  Forbidden: 'אין לך הרשאה לבצע פעולה זו',
  'Access denied': 'הגישה נדחתה',
  'Token expired': 'פג תוקף ההתחברות, יש להתחבר מחדש',
  'Invalid token': 'ההתחברות אינה תקינה, יש להתחבר מחדש',
  'No token provided': 'נדרשת התחברות למערכת',
  /*
   * ========================================
   * ObjectId / Validation
   * ========================================
   */
  'Invalid ObjectId': 'מזהה הנתון אינו תקין',
  'Invalid appointment id': 'מזהה המפגש אינו תקין',
  'Invalid treatmentId': 'מזהה הטיפול אינו תקין',
  'Missing required fields': 'יש למלא את כל השדות הנדרשים',
  'Invalid weekday': 'יום חול לא חוקי',
  /*
   * ========================================
   * Appointment / Treatment Session
   * ========================================
   */
  'Appointment not found': 'המפגש לא נמצא',
  'Failed to fetch appointments': 'אירעה שגיאה בטעינת המפגשים',
  'Failed to create appointment': 'אירעה שגיאה ביצירת המפגש',
  'Failed to update appointment': 'אירעה שגיאה בעדכון המפגש',
  'Failed to delete appointment': 'אירעה שגיאה במחיקת המפגש',
  'Appointment updated successfully': 'המפגש עודכן בהצלחה',
  'Doctor already has an appointment at this date and time':
    'לרופא כבר קיים תור בתאריך ובשעה שנבחרו',
  'Patient already has an appointment on this day':
    'למטופל כבר קיים תור פעיל ביום זה',
  'Doctor already has an overlapping appointment at this date and time':
    'לרופא כבר יש תור חופף בתאריך ובשעה אלה',
  'Patient already has an appointment on this day. Complete the existing appointment first.':
    'למטופל כבר קיים תור ביום זה, יש להשלים או לסיים את התור הקיים תחילה',
  'Doctor, date and time are required for pending or confirmed sessions':
    'יש לבחור רופא, תאריך ושעה עבור מפגש ממתין או מאושר',
  'Invalid appointment date': 'תאריך המפגש אינו תקין',
  'Invalid session date': 'תאריך המפגש אינו תקין',
  'Invalid session date. Expected YYYY-MM-DD': 'תאריך המפגש אינו תקין',
  'Invalid time format. Expected HH:mm': 'שעת המפגש אינה תקינה',
  'New session status must be pending or confirmed':
    'סטטוס של מפגש חדש יכול להיות רק ממתין או מאושר',
  'All treatment sessions are already scheduled': 'כל מפגשי הטיפול כבר נקבעו',
  'Previous treatment session must be scheduled first':
    'יש לקבוע קודם את המפגש הקודם',
  'Session must be scheduled after the previous session':
    'יש לקבוע את המפגש לאחר המפגש הקודם',
  'Session must be scheduled before the next session':
    'יש לקבוע את המפגש לפני המפגש הבא',
  'Failed to calculate next session number':
    'אירעה שגיאה בחישוב מספר המפגש הבא',
  'Invalid session date or time': 'התאריך או השעה של המפגש אינם תקינים',
  'Treatment session created successfully': 'המפגש נוסף בהצלחה',
  'Failed to create session': 'אירעה שגיאה ביצירת המפגש',
  'Failed to update session': 'אירעה שגיאה בעדכון המפגש',
  'Failed to delete session': 'אירעה שגיאה במחיקת המפגש',
  'Failed to fetch sessions': 'אירעה שגיאה בטעינת מפגשי הטיפול',
  'Session not found': 'המפגש לא נמצא',
  'Only doctors or secretaries can update sessions':
    'רק רופא או מזכירה יכולים לעדכן מפגש',
  'Only doctors or secretaries can delete sessions':
    'רק רופא או מזכירה יכולים למחוק מפגש',
  /*
   * ========================================
   * Treatment
   * ========================================
   */
  'Treatment not found': 'הטיפול לא נמצא',
  'Cannot add sessions to a treatment that is not in progress':
    'לא ניתן להוסיף מפגש לטיפול שאינו פעיל',
  'totalSessions must be at least 1': 'מספר המפגשים חייב להיות לפחות 1',
  'totalSessions must be an integer greater than or equal to 1':
    'מספר המפגשים חייב להיות מספר שלם הגדול או שווה ל-1',
  /*
   * ========================================
   * Doctor
   * ========================================
   */
  'Doctor not found': 'הרופא לא נמצא',
  'Doctor not found or does not provide this service':
    'הרופא לא נמצא או שאינו מספק את הטיפול שנבחר',
  'Doctor does not provide this treatment service':
    'הרופא שנבחר אינו מתאים לסוג הטיפול הזה',
  'Treatment doctor is inactive or no longer provides this service':
    'הרופא אינו פעיל או שאינו מספק עוד את הטיפול הזה',
  'Doctor is inactive': 'חשבון הרופא אינו פעיל',
  'Failed to fetch doctors': 'אירעה שגיאה בטעינת הרופאים',
  'Failed to update doctor': 'אירעה שגיאה בעדכון פרטי הרופא',
  'Failed to create doctor': 'אירעה שגיאה ביצירת הרופא',
  'Doctor already exists': 'הרופא כבר קיים במערכת',
  'Selected time is outside doctor working hours':
    'הזמן שנבחר הוא מחוץ לשעות הפעילות של הרופא',
  'Doctor is not working on the selected day': 'הרופא לא עובד ביום שנבחר',
  /*
   * ========================================
   * Patient
   * ========================================
   */
  'Patient not found': 'המטופל לא נמצא',
  'The patient is inactive': 'חשבון המטופל אינו פעיל',
  'Patient is inactive': 'חשבון המטופל אינו פעיל',
  'Failed to fetch patients': 'אירעה שגיאה בטעינת המטופלים',
  'Failed to create patient': 'אירעה שגיאה ביצירת המטופל',
  'Failed to update patient': 'אירעה שגיאה בעדכון פרטי המטופל',
  'Patient already exists': 'המטופל כבר קיים במערכת',
  /*
   * ========================================
   * Services
   * ========================================
   */
  'Service not found': 'הטיפול לא נמצא',
  'Service group not found': 'קבוצת הטיפול לא נמצאה',
  'Service item not found': 'סוג הטיפול לא נמצא',
  'Failed to fetch services': 'אירעה שגיאה בטעינת השירותים',
  'Failed to create service': 'אירעה שגיאה ביצירת השירות',
  'Failed to update service': 'אירעה שגיאה בעדכון השירות',
  'Service already exists': 'השירות כבר קיים במערכת',
  'Invalid service duration': 'משך שירות לא חוקי',
  'Service item not found in selected service group':'פריט השירות לא נמצא בקבוצת השירות שנבחרה',
  /*
   * ========================================
   * Clinic
   * ========================================
   */
  'Clinic not found': 'המרפאה לא נמצאה',
  'Failed to fetch clinics': 'אירעה שגיאה בטעינת המרפאות',
  'Failed to create clinic': 'אירעה שגיאה ביצירת המרפאה',
  'Failed to update clinic': 'אירעה שגיאה בעדכון המרפאה',
  /*
   * ========================================
   * Auth / User
   * ========================================
   */
  'User not found': 'המשתמש לא נמצא',
  'Invalid credentials': 'פרטי ההתחברות אינם נכונים',
  'Invalid password': 'הסיסמה אינה נכונה',
  'Wrong password': 'הסיסמה אינה נכונה',
  'Email already exists': 'כתובת האימייל כבר קיימת במערכת',
  'Phone number already exists': 'מספר הטלפון כבר קיים במערכת',
  'ID number already exists': 'מספר הזהות כבר קיים במערכת',
  'idNumber already exists': 'מספר הזהות כבר קיים במערכת',
  'Account is inactive': 'החשבון אינו פעיל',
  'User is inactive': 'החשבון אינו פעיל',
  'Password is required': 'יש להזין סיסמה',
  'Current password is incorrect': 'הסיסמה הנוכחית אינה נכונה',
  'Passwords do not match': 'הסיסמאות אינן תואמות',
  /*
   * ========================================
   * Network
   * ========================================
   */
  NETWORK_ERROR: 'אין חיבור לשרת, בדוק את חיבור האינטרנט',
  TIMEOUT_ERROR: 'הבקשה נמשכה זמן רב מדי, נסה שוב',
  UNKNOWN_ERROR: 'אירעה שגיאה לא צפויה, נסה שוב',
};
export const getAppErrorMessage = (
  errorOrMessage,
  fallback = 'אירעה שגיאה, נסה שוב',
) => {
  if (typeof errorOrMessage === 'string') {
    return ERROR_MESSAGES[errorOrMessage] || errorOrMessage || fallback;
  }
  const error = errorOrMessage;
  if (!error) {
    return fallback;
  }
  if (error.code === 'ERR_NETWORK' || (!error.response && error.request)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;
  if (!ERROR_MESSAGES[message]) {
    switch (error?.response?.status) {
      case 400:
        return message || 'הבקשה אינה תקינה';
      case 401:
        return 'נדרשת התחברות מחדש למערכת';
      case 403:
        return 'אין לך הרשאה לבצע פעולה זו';
      case 404:
        return message || 'הנתון המבוקש לא נמצא';
      case 409:
        return message || 'קיימת התנגשות עם נתונים קיימים';
      case 422:
        return message || 'חלק מהנתונים שהוזנו אינם תקינים';
      case 500:
        return 'אירעה שגיאה בשרת, נסה שוב מאוחר יותר';
      default:
        break;
    }
  }
  return ERROR_MESSAGES[message] || message || fallback;
};
export const showErrorToast = (error, fallback) => {
  const message = getAppErrorMessage(error, fallback);
  toast.error(message);
};
