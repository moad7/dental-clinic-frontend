import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMyAppointment = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const check = await axios.get(
        `http://localhost:5000/api/appointments/check?date=${date}&time=${time}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!check.data.available) {
        return alert('תאריך או שעה כבר תפוסים!');
      }

      await axios.post(
        'http://localhost:5000/api/appointments',
        { date, time, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('התור נוסף בהצלחה!');
      navigate('/patient-dashboard');
    } catch (err) {
      console.error(err);
      alert('שגיאה בקביעת תור');
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">קבע תור חדש</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">תאריך</label>
          <input
            type="date"
            className="form-control"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">שעה</label>
          <input
            type="time"
            className="form-control"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">הערה (אופציונלי)</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">
          שמור תור
        </button>
      </form>
    </div>
  );
};

export default CreateMyAppointment;
