import { RiToothLine } from 'react-icons/ri';
import loginScreenImage from '../../assets/images/loginScreen.png';
import './loginScreen.css';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import textDictionary from '../../dictionary/text';
import { toast } from 'react-toastify';
import {
  checkPhoneAndSendCode,
  loginUser,
  registerUser,
  signInWithOtp,
  updatePassword,
  verifyOtp,
} from '../../services/authService';
import OtpInput from '../../components/OtpInput';
import validator from 'validator';
import { AuthContext } from '../../context/AuthContext';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../../utils/functions';
import { SlReload } from 'react-icons/sl';
import Login from './components/login/Login';

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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // const logInHandler = async () => {
  //   setIsPending(true);

  //   const isPhone = validator.isMobilePhone(phone);
  //   if (!phone) {
  //     toast.error(textDictionary.phoneRequired);
  //     return;
  //   }
  //   if (!isPhone) {
  //     toast.error(textDictionary.phoneInvalid);
  //     return;
  //   }

  //   try {
  //     const res = await loginUser(phone, password);

  //     if (res?.type == 'Sign in') {
  //       setOtpId(res.otpId);
  //       setOtpType(res.type);
  //       setCodeValidation('');
  //       setView('otp');
  //     }
  //   } catch (error) {
  //     switch (error.response.data.message) {
  //       case 'User not exist':
  //         toast.error(textDictionary.phoneInvalid);
  //         break;
  //       case 'Incorrect password':
  //         toast.error(textDictionary.errorPasswordCode);
  //         break;
  //     }
  //   } finally {
  //     setIsPending(false);
  //   }
  // };
  const loginWithOtp = async () => {
    setIsPending(true);
    try {
      if (!codeValidation) {
        toast.warning(textDictionary.codeValidationRequired);
        return;
      }

      const res = await signInWithOtp(otpId, codeValidation);
      login(res);
      if (res.user.role == 'patient') {
        navigate('/patient-dashboard');
      } else if (res.user.role == 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/secretary');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'ההתחברות נכשלה');
    }
  };
  // const signup = async () => {
  //   if (!name || !phone || !passwordConfirm || !password) {
  //     toast.warning(textDictionary.requiredField);
  //     return;
  //   }
  //   if (password !== passwordConfirm) {
  //     toast.warning(textDictionary.passwordNotMatch);
  //     return;
  //   }

  //   try {
  //     const otp = await checkPhoneAndSendCode(phone, 'Verify Sign Up');
  //     if (otp.type == 'Verify Sign Up') {
  //       setOtpId(otp.otpId);
  //       setOtpType(otp.type);
  //       setView('otp');
  //     }
  //     const flow = checkCodeValidation();
  //     if (flow === 'Verify Sign Up') {
  //       await registerUser(name, phone, password);
  //       toast.success('התרשמת במערכת בהצלחה');
  //       setView('login');
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'ההרשמה נכשלה');
  //   } finally {
  //     setName('');
  //     setPassword('');
  //     setPasswordConfirm('');
  //     setPhone('');
  //   }
  // };

  const signup = async () => {
    if (!name || !phone || !passwordConfirm || !password) {
      toast.warning(textDictionary.requiredField);
      return;
    }
    if (password !== passwordConfirm) {
      toast.warning(textDictionary.passwordNotMatch);
      return;
    }

    try {
      const otp = await checkPhoneAndSendCode(phone, 'Verify Sign Up');

      if (otp.type === 'Verify Sign Up') {
        setOtpId(otp.otpId);
        setOtpType(otp.type);
        setView('otp');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'ההרשמה נכשלה');
    }
  };
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
  const checkCodeValidation = async () => {
    if (codeValidation.length !== 4) {
      toast.warning(textDictionary.codeValidationRequired);
      return;
    }
    try {
      const { data } = await verifyOtp(otpId, codeValidation);
      if (data.success) {
        if (data.flow === 'password-recovery') {
          setView('newPassword');
        }
        if (data.flow === 'verify-signup') {
          setPhone(data.phoneNumber);
          return data.flow;
        }
      }
    } catch (error) {
      switch (error.response.data.message) {
        case 'OTP already used.': {
          toast.error(textDictionary.errorVerificationCode);
          break;
        }
        case 'invalid signature': {
          toast.error(textDictionary.errorCode);
          break;
        }
        case 'jwt expired': {
          toast.error(textDictionary.codeExpired);
          break;
        }
        default: {
          console.log(error.response.data.message);
          break;
        }
      }
    }
  };
  const sendMeOTPHandler = async () => {
    if (!phone) {
      toast.error(textDictionary.phoneRequired);
      return;
    }
    try {
      setCodeValidation('');
      const otp = await checkPhoneAndSendCode(phone, 'Password recovery');
      if (otp.type == 'Password recovery') {
        setOtpId(otp.otpId);
        setOtpType(otp.type);
        setView('otp');
      }
    } catch (error) {
      switch (error.response.data.message) {
        case 'User not found':
          toast.error(textDictionary.errorPhone);
          break;
        default: {
          console.log(error.response.data.message);
          break;
        }
      }
    }
  };

  const modifyPasswordHandler = async () => {
    setIsPending(true);
    // Check if the password fields are not empty
    if (!password || !passwordConfirm) {
      toast.error(textDictionary.passwordRequired);
      return;
    }
    // Ensure the password meets the validation criteria
    if (!validationResults.every((result) => result.isMet)) {
      toast.warning(textDictionary.passwordCriteria);
      return;
    }

    // Validate if passwords match
    if (password !== passwordConfirm) {
      toast.warning(textDictionary.passwordNotMatch);
      return;
    }

    try {
      setIsPending(true);
      await updatePassword(phone, passwordConfirm);
      setView('login');
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setIsPending(false);
    }
  };
  const handleOtpClick = async () => {
    if (otpType === 'Sign in') {
      await loginWithOtp();
      return;
    }

    const flow = await checkCodeValidation();

    if (flow === 'verify-signup') {
      try {
        await registerUser(name, phone, password);
        toast.success('התרשמת במערכת בהצלחה');
        setView('login');

        setName('');
        setPassword('');
        setPasswordConfirm('');
        setPhone('');
        setCodeValidation('');
      } catch (error) {
        toast.error(error.response?.data?.message || 'ההרשמה נכשלה');
      }
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
              {/* <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
                  <h3 className="fw-bold mb-2 text-center">ברוכים הבאים</h3>
                  <p className="text-muted mb-4 text-center">
                    הזן את כתובת הדוא"ל והסיסמה שלך כדי לגשת לחשבונך
                  </p>

                  <div className="login-card-inputs w-100">
                    <div className="mb-3">
                      <label htmlFor="phoneInput" className="form-label">
                        מספר נייד
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneInput"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="passwordInput" className="form-label">
                        סיסמה
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check form-check-reverse">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberMe"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          זכור אותי
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn p-0"
                        style={{ color: '#11D057' }}
                        onClick={() => {
                          setView('phoneInput');
                          setOtpType('Sign in');
                        }}
                      >
                        שכחת את הסיסמה שלך?
                      </button>
                    </div>

                    <button
                      className="btn btn-success w-100 mb-3 border-0"
                      style={{ backgroundColor: '#11D057' }}
                      onClick={logInHandler}
                    >
                      התחברות
                    </button>

                    <div className="text-center text-muted mb-3">
                      או התחבר באמצעות
                    </div>

                    <div className="d-flex gap-3 mb-3 justify-content-center align-items-center ">
                      <button className="w-50 btn-google-apple ">
                        Google <FcGoogle />
                      </button>
                      <button className="w-50 btn-google-apple">
                        Apple
                        <FaApple />
                      </button>
                    </div>

                    <div className="text-center">
                      אין לך חשבון?
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        style={{ color: '#11D057' }}
                        onClick={() => {
                          setView('signup');
                          setPassword('');
                          setPhone('');
                          setName('');
                          setPasswordConfirm('');
                        }}
                      >
                        הירשמו עכשיו
                      </button>
                    </div>
                  </div>
                </div> */}
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
              <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
                <h3 className="fw-bold mb-2 text-center">צור חשבון</h3>
                <p className="text-muted mb-4 text-center">
                  הצטרפו עכשיו לפאנל הבקרה של קליניקס
                </p>

                <div className="login-card-inputs w-100">
                  <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label">
                      שם
                    </label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      value={name}
                      className="form-control"
                      id="name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneInput" className="form-label">
                      מספר נייד
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneInput"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      סיסמה
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="passwordConfirmInput"
                      className="form-label"
                    >
                      אשר סיסמה
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordConfirm"
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      value={passwordConfirm}
                    />
                  </div>
                  <div>
                    <ul>
                      {validationResults.length > 0 ? (
                        validationResults
                          .filter(
                            (result) =>
                              result.message !==
                              textDictionary.passwordCheckNoSpaces
                          )
                          .map((result, index) => (
                            <li
                              key={index}
                              style={{
                                color: result.isMet ? 'green' : 'red',
                              }}
                            >
                              {result.message}
                            </li>
                          ))
                      ) : (
                        <p>No validation results yet</p>
                      )}
                    </ul>
                  </div>
                  <button
                    className="btn btn-success w-100 mb-3 border-0"
                    style={{ backgroundColor: '#11D057' }}
                    onClick={signup}
                  >
                    התרשם
                  </button>

                  <div className="text-center text-muted mb-3">
                    או להירשם באמצעות
                  </div>

                  <div className="d-flex gap-3 mb-3 justify-content-center align-items-center ">
                    <button className="w-50 btn-google-apple ">
                      Google <FcGoogle />
                    </button>
                    <button className="w-50 btn-google-apple">
                      Apple
                      <FaApple />
                    </button>
                  </div>

                  <div className="text-center">
                    האם כבר יש לך חשבון?
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{ color: '#11D057' }}
                      onClick={() => {
                        setView('login');
                      }}
                    >
                      התחבר
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : view === 'otp' ? (
            <>
              <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
                <h3 className="fw-bold mb-4 text-center">קוד OTP</h3>

                <p className="fw-semibold mb-2 text-center">הזן את הקוד </p>
                <p className="fw-light mb-3 text-center">
                  שלחנו את הקוד למספר {phone}
                </p>

                <div className="login-card-inputs w-100">
                  <div className="d-flex w-100 align-items-center p-10 mb-4 ">
                    <OtpInput
                      setOTPCode={setCodeValidation}
                      otpCode={codeValidation}
                    />
                  </div>
                  <button
                    className="btn btn-success w-100 mb-3 border-0"
                    style={{ backgroundColor: '#11D057' }}
                    onClick={handleOtpClick}
                  >
                    {otpType === 'Verify Sign Up'
                      ? 'אישור הרשמה'
                      : otpType === 'Password recovery'
                      ? 'אישור קוד'
                      : otpType === 'Sign in'
                      ? 'התחברות'
                      : 'אישור'}
                  </button>

                  <div className="d-flex w-100 justify-content-betwen">
                    <button
                      type="button"
                      className="btn p-0"
                      style={{ color: '#11D057' }}
                      onClick={() => {
                        setView('login');
                      }}
                    >
                      חזרה
                      <MdOutlineArrowBackIosNew />
                    </button>
                    <button
                      type="button"
                      className="btn p-0"
                      style={{ color: '#364b3eff' }}
                      onClick={resendOtp}
                    >
                      {textDictionary.resendVerificattionCode}

                      <SlReload />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : view === 'newPassword' ? (
            <>
              <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
                <h3 className="fw-bold mb-4 text-center"></h3>

                <p className="fw-semibold mb-2 text-center">סיסמה חדשה</p>
                <p className="fw-light mb-3 text-center">
                  הזן את הסיסמה החדשה שלך
                </p>

                <div className="login-card-inputs w-100">
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      {textDictionary.newPassword}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      {textDictionary.newPasswordVerification}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInputConfirm"
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      value={passwordConfirm}
                    />
                  </div>
                  <div>
                    <ul>
                      {validationResults.length > 0 ? (
                        validationResults
                          .filter(
                            (result) =>
                              result.message !==
                              textDictionary.passwordCheckNoSpaces
                          )
                          .map((result, index) => (
                            <li
                              key={index}
                              style={{
                                color: result.isMet ? 'green' : 'red',
                              }}
                            >
                              {result.message}
                            </li>
                          ))
                      ) : (
                        <p>No validation results yet</p>
                      )}
                    </ul>
                  </div>
                  <button
                    className="btn btn-success w-100 mb-3 border-0"
                    style={{ backgroundColor: '#11D057' }}
                    onClick={modifyPasswordHandler}
                  >
                    המשך
                  </button>
                  <div className="d-flex w-100 justify-content-end">
                    <button
                      type="button"
                      className="btn p-0"
                      style={{ color: '#11D057' }}
                      onClick={() => {
                        setView('login');
                      }}
                    >
                      חזרה
                      <MdOutlineArrowBackIosNew />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            view === 'phoneInput' && (
              <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
                <h3 className="fw-bold mb-4 text-center"></h3>

                <p className="fw-semibold mb-2 text-center">
                  הזן את מספר הטלפון{' '}
                </p>
                {/* <p className="fw-light mb-3 text-center">
                  שלחנו את הקוד למספר {phone}
                </p> */}

                <div className="login-card-inputs w-100">
                  <div className="mb-3">
                    <label htmlFor="phoneInput" className="form-label">
                      מספר נייד
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneInput"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-success w-100 mb-3 border-0"
                    style={{ backgroundColor: '#11D057' }}
                    onClick={sendMeOTPHandler}
                  >
                    שלח קוד
                  </button>
                  <div className="d-flex w-100 justify-content-end">
                    <button
                      type="button"
                      className="btn p-0"
                      style={{ color: '#11D057' }}
                      onClick={() => {
                        setView('login');
                      }}
                    >
                      חזרה
                      <MdOutlineArrowBackIosNew />
                    </button>
                  </div>
                </div>
              </div>
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
