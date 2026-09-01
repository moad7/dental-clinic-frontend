import React, { useContext, useEffect, useMemo, useState } from 'react';

import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import { AppDataContext } from '../../../../../context/AppDataContext';
import { AuthContext } from '../../../../../context/AuthContext';

import './doctorEditDetails.css';
import { updateDoctorBySecretary } from '../../../../../api/secretaryApi';

const DAYS = [
  { key: 'sunday', label: 'יום ראשון' },
  { key: 'monday', label: 'יום שני' },
  { key: 'tuesday', label: 'יום שלישי' },
  { key: 'wednesday', label: 'יום רביעי' },
  { key: 'thursday', label: 'יום חמישי' },
  { key: 'friday', label: 'יום שישי' },
  { key: 'saturday', label: 'יום שבת' },
];

const DEFAULT_WORKING_HOURS = DAYS.map((day) => ({
  day: day.key,
  isClosed: true,
  start: '09:00',
  end: '17:00',
}));

const DoctorEditDetails = ({ doctor, onCancel, onSuccess }) => {
  const { token } = useContext(AuthContext);

  const { serviceGroups, clinics, loadDoctors } = useContext(AppDataContext);

  const raw = doctor?.raw || doctor || {};
  const doctorProfile = raw?.doctor || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    birth: '',
    gender: '',
    yearsOfExperience: 0,
    bio: '',
    clinic: '',
    servicesGroupIds: [],
    workingHours: DEFAULT_WORKING_HOURS,
    isActive: true,
  });

  useEffect(() => {
    if (!raw?._id) return;

    const selectedServices = Array.isArray(doctorProfile?.services)
      ? doctorProfile.services
          .map((service) => {
            return service?.groupId?._id || service?.groupId;
          })
          .filter(Boolean)
          .map(String)
      : [];

    const existingHours = Array.isArray(doctorProfile?.workingHours)
      ? doctorProfile.workingHours
      : [];

    const normalizedHours = DAYS.map((day) => {
      const existing = existingHours.find((item) => item.day === day.key);

      return {
        day: day.key,
        isClosed: existing?.isClosed ?? true,
        start: existing?.start || '09:00',
        end: existing?.end || '17:00',
      };
    });

    setFormData({
      name: raw.name || '',
      idNumber: raw.idNumber || '',
      phoneNumber: raw.phoneNumber || '',
      email: raw.email || '',
      birth: raw.birth ? raw.birth.slice(0, 10) : '',
      gender: raw.gender || '',
      yearsOfExperience: doctorProfile?.yearsOfExperience ?? 0,
      bio: doctorProfile?.bio || '',
      clinic: doctorProfile?.clinic?._id || doctorProfile?.clinic || '',
      servicesGroupIds: selectedServices,
      workingHours: normalizedHours,
      isActive: raw.isActive ?? true,
    });
  }, [doctor]);

  const groups = useMemo(() => {
    return Array.isArray(serviceGroups) ? serviceGroups : [];
  }, [serviceGroups]);

  const availableClinics = useMemo(() => {
    return Array.isArray(clinics) ? clinics : [];
  }, [clinics]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleServiceToggle = (groupId) => {
    const id = String(groupId);

    setFormData((prev) => {
      const alreadySelected = prev.servicesGroupIds.includes(id);

      return {
        ...prev,

        servicesGroupIds: alreadySelected
          ? prev.servicesGroupIds.filter((item) => item !== id)
          : [...prev.servicesGroupIds, id],
      };
    });
  };

  const handleDayToggle = (dayKey) => {
    setFormData((prev) => ({
      ...prev,

      workingHours: prev.workingHours.map((item) =>
        item.day === dayKey
          ? {
              ...item,
              isClosed: !item.isClosed,
            }
          : item,
      ),
    }));
  };

  const handleWorkingHourChange = (dayKey, field, value) => {
    setFormData((prev) => ({
      ...prev,

      workingHours: prev.workingHours.map((item) =>
        item.day === dayKey
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.warning('יש להזין שם רופא');
      return false;
    }

    if (!formData.idNumber.trim()) {
      toast.warning('יש להזין מספר זהות');
      return false;
    }

    if (formData.idNumber.length !== 9) {
      toast.warning('מספר זהות חייב להכיל 9 ספרות');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.warning('יש להזין מספר טלפון');
      return false;
    }

    if (!formData.gender) {
      toast.warning('יש לבחור מין');
      return false;
    }

    if (formData.servicesGroupIds.length === 0) {
      toast.warning('יש לבחור לפחות תחום טיפול אחד');
      return false;
    }

    if (!formData.clinic) {
      toast.warning('יש לבחור מרפאה');
      return false;
    }

    if (Number(formData.yearsOfExperience) < 0) {
      toast.warning('שנות ניסיון אינן תקינות');
      return false;
    }

    const invalidWorkingHour = formData.workingHours.find((item) => {
      if (item.isClosed) return false;

      if (!item.start || !item.end) {
        return true;
      }

      return item.start >= item.end;
    });

    if (invalidWorkingHour) {
      const dayName =
        DAYS.find((day) => day.key === invalidWorkingHour.day)?.label ||
        invalidWorkingHour.day;

      toast.warning(`שעות העבודה אינן תקינות ב${dayName}`);

      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      idNumber: formData.idNumber.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim() || null,
      birth: formData.birth || null,
      gender: formData.gender,
      isActive: formData.isActive,
      doctor: {
        servicesGroupIds: formData.servicesGroupIds,
        yearsOfExperience: Number(formData.yearsOfExperience),
        bio: formData.bio.trim(),
        clinic: formData.clinic,
        workingHours: formData.workingHours,
      },
    };

    try {
      setLoading(true);
      console.log('UPDATE DOCTOR:', raw._id, payload);

      await updateDoctorBySecretary(raw._id, payload, token);

      await loadDoctors?.();

      toast.success('פרטי הרופא עודכנו בהצלחה');

      onSuccess?.();
    } catch (error) {
      console.error('Update doctor error:', error);

      toast.error(
        error?.response?.data?.message || 'אירעה שגיאה בעדכון פרטי הרופא',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!raw?._id) {
    return <div className="doctor-edit__empty">לא נמצאו פרטי רופא</div>;
  }

  return (
    <form className="doctor-edit" dir="rtl" onSubmit={handleSubmit}>
      {/* =========================
          HEADER
      ========================= */}

      <div className="doctor-edit__header">
        <div className="doctor-edit__header-info">
          <div className="doctor-edit__avatar">
            {raw.avatar ? (
              <img src={raw.avatar} alt={raw.name} />
            ) : (
              <span>
                {raw.name
                  ?.split(' ')
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('') || 'DR'}
              </span>
            )}
          </div>

          <div>
            <span className="doctor-edit__eyebrow">עריכת רופא</span>

            <h2>ד"ר {raw.name}</h2>

            <p>עדכון פרטים אישיים, מקצועיים ושעות פעילות</p>
          </div>
        </div>

        <div className="doctor-edit__header-actions">
          <button
            type="button"
            className="doctor-edit__button doctor-edit__button--secondary"
            onClick={onCancel}
            disabled={loading}
          >
            ביטול
          </button>

          <button
            type="submit"
            className="doctor-edit__button doctor-edit__button--primary"
            disabled={loading}
          >
            <FiSave />

            {loading ? 'שומר...' : 'שמירת שינויים'}
          </button>
        </div>
      </div>

      <div className="doctor-edit__layout">
        {/* =========================
            PERSONAL DETAILS
        ========================= */}

        <section className="doctor-edit__card">
          <SectionHeader
            icon={<FiUser />}
            title="פרטים אישיים"
            subtitle="פרטי הזיהוי והקשר של הרופא"
          />

          <div className="doctor-edit__form-grid">
            <Field label="שם מלא" required>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="שם מלא"
              />
            </Field>

            <Field label="מספר זהות" required>
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={formData.idNumber}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 9);

                  setFormData((prev) => ({
                    ...prev,
                    idNumber: value,
                  }));
                }}
              />
            </Field>

            <Field label="מספר טלפון" required>
              <div className="doctor-edit__input-icon">
                <FiPhone />

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </Field>

            <Field label="אימייל">
              <div className="doctor-edit__input-icon">
                <FiMail />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </Field>

            <Field label="תאריך לידה">
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
              />
            </Field>

            <Field label="מין" required>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">בחר מין</option>

                <option value="male">זכר</option>

                <option value="female">נקבה</option>
              </select>
            </Field>
          </div>
        </section>

        {/* =========================
            PROFESSIONAL
        ========================= */}

        <section className="doctor-edit__card">
          <SectionHeader
            icon={<FiBriefcase />}
            title="פרטים מקצועיים"
            subtitle="ניסיון ופרטי המרפאה"
          />

          <div className="doctor-edit__form-grid">
            <Field label="שנות ניסיון" required>
              <input
                type="number"
                min="0"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
              />
            </Field>

            <Field label="מרפאה" required>
              <div className="doctor-edit__input-icon">
                <FiMapPin />

                <select
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleChange}
                >
                  <option value="">בחר מרפאה</option>

                  {availableClinics.map((clinic) => (
                    <option key={clinic._id} value={clinic._id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>

          <Field label="אודות הרופא" className="doctor-edit__bio-field">
            <textarea
              name="bio"
              rows="5"
              maxLength={700}
              value={formData.bio}
              onChange={handleChange}
              placeholder="כתוב תיאור קצר על הרופא, הניסיון וההתמחות שלו..."
            />

            <div className="doctor-edit__counter">
              {formData.bio.length}/700
            </div>
          </Field>
        </section>

        {/* =========================
            SERVICES
        ========================= */}

        <section className="doctor-edit__card doctor-edit__card--full">
          <SectionHeader
            icon={<FiBriefcase />}
            title="תחומי טיפול"
            subtitle="בחר את תחומי הטיפול שהרופא מספק"
          />

          {groups.length > 0 ? (
            <div className="doctor-edit__services">
              {groups.map((group) => {
                const groupId = String(group._id);

                const selected = formData.servicesGroupIds.includes(groupId);

                return (
                  <button
                    type="button"
                    key={group._id}
                    className={`doctor-edit__service ${
                      selected ? 'doctor-edit__service--selected' : ''
                    }`}
                    onClick={() => handleServiceToggle(group._id)}
                  >
                    <div className="doctor-edit__service-check">
                      {selected && <FiCheck />}
                    </div>

                    <div className="doctor-edit__service-info">
                      <strong>{group.title}</strong>

                      <span>
                        {Array.isArray(group.services)
                          ? `${group.services.length} טיפולים`
                          : 'תחום טיפול'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="doctor-edit__empty">לא נמצאו תחומי טיפול</div>
          )}
        </section>

        {/* =========================
            WORKING HOURS
        ========================= */}

        <section className="doctor-edit__card doctor-edit__card--full">
          <SectionHeader
            icon={<FiClock />}
            title="שעות פעילות"
            subtitle="הגדר את ימי ושעות העבודה של הרופא"
          />

          <div className="doctor-edit__working-hours">
            {formData.workingHours.map((item) => {
              const day = DAYS.find((day) => day.key === item.day);

              return (
                <div
                  key={item.day}
                  className={`doctor-edit__working-day ${
                    item.isClosed ? 'doctor-edit__working-day--closed' : ''
                  }`}
                >
                  <div className="doctor-edit__working-day-info">
                    <button
                      type="button"
                      className={`doctor-edit__switch ${
                        !item.isClosed ? 'doctor-edit__switch--active' : ''
                      }`}
                      onClick={() => handleDayToggle(item.day)}
                    >
                      <span />
                    </button>

                    <div>
                      <strong>{day?.label}</strong>

                      <span>{item.isClosed ? 'סגור' : 'יום עבודה'}</span>
                    </div>
                  </div>

                  <div className="doctor-edit__working-time">
                    <div>
                      <label>משעה</label>

                      <input
                        type="time"
                        value={item.start}
                        disabled={item.isClosed}
                        onChange={(event) =>
                          handleWorkingHourChange(
                            item.day,
                            'start',
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <span className="doctor-edit__time-separator">עד</span>

                    <div>
                      <label>עד שעה</label>

                      <input
                        type="time"
                        value={item.end}
                        disabled={item.isClosed}
                        onChange={(event) =>
                          handleWorkingHourChange(
                            item.day,
                            'end',
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={`doctor-edit__day-status ${
                      item.isClosed ? 'doctor-edit__day-status--closed' : ''
                    }`}
                  >
                    {item.isClosed ? 'סגור' : `${item.start} - ${item.end}`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================
            ACCOUNT STATUS
        ========================= */}

        <section className="doctor-edit__card doctor-edit__card--full">
          <SectionHeader
            icon={<FiUser />}
            title="מצב חשבון"
            subtitle="הפעל או השבת את חשבון הרופא"
          />

          <div className="doctor-edit__account-status">
            <div>
              <strong>חשבון רופא פעיל</strong>

              <span>
                כאשר החשבון מושבת, הרופא לא יוצג כזמין לקביעת תורים חדשים.
              </span>
            </div>

            <button
              type="button"
              className={`doctor-edit__switch doctor-edit__switch--large ${
                formData.isActive ? 'doctor-edit__switch--active' : ''
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
            >
              <span />
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Actions */}

      <div className="doctor-edit__footer">
        <button
          type="button"
          className="doctor-edit__button doctor-edit__button--secondary"
          onClick={onCancel}
          disabled={loading}
        >
          ביטול
        </button>

        <button
          type="submit"
          className="doctor-edit__button doctor-edit__button--primary"
          disabled={loading}
        >
          <FiSave />

          {loading ? 'שומר שינויים...' : 'שמירת שינויים'}
        </button>
      </div>
    </form>
  );
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="doctor-edit__section-header">
    <div className="doctor-edit__section-icon">{icon}</div>

    <div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
);

const Field = ({ label, required, children, className = '' }) => (
  <label className={`doctor-edit__field ${className}`}>
    <span>
      {label}

      {required && <b className="doctor-edit__required">*</b>}
    </span>

    {children}
  </label>
);

export default DoctorEditDetails;
