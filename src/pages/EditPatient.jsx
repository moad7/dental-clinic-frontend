import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditPatient = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const patient = res.data.find((p) => p.id === parseInt(id));
        if (!patient) throw new Error('לא נמצא מטופל');
        console.log(patient);

        setName(patient.name);
        setPhoneNumber(patient.phoneNumber);
        setRole(patient.role);
      } catch (err) {
        alert('שגיאה בטעינת המטופל');
        navigate('/patients');
      }
    };
    fetchPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, phoneNumber, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('הפרטים עודכנו בהצלחה');
      navigate('/patients');
    } catch (err) {
      alert('שגיאה בעדכון המטופל');
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="mb-4 text-center">עריכת מטופל</h3>
      <form
        style={{ maxWidth: '500px', margin: '0 auto' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">שם</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">טלפון</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {user.role === 'secretary' && (
          <div className="mb-3">
            <label className="form-label">תפקיד</label>
            <select
              type="text"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value={'patient'}>חולה</option>
              <option value={'secretary'}>מזכירה</option>
              <option value={'doctor'}>רופה</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          עדכן
        </button>
      </form>
    </div>
  );
};

export default EditPatient;
