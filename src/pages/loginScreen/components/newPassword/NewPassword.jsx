import { useState } from 'react';
import textDictionary from '../../../../dictionary/text';
import { updatePassword } from '../../../../api/authApi';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './newPassword.css';
const NewPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const modifyPasswordHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!props.password || !props.passwordConfirm) {
      toast.error(textDictionary.passwordRequired);
      return;
    }
    if (!props.validationResults?.length || !props.validationResults.every((result) => result.isMet)) {
      toast.warning(textDictionary.passwordCriteria);
      return;
    }
    if (props.password !== props.passwordConfirm) {
      toast.warning(textDictionary.passwordNotMatch);
      return;
    }
    setLoading(true);
    props.setIsPending(true);
    try {
      await updatePassword(props.phone, props.passwordConfirm);
      toast.success('הסיסמה עודכנה בהצלחה');
      props.setPassword('');
      props.setPasswordConfirm('');
      props.setView('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'אירעה שגיאה בעדכון הסיסמה');
    } finally {
      setLoading(false);
      props.setIsPending(false);
    }
  };
  const handleBack = () => {
    if (loading) return;
    props.setView('login');
  };
  const visibleValidationResults = (props.validationResults || []).filter((result) => result.message !== textDictionary.passwordCheckNoSpaces);
  return (
    <div className="login-card new-password-card" dir="rtl">
      {/* HEADER */}
      <div className="new-password-header">
        <h2 className="new-password-title">סיסמה חדשה</h2>
        <p className="new-password-subtitle">הזן את הסיסמה החדשה שלך</p>
      </div>
      <form className="new-password-form" onSubmit={modifyPasswordHandler}>
        {/* NEW PASSWORD */}
        <div className="new-password-field">
          <label htmlFor="newPasswordInput" className="new-password-label">
            {textDictionary.newPassword}
          </label>
          <div className="new-password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPasswordInput"
              className="new-password-input"
              value={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              placeholder="הזן סיסמה חדשה"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="new-password-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        {/* CONFIRM PASSWORD */}
        <div className="new-password-field">
          <label htmlFor="newPasswordConfirmInput" className="new-password-label">
            {textDictionary.newPasswordVerification}
          </label>
          <div className="new-password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="newPasswordConfirmInput"
              className="new-password-input"
              value={props.passwordConfirm}
              onChange={(e) => props.setPasswordConfirm(e.target.value)}
              placeholder="הזן את הסיסמה שוב"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="new-password-eye-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              disabled={loading}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        {/* PASSWORD VALIDATION */}
        {visibleValidationResults.length > 0 && (
          <div className="new-password-validation">
            <p className="new-password-validation-title">דרישות הסיסמה</p>
            <ul className="new-password-validation-list">
              {visibleValidationResults.map((result, index) => (
                <li key={index} className={`new-password-validation-item ${result.isMet ? 'is-valid' : 'is-invalid'}`}>
                  <span className="new-password-validation-icon">{result.isMet ? <FiCheck /> : <FiX />}</span>
                  <span>{result.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* SUBMIT */}
        <button type="submit" className="new-password-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="new-password-spinner" />
              מעדכן סיסמה...
            </>
          ) : (
            'המשך'
          )}
        </button>
        {/* BACK */}
        <div className="new-password-back-wrapper">
          <button type="button" className="new-password-back" onClick={handleBack} disabled={loading}>
            <MdOutlineArrowBackIosNew size={14} />
            <span>חזרה</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewPassword;
