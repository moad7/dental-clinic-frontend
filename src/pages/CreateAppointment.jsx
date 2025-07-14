import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);
  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error('שגיאה בקבלת המטופלים');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !date || !time) return alert('נא למלא את כל השדות');

    try {
      await axios.post(
        'http://localhost:5000/api/appointments',
        { userId, date, time, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('הפגישה נוספה בהצלחה');
      //   navigate('/appointments');
      await fetchPatients();
      setUserId('');
      setDate('');
      setTime('');
      setNote('');
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה בהוספת הפגישה');
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">הוספת פגישה חדשה</h3>
      <form
        className="mx-auto"
        style={{ maxWidth: '500px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">בחר מטופל</label>
          <select
            className="form-select"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">בחר...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

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
          <label className="form-label">הערה (אופציונלי)</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          שמור פגישה
        </button>
      </form>
    </div>
  );
};

export default CreateAppointment;
