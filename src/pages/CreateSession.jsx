import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const CreateSession = () => {
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get('treatmentId');
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('scheduled');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/sessions',
        {
          treatmentId,
          date,
          time,
          note,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('הסשן נוסף בהצלחה');
      navigate(-1);
    } catch (err) {
      alert('שגיאה בהוספת סשן');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h4 className="mb-3">📅 הוסף סשן חדש</h4>
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
          <label className="form-label">סטטוס</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="scheduled">מתוכנן</option>
            <option value="done">בוצע</option>
            <option value="missed">לא הגיע</option>
            <option value="cancelled">בוטל</option>
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

        <button type="submit" className="btn btn-success">
          שמור סשן
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
