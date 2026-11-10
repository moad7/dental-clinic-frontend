import { useContext, useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiEdit2, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import DataTable from '../../../components/dataTable/DataTable';
import Modal from '../../../../components/modal/Modal';
import { AuthContext } from '../../../../context/AuthContext';
import { AppDataContext } from '../../../../context/AppDataContext';
import { confirmDateById } from '../../../../api/appointmentApi';
import './doctorAppointment.css';
import { showErrorToast } from '../../../../utils/errorMessages';
import { useDashboardStats } from '../../../../hooks/useDashboardStats';
import { doctorDashboardStats } from '../../../../utils/dashboardDataStats/dataStats';
const STATUS_OPTIONS = [
  { value: 'all', label: 'כל הסטטוסים' },
  { value: 'pending', label: 'ממתין' },
  { value: 'confirmed', label: 'מאושר' },
  { value: 'completed', label: 'הושלם' },
  { value: 'cancelled', label: 'בוטל' },
  { value: 'rejected', label: 'נדחה' },
];
const STATUS_LABELS = {
  pending: 'ממתין',
  confirmed: 'מאושר',
  completed: 'הושלם',
  cancelled: 'בוטל',
  rejected: 'נדחה',
};
const DOCTOR_STATUS_OPTIONS = [
  { value: 'completed', label: 'הושלם' },
  { value: 'rejected', label: 'נדחה' },
];
const formatDate = (value) => {
  if (!value) return '-';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};
const normalizeAppointments = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.appointments)) {
    return data.appointments;
  }
  return [];
};
const DoctorAppointment = () => {
  const { token } = useContext(AuthContext);
  const { doctorAppointments } = useContext(AppDataContext);
  const { items, loadingState } = useDashboardStats(doctorDashboardStats, 'overview');
  const [appointments, setAppointments] = useState(() => normalizeAppointments(doctorAppointments));
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNote, setEditNote] = useState('');
  useEffect(() => {
    setAppointments(normalizeAppointments(doctorAppointments));
  }, [doctorAppointments]);
  const isCompleted = selectedSession?.status === 'completed';
  const isRejected = selectedSession?.status === 'rejected';
  const isCancelled = selectedSession?.status === 'cancelled';
  const isReadOnlyStatus = isCompleted || isRejected || isCancelled;
  const canEditNote = !isRejected && !isCancelled;
  const canSave = Boolean(selectedSession) && canEditNote;
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.patient?.name?.toLowerCase().includes(query) ||
        appointment.patient?.phoneNumber?.includes(query) ||
        appointment.serviceName?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDate = !dateFilter || String(appointment.date).slice(0, 10) === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);
  const openSessionModal = (session) => {
    setSelectedSession(session);
    setEditStatus(session.status || '');
    setEditNote(session.note || '');
  };
  const closeSessionModal = () => {
    if (saving) return;
    setSelectedSession(null);
    setEditStatus('');
    setEditNote('');
  };
  const handleSave = async (selectedSessionId) => {
    if (!selectedSession || saving) return;
    const currentStatus = selectedSession.status;
    const completedSession = currentStatus === 'completed';
    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      toast.error('לא ניתן לערוך פגישה זו');
      return;
    }
    const decision = completedSession ? 'update_note' : editStatus;
    if (!completedSession && !editStatus) {
      toast.error('יש לבחור סטטוס');
      return;
    }
    if (!editNote.trim()) {
      toast.error('יש להזין הערה');
      return;
    }
    try {
      setSaving(true);
      const response = await confirmDateById(selectedSessionId, decision, editNote.trim(), token);
      // Update the appointment locally after successful save
      const updatedSession = response?.appointment;
      setAppointments((previous) =>
        previous.map((appointment) => {
          if (String(appointment._id) !== String(selectedSessionId)) {
            return appointment;
          }
          return {
            ...appointment,
            status: updatedSession?.status || (decision === 'update_note' ? appointment.status : decision),
            note: updatedSession?.note ?? editNote.trim(),
          };
        }),
      );
      toast.success(completedSession ? 'ההערה עודכנה בהצלחה' : 'סטטוס הפגישה עודכן בהצלחה');
      setSelectedSession(null);
      setEditStatus('');
      setEditNote('');
    } catch (error) {
      console.error('Update appointment error:', error);
      showErrorToast(error || 'אירעה שגיאה בעדכון הפגישה');
    } finally {
      setSaving(false);
    }
  };
  const columns = [
    {
      key: 'patient',
      title: 'מטופל',
      width: '1.5fr',
      render: (item) => (
        <div className="doctor-appointment-patient">
          <span className="doctor-appointment-avatar">{item.patient?.name?.charAt(0) || '?'}</span>
          <div>
            <strong>{item.patient?.name || 'מטופל לא זמין'}</strong>
            <small>{item.patient?.phoneNumber || '-'}</small>
          </div>
        </div>
      ),
    },
    {
      key: 'serviceName',
      title: 'סוג טיפול',
      width: '1.3fr',
      render: (item) => (
        <div className="doctor-appointment-service">
          <strong>{item.serviceName || '-'}</strong>
          <small>
            מפגש {item.sessionNumber ?? '-'}
            {item.totalSessions ? ` מתוך ${item.totalSessions}` : ''}
          </small>
        </div>
      ),
    },
    {
      key: 'date',
      title: 'תאריך',
      width: '1fr',
      render: (item) => formatDate(item.date),
    },
    {
      key: 'time',
      title: 'שעה',
      width: '0.7fr',
      render: (item) => item.time || '-',
    },
    {
      key: 'durationMin',
      title: 'משך',
      width: '0.7fr',
      render: (item) => (item.durationMin != null ? `${item.durationMin} דקות` : '-'),
    },
    {
      key: 'status',
      title: 'סטטוס',
      width: '0.9fr',
      render: (item) => (
        <span className={`doctor-appointment-status doctor-appointment-status--${item.status}`}>{STATUS_LABELS[item.status] || item.status}</span>
      ),
    },
    {
      key: 'actions',
      title: 'פעולות',
      width: '0.8fr',
      render: (item) => (
        <button type="button" className="doctor-appointment-edit-btn" onClick={() => openSessionModal(item)}>
          <FiEdit2 />
          פרטים
        </button>
      ),
    },
  ];
  return (
    <div className="main-container doctor-appointment-page" dir="rtl">
      <BoxHeader title="לוח זמנים של הרופא" subtitle="סקירה כללית של הפגישות והטיפולים של הרופא" />
      {loadingState ? <p>טוען נתונים...</p> : <DashboardStats items={items} />}
      <section className="doctor-appointment-panel">
        <div className="doctor-appointment-heading">
          <div>
            <h2>כל הפגישות</h2>
            <p>ניהול ומעקב אחר הפגישות והטיפולים שלך</p>
          </div>
          <span className="doctor-appointment-total">{filteredAppointments.length} פגישות</span>
        </div>
        <div className="doctor-appointment-filters">
          <div className="doctor-appointment-search">
            <FiSearch />
            <input
              type="search"
              placeholder="חיפוש לפי מטופל, טלפון או טיפול..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="doctor-appointment-date-filter">
            <FiCalendar />
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </div>
          {(search || statusFilter !== 'all' || dateFilter) && (
            <button
              type="button"
              className="doctor-appointment-clear"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setDateFilter('');
              }}
            >
              <FiX />
              ניקוי
            </button>
          )}
        </div>
        <div className="doctor-appointment-table-wrap">
          <DataTable
            columns={columns}
            data={filteredAppointments}
            rowKey="_id"
            classPrefix="doctor-appointments-table"
            emptyText="לא נמצאו פגישות"
            defaultPageSize={15}
          />
        </div>
      </section>
      <Modal isOpen={Boolean(selectedSession)} onClose={closeSessionModal} title="פרטי הפגישה" size="md">
        {selectedSession && (
          <div className="doctor-appointment-modal" dir="rtl">
            <div className="doctor-appointment-modal-info">
              <div>
                <span>מטופל</span>
                <strong>{selectedSession.patient?.name || '-'}</strong>
              </div>
              <div>
                <span>טיפול</span>
                <strong>{selectedSession.serviceName || '-'}</strong>
              </div>
              <div>
                <span>תאריך</span>
                <strong>{formatDate(selectedSession.date)}</strong>
              </div>
              <div>
                <span>שעה</span>
                <strong>{selectedSession.time || '-'}</strong>
              </div>
            </div>
            <div className="doctor-appointment-modal-field">
              <label htmlFor="doctor-session-status">סטטוס הפגישה</label>
              {isReadOnlyStatus ? (
                <div
                  className={`doctor-appointment-status-text ${
                    isCompleted ? 'doctor-appointment-status-text--completed' : 'doctor-appointment-status-text--rejected'
                  }`}
                >
                  {isCompleted ? 'הפגישה הושלמה' : isRejected ? 'הפגישה נדחתה' : 'הפגישה בוטלה'}
                </div>
              ) : (
                <select id="doctor-session-status" value={editStatus} onChange={(event) => setEditStatus(event.target.value)} disabled={saving}>
                  <option value="">בחר סטטוס</option>
                  {DOCTOR_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="doctor-appointment-modal-field">
              <label htmlFor="doctor-session-note">הערת הרופא</label>
              {canEditNote ? (
                <textarea
                  id="doctor-session-note"
                  value={editNote}
                  onChange={(event) => setEditNote(event.target.value)}
                  placeholder="הוסף הערה על המפגש..."
                  disabled={saving}
                  rows={4}
                />
              ) : (
                <div className="doctor-appointment-note-text">{selectedSession.note?.trim() || 'לא נוספה הערה למפגש זה'}</div>
              )}
            </div>
            <div className="doctor-appointment-modal-actions">
              <button type="button" onClick={closeSessionModal} disabled={saving}>
                סגירה
              </button>
              {canSave && (
                <button type="button" className="doctor-appointment-save-btn" onClick={() => handleSave(selectedSession._id)} disabled={saving}>
                  {saving ? 'שומר...' : isCompleted ? 'שמירת הערה' : 'שמירת שינויים'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default DoctorAppointment;
