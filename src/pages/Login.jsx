import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(phoneNumber, password);

      login(data);
      if (data.user.role == 'patient') {
        navigate('/patient-dashboard');
      } else if (data.user.role == 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/secretary');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'ההתחברות נכשלה');
    }
  };

  return (
    <div
      className="mt-5 row "
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '100%',
      }}
    >
      <form
        className="mx-auto row"
        style={{
          maxWidth: '400px',
        }}
        onSubmit={handleSubmit}
      >
        {' '}
        <h3 className="text-center mb-4">התחברות</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">מספר טלפון</label>
          <input
            type="tel"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">סיסמה</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          התחבר
        </button>{' '}
        <div className="text-center">
          <button
            onClick={() => navigate('/register')}
            className="btn btn-link"
          >
            אין לך חשבון? הירשם כאן
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
