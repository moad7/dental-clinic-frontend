import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('שגיאה בקבלת הפגישות');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('האם למחוק את הפגישה?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (err) {
      alert('שגיאה במחיקה');
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-3 text-center">ניהול פגישות</h3>

      {loading ? (
        <p className="text-center">טוען...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center">אין פגישות</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>שם מטופל</th>
                <th>תאריך</th>
                <th>שעה</th>
                <th>סטטוס</th>
                <th>הערה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.status}</td>
                  <td>{a.note || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        navigate(`/appointments/edit/${a.id}`, {
                          state: { appointment: a },
                        })
                      }
                    >
                      ערוך
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleDelete(a.id)}
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
