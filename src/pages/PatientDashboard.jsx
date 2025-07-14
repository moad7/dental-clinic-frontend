import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/appointments/mine',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        alert('שגיאה בטעינת הפגישות');
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="text-center mb-4">📋 הפגישות שלי</h3>

      <div className="mb-4 text-end">
        <button
          className="btn btn-success me-2"
          onClick={() => navigate('/appointments/create')}
        >
          ➕ קבע תור חדש
        </button>
      </div>

      <div className="row">
        {appointments.length === 0 ? (
          <p className="text-center">אין פגישות מוצגות</p>
        ) : (
          appointments.map((a) => (
            <div className="col-md-4 mb-3" key={a.id}>
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">📅 {a.date}</h5>
                  <p className="card-text">🕒 {a.time}</p>
                  <p className="card-text">📝 {a.note || 'אין הערה'}</p>
                  <p className="card-text">
                    סטטוס: <strong>{translateStatus(a.status)}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const translateStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'ממתין לאישור';
    case 'confirmed':
      return 'מאושר';
    case 'completed':
      return 'הושלם';
    case 'cancelled':
      return 'בוטל';
    default:
      return status;
  }
};

export default PatientDashboard;
