import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await registerUser(name, phoneNumber, password);
      setSuccess('ההרשמה הצליחה! אפשר להתחבר.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'ההרשמה נכשלה');
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
        className="mx-auto"
        style={{ maxWidth: '400px' }}
        onSubmit={handleSubmit}
      >
        {' '}
        <h3 className="text-center mb-4">הרשמה</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
          <label className="form-label">שם מלא</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="btn btn-success w-100">
          הירשם
        </button>
      </form>
    </div>
  );
};

export default Register;
