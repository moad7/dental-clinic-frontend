import { RiToothLine } from 'react-icons/ri';
import loginScreenImage from '../../assets/images/loginScreen.png';
import './loginScreen.css';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { checkPhoneAndSendCode } from '../../api/authApi';
import OtpInput from '../../components/OtpInput';
import { AuthContext } from '../../context/AuthContext';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { validatePassword } from '../../utils/functions';
import { SlReload } from 'react-icons/sl';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Otp from './components/otp/Otp';
import NewPassword from './components/newPassword/NewPassword';
import PhoneInput from './components/phoneInput/PhoneInput';
const LoginScreen = () => {
  const [view, setView] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
  // Using useEffect to trigger validation when password changes
  useEffect(() => {
    // Perform password validation when newPassword changes
    const results = validatePassword(password);
    setValidationResults(results);
  }, [password]); // Dependency array: runs when `password` changes
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center main-login">
      <div className="row g-0 w-100" style={{ maxWidth: '1200px' }}>
        <div className="col-12 col-lg-5 p-5 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-lg-start justify-content-center mb-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#EFFCF4',
                  color: '#11D057',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RiToothLine size={22} />
              </span>
              <span
                style={{
                  color: '#11D057',
                  fontWeight: '700',
                  fontSize: '25px',
                }}
              >
                טיפול שיניים
              </span>
            </div>
          </div>
          {view === 'login' ? (
            <>
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
            </>
          ) : view === 'signup' ? (
            <>
              <Signup
                setIsPending={setIsPending}
                setPasswordConfirm={setPasswordConfirm}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                setPassword={setPassword}
                password={password}
                setView={setView}
                validationResults={validationResults}
                setOtpType={setOtpType}
                setOtpId={setOtpId}
              />
            </>
          ) : view === 'otp' ? (
            <>
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
                resendOtp={resendOtp}
              />
            </>
          ) : view === 'newPassword' ? (
            <>
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
            </>
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
          <div className="mt-3 text-center text-lg-end text-muted small">
            Clinic Enterprises LTD 2025 ©
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="login-hero h-100 p-md-5 d-flex flex-column justify-content-center">
            <div className="mt-4 d-flex justify-content-center justify-content-lg-start">
              <img
                src={loginScreenImage}
                alt="Clinic dashboard preview"
                className="img-fluid login-hero-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginScreen;
