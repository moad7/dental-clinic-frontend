import React from 'react';
import textDictionary from '../../../../dictionary/text';
import { toast } from 'react-toastify';
import { checkPhoneAndSendCode } from '../../../../api/authApi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
const Signup = (props) => {
  const signup = async () => {
    if (
      !props.name ||
      !props.phone ||
      !props.passwordConfirm ||
      !props.password
    ) {
      toast.warning(textDictionary.requiredField);
      return;
    }
    if (props.password !== props.passwordConfirm) {
      toast.warning(textDictionary.passwordNotMatch);
      return;
    }
    try {
      const otp = await checkPhoneAndSendCode(props.phone, 'Verify Sign Up');
      if (otp.type === 'Verify Sign Up') {
        props.setOtpId(otp.otpId);
        props.setOtpType(otp.type);
        props.setView('otp');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'ההרשמה נכשלה');
    }
  };
  return (
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
            onChange={(e) => props.setName(e.target.value)}
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
            onChange={(e) => props.setPhone(e.target.value)}
            value={props.phone}
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
            onChange={(e) => props.setPassword(e.target.value)}
            value={props.password}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordConfirmInput" className="form-label">
            אשר סיסמה
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordConfirm"
            onChange={(e) => props.setPasswordConfirm(e.target.value)}
            value={props.passwordConfirm}
          />
        </div>
        <div>
          <ul>
            {props.validationResults.length > 0 ? (
              props.validationResults
                .filter(
                  (result) =>
                    result.message !== textDictionary.passwordCheckNoSpaces,
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
        <div className="text-center text-muted mb-3">או להירשם באמצעות</div>
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
              props.setView('login');
            }}
          >
            התחבר
          </button>
        </div>
      </div>
    </div>
  );
};
export default Signup;
