import { useEffect, useState } from 'react';
import { RiToothLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import loginScreenImage from '../../assets/images/loginScreen.png';
import { checkPhoneAndSendCode } from '../../api/authApi';
import { validatePassword } from '../../utils/functions';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Otp from './components/otp/Otp';
import NewPassword from './components/newPassword/NewPassword';
import PhoneInput from './components/phoneInput/PhoneInput';
import './loginScreen.css';
const LoginScreen = () => {
  const [view, setView] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [birth, setBirth] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [codeValidation, setCodeValidation] = useState('');
  const [otpId, setOtpId] = useState('');
  const [otpType, setOtpType] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const resendOtp = async () => {
    setCodeValidation('');
    try {
      if (!phone || !otpType) {
        toast.error('לא ניתן לשלוח שוב קוד');
        return;
      }
      const otp = await checkPhoneAndSendCode(phone, otpType);
      if (otp?.otpId) {
        setOtpId(otp.otpId);
        toast.success('הקוד נשלח שוב בהצלחה');
      } else {
        toast.error('שליחת הקוד נכשלה');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'שליחת הקוד נכשלה');
    }
  };
  useEffect(() => {
    const results = validatePassword(password);
    setValidationResults(results);
  }, [password]);
  return (
    <div className="main-login" dir="rtl">
      <div className="login-layout">
        {/* LEFT / FORM SECTION */}
        <section className="login-form-section">
          {/* LOGO */}
          <div className="login-brand">
            <span className="login-brand-icon">
              <RiToothLine size={22} />
            </span>
            <span className="login-brand-name">טיפול שיניים</span>
          </div>
          {/* FORM CONTENT */}
          <main className="login-form-content">
            {view === 'login' ? (
              <Login
                setIsPending={setIsPending}
                setPasswordConfirm={setPasswordConfirm}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                setPassword={setPassword}
                password={password}
                setView={setView}
                setOtpType={setOtpType}
                setOtpId={setOtpId}
                setCodeValidation={setCodeValidation}
              />
            ) : view === 'signup' ? (
              <Signup
                setIsPending={setIsPending}
                name={name}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                passwordConfirm={passwordConfirm}
                setPasswordConfirm={setPasswordConfirm}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                gender={gender}
                setGender={setGender}
                city={city}
                setCity={setCity}
                birth={birth}
                setBirth={setBirth}
                setView={setView}
                validationResults={validationResults}
                setOtpType={setOtpType}
                setOtpId={setOtpId}
              />
            ) : view === 'otp' ? (
              <Otp
                setIsPending={setIsPending}
                phone={phone}
                setPhone={setPhone}
                setCodeValidation={setCodeValidation}
                codeValidation={codeValidation}
                otpType={otpType}
                otpId={otpId}
                setView={setView}
                setPasswordConfirm={setPasswordConfirm}
                name={name}
                setName={setName}
                setPassword={setPassword}
                password={password}
                idNumber={idNumber}
                gender={gender}
                birth={birth}
                city={city}
                resendOtp={resendOtp}
              />
            ) : view === 'newPassword' ? (
              <NewPassword
                phone={phone}
                setIsPending={setIsPending}
                setView={setView}
                setPassword={setPassword}
                password={password}
                setPasswordConfirm={setPasswordConfirm}
                passwordConfirm={passwordConfirm}
                validationResults={validationResults}
              />
            ) : (
              view === 'phoneInput' && (
                <PhoneInput
                  phone={phone}
                  setPhone={setPhone}
                  setView={setView}
                  setCodeValidation={setCodeValidation}
                  setOtpId={setOtpId}
                  setOtpType={setOtpType}
                />
              )
            )}
          </main>
          {/* FOOTER */}
          <footer className="login-footer">Clinic Enterprises LTD 2025 ©</footer>
        </section>
        {/* HERO SECTION */}
        <aside className="login-hero">
          <div className="login-hero-content">
            <img src={loginScreenImage} alt="Clinic dashboard preview" className="login-hero-img" />
          </div>
        </aside>
      </div>
    </div>
  );
};
export default LoginScreen;
