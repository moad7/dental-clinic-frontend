import React from 'react';
import textDictionary from '../../../../dictionary/text';
import { updatePassword } from '../../../../api/authApi';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { toast } from 'react-toastify';
const NewPassword = (props) => {
  const modifyPasswordHandler = async () => {
    props.setIsPending(true);
    // Check if the password fields are not empty
    if (!props.password || !props.passwordConfirm) {
      toast.error(textDictionary.passwordRequired);
      return;
    }
    // Ensure the password meets the validation criteria
    if (!props.validationResults.every((result) => result.isMet)) {
      toast.warning(textDictionary.passwordCriteria);
      return;
    }
    // Validate if passwords match
    if (props.password !== props.passwordConfirm) {
      toast.warning(textDictionary.passwordNotMatch);
      return;
    }
    try {
      props.setIsPending(true);
      await updatePassword(props.phone, props.passwordConfirm);
      props.setView('login');
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      props.setIsPending(false);
    }
  };
  return (
    <div className="login-card rounded-4 p-4 p-md-4 w-100 mx-auto">
      <h3 className="fw-bold mb-4 text-center"></h3>
      <p className="fw-semibold mb-2 text-center">סיסמה חדשה</p>
      <p className="fw-light mb-3 text-center">הזן את הסיסמה החדשה שלך</p>
      <div className="login-card-inputs w-100">
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">
            {textDictionary.newPassword}
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
          <label htmlFor="passwordInput" className="form-label">
            {textDictionary.newPasswordVerification}
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordInputConfirm"
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
export default NewPassword;
