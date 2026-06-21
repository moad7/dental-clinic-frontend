import React, { useContext } from 'react';
import './addDoctorModal.css';
import { useState } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import { createDoctorBySecretary } from '../../../api/secretaryApi';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const days = [
  { key: 'sunday', label: 'יום ראשון' },
  { key: 'monday', label: 'יום שני' },
  { key: 'tuesday', label: 'יום שלישי' },
  { key: 'wednesday', label: 'יום רביעי' },
  { key: 'thursday', label: 'יום חמישי' },
  { key: 'friday', label: 'יום שישי' },
  { key: 'saturday', label: 'יום שבת' },
];

const defaultWorkingHours = days.map((d) => ({
  day: d.key,
  isClosed: d.key === 'friday' || d.key === 'saturday',
  start: '09:00',
  end: '17:00',
}));
const initialFormData = {
  name: '',
  phoneNumber: '',
  email: '',
  gender: '',
  avatar: '',
  yearsOfExperience: '',
  bio: '',
  clinic: '',
  servicesGroupIds: [],
  workingHours: defaultWorkingHours,
};

const AddDoctorModal = ({ setOpen, open }) => {
  const { serviceGroups, clinics, addDoctorToState } =
    useContext(AppDataContext);
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'yearsOfExperience') {
      let years = Number(value);

      if (years < 0) years = 0;
      if (years > 60) years = 60;

      setFormData((prev) => ({
        ...prev,
        yearsOfExperience: years,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      servicesGroupIds: selected,
    }));
  };

  const handleWorkingHourChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedHours = [...prev.workingHours];

      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value,
      };

      return {
        ...prev,
        workingHours: updatedHours,
      };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        gender: formData.gender,
        avatar: formData.avatar,
        role: 'doctor',

        doctor: {
          servicesGroupIds: formData.servicesGroupIds,
          yearsOfExperience: Number(formData.yearsOfExperience),
          // languages: formData.languages
          //   .split(',')
          //   .map((lang) => lang.trim())
          //   .filter(Boolean),
          bio: formData.bio,
          clinic: formData.clinic,
          workingHours: formData.workingHours,
        },
      };
      const newDoctor = await createDoctorBySecretary(payload, token);
      addDoctorToState(newDoctor.doctor);
      setOpen(!open);
      toast.success('הרופא נוצר בהצלחה ונשלח ליינק ליצר סיססמה חדשה');
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'אירעה שגיאה, נסה שוב');
    }
  };

  return (
    <form className="doctor-form" onSubmit={handleSubmit}>
      <div className="doctor-form-grid">
        <div className="form-field-add-doctor">
          <label>שמו המלא של הרופא</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field-add-doctor">
          <label>הטלפון</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+972 50 000 0000"
            required
          />
        </div>

        <div className="form-field-add-doctor">
          <label>דוא"ל</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@email.com"
          />
        </div>

        <div className="form-field-add-doctor">
          <label>מין</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">בחר מין</option>
            <option value="male">זכר</option>
            <option value="female">נקבה</option>
          </select>
        </div>
        <div className="form-field-add-doctor">
          <label>שנים של ניסיון</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}

            // placeholder="5"
          />
        </div>

        <div className="form-field-add-doctor">
          <label>שירותי רופא</label>

          <select
            multiple
            value={formData.servicesGroupIds}
            onChange={handleServiceChange}
            required
          >
            {serviceGroups.map((item) => (
              <option value={item._id} key={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field-add-doctor full-width">
          <label>אודות הרופא</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="כתבו סיכום קצר על הרופא."
          />
        </div>
        <div className="working-box full-width">
          <label className="section-label">שעות עבודה</label>

          {formData.workingHours?.map((item, index) => (
            <div
              className={`working-row ${item.isClosed ? 'closed' : ''}`}
              key={item.day}
            >
              <div className="day-name">
                {days.find((d) => d.key === item.day)?.label}
              </div>

              <label className="open-switch">
                <input
                  type="checkbox"
                  checked={!item.isClosed}
                  onChange={(e) =>
                    handleWorkingHourChange(
                      index,
                      'isClosed',
                      !e.target.checked,
                    )
                  }
                />
                <span></span>
                פתוח
              </label>

              <div className="time-field">
                <span>מ־</span>
                <input
                  type="time"
                  value={item.start}
                  disabled={item.isClosed}
                  onChange={(e) =>
                    handleWorkingHourChange(index, 'start', e.target.value)
                  }
                />
              </div>

              <div className="time-field">
                <span>עד</span>
                <input
                  type="time"
                  value={item.end}
                  disabled={item.isClosed}
                  onChange={(e) =>
                    handleWorkingHourChange(index, 'end', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-field-add-doctor full-width">
          <label>מרפאה</label>

          <div className="clinic-cards">
            {clinics.clinics?.map((clinic) => (
              <button
                type="button"
                key={clinic._id}
                className={`clinic-card ${
                  formData.clinic === clinic._id ? 'active' : ''
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    clinic: clinic._id,
                  }))
                }
              >
                <h4>{clinic.name}</h4>
                <p>{clinic.address}</p>

                {clinic.phones?.length > 0 && (
                  <span>{clinic.phones.join(' | ')}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="submit-btn" type="submit">
        הוסף רופא
      </button>
    </form>
  );
};

export default AddDoctorModal;
