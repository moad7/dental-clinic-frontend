import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import './addMeetingsModal.css';
import { AppDataContext } from '../../../context/AppDataContext';
import { AuthContext } from '../../../context/AuthContext';
import { fetchDoctorAvailableSlots } from '../../../api/doctorApi';
import { createAppointments } from '../../../api/appointmentApi';
import MeetingSchedulePicker from '../../components/meetingSchedulePicker/MeetingSchedulePicker';

const initialFormData = {
  patientId: '',
  serviceGroupId: '',
  serviceItemId: '',
  doctorId: '',
  date: '',
  time: '',
  requiresMultipleSessions: 'false',
  totalSessions: 2,
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
  const { patientsBySecretry, serviceGroups, loadAllAppointments } =
    useContext(AppDataContext);

  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialFormData);
  const [patientSearch, setPatientSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const patients = useMemo(() => {
    return Array.isArray(patientsBySecretry) ? patientsBySecretry : [];
  }, [patientsBySecretry]);

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

  const filteredServices = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();

    return allServices.filter((service) => {
      if (service.active === false) {
        return false;
      }
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
      (service) =>
        String(service.serviceItemId) === String(formData.serviceItemId),
    );
  }, [allServices, formData.serviceItemId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

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
      date: '',
      time: '',
    }));

    setAvailableSlots([]);
  };

  useEffect(() => {
    if (!formData.doctorId || !formData.date) {
      setAvailableSlots([]);
      return;
    }
    let ignoreResult = false;

    const loadDoctorSlots = async () => {
      try {
        setSlotsLoading(true);
        const result = await fetchDoctorAvailableSlots(
          {
            doctorId: formData.doctorId,
            date: formData.date,
          },
          token,
        );
        if (ignoreResult) return;
        setAvailableSlots(Array.isArray(result?.slots) ? result.slots : []);
      } catch (error) {
        if (ignoreResult) return;
        console.error('Failed to load slots:', error);
        setAvailableSlots([]);
        toast.error('שגיאה בטעינת שעות זמינות');
      } finally {
        if (!ignoreResult) {
          setSlotsLoading(false);
        }
      }
    };

    loadDoctorSlots();

    return () => {
      ignoreResult = true;
    };
  }, [formData.doctorId, formData.date, token]);

  const validateForm = () => {
    if (!formData.patientId) {
      toast.error('יש לבחור מטופל');

      return false;
    }
    if (!formData.serviceGroupId || !formData.serviceItemId) {
      toast.error('יש לבחור סוג טיפול');

      return false;
    }
    if (!formData.doctorId) {
      toast.error('יש לבחור רופא מתאים');

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
      patientId: formData.patientId,
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
        status: user?.role === 'patient' ? 'pending' : 'confirmed',
        note: formData.note.trim(),
      },
      note: formData.note.trim(),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = buildPayload();

    try {
      setLoading(true);

      await createAppointments(payload, token);

      await loadAllAppointments?.();

      toast.success('הטיפול נוצר בהצלחה');

      setFormData(initialFormData);

      setPatientSearch('');
      setServiceSearch('');

      setAvailableSlots([]);

      setOpen(false);
    } catch (error) {
      const message = error?.response?.data?.message;

      switch (message) {
        case 'Doctor already has an appointment at this date and time':
          toast.error('לרופא כבר קיים תור בשעה זו');
          break;

        case 'Patient already has an appointment on this day. Complete the existing appointment first.':
          toast.error('למטופל כבר קיים תור פעיל באותו יום');
          break;

        case 'Patient not found':
          toast.error('המטופל לא נמצא');
          break;

        case 'Doctor not found or does not provide this service':
          toast.error('הרופא אינו מספק טיפול זה');
          break;

        case 'The patient is inactive':
          toast.error('המטופל אינו פעיל');
          break;

        default:
          toast.error(message || 'אירעה שגיאה');
      }
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(event) => setPatientSearch(event.target.value)}
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
            onChange={(event) => setServiceSearch(event.target.value)}
          />
        </div>

        <div className="add-meeting-modal-service-list">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const isSelected =
                String(formData.serviceItemId) ===
                String(service.serviceItemId);

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
          <span className="add-meeting-modal-section-title">
            קביעת המפגש הראשון
          </span>

          <span className="add-meeting-modal-section-subtitle">
            בחר רופא, תאריך ושעה למפגש הראשון
          </span>
        </div>

        {!formData.serviceGroupId ? (
          <div className="add-meeting-modal-empty-state">
            יש לבחור טיפול תחילה
          </div>
        ) : (
          <MeetingSchedulePicker
            serviceGroupId={formData.serviceGroupId}
            doctorId={formData.doctorId}
            date={formData.date}
            time={formData.time}
            availableSlots={availableSlots}
            loadingSlots={slotsLoading}
            onDoctorChange={(doctorId) => {
              setFormData((prev) => ({
                ...prev,

                doctorId,

                date: '',
                time: '',
              }));

              setAvailableSlots([]);
            }}
            onDateChange={(date) => {
              setFormData((prev) => ({
                ...prev,

                date,
                time: '',
              }));
            }}
            onTimeChange={(time) => {
              setFormData((prev) => ({
                ...prev,
                time,
              }));
            }}
            onMonthChange={() => {
              setFormData((prev) => ({
                ...prev,

                date: '',
                time: '',
              }));

              setAvailableSlots([]);
            }}
          />
        )}
      </div>

      <div className="add-meeting-modal-section">
        <div className="add-meeting-modal-section-header">
          <span className="add-meeting-modal-section-title">פרטי הטיפול</span>

          <span className="add-meeting-modal-section-subtitle">
            הגדר את מספר המפגשים והערות הטיפול
          </span>
        </div>

        <div className="add-meeting-modal-grid">
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
