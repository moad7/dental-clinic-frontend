import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
import { AppDataContext } from '../../../../context/AppDataContext';
import { AuthContext } from '../../../../context/AuthContext';
import { useCalendar } from '../../../../hooks/useCalendar';
import { fetchDoctorAvailableSlots } from '../../../../api/doctorApi';

const SESSION_STATUS_OPTIONS = [
  { value: 'pending', label: 'ממתין' },
  { value: 'confirmed', label: 'מאושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
  { value: 'rejected', label: 'נדחה' },
];

const CREATOR_ROLES = {
  secretary: 'מזכיר/ה',
  doctor: 'רופא/ה',
  patient: 'מטופל/ת',
};

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

const formatMonthForInput = (date) => {
  const parts = getDateParts(date);

  if (!parts) return '';

  return `${parts.year}-${parts.month}`;
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
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const { token } = useContext(AuthContext);
  const { doctors } = useContext(AppDataContext);

  const { selectedMonth, setSelectedMonth, monthDays, today, isPastTimeSlot } =
    useCalendar();

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

  const raw = appointment?.raw || {};
  const treatment = raw.treatmentId || {};
  const patient = treatment.userId || {};
  const currentDoctor = raw.doctorId || {};
  const serviceGroup = treatment.serviceGroupId || {};
  const serviceItem = treatment.serviceItem || {};

  const patientName =
    appointment?.patientName || patient.name || 'מטופל ללא שם';

  const patientPhone = appointment?.patientPhone || patient.phoneNumber || '-';

  const doctorName =
    appointment?.doctorName || currentDoctor.name || 'לא נבחר רופא';

  const originalDate = formatDateForInput(appointment?.requestDate || raw.date);

  const originalTime = appointment?.requestTime || raw.time || '';

  const originalDoctorId = currentDoctor?._id || '';

  const currentServiceGroupId = serviceGroup?._id || null;

  const createInitialFormData = useCallback(() => {
    return {
      date: originalDate,
      time: originalTime,
      doctorId: originalDoctorId,
      status: appointment?.sessionStatus || raw.status || 'pending',
      note: raw.note || '',
    };
  }, [
    appointment?.sessionStatus,
    originalDate,
    originalDoctorId,
    originalTime,
    raw.note,
    raw.status,
  ]);

  const availableDoctors = useMemo(() => {
    if (!currentServiceGroupId) return [];

    return (Array.isArray(doctors) ? doctors : []).filter((doctorItem) => {
      const belongsToSpecialty = doctorItem?.doctor?.services?.some(
        (service) => {
          const groupId = service?.groupId?._id || service?.groupId;

          return String(groupId) === String(currentServiceGroupId);
        },
      );

      return belongsToSpecialty && doctorItem?.isActive;
    });
  }, [doctors, currentServiceGroupId]);

  const selectedDoctor = useMemo(() => {
    return availableDoctors.find(
      (doctorItem) => String(doctorItem._id) === String(formData.doctorId),
    );
  }, [availableDoctors, formData.doctorId]);

  const canSave =
    Boolean(formData.doctorId) &&
    Boolean(formData.date) &&
    Boolean(formData.time) &&
    Boolean(formData.status) &&
    !isUpdating;

  useEffect(() => {
    if (!appointment) return;

    setFormData(createInitialFormData());
    setSelectedMonth(formatMonthForInput(appointment.requestDate || raw.date));

    setIsEditing(false);
    setShowDeleteConfirm(false);
    setAvailableSlots([]);
  }, [appointment, createInitialFormData, raw.date, setSelectedMonth]);

  useEffect(() => {
    if (!isEditing || !formData.doctorId || !formData.date) {
      setAvailableSlots([]);
      return undefined;
    }

    let ignoreResult = false;

    const loadDoctorSlots = async () => {
      try {
        setSlotsLoading(true);

        const result = await fetchDoctorAvailableSlots(
          {
            doctorId: formData.doctorId,
            date: formData.date,

            // أرسله للباك حتى يستثني الموعد الحالي
            // من فحص تعارض المواعيد.
            sessionId: appointment?._id,
          },
          token,
        );

        if (ignoreResult) return;

        let slots = Array.isArray(result?.slots) ? result.slots : [];

        const isOriginalDoctor =
          String(formData.doctorId) === String(originalDoctorId);

        const isOriginalDate = formData.date === originalDate;

        /*
         * إذا كان الباك لا يستثني الموعد الحالي،
         * نحافظ على وقته ضمن الخيارات عند تعديل
         * نفس الطبيب ونفس التاريخ.
         */
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
    formData.date,
    formData.doctorId,
    isEditing,
    originalDate,
    originalDoctorId,
    originalTime,
    token,
  ]);

  if (!appointment) return null;

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;

    setFormData((prev) => ({
      ...prev,
      doctorId,
      date: '',
      time: '',
    }));

    setAvailableSlots([]);
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;

    setSelectedMonth(month);

    setFormData((prev) => ({
      ...prev,
      date: '',
      time: '',
    }));

    setAvailableSlots([]);
  };

  const handleDateSelect = (dateValue) => {
    setFormData((prev) => ({
      ...prev,
      date: dateValue,
      time: '',
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({
      ...prev,
      time,
    }));
  };

  const handleStartEdit = () => {
    setShowDeleteConfirm(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    const initialData = createInitialFormData();

    setFormData(initialData);
    setSelectedMonth(formatMonthForInput(appointment.requestDate || raw.date));

    setAvailableSlots([]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canSave) {
      toast.warning('יש לבחור רופא, תאריך, שעה וסטטוס');
      return;
    }

    const updateData = {
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      note: formData.note.trim(),
    };

    try {
      await onUpdate?.(appointment._id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update appointment:', error);
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
                value={appointment.sessions || treatment.totalSessions || 0}
              />
            </div>
          ) : (
            <div className="meeting-details__edit-content">
              <div className="meeting-details__edit-row">
                <label className="meeting-details__field">
                  <span>רופא מטפל</span>

                  {availableDoctors.length > 0 ? (
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleDoctorChange}
                    >
                      <option value="">בחר רופא</option>

                      {availableDoctors.map((doctorItem) => (
                        <option key={doctorItem._id} value={doctorItem._id}>
                          ד"ר {doctorItem.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="meeting-details__field-message meeting-details__field-message--warning">
                      לא נמצאו רופאים פעילים בתחום הטיפול הזה
                    </div>
                  )}
                </label>

                <label className="meeting-details__field">
                  <span>סטטוס מפגש</span>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    required
                  >
                    {SESSION_STATUS_OPTIONS.map((statusOption) => (
                      <option
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="meeting-details__schedule">
                <div className="meeting-details__calendar">
                  <div className="meeting-details__schedule-heading">
                    <div>
                      <h5>בחירת תאריך</h5>
                      <p>בחר חודש ולאחר מכן יום פנוי</p>
                    </div>

                    {formData.date && (
                      <span className="meeting-details__selected-value">
                        {formatDisplayDate(formData.date)}
                      </span>
                    )}
                  </div>

                  <label className="meeting-details__field">
                    <span>חודש</span>

                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      disabled={!formData.doctorId}
                    />
                  </label>

                  <div className="meeting-details__days-grid">
                    {monthDays.map((dayItem) => {
                      const isPastDate = dayItem.dateValue < today;

                      const isSelected = formData.date === dayItem.dateValue;

                      return (
                        <button
                          type="button"
                          key={dayItem.dateValue}
                          disabled={!formData.doctorId || isPastDate}
                          className={[
                            'meeting-details__day',
                            isSelected ? 'meeting-details__day--selected' : '',
                            isPastDate ? 'meeting-details__day--disabled' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleDateSelect(dayItem.dateValue)}
                        >
                          <span>{dayItem.dayName}</span>
                          <strong>{dayItem.day}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="meeting-details__times">
                  <div className="meeting-details__schedule-heading">
                    <div>
                      <h5>שעות זמינות</h5>

                      <p>
                        {selectedDoctor
                          ? `ד"ר ${selectedDoctor.name}`
                          : 'יש לבחור רופא תחילה'}
                      </p>
                    </div>

                    {formData.time && (
                      <span className="meeting-details__selected-value">
                        {formData.time}
                      </span>
                    )}
                  </div>

                  <div className="meeting-details__times-grid">
                    {!formData.doctorId ? (
                      <ScheduleEmpty text="יש לבחור רופא תחילה" />
                    ) : !formData.date ? (
                      <ScheduleEmpty text="יש לבחור תאריך" />
                    ) : slotsLoading ? (
                      <ScheduleEmpty text="טוען שעות זמינות..." loading />
                    ) : availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const isPastTime = isPastTimeSlot(formData.date, slot);

                        const isSelected = formData.time === slot;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isPastTime}
                            className={[
                              'meeting-details__time',
                              isSelected
                                ? 'meeting-details__time--selected'
                                : '',
                              isPastTime
                                ? 'meeting-details__time--disabled'
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onClick={() => handleTimeSelect(slot)}
                          >
                            <FiClock />
                            {slot}
                          </button>
                        );
                      })
                    ) : (
                      <ScheduleEmpty text="אין שעות זמינות ביום זה" />
                    )}
                  </div>
                </div>
              </div>

              <label className="meeting-details__field">
                <span>הערות</span>

                <textarea
                  name="note"
                  rows="4"
                  value={formData.note}
                  onChange={handleFieldChange}
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

const ScheduleEmpty = ({ text, loading = false }) => {
  return (
    <div className="meeting-details__schedule-empty">
      {loading && <span className="meeting-details__loader" />}

      <span>{text}</span>
    </div>
  );
};

export default MeetingsDetailsModal;
