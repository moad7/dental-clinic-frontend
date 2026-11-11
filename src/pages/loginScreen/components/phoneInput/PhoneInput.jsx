import { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { FiPhone, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import validator from 'validator';
import textDictionary from '../../../../dictionary/text';
import { checkPhoneAndSendCode } from '../../../../api/authApi';
import './phoneInput.css';
const PhoneInput = (props) => {
  const [loading, setLoading] = useState(false);
  const sendMeOTPHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    const phone = props.phone.trim();
    if (!phone) {
      toast.error(textDictionary.phoneRequired);
      return;
    }
    if (!validator.isMobilePhone(phone, 'he-IL')) {
      toast.error(textDictionary.phoneInvalid);
      return;
    }
    setLoading(true);
    try {
      props.setCodeValidation('');
      const otp = await checkPhoneAndSendCode(phone, 'Password recovery');
      if (otp?.type === 'Password recovery' && otp?.otpId) {
        props.setOtpId(otp.otpId);
        props.setOtpType(otp.type);
        props.setView('otp');
      } else {
        toast.error('שליחת הקוד נכשלה');
      }
    } catch (error) {
      const message = error.response?.data?.message;
      switch (message) {
        case 'User not found':
          toast.error(textDictionary.errorPhone);
          break;
        default:
          toast.error(message || 'שליחת הקוד נכשלה');
          break;
      }
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (loading) return;
    props.setView('login');
  };
  return (
    <div className="login-card phone-input-card" dir="rtl">
      {/* HEADER */}
      <div className="phone-input-header">
        <div className="phone-input-header-icon">
          <FiPhone size={25} />
        </div>
        <h2 className="phone-input-title">שחזור סיסמה</h2>
        <p className="phone-input-subtitle">הזן את מספר הטלפון המשויך לחשבונך ונשלח אליך קוד אימות לשחזור הסיסמה</p>
      </div>
      {/* FORM */}
      <form className="phone-input-form" onSubmit={sendMeOTPHandler}>
        <div className="phone-input-field">
          <label htmlFor="recoveryPhoneInput" className="phone-input-label">
            מספר נייד
          </label>
          <div className="phone-input-wrapper">
            <input
              type="tel"
              id="recoveryPhoneInput"
              className="phone-input-control"
              value={props.phone}
              onChange={(e) => props.setPhone(e.target.value)}
              placeholder="0501234567"
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
              disabled={loading}
            />
          </div>
        </div>
        {/* SUBMIT */}
        <button type="submit" className="phone-input-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="phone-input-spinner" />
              שולח קוד...
            </>
          ) : (
            <>
              <FiSend size={17} />
              <span>שלח קוד</span>
            </>
          )}
        </button>
        {/* BACK */}
        <div className="phone-input-back-wrapper">
          <button type="button" className="phone-input-back" onClick={handleBack} disabled={loading}>
            <MdOutlineArrowBackIosNew size={14} />
            <span>חזרה להתחברות</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default PhoneInput;
