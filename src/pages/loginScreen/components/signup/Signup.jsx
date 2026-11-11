import { useState } from 'react';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { toast } from 'react-toastify';
import validator from 'validator';
import textDictionary from '../../../../dictionary/text';
import { checkPhoneAndSendCode } from '../../../../api/authApi';
import './signup.css';
import { cityOptions } from '../../../../utils/functions';
import Select from 'react-select';
import { showErrorToast } from '../../../../utils/errorMessages';
const Signup = (props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signup = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (
      !props.name?.trim() ||
      !props.phone?.trim() ||
      !props.idNumber.trim() ||
      !props.gender.trim() ||
      !props.city.trim() ||
      !props.birth.trim() ||
      !props.password.trim() ||
      !props.passwordConfirm.trim()
    ) {
      toast.warning(textDictionary.requiredField);
      return;
    }
    if (!/^\d{9}$/.test(props.idNumber)) {
      toast.warning('תעודת זהות חייבת להכיל 9 ספרות');
      return;
    }
    if (!validator.isMobilePhone(props.phone, 'he-IL')) {
      toast.warning(textDictionary.phoneInvalid);
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
    try {
      setLoading(true);
      props.setIsPending(true);
      const otp = await checkPhoneAndSendCode(props.phone, 'Verify Sign Up');
      if (otp?.type !== 'Verify Sign Up' || !otp?.otpId) {
        toast.error('שליחת קוד האימות נכשלה');
        return;
      }
      props.setOtpId(otp.otpId);
      props.setOtpType(otp.type);
      props.setView('otp');
    } catch (error) {
      console.error('Signup error:', error);
      showErrorToast(error || 'ההרשמה נכשלה');
    } finally {
      setLoading(false);
      props.setIsPending(false);
    }
  };
  const handleLogin = () => {
    if (loading) return;
    props.setView('login');
  };
  const today = new Date();
  const maxBirthDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  const visibleValidationResults = (props.validationResults || []).filter((result) => result.message !== textDictionary.passwordCheckNoSpaces);
  return (
    <div className="login-card signup-card" dir="rtl">
      {/* HEADER */}
      <div className="signup-header">
        <h2 className="signup-title">צור חשבון</h2>
        <p className="signup-subtitle">הצטרפו עכשיו לפאנל הבקרה של קליניקס</p>
      </div>
      <form className="signup-form" onSubmit={signup}>
        {/* NAME */}
        <div className="signup-field">
          <label htmlFor="signupName" className="signup-label">
            שם מלא
          </label>
          <input
            type="text"
            id="signupName"
            className="signup-input"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            placeholder="הזן שם מלא"
            autoComplete="name"
            disabled={loading}
          />
        </div>
        {/* ID NUMBER */}
        <div className="signup-field">
          <label htmlFor="signupIdNumber" className="signup-label">
            תעודת זהות
          </label>
          <input
            type="text"
            id="signupIdNumber"
            className="signup-input signup-number-input"
            value={props.idNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9);
              props.setIdNumber(value);
            }}
            placeholder="הזן מספר תעודת זהות"
            inputMode="numeric"
            maxLength={9}
            autoComplete="off"
            dir="ltr"
            disabled={loading}
            required
          />
          {props.idNumber?.length > 0 && props.idNumber.length < 9 && <span className="signup-field-hint">יש להזין 9 ספרות</span>}
        </div>
        {/* GENDER */}
        <div className="signup-field">
          <label htmlFor="signupGender" className="signup-label">
            מין
          </label>
          <Select
            inputId="signupGender"
            options={[
              { value: 'male', label: 'זכר' },
              { value: 'female', label: 'נקבה' },
            ]}
            placeholder="בחר מין"
            value={
              [
                { value: 'male', label: 'זכר' },
                { value: 'female', label: 'נקבה' },
              ].find((option) => option.value === props.gender) || null
            }
            onChange={(selectedOption) => {
              props.setGender(selectedOption?.value || '');
            }}
            className="signup-city-select"
            classNamePrefix="signup-city"
            isDisabled={loading}
            isSearchable={false}
            isClearable
            isRtl
          />
        </div>
        {/* CITY  */}
        <div className="signup-field">
          <label htmlFor="signupCity" className="signup-label">
            עיר
          </label>
          <Select
            inputId="signupCity"
            options={cityOptions}
            placeholder="בחר עיר מגורים"
            noOptionsMessage={() => 'לא נמצאו ערים'}
            value={cityOptions.find((option) => option.value === props.city) || null}
            onChange={(selectedOption) => {
              props.setCity(selectedOption?.value || '');
            }}
            className="signup-city-select"
            classNamePrefix="signup-city"
            isDisabled={loading}
            isSearchable
            isClearable
            isRtl
          />
        </div>
        {/* BIRTH DATE */}
        <div className="signup-field">
          <label htmlFor="signupBirth" className="signup-label">
            תאריך לידה
          </label>
          <input
            type="date"
            id="signupBirth"
            className="signup-input signup-date-input"
            value={props.birth}
            onChange={(e) => props.setBirth(e.target.value)}
            max={maxBirthDate}
            autoComplete="bday"
            disabled={loading}
            required
          />
        </div>
        {/* PHONE */}
        <div className="signup-field">
          <label htmlFor="signupPhone" className="signup-label">
            מספר נייד
          </label>
          <input
            type="tel"
            id="signupPhone"
            className="signup-input signup-phone-input"
            value={props.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              props.setPhone(value);
            }}
            placeholder="0501234567"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            dir="ltr"
            disabled={loading}
          />
        </div>
        {/* PASSWORD */}
        <div className="signup-field">
          <label htmlFor="signupPassword" className="signup-label">
            סיסמה
          </label>
          <div className="signup-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="signupPassword"
              className="signup-input signup-password-input"
              value={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              placeholder="הזן סיסמה"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="signup-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              disabled={loading}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        {/* CONFIRM PASSWORD */}
        <div className="signup-field">
          <label htmlFor="signupPasswordConfirm" className="signup-label">
            אשר סיסמה
          </label>
          <div className="signup-password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="signupPasswordConfirm"
              className="signup-input signup-password-input"
              value={props.passwordConfirm}
              onChange={(e) => props.setPasswordConfirm(e.target.value)}
              placeholder="הזן את הסיסמה שוב"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="signup-eye-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              disabled={loading}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        {/* PASSWORD REQUIREMENTS */}
        {visibleValidationResults.length > 0 && (
          <div className="signup-validation">
            <p className="signup-validation-title">דרישות הסיסמה</p>
            <ul className="signup-validation-list">
              {visibleValidationResults.map((result, index) => (
                <li key={index} className={`signup-validation-item ${result.isMet ? 'is-valid' : 'is-invalid'}`}>
                  <span className="signup-validation-icon">{result.isMet ? <FiCheck /> : <FiX />}</span>
                  <span>{result.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* SUBMIT */}
        <button type="submit" className="signup-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="signup-spinner" />
              שולח קוד אימות...
            </>
          ) : (
            'הרשמה'
          )}
        </button>
        {/* DIVIDER */}
        <div className="signup-divider">
          <span>או להירשם באמצעות</span>
        </div>
        {/* SOCIAL LOGIN */}
        <div className="signup-social-buttons">
          <button type="button" className="signup-social-btn" disabled={loading}>
            <FcGoogle size={21} />
            <span>Google</span>
          </button>
          <button type="button" className="signup-social-btn" disabled={loading}>
            <FaApple size={21} />
            <span>Apple</span>
          </button>
        </div>
        {/* LOGIN LINK */}
        <div className="signup-login">
          <span>האם כבר יש לך חשבון?</span>
          <button type="button" className="signup-login-btn" onClick={handleLogin} disabled={loading}>
            התחבר
          </button>
        </div>
      </form>
    </div>
  );
};
export default Signup;
