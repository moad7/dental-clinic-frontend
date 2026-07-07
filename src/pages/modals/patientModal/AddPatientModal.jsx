import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import './addPatientModal.css';
import Select from 'react-select';
import { israelCities } from '../../../utils/functions';
import { AuthContext } from '../../../context/AuthContext';
import { createPatientsBySecretary } from '../../../api/secretaryApi';

const initialFormData = {
  idNumber: '',
  name: '',
  phoneNumber: '',
  email: '',
  gender: '',
  birth: '',
  city: '',
  allergies: '',
  notes: '',
};

const AddPatientModal = ({ setOpen }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'idNumber' || name === 'phoneNumber'
          ? value.replace(/\D/g, '')
          : value,
    }));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age -= 1;
    }

    return age;
  };
  const cityOptions = israelCities.map((city) => ({
    value: city,
    label: city,
  }));
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('יש להזין שם מטופל');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('יש להזין מספר טלפון');
      return;
    }

    const payload = {
      idNumber: formData.idNumber,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      gender: formData.gender,
      city: formData.city,
      age: calculateAge(formData.birth),
      allergies: formData.allergies,
      notes: formData.notes,
    };

    try {
      setLoading(true);
      await createPatientsBySecretary(payload, token);
      toast.success('המטופל נוצר בהצלחה');
      setFormData(initialFormData);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'אירעה שגיאה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-patient-modal-form" onSubmit={handleSubmit} dir="rtl">
      <div className="add-patient-modal-section">
        <div className="add-patient-modal-section-header">
          <span className="add-patient-modal-section-title">פרטי המטופל</span>
          <span className="add-patient-modal-section-subtitle">
            הזן פרטים בסיסיים ליצירת מטופל חדש
          </span>
        </div>

        <div className="add-patient-modal-grid">
          <div className="add-patient-modal-field">
            <label>מספר תעודת זהות</label>
            <input
              type="text"
              name="idNumber"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={9}
              placeholder="030000000"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-patient-modal-field">
            <label>שם מלא</label>
            <input
              type="text"
              name="name"
              placeholder="לדוגמה: אחמד מוחמד"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-patient-modal-field">
            <label>טלפון</label>
            <input
              type="tel"
              maxLength={10}
              name="phoneNumber"
              placeholder="0501234567"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-patient-modal-field">
            <label>אימייל</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="add-patient-modal-field">
            <label>מין</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">בחר מין</option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </div>

          <div className="add-patient-modal-field">
            <label>תאריך לידה</label>
            <input
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
            />
          </div>

          <div className="add-patient-modal-field">
            <label>עיר</label>

            <Select
              options={cityOptions}
              placeholder="חפש עיר..."
              noOptionsMessage={() => 'לא נמצאו ערים'}
              value={
                formData.city
                  ? {
                      value: formData.city,
                      label: formData.city,
                    }
                  : null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  city: selected?.value || '',
                }))
              }
              classNamePrefix="add-patient-city-select"
              isSearchable
            />
          </div>

          <div className="add-patient-modal-field add-patient-modal-full">
            <label>אלרגיות</label>
            <textarea
              name="allergies"
              placeholder="כתוב אלרגיות אם יש..."
              value={formData.allergies}
              onChange={handleChange}
            />
          </div>

          <div className="add-patient-modal-field add-patient-modal-full">
            <label>הערות</label>
            <textarea
              name="notes"
              placeholder="הערות נוספות..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="add-patient-modal-actions">
        <button
          type="button"
          className="add-patient-modal-cancel-btn"
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          ביטול
        </button>

        <button
          type="submit"
          className="add-patient-modal-submit-btn"
          disabled={loading}
        >
          {loading ? 'שומר...' : 'צור מטופל'}
        </button>
      </div>
    </form>
  );
};

export default AddPatientModal;
