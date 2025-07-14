import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user } = useContext(AuthContext);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      alert('שגיאה בטעינת מטופלים');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המטופל?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(patients.filter((p) => p.id !== id));
      } catch (err) {
        alert('שגיאה במחיקת המטופל');
      }
    }
  };
  console.log(user.role);

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">ניהול מטופלים</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>תפקיד</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td onClick={() => navigate(`/patients/profile/${p.id}`)}>
                {p.name}
              </td>
              <td>{p.phoneNumber}</td>
              <td>{p.role}</td>

              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => navigate(`/patients/edit/${p.id}`)}
                >
                  ערוך
                </button>

                {user.id !== p.id && p.id !== '1' && (
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(p.id)}
                  >
                    מחק
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
