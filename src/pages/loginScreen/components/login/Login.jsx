// import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../../services/authService';
import { AuthContext } from '../../../../context/AuthContext';
import textDictionary from '../../../../dictionary/text';
import { toast } from 'react-toastify';
import validator from 'validator';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const Login = (props) => {
  // const { login } = useContext(AuthContext);
  // const [error, setError] = useState('');

  const logInHandler = async () => {
    props.setIsPending(true);

    const isPhone = validator.isMobilePhone(props.phone);
    if (!props.phone) {
      toast.error(textDictionary.phoneRequired);
      return;
    }
    if (!isPhone) {
      toast.error(textDictionary.phoneInvalid);
      return;
    }

    try {
      const res = await loginUser(props.phone, props.password);

      if (res?.type == 'Sign in') {
        props.setOtpId(res.otpId);
        props.setOtpType(res.type);
        props.setCodeValidation('');
        props.setView('otp');
      }
    } catch (error) {
      switch (error.response.data.message) {
        case 'User not exist':
          toast.error(textDictionary.phoneInvalid);
          break;
        case 'Incorrect password':
          toast.error(textDictionary.errorPasswordCode);
          break;
      }
    } finally {
      props.setIsPending(false);
    }
  };
  return (
    <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
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
            value={props.phone}
            onChange={(e) => props.setPhone(e.target.value)}
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
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check form-check-reverse">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              זכור אותי
            </label>
          </div>
          <button
            type="button"
            className="btn p-0"
            style={{ color: '#11D057' }}
            onClick={() => {
              props.setView('phoneInput');
              props.setOtpType('Sign in');
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

        <div className="text-center text-muted mb-3">או התחבר באמצעות</div>

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
              props.setView('signup');
              props.setPassword('');
              props.setPhone('');
              props.setName('');
              props.setPasswordConfirm('');
            }}
          >
            הירשמו עכשיו
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
