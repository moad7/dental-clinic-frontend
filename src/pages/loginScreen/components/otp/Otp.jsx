import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { SlReload } from 'react-icons/sl';
import { toast } from 'react-toastify';
import OtpInput from '../../../../components/OtpInput';
import textDictionary from '../../../../dictionary/text';
import { registerUser, signInWithOtp, verifyOtp } from '../../../../api/authApi';
import { AuthContext } from '../../../../context/AuthContext';
import './otp.css';
const Otp = (props) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const loginWithOtp = async () => {
    const res = await signInWithOtp(props.otpId, props.codeValidation);
    login(res);
    if (res.user.role === 'patient') {
      navigate('/patient-dashboard');
    } else if (res.user.role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/secretary');
    }
  };
  const checkCodeValidation = async () => {
    try {
      const { data } = await verifyOtp(props.otpId, props.codeValidation);
      if (!data?.success) {
        toast.error(textDictionary.errorVerificationCode);
        return null;
      }
      if (data.flow === 'password-recovery') {
        props.setView('newPassword');
        return 'password-recovery';
      }
      if (data.flow === 'verify-signup') {
        props.setPhone(data.phoneNumber);
        return 'verify-signup';
      }
      return null;
    } catch (error) {
      const message = error.response?.data?.message;
      switch (message) {
        case 'OTP already used.':
          toast.error(textDictionary.errorVerificationCode);
          break;
        case 'invalid signature':
          toast.error(textDictionary.errorCode);
          break;
        case 'jwt expired':
          toast.error(textDictionary.codeExpired);
          break;
        default:
          toast.error(message || 'אימות הקוד נכשל');
          break;
      }
      return null;
    }
  };
  const handleOtpClick = async (e) => {
    e.preventDefault();
    if (loading || resending) return;
    if (props.codeValidation?.length !== 4) {
      toast.warning(textDictionary.codeValidationRequired);
      return;
    }
    setLoading(true);
    props.setIsPending(true);
    try {
      if (props.otpType === 'Sign in') {
        await loginWithOtp();
        return;
      }
      const flow = await checkCodeValidation();
      if (flow === 'verify-signup') {
        await registerUser(props.name, props.phone, props.password, props.city, props.gender, props.birth, props.idNumber);
        toast.success('נרשמת למערכת בהצלחה');
        props.setView('login');
        props.setName('');
        props.setPassword('');
        props.setPasswordConfirm('');
        props.setPhone('');
        props.setCodeValidation('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (props.otpType === 'Sign in' ? 'ההתחברות נכשלה' : 'ההרשמה נכשלה'));
    } finally {
      setLoading(false);
      props.setIsPending(false);
    }
  };
  const handleResendOtp = async () => {
    if (loading || resending) return;
    setResending(true);
    try {
      await props.resendOtp();
    } finally {
      setResending(false);
    }
  };
  const handleBack = () => {
    if (loading || resending) return;
    props.setCodeValidation('');
    props.setView('login');
  };
  const submitLabel =
    props.otpType === 'Verify Sign Up'
      ? 'אישור הרשמה'
      : props.otpType === 'Password recovery'
        ? 'אישור קוד'
        : props.otpType === 'Sign in'
          ? 'התחברות'
          : 'אישור';
  return (
    <div className="login-card otp-card" dir="rtl">
      {/* HEADER */}
      <div className="otp-header">
        <div className="otp-header-icon">
          <span>1234</span>
        </div>
        <h2 className="otp-title">אימות קוד OTP</h2>
        <p className="otp-subtitle">הזן את קוד האימות שנשלח אליך</p>
        <p className="otp-phone">
          שלחנו את הקוד למספר
          <span dir="ltr">{props.phone}</span>
        </p>
      </div>
      {/* FORM */}
      <form className="otp-form" onSubmit={handleOtpClick}>
        <div className="otp-code-section">
          <label className="otp-code-label">קוד אימות</label>
          <div className="otp-code-wrapper">
            <OtpInput setOTPCode={props.setCodeValidation} otpCode={props.codeValidation} />
          </div>
        </div>
        {/* SUBMIT */}
        <button type="submit" className="otp-submit-btn" disabled={loading || resending}>
          {loading ? (
            <>
              <span className="otp-loading-spinner" />
              מאמת קוד...
            </>
          ) : (
            submitLabel
          )}
        </button>
        {/* ACTIONS */}
        <div className="otp-actions">
          <button type="button" className="otp-back-btn" onClick={handleBack} disabled={loading || resending}>
            <MdOutlineArrowBackIosNew size={14} />
            <span>חזרה</span>
          </button>
          <button type="button" className="otp-resend-btn" onClick={handleResendOtp} disabled={loading || resending}>
            <SlReload size={14} className={resending ? 'otp-reloading' : ''} />
            <span>{resending ? 'שולח קוד...' : textDictionary.resendVerificattionCode}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default Otp;
