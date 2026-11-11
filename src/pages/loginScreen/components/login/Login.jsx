import { useState } from 'react';
import { loginUser } from '../../../../api/authApi';
import textDictionary from '../../../../dictionary/text';
import { toast } from 'react-toastify';
import validator from 'validator';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './login.css';
const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const logInHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    const phone = props.phone.trim();
    const isPhone = validator.isMobilePhone(phone);
    if (!phone) {
      toast.error(textDictionary.phoneRequired);
      return;
    }
    if (!isPhone) {
      toast.error(textDictionary.phoneInvalid);
      return;
    }
    if (!props.password) {
      toast.error('יש להזין סיסמה');
      return;
    }
    setLoading(true);
    props.setIsPending(true);
    try {
      const res = await loginUser(phone, props.password);
      if (res?.type === 'Sign in') {
        props.setOtpId(res.otpId);
        props.setOtpType(res.type);
        props.setCodeValidation('');
        props.setView('otp');
      }
    } catch (error) {
      const message = error.response?.data?.message;
      switch (message) {
        case 'User not exist':
          toast.error(textDictionary.phoneInvalid);
          break;
        case 'Incorrect password':
          toast.error(textDictionary.errorPasswordCode);
          break;
        case 'User is not activated':
          toast.error('המשתמש לא פעיל');
          break;
        default:
          toast.error(message || 'שגיאה בהתחברות');
          break;
      }
    } finally {
      setLoading(false);
      props.setIsPending(false);
    }
  };
  const handleForgotPassword = () => {
    props.setView('phoneInput');
    props.setOtpType('Sign in');
  };
  const handleSignup = () => {
    props.setView('signup');
    props.setPassword('');
    props.setPhone('');
    props.setName('');
    props.setPasswordConfirm('');
  };
  return (
    <div className="login-card" dir="rtl">
      <div className="login-card-header">
        <h2 className="login-card-title">ברוכים הבאים</h2>
        <p className="login-card-subtitle">הזן את מספר הטלפון והסיסמה שלך כדי לגשת לחשבונך</p>
      </div>
      <form className="login-card-form" onSubmit={logInHandler}>
        <div className="login-card-inputs">
          {/* PHONE */}
          <div className="login-field">
            <label htmlFor="phoneInput" className="login-field-label">
              מספר נייד
            </label>
            <input
              type="tel"
              id="phoneInput"
              className="login-field-input"
              value={props.phone}
              onChange={(e) => props.setPhone(e.target.value)}
              placeholder="הזן מספר טלפון"
              autoComplete="tel"
              inputMode="tel"
              maxLength={10}
              dir="ltr"
              disabled={loading}
            />
          </div>
          {/* PASSWORD */}
          <div className="login-field">
            <label htmlFor="passwordInput" className="login-field-label">
              סיסמה
            </label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="passwordInput"
                className="login-field-input login-password-input"
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                {showPassword ? 'הסתר' : 'הצג'}
              </button>
            </div>
          </div>
          {/* OPTIONS */}
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" className="login-remember-checkbox" />
              <span>זכור אותי</span>
            </label>
            <button type="button" className="login-text-button" onClick={handleForgotPassword} disabled={loading}>
              שכחת את הסיסמה שלך?
            </button>
          </div>
          {/* SUBMIT */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-loading-spinner" />
                מתחבר...
              </>
            ) : (
              'התחברות'
            )}
          </button>
          {/* DIVIDER */}
          <div className="login-divider">
            <span>או התחבר באמצעות</span>
          </div>
          {/* SOCIAL LOGIN */}
          <div className="login-social-buttons">
            <button type="button" className="login-social-btn">
              <FcGoogle size={21} />
              <span>Google</span>
            </button>
            <button type="button" className="login-social-btn">
              <FaApple size={21} />
              <span>Apple</span>
            </button>
          </div>
          {/* SIGNUP */}
          <div className="login-signup">
            <span>אין לך חשבון?</span>
            <button type="button" className="login-text-button login-signup-btn" onClick={handleSignup} disabled={loading}>
              הירשמו עכשיו
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;
