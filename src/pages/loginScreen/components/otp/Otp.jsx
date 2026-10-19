import React, { useContext } from 'react';
import OtpInput from '../../../../components/OtpInput';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { SlReload } from 'react-icons/sl';
import textDictionary from '../../../../dictionary/text';
import { toast } from 'react-toastify';
import {
  registerUser,
  signInWithOtp,
  verifyOtp,
} from '../../../../api/authApi';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Otp = (props) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const loginWithOtp = async () => {
    props.setIsPending(true);
    try {
      if (!props.codeValidation) {
        toast.warning(textDictionary.codeValidationRequired);
        return;
      }
      const res = await signInWithOtp(props.otpId, props.codeValidation);
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
  const handleOtpClick = async () => {
    if (props.otpType === 'Sign in') {
      await loginWithOtp();
      return;
    }
    const flow = await checkCodeValidation();
    if (flow === 'verify-signup') {
      try {
        await registerUser(props.name, props.phone, props.password);
        toast.success('התרשמת במערכת בהצלחה');
        props.setView('login');
        props.setName('');
        props.setPassword('');
        props.setPasswordConfirm('');
        props.setPhone('');
        props.setCodeValidation('');
      } catch (error) {
        toast.error(error.response?.data?.message || 'ההרשמה נכשלה');
      }
    }
  };
  const checkCodeValidation = async () => {
    if (props.codeValidation.length !== 4) {
      toast.warning(textDictionary.codeValidationRequired);
      return;
    }
    try {
      const { data } = await verifyOtp(props.otpId, props.codeValidation);
      if (data.success) {
        if (data.flow === 'password-recovery') {
          props.setView('newPassword');
        }
        if (data.flow === 'verify-signup') {
          props.setPhone(data.phoneNumber);
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
  return (
    <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
      <h3 className="fw-bold mb-4 text-center">קוד OTP</h3>
      <p className="fw-semibold mb-2 text-center">הזן את הקוד </p>
      <p className="fw-light mb-3 text-center">
        שלחנו את הקוד למספר {props.phone}
      </p>
      <div className="login-card-inputs w-100">
        <div className="d-flex w-100 align-items-center p-10 mb-4 ">
          <OtpInput
            setOTPCode={props.setCodeValidation}
            otpCode={props.codeValidation}
          />
        </div>
        <button
          className="btn btn-success w-100 mb-3 border-0"
          style={{ backgroundColor: '#11D057' }}
          onClick={handleOtpClick}
        >
          {props.otpType === 'Verify Sign Up'
            ? 'אישור הרשמה'
            : props.otpType === 'Password recovery'
              ? 'אישור קוד'
              : props.otpType === 'Sign in'
                ? 'התחברות'
                : 'אישור'}
        </button>
        <div className="d-flex w-100 justify-content-betwen">
          <button
            type="button"
            className="btn p-0"
            style={{ color: '#11D057' }}
            onClick={() => {
              props.setView('login');
            }}
          >
            חזרה
            <MdOutlineArrowBackIosNew />
          </button>
          <button
            type="button"
            className="btn p-0"
            style={{ color: '#364b3eff' }}
            onClick={props.resendOtp}
          >
            {textDictionary.resendVerificattionCode}
            <SlReload />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Otp;
