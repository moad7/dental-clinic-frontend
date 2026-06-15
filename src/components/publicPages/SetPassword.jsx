import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './setPassword.css';
import { setPassword } from '../../api/authApi';
import { toast } from 'react-toastify';

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    try {
      setLoading(true);
      await setPassword(token, formData.password);
      toast.success('הסיססמה נרשמה בהצלחה');
      navigate('/login');
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || 'אירעה שגיאה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-password-page" dir="rtl">
      <div className="set-password-card">
        <div className="set-password-icon">🔐</div>

        <h2>הגדרת סיסמה</h2>
        <p>צור סיסמה חדשה כדי להפעיל את החשבון שלך</p>

        <form onSubmit={handleSubmit}>
          <div className="set-password-field">
            <label>סיסמה חדשה</label>
            <input
              type="password"
              name="password"
              placeholder="הכנס סיסמה חדשה"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="set-password-field">
            <label>אימות סיסמה</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="הכנס שוב את הסיסמה"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="set-password-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'שומר...' : 'שמור סיסמה'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
