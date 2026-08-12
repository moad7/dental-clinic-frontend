import { useCallback, useContext, useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiPhone,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import './meetingsDetailsModal.css';
import { StatusBadge } from '../../../components/statusBadge/StatusBadge';
import MeetingSchedulePicker from '../../../components/meetingSchedulePicker/MeetingSchedulePicker';

import { AppDataContext } from '../../../../context/AppDataContext';
import { AuthContext } from '../../../../context/AuthContext';

import { fetchDoctorAvailableSlots } from '../../../../api/doctorApi';
import { updateAppointmentById } from '../../../../api/appointmentApi';

import {
  CREATOR_ROLES,
  SESSION_STATUS_OPTIONS,
} from '../../../../utils/constants';

const getDateParts = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    year: parsedDate.getFullYear(),
    month: String(parsedDate.getMonth() + 1).padStart(2, '0'),
    day: String(parsedDate.getDate()).padStart(2, '0'),
  };
};

const formatDateForInput = (date) => {
  const parts = getDateParts(date);

  if (!parts) return '';

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const formatDisplayDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateTime = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCreatorRoleText = (role) => {
  return CREATOR_ROLES[role] || role || '-';
};

const MeetingsDetailsModal = ({
  appointment,
  onClose,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const { token } = useContext(AuthContext);

  const { loadAllAppointments } = useContext(AppDataContext);

  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [slotsLoading, setSlotsLoading] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorId: '',
    status: '',
    note: '',
  });

  const raw = appointment.raw || {};
  const treatment = raw.treatmentId || {};
  const patient = treatment.userId || {};
  const currentDoctor = raw.doctorId || {};
  const serviceGroup = treatment.serviceGroupId || {};
  const serviceItem = treatment.serviceItem || {};

  const patientName = appointment.patientName || patient.name || 'מטופל ללא שם';

  const patientPhone = appointment.patientPhone || patient.phoneNumber || '-';

  const doctorName =
    appointment.doctorName || currentDoctor.name || 'לא נבחר רופא';

  const originalDate = formatDateForInput(appointment.requestDate || raw.date);

  const originalTime = appointment.requestTime || raw.time || '';

  const originalDoctorId = currentDoctor?._id || '';

  const serviceGroupId = serviceGroup?._id || null;

  const requiresSchedule =
    formData.status === 'pending' || formData.status === 'confirmed';

  const canSave =
    Boolean(formData.status) &&
    (!requiresSchedule ||
      (Boolean(formData.doctorId) &&
        Boolean(formData.date) &&
        Boolean(formData.time))) &&
    !isUpdating;

  const createInitialFormData = useCallback(() => {
    return {
      date: originalDate,
      time: originalTime,
      doctorId: originalDoctorId,
      status: raw.status || 'pending',
      note: raw.note || '',
    };
  }, [originalDate, originalTime, originalDoctorId, raw.status, raw.note]);

  useEffect(() => {
    if (!appointment) return;

    setFormData(createInitialFormData());
    setAvailableSlots([]);
    setShowDeleteConfirm(false);
    setIsEditing(false);
  }, [appointment, createInitialFormData]);

  useEffect(() => {
    const canLoadSlots =
      Boolean(appointment?._id) &&
      isEditing &&
      requiresSchedule &&
      Boolean(formData.doctorId) &&
      Boolean(formData.date);

    if (!canLoadSlots) {
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
            sessionId: appointment._id,
          },
          token,
        );

        if (ignoreResult) return;

        let slots = Array.isArray(result?.slots) ? result.slots : [];

        const isOriginalDoctor =
          String(formData.doctorId) === String(originalDoctorId);

        const isOriginalDate = formData.date === originalDate;

        if (
          isOriginalDoctor &&
          isOriginalDate &&
          originalTime &&
          !slots.includes(originalTime)
        ) {
          slots = [...slots, originalTime].sort();
        }

        setAvailableSlots(slots);
      } catch (error) {
        if (ignoreResult) return;

        console.error('Failed to load doctor slots:', error);

        setAvailableSlots([]);

        toast.error('שגיאה בטעינת השעות הזמינות');
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
  }, [
    appointment?._id,
    formData.doctorId,
    formData.date,
    isEditing,
    requiresSchedule,
    originalDoctorId,
    originalDate,
    originalTime,
    token,
  ]);

  // ✅ هنا مكانها الصحيح
  if (!appointment) {
    return null;
  }

  const handleStatusChange = (event) => {
    const status = event.target.value;

    setFormData((prev) => ({
      ...prev,
      status,
    }));

    const usesSchedule = status === 'pending' || status === 'confirmed';

    if (!usesSchedule) {
      setAvailableSlots([]);
    }
  };

  const handleStartEdit = () => {
    setShowDeleteConfirm(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(createInitialFormData());
    setAvailableSlots([]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.status) {
      toast.warning('יש לבחור סטטוס מפגש');
      return;
    }

    if (
      requiresSchedule &&
      (!formData.doctorId || !formData.date || !formData.time)
    ) {
      toast.warning('יש לבחור רופא, תאריך ושעה');
      return;
    }

    const updateData = {
      sessionStatus: formData.status,
      note: formData.note.trim(),

      ...(requiresSchedule && {
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
      }),
    };

    try {
      await updateAppointmentById(updateData, appointment._id, token);

      await loadAllAppointments?.();

      toast.success('המפגש עודכן בהצלחה');

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update appointment:', error);

      const message = error?.response?.data?.message;

      switch (message) {
        case 'Doctor already has an appointment at this date and time':
          toast.error('לרופא כבר קיים תור בשעה זו');
          break;

        case 'Doctor does not provide this treatment service':
          toast.error('הרופא אינו מספק את הטיפול הזה');
          break;

        default:
          toast.error(message || 'אירעה שגיאה בעדכון המפגש');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete?.(appointment._id);

      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  return (
    <div className="meeting-details" dir="rtl">
      <header className="meeting-details__summary">
        <div className="meeting-details__patient">
          <div className="meeting-details__patient-avatar">
            {appointment.initials || 'AA'}
          </div>

          <div className="meeting-details__patient-content">
            <h3>{patientName}</h3>

            <div className="meeting-details__phone">
              <FiPhone />

              <span>{patientPhone}</span>
            </div>
          </div>
        </div>

        <div className="meeting-details__statuses">
          <StatusItem
            label="סטטוס טיפול"
            type="treatment"
            status={appointment.treatmentStatus}
          />

          <StatusItem
            label="סטטוס מפגש"
            type="session"
            status={appointment.sessionStatus}
          />
        </div>
      </header>

      <div className="meeting-details__content-grid">
        <section className="meeting-details__card">
          <SectionHeader icon={<FiCalendar />} title="פרטי המפגש" />

          {!isEditing ? (
            <div className="meeting-details__info-grid">
              <InfoItem
                label="תאריך"
                value={formatDisplayDate(appointment.requestDate || raw.date)}
              />

              <InfoItem
                label="שעה"
                value={appointment.requestTime || raw.time || '-'}
              />

              <InfoItem label="רופא מטפל" value={doctorName} />

              <InfoItem
                label="טלפון רופא"
                value={currentDoctor.phoneNumber || '-'}
              />

              <InfoItem
                label="סטטוס מפגש"
                customValue={
                  <StatusBadge
                    type="session"
                    status={appointment.sessionStatus}
                  />
                }
              />

              <InfoItem
                label="מספר מפגשים"
                value={treatment.totalSessions || appointment.sessions || 0}
              />
            </div>
          ) : (
            <div className="meeting-details__edit-content">
              <label className="meeting-details__field">
                <span>סטטוס מפגש</span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                >
                  {SESSION_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {requiresSchedule && (
                <MeetingSchedulePicker
                  serviceGroupId={serviceGroupId}
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

              {!requiresSchedule && (
                <div className="meeting-details__field-message">
                  {formData.status === 'completed' &&
                    'המפגש הושלם ואין צורך לבחור מועד חדש'}

                  {formData.status === 'cancelled' &&
                    'המפגש בוטל ואין צורך לבחור מועד חדש'}

                  {formData.status === 'rejected' &&
                    'המפגש נדחה ואין צורך לבחור מועד חדש'}
                </div>
              )}

              <label className="meeting-details__field">
                <span>הערות</span>

                <textarea
                  name="note"
                  rows="4"
                  value={formData.note}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      note: event.target.value,
                    }))
                  }
                  placeholder="הוסף הערה למפגש..."
                />
              </label>
            </div>
          )}
        </section>

        <section className="meeting-details__card">
          <SectionHeader icon={<FiUser />} title="פרטי הטיפול" />

          <div className="meeting-details__service">
            {serviceItem.photo ? (
              <img
                className="meeting-details__service-image"
                src={serviceItem.photo}
                alt={serviceItem.name || appointment.serviceName || 'טיפול'}
              />
            ) : (
              <div className="meeting-details__service-placeholder">
                ללא תמונה
              </div>
            )}

            <div className="meeting-details__service-content">
              <h5>{serviceItem.name || appointment.serviceName || '-'}</h5>

              <span>{serviceGroup.title || '-'}</span>

              <p>{serviceItem.description || 'אין תיאור זמין לטיפול'}</p>
            </div>
          </div>

          <div className="meeting-details__info-grid">
            <InfoItem
              label="מחיר"
              value={
                serviceItem.price !== undefined ? `₪${serviceItem.price}` : '-'
              }
            />

            <InfoItem
              label="משך טיפול"
              value={
                serviceItem.durationMin
                  ? `${serviceItem.durationMin} דקות`
                  : '-'
              }
            />

            <InfoItem
              label="מספר מפגשים"
              value={treatment.totalSessions || appointment.sessions || 0}
            />

            <InfoItem
              label="סטטוס טיפול"
              customValue={
                <StatusBadge
                  type="treatment"
                  status={appointment.treatmentStatus}
                />
              }
            />
          </div>
        </section>

        <section className="meeting-details__card meeting-details__card--full">
          <SectionHeader icon={<FiClock />} title="מידע נוסף" />

          <div className="meeting-details__info-grid meeting-details__info-grid--four">
            <InfoItem label="נוצר על ידי" value={raw.createdBy?.name || '-'} />

            <InfoItem
              label="תפקיד"
              value={getCreatorRoleText(
                raw.createdByRole || raw.createdBy?.role,
              )}
            />

            <InfoItem
              label="תאריך יצירה"
              value={formatDateTime(raw.createdAt)}
            />

            <InfoItem
              label="עדכון אחרון"
              value={formatDateTime(raw.updatedAt)}
            />
          </div>

          {!isEditing && (
            <div className="meeting-details__note">
              <span>הערות</span>

              <p>{raw.note?.trim() || 'אין הערות למפגש זה'}</p>
            </div>
          )}
        </section>
      </div>

      <footer className="meeting-details__footer">
        <div className="meeting-details__danger-area">
          {!showDeleteConfirm ? (
            <button
              className="meeting-details__button meeting-details__button--danger-outline"
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isUpdating}
            >
              <FiTrash2 />
              מחיקת המפגש
            </button>
          ) : (
            <div className="meeting-details__delete-confirm">
              <span>האם אתה בטוח שברצונך למחוק?</span>

              <button
                type="button"
                className="meeting-details__button meeting-details__button--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'מוחק...' : 'כן, מחק'}
              </button>

              <button
                type="button"
                className="meeting-details__button meeting-details__button--light"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                ביטול
              </button>
            </div>
          )}
        </div>

        <div className="meeting-details__actions">
          {isEditing ? (
            <>
              <button
                className="meeting-details__button meeting-details__button--light"
                type="button"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <FiX />
                ביטול
              </button>

              <button
                className="meeting-details__button meeting-details__button--primary"
                type="button"
                onClick={handleSave}
                disabled={!canSave}
              >
                {isUpdating ? 'שומר...' : 'שמירת שינויים'}
              </button>
            </>
          ) : (
            <>
              <button
                className="meeting-details__button meeting-details__button--light"
                type="button"
                onClick={onClose}
              >
                סגירה
              </button>

              <button
                className="meeting-details__button meeting-details__button--primary"
                type="button"
                onClick={handleStartEdit}
              >
                <FiEdit2 />
                עריכת המפגש
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => {
  return (
    <div className="meeting-details__card-header">
      <span>{icon}</span>
      <h4>{title}</h4>
    </div>
  );
};

const StatusItem = ({ label, type, status }) => {
  return (
    <div className="meeting-details__status-item">
      <span>{label}</span>

      <StatusBadge type={type} status={status} />
    </div>
  );
};

const InfoItem = ({ label, value, customValue }) => {
  return (
    <div className="meeting-details__info-item">
      <span className="meeting-details__info-label">{label}</span>

      <div className="meeting-details__info-value">
        {customValue ?? value ?? '-'}
      </div>
    </div>
  );
};

export default MeetingsDetailsModal;
