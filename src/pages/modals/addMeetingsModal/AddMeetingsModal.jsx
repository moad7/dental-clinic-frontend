import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
// import { createTreatmentBySecretary } from '../../../../api/secretaryApi';
import './addMeetingsModal.css';
import { AppDataContext } from '../../../context/AppDataContext';
import { AuthContext } from '../../../context/AuthContext';
import { fetchAvailableDoctors } from '../../../api/secretaryApi';
const initialFormData = {
  patientId: '',
  serviceGroupId: '',
  serviceItemId: '',
  doctorId: '',
  requiresMultipleSessions: 'false',
  totalSessions: 2,
  date: '',
  time: '',
  note: '',
};

const getPatientId = (patient) => {
  return patient?.userId?._id || patient?._id || '';
};

const getPatientName = (patient) => {
  return patient?.userId?.name || patient?.name || '';
};

const getPatientPhone = (patient) => {
  return patient?.userId?.phoneNumber || patient?.phoneNumber || '';
};

const AddMeetingsModal = ({ setOpen }) => {
  const { patientsBySecretry, serviceGroups } = useContext(AppDataContext);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState(initialFormData);
  const [patientSearch, setPatientSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const patients = useMemo(() => {
    return Array.isArray(patientsBySecretry) ? patientsBySecretry : [];
  }, [patientsBySecretry]);

  const allServices = useMemo(() => {
    const groups = Array.isArray(serviceGroups) ? serviceGroups : [];

    return groups.flatMap((group) =>
      Array.isArray(group.services)
        ? group.services.map((service) => ({
            groupId: group._id,
            groupTitle: group.title,
            serviceItemId: service._id,
            name: service.name,
            description: service.description,
            price: service.price,
            durationMin: service.durationMin,
            photo: service.photo,
            active: service.active,
          }))
        : [],
    );
  }, [serviceGroups]);

  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();

    if (!q) return patients;

    return patients.filter((patient) => {
      const name = getPatientName(patient).toLowerCase();
      const phone = getPatientPhone(patient).toLowerCase();
      const id = getPatientId(patient).toLowerCase();

      return name.includes(q) || phone.includes(q) || id.includes(q);
    });
  }, [patients, patientSearch]);

  const filteredServices = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();

    return allServices.filter((service) => {
      if (service.active === false) return false;

      if (!q) return true;

      return (
        service.name?.toLowerCase().includes(q) ||
        service.groupTitle?.toLowerCase().includes(q) ||
        service.description?.toLowerCase().includes(q)
      );
    });
  }, [allServices, serviceSearch]);

  const selectedService = useMemo(() => {
    return allServices.find(
      (service) => service.serviceItemId === formData.serviceItemId,
    );
  }, [allServices, formData.serviceItemId]);

  const filteredAvailableDoctors = useMemo(() => {
    const q = doctorSearch.trim().toLowerCase();

    if (!q) return availableDoctors;

    return availableDoctors.filter((doctor) => {
      return (
        doctor.name?.toLowerCase().includes(q) ||
        doctor.email?.toLowerCase().includes(q) ||
        doctor.phoneNumber?.toLowerCase().includes(q) ||
        doctor.specialization?.toLowerCase().includes(q)
      );
    });
  }, [availableDoctors, doctorSearch]);

  const selectedDoctor = useMemo(() => {
    return availableDoctors.find((doctor) => doctor._id === formData.doctorId);
  }, [availableDoctors, formData.doctorId]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'requiresMultipleSessions') {
      setFormData((prev) => ({
        ...prev,
        requiresMultipleSessions: value,
        totalSessions: value === 'true' ? prev.totalSessions || 2 : 1,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPatient = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: getPatientId(patient),
    }));
  };

  const handleSelectService = (service) => {
    setFormData((prev) => ({
      ...prev,
      serviceGroupId: service.groupId,
      serviceItemId: service.serviceItemId,
      doctorId: '',
    }));
  };

  const handleSelectDoctor = (doctor) => {
    setFormData((prev) => ({
      ...prev,
      doctorId: doctor._id,
    }));
  };

  const validateForm = () => {
    if (!formData.patientId) {
      toast.error('יש לבחור מטופל');
      return false;
    }

    if (!formData.serviceGroupId || !formData.serviceItemId) {
      toast.error('יש לבחור סוג טיפול');
      return false;
    }

    if (!formData.date) {
      toast.error('יש לבחור תאריך');
      return false;
    }

    if (!formData.time) {
      toast.error('יש לבחור שעה');
      return false;
    }

    if (!formData.doctorId) {
      toast.error('יש לבחור רופא מתאים');
      return false;
    }

    if (
      formData.requiresMultipleSessions === 'true' &&
      Number(formData.totalSessions) < 2
    ) {
      toast.error('בטיפול עם מספר מפגשים יש לבחור לפחות 2 מפגשים');
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    const requiresMultipleSessions =
      formData.requiresMultipleSessions === 'true';

    return {
      userId: formData.patientId,
      doctorId: formData.doctorId,

      serviceGroupId: formData.serviceGroupId,
      serviceItemId: formData.serviceItemId,

      requiresMultipleSessions,
      totalSessions: requiresMultipleSessions
        ? Number(formData.totalSessions)
        : 1,

      session: {
        date: formData.date,
        time: formData.time,
        status: 'pending',
        note: formData.note,
      },

      note: formData.note,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = buildPayload();

    try {
      setLoading(true);

      console.log('Add meeting payload:', payload);

      // await createTreatmentBySecretary(payload, token);

      toast.success('הטיפול נוצר בהצלחה');
      setFormData(initialFormData);
      setPatientSearch('');
      setServiceSearch('');
      setDoctorSearch('');
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'אירעה שגיאה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAvailableDoctors = async () => {
      if (!formData.serviceGroupId || !formData.date || !formData.time) {
        setAvailableDoctors([]);
        return;
      }

      try {
        setDoctorsLoading(true);

        const result = await fetchAvailableDoctors(token, {
          serviceGroupId: formData.serviceGroupId,
          date: formData.date,
          time: formData.time,
        });

        setAvailableDoctors(result.doctors || []);
      } catch (error) {
        console.log(error);
        toast.error('שגיאה בטעינת רופאים זמינים');
        setAvailableDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    loadAvailableDoctors();
  }, [formData.serviceGroupId, formData.date, formData.time, token]);
  return (
    <form className="add-meeting-modal-form" onSubmit={handleSubmit} dir="rtl">
      <div className="add-meeting-modal-section">
        <div className="add-meeting-modal-section-header">
          <span className="add-meeting-modal-section-title">בחירת מטופל</span>
          <span className="add-meeting-modal-section-subtitle">
            חפש לפי שם, טלפון או מזהה
          </span>
        </div>

        <div className="add-meeting-modal-search-box">
          <input
            className="add-meeting-modal-search-input"
            type="text"
            placeholder="חפש מטופל..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
        </div>

        <div className="add-meeting-modal-patient-list">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => {
              const patientId = getPatientId(patient);
              const patientName = getPatientName(patient);
              const patientPhone = getPatientPhone(patient);
              const isSelected = formData.patientId === patientId;

              return (
                <button
                  type="button"
                  key={patientId}
                  className={`add-meeting-modal-patient-card ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="add-meeting-modal-patient-avatar">
                    {patientName
                      ?.split(' ')
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('') || 'AA'}
                  </div>

                  <div className="add-meeting-modal-patient-info">
                    <strong>{patientName}</strong>
                    <span>{patientPhone || 'ללא טלפון'}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="add-meeting-modal-empty-state">
              לא נמצאו מטופלים
            </div>
          )}
        </div>
      </div>

      <div className="add-meeting-modal-section">
        <div className="add-meeting-modal-section-header">
          <span className="add-meeting-modal-section-title">
            בחירת סוג טיפול
          </span>
          <span className="add-meeting-modal-section-subtitle">
            ניתן לחפש לפי שם טיפול או קטגוריה
          </span>
        </div>

        <div className="add-meeting-modal-search-box">
          <input
            className="add-meeting-modal-search-input"
            type="text"
            placeholder="חפש טיפול..."
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
          />
        </div>

        <div className="add-meeting-modal-service-list">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const isSelected =
                formData.serviceItemId === service.serviceItemId;

              return (
                <button
                  type="button"
                  key={service.serviceItemId}
                  className={`add-meeting-modal-service-card ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="add-meeting-modal-service-image-wrap">
                    {service.photo ? (
                      <img
                        className="add-meeting-modal-service-image"
                        src={service.photo}
                        alt={service.name}
                      />
                    ) : (
                      <div className="add-meeting-modal-service-image-placeholder">
                        +
                      </div>
                    )}
                  </div>

                  <div className="add-meeting-modal-service-info">
                    <strong>{service.name}</strong>
                    <span>{service.groupTitle}</span>
                    <small>
                      {service.durationMin || 0} דקות · ₪{service.price || 0}
                    </small>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="add-meeting-modal-empty-state">
              לא נמצאו טיפולים
            </div>
          )}
        </div>

        {selectedService && (
          <div className="add-meeting-modal-selected-service">
            <span>הטיפול שנבחר:</span>
            <strong>
              {selectedService.name} - {selectedService.groupTitle}
            </strong>
          </div>
        )}
      </div>

      <div className="add-meeting-modal-section">
        <div className="add-meeting-modal-section-header">
          <span className="add-meeting-modal-section-title">פרטי הפגישה</span>
          <span className="add-meeting-modal-section-subtitle">
            בחר תאריך ושעה כדי להציג רופאים זמינים
          </span>
        </div>

        <div className="add-meeting-modal-grid">
          <div className="add-meeting-modal-field">
            <label>תאריך</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                  doctorId: '',
                }))
              }
              required
            />
          </div>

          <div className="add-meeting-modal-field">
            <label>שעה</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  time: e.target.value,
                  doctorId: '',
                }))
              }
              required
            />
          </div>

          <div className="add-meeting-modal-field">
            <label>האם הטיפול דורש יותר מפגישה אחת?</label>
            <select
              name="requiresMultipleSessions"
              value={formData.requiresMultipleSessions}
              onChange={handleChange}
            >
              <option value="false">לא, טיפול חד פעמי</option>
              <option value="true">כן, טיפול עם מספר מפגשים</option>
            </select>
          </div>

          {formData.requiresMultipleSessions === 'true' && (
            <div className="add-meeting-modal-field">
              <label>מספר מפגשים</label>
              <input
                type="number"
                name="totalSessions"
                min="2"
                max="60"
                value={formData.totalSessions}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="add-meeting-modal-field add-meeting-modal-full">
            <label>הערות</label>
            <textarea
              name="note"
              placeholder="כתוב הערה במידת הצורך..."
              value={formData.note}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="add-meeting-modal-section">
        <div className="add-meeting-modal-section-header">
          <span className="add-meeting-modal-section-title">
            בחירת רופא מתאים
          </span>
          <span className="add-meeting-modal-section-subtitle">
            יוצגו רק רופאים שמתאימים לטיפול ולזמן שנבחר
          </span>
        </div>

        <div className="add-meeting-modal-search-box">
          <input
            className="add-meeting-modal-search-input"
            type="text"
            placeholder="חפש רופא..."
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
            disabled={
              !formData.serviceGroupId || !formData.date || !formData.time
            }
          />
        </div>

        <div className="add-meeting-modal-doctor-list">
          {doctorsLoading ? (
            <div className="add-meeting-modal-empty-state">
              טוען רופאים זמינים...
            </div>
          ) : !formData.serviceGroupId || !formData.date || !formData.time ? (
            <div className="add-meeting-modal-empty-state">
              יש לבחור טיפול, תאריך ושעה כדי לראות רופאים זמינים
            </div>
          ) : filteredAvailableDoctors.length > 0 ? (
            filteredAvailableDoctors.map((doctor) => {
              const isSelected = formData.doctorId === doctor._id;

              return (
                <button
                  type="button"
                  key={doctor._id}
                  className={`add-meeting-modal-doctor-card ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  <div className="add-meeting-modal-doctor-avatar">
                    {doctor.avatar ? (
                      <img
                        className="add-meeting-modal-doctor-avatar-img"
                        src={doctor.avatar}
                        alt={doctor.name}
                      />
                    ) : (
                      doctor.name
                        ?.split(' ')
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join('') || 'DR'
                    )}
                  </div>

                  <div className="add-meeting-modal-doctor-info">
                    <strong>ד"ר {doctor.name}</strong>
                    <span>{doctor.email || doctor.phoneNumber}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="add-meeting-modal-empty-state">
              לא נמצאו רופאים זמינים בזמן שנבחר
            </div>
          )}
        </div>

        {selectedDoctor && (
          <div className="add-meeting-modal-selected-doctor">
            <span>הרופא שנבחר:</span>
            <strong>ד"ר {selectedDoctor.name}</strong>
          </div>
        )}
      </div>

      <div className="add-meeting-modal-actions">
        <button
          type="button"
          className="add-meeting-modal-cancel-btn"
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          ביטול
        </button>

        <button
          type="submit"
          className="add-meeting-modal-submit-btn"
          disabled={loading}
        >
          {loading ? 'שומר...' : 'צור טיפול'}
        </button>
      </div>
    </form>
  );
};

export default AddMeetingsModal;
