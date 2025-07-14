import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${id}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPatient(res.data);
      } catch (err) {
        alert('שגיאה בטעינת פרטי המטופל');
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div className="text-center mt-5">טוען...</div>;

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">פרופיל מטופל</h3>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🧍‍♂️ {patient.name}</h5>
          <p className="card-text">📞 {patient.phoneNumber}</p>
        </div>
      </div>

      <h5 className="mb-3">📅 רשימת פגישות</h5>
      {patient.Appointments.length === 0 ? (
        <p>אין פגישות למטופל זה.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>תאריך</th>
              <th>שעה</th>
              <th>סטטוס</th>
              <th>הערה</th>
              <th>טיפולים</th>
            </tr>
          </thead>
          <tbody>
            {patient.Appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.status}</td>
                <td>{a.note || '-'}</td>
                <td>
                  {a.Treatments?.length === 0 ? (
                    <span className="text-muted">אין</span>
                  ) : (
                    <ul className="mb-0">
                      {a.Treatments.map((treatment) => (
                        <li key={treatment.id}>
                          <strong>טיפול:</strong> {treatment.note || '---'}
                          {treatment.Sessions?.length > 0 && (
                            <ul>
                              {treatment.Sessions.map((s) => (
                                <li key={s.id}>
                                  {s.date} - {s.note} ({s.status})
                                </li>
                              ))}
                            </ul>
                          )}
                          <button
                            className="btn btn-sm btn-outline-primary mt-1"
                            onClick={() =>
                              navigate(
                                `/sessions/create?treatmentId=${treatment.id}`
                              )
                            }
                          >
                            ➕ הוסף סשן
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientProfile;
