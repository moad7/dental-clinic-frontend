import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const EditAppointment = () => {
  const { id } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const location = useLocation();
  const appointment = location.state.appointment;
  useEffect(() => {
    if (appointment) setDate(appointment.date);
    setTime(appointment.time);
    setNote(appointment.note || '');
    setStatus(appointment.status);
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        { date, time, note, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('הפגישה עודכנה בהצלחה');
      navigate('/appointments');
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה בעדכון הפגישה');
    }
  };

  if (!appointment) return <div className="text-center mt-5">טוען...</div>;

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">עריכת פגישה</h3>
      <form
        className="mx-auto"
        style={{ maxWidth: '500px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">תאריך</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">שעה</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">סטטוס</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">בהמתנה</option>
            <option value="confirmed">מאושרת</option>
            <option value="cancelled">מבוטלת</option>
            <option value="completed">הושלם</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">הערה</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          עדכן פגישה
        </button>
      </form>
    </div>
  );
};

export default EditAppointment;
