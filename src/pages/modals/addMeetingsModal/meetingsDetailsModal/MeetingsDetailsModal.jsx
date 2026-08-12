import { useCallback, useContext, useState, useEffect, useMemo } from 'react';
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiPhone,
  FiPlus,
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
  createTreatmentSession,
  fetchTreatmentSessions,
} from '../../../../api/treatmentApi';

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
  const [treatmentSessions, setTreatmentSessions] = useState([]);

  const [sessionsStats, setSessionsStats] = useState({
    totalSessions: 0,
    scheduledSessions: 0,
    remainingSessions: 0,
  });

  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionToSchedule, setSessionToSchedule] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);
  const [newSessionSlots, setNewSessionSlots] = useState([]);
  const [newSessionSlotsLoading, setNewSessionSlotsLoading] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    sessionStatus: 'pending',
    note: '',
  });
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorId: '',
    status: '',
    note: '',
  });

  const raw = appointment.raw || {};
  const treatment = raw.treatmentId || {};
  const treatmentId = treatment?._id || null;
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

  const loadTreatmentSessions = async () => {
    if (!treatmentId) return;

    try {
      setSessionsLoading(true);
      const result = await fetchTreatmentSessions(treatmentId, token);
      setTreatmentSessions(
        Array.isArray(result?.sessions) ? result.sessions : [],
      );
      setSessionsStats({
        totalSessions:
          result?.statistics?.totalSessions ?? treatment.totalSessions ?? 0,
        scheduledSessions: result?.statistics?.scheduledSessions ?? 0,
        remainingSessions: result?.statistics?.remainingSessions ?? 0,
      });
    } catch (error) {
      console.error('Failed to load treatment sessions:', error);
      toast.error('שגיאה בטעינת מפגשי הטיפול');
    } finally {
      setSessionsLoading(false);
    }
  };

  const treatmentSessionRows = useMemo(() => {
    const total = sessionsStats.totalSessions || treatment.totalSessions || 0;

    const sortedSessions = [...treatmentSessions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateA !== dateB) {
        return dateA - dateB;
      }

      return String(a.time || '').localeCompare(String(b.time || ''));
    });

    return Array.from({ length: total }, (_, index) => ({
      number: index + 1,
      session: sortedSessions[index] || null,
    }));
  }, [treatmentSessions, sessionsStats.totalSessions, treatment.totalSessions]);
  useEffect(() => {
    if (
      !sessionToSchedule ||
      !newSessionForm.doctorId ||
      !newSessionForm.date
    ) {
      setNewSessionSlots([]);
      return;
    }

    let ignoreResult = false;

    const loadSlots = async () => {
      try {
        setNewSessionSlotsLoading(true);

        const result = await fetchDoctorAvailableSlots(
          {
            doctorId: newSessionForm.doctorId,
            date: newSessionForm.date,
          },
          token,
        );

        if (ignoreResult) return;

        setNewSessionSlots(Array.isArray(result?.slots) ? result.slots : []);
      } catch (error) {
        if (ignoreResult) return;

        console.error('Failed to load slots for new session:', error);

        setNewSessionSlots([]);

        toast.error('שגיאה בטעינת שעות זמינות');
      } finally {
        if (!ignoreResult) {
          setNewSessionSlotsLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      ignoreResult = true;
    };
  }, [sessionToSchedule, newSessionForm.doctorId, newSessionForm.date, token]);
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
  useEffect(() => {
    if (!treatmentId) return;

    loadTreatmentSessions();
  }, [treatmentId]);
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

      await Promise.all([loadAllAppointments?.(), loadTreatmentSessions()]);

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
  const handleOpenNewSession = (sessionNumber) => {
    setSessionToSchedule(sessionNumber);

    setNewSessionForm({
      doctorId: '',
      date: '',
      time: '',
      sessionStatus: 'pending',
      note: '',
    });

    setNewSessionSlots([]);
  };
  const handleCancelNewSession = () => {
    setSessionToSchedule(null);

    setNewSessionForm({
      doctorId: '',
      date: '',
      time: '',
      sessionStatus: 'pending',
      note: '',
    });

    setNewSessionSlots([]);
  };

  const handleCreateTreatmentSession = async () => {
    if (!treatmentId) {
      toast.error('לא נמצא טיפול');
      return;
    }

    if (!newSessionForm.doctorId) {
      toast.warning('יש לבחור רופא');
      return;
    }

    if (!newSessionForm.date) {
      toast.warning('יש לבחור תאריך');
      return;
    }

    if (!newSessionForm.time) {
      toast.warning('יש לבחור שעה');
      return;
    }

    if (!newSessionForm.sessionStatus) {
      toast.warning('יש לבחור סטטוס');
      return;
    }

    const payload = {
      doctorId: newSessionForm.doctorId,
      date: newSessionForm.date,
      time: newSessionForm.time,
      sessionStatus: newSessionForm.sessionStatus,
      note: newSessionForm.note.trim(),
    };

    try {
      setCreatingSession(true);

      await createTreatmentSession(treatmentId, payload, token);

      toast.success('המפגש נוסף בהצלחה');

      await loadTreatmentSessions();

      await loadAllAppointments?.();

      handleCancelNewSession();
    } catch (error) {
      console.error('Failed to create treatment session:', error);

      const message = error?.response?.data?.message;

      switch (message) {
        case 'Doctor already has an appointment at this date and time':
          toast.error('לרופא כבר קיים תור בשעה זו');
          break;

        case 'Doctor does not provide this treatment service':
          toast.error('הרופא אינו מתאים לטיפול הזה');
          break;

        case 'Patient already has an appointment on this day':
          toast.error('למטופל כבר קיים תור ביום זה');
          break;

        case 'All treatment sessions are already scheduled':
          toast.error('כל מפגשי הטיפול כבר נקבעו');
          break;

        default:
          toast.error(message || 'אירעה שגיאה ביצירת המפגש');
      }
    } finally {
      setCreatingSession(false);
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
          <div className="meeting-details__sessions-header">
            <SectionHeader icon={<FiCalendar />} title="מפגשי הטיפול" />

            {!sessionsLoading && (
              <div className="meeting-details__sessions-summary">
                <span>
                  {sessionsStats.scheduledSessions}
                  {' / '}
                  {sessionsStats.totalSessions} מפגשים נקבעו
                </span>

                {sessionsStats.remainingSessions > 0 && (
                  <strong>
                    נשארו {sessionsStats.remainingSessions} מפגשים
                  </strong>
                )}
              </div>
            )}
          </div>

          {sessionsLoading ? (
            <div className="meeting-details__sessions-empty">
              טוען מפגשים...
            </div>
          ) : treatmentSessionRows.length === 0 ? (
            <div className="meeting-details__sessions-empty">
              אין מפגשים להצגה
            </div>
          ) : (
            <div className="meeting-details__sessions-list">
              {treatmentSessionRows.map(({ number, session }) => (
                <div
                  className={`meeting-details__session-card ${
                    session
                      ? 'meeting-details__session-card--scheduled'
                      : 'meeting-details__session-card--empty'
                  }`}
                  key={session?._id || `empty-${number}`}
                >
                  <div className="meeting-details__session-number">
                    <span>מפגש</span>
                    <strong>{number}</strong>
                  </div>

                  {session ? (
                    <>
                      <div className="meeting-details__session-main">
                        <div className="meeting-details__session-date">
                          <strong>{formatDisplayDate(session.date)}</strong>

                          <span>{session.time || '-'}</span>
                        </div>

                        <div className="meeting-details__session-doctor">
                          <span>רופא מטפל</span>

                          <strong>
                            {session.doctorId?.name
                              ? `ד"ר ${session.doctorId.name}`
                              : '-'}
                          </strong>
                        </div>
                      </div>

                      <div className="meeting-details__session-status">
                        <StatusBadge type="session" status={session.status} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="meeting-details__session-main">
                        <strong className="meeting-details__session-not-set">
                          טרם נקבע מועד
                        </strong>

                        <span>ניתן לבחור רופא, תאריך ושעה</span>
                      </div>

                      <button
                        type="button"
                        className="meeting-details__button meeting-details__button--primary"
                        onClick={() => handleOpenNewSession(number)}
                        disabled={treatment.status !== 'in_progress'}
                      >
                        <FiPlus />
                        קביעת מפגש
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {sessionToSchedule && (
            <div className="meeting-details__new-session">
              <div className="meeting-details__new-session-header">
                <div>
                  <h4>קביעת מפגש {sessionToSchedule}</h4>

                  <p>בחר רופא, תאריך ושעה למפגש החדש</p>
                </div>

                <button
                  type="button"
                  className="meeting-details__new-session-close"
                  onClick={handleCancelNewSession}
                >
                  <FiX />
                </button>
              </div>

              <label className="meeting-details__field">
                <span>סטטוס מפגש</span>

                <select
                  value={newSessionForm.sessionStatus}
                  onChange={(event) =>
                    setNewSessionForm((prev) => ({
                      ...prev,
                      sessionStatus: event.target.value,
                    }))
                  }
                >
                  <option value="pending">ממתין</option>

                  <option value="confirmed">מאושר</option>
                </select>
              </label>

              <MeetingSchedulePicker
                serviceGroupId={serviceGroupId}
                doctorId={newSessionForm.doctorId}
                date={newSessionForm.date}
                time={newSessionForm.time}
                availableSlots={newSessionSlots}
                loadingSlots={newSessionSlotsLoading}
                onDoctorChange={(doctorId) => {
                  setNewSessionForm((prev) => ({
                    ...prev,
                    doctorId,
                    date: '',
                    time: '',
                  }));

                  setNewSessionSlots([]);
                }}
                onDateChange={(date) => {
                  setNewSessionForm((prev) => ({
                    ...prev,
                    date,
                    time: '',
                  }));
                }}
                onTimeChange={(time) => {
                  setNewSessionForm((prev) => ({
                    ...prev,
                    time,
                  }));
                }}
                onMonthChange={() => {
                  setNewSessionForm((prev) => ({
                    ...prev,
                    date: '',
                    time: '',
                  }));

                  setNewSessionSlots([]);
                }}
              />

              <label className="meeting-details__field">
                <span>הערות</span>

                <textarea
                  rows="3"
                  value={newSessionForm.note}
                  onChange={(event) =>
                    setNewSessionForm((prev) => ({
                      ...prev,
                      note: event.target.value,
                    }))
                  }
                  placeholder="הוסף הערה למפגש..."
                />
              </label>

              <div className="meeting-details__new-session-actions">
                <button
                  type="button"
                  className="meeting-details__button meeting-details__button--light"
                  onClick={handleCancelNewSession}
                  disabled={creatingSession}
                >
                  ביטול
                </button>

                <button
                  type="button"
                  className="meeting-details__button meeting-details__button--primary"
                  onClick={handleCreateTreatmentSession}
                  disabled={creatingSession}
                >
                  {creatingSession ? 'שומר...' : 'שמירת המפגש'}
                </button>
              </div>
            </div>
          )}
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
