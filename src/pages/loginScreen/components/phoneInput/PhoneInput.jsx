import React from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { toast } from 'react-toastify';
import textDictionary from '../../../../dictionary/text';
import { checkPhoneAndSendCode } from '../../../../api/authApi';
const PhoneInput = (props) => {
  const sendMeOTPHandler = async () => {
    if (!props.phone) {
      toast.error(textDictionary.phoneRequired);
      return;
    }
    try {
      props.setCodeValidation('');
      const otp = await checkPhoneAndSendCode(props.phone, 'Password recovery');
      if (otp.type == 'Password recovery') {
        props.setOtpId(otp.otpId);
        props.setOtpType(otp.type);
        props.setView('otp');
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
  return (
    <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
      <h3 className="fw-bold mb-4 text-center"></h3>
      <p className="fw-semibold mb-2 text-center">הזן את מספר הטלפון </p>
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
            onChange={(e) => props.setPhone(e.target.value)}
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
              props.setView('login');
            }}
          >
            חזרה
            <MdOutlineArrowBackIosNew />
          </button>
        </div>
      </div>
    </div>
  );
};
export default PhoneInput;
