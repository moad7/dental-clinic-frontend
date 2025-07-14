import { useEffect, useState } from 'react';
import axios from 'axios';

const SecretaryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/dashboard/summary',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error('שגיאה בקבלת נתוני לוח בקרה');
      }
    };

    const fetchTodayAppointments = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/appointments/today',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTodayAppointments(res.data);
      } catch (err) {
        console.error('שגיאה בקבלת פגישות להיום');
      }
    };

    fetchStats();
    fetchTodayAppointments();
  }, []);

  if (!stats) return <div className="text-center mt-5">טוען...</div>;

  return (
    <div className="container mt-4" dir="rtl">
      <h2 className="mb-4 text-center">לוח בקרה - מזכירה</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-bg-primary">
            <div className="card-body text-center">
              <h5 className="card-title">סה"כ מטופלים</h5>
              <p className="card-text fs-4">{stats.totalPatients}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-success">
            <div className="card-body text-center">
              <h5 className="card-title">פגישות עתידיות</h5>
              <p className="card-text fs-4">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-warning">
            <div className="card-body text-center">
              <h5 className="card-title">פגישות להיום</h5>
              <p className="card-text fs-4">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-secondary text-white">
          פגישות מתוכננות להיום
        </div>
        <div className="card-body p-0">
          {todayAppointments.length > 0 ? (
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>שם מטופל</th>
                  <th>שעה</th>
                  <th>סטטוס</th>
                  <th>הערה</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.patient?.name}</td>
                    <td>{appt.time}</td>
                    <td>{appt.status}</td>
                    <td>{appt.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-3 text-center">אין פגישות להיום</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
