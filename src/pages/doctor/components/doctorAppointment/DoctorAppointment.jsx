import { useContext, useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiEdit2, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import DataTable from '../../../components/dataTable/DataTable';
import Modal from '../../../../components/modal/Modal';
import { doctorDashboardStats } from '../../../../utils/dashboardDataStats/dataStats';
import { AuthContext } from '../../../../context/AuthContext';
import './doctorAppointment.css';
import { AppDataContext } from '../../../../context/AppDataContext';
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
const formatDate = (value) => {
  if (!value) return '-';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};
const DoctorAppointment = () => {
  const { token } = useContext(AuthContext);
  const { doctorAppointments } = useContext(AppDataContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [editStatus, setEditStatus] = useState('pending');
  const [editNote, setEditNote] = useState('');
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const loadAppointments = async () => {
      try {
        const response = await doctorAppointments;
        if (!cancelled) {
          setAppointments(response.appointments ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          toast.error('שגיאה בטעינת הפגישות');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAppointments();
    return () => {
      cancelled = true;
    };
  }, [token]);
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.patient?.name?.toLowerCase().includes(query) ||
        appointment.patient?.phoneNumber?.includes(query) ||
        appointment.serviceName?.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDate =
        !dateFilter || String(appointment.date).slice(0, 10) === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);
  const openSessionModal = (session) => {
    setSelectedSession(session);
    setEditStatus(session.status);
    setEditNote(session.note ?? '');
  };
  const closeSessionModal = () => {
    setSelectedSession(null);
  };
  const columns = [
    {
      key: 'patient',
      title: 'מטופל',
      width: '1.5fr',
      render: (item) => (
        <div className="doctor-appointment-patient">
          <span className="doctor-appointment-avatar">
            {item.patient?.name?.charAt(0) || '?'}
          </span>
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
          <strong>{item.serviceName}</strong>
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
      render: (item) =>
        item.durationMin != null ? `${item.durationMin} דקות` : '-',
    },
    {
      key: 'status',
      title: 'סטטוס',
      width: '0.9fr',
      render: (item) => (
        <span
          className={`doctor-appointment-status doctor-appointment-status--${item.status}`}
        >
          {STATUS_LABELS[item.status] || item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'פעולות',
      width: '0.8fr',
      render: (item) => (
        <button
          type="button"
          className="doctor-appointment-edit-btn"
          onClick={() => openSessionModal(item)}
        >
          <FiEdit2 />
          פרטים
        </button>
      ),
    },
  ];
  return (
    <div className="main-container doctor-appointment-page" dir="rtl">
      <BoxHeader
        title="לוח זמנים של הרופא"
        subtitle="סקירה כללית של הפגישות והטיפולים של הרופא"
      />
      <DashboardStats items={doctorDashboardStats} />
      <section className="doctor-appointment-panel">
        <div className="doctor-appointment-heading">
          <div>
            <h2>כל הפגישות</h2>
            <p>ניהול ומעקב אחר הפגישות והטיפולים שלך</p>
          </div>
          <span className="doctor-appointment-total">
            {filteredAppointments.length} פגישות
          </span>
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
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="doctor-appointment-date-filter">
            <FiCalendar />
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
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
        {loading ? (
          <div className="doctor-appointment-loading">טוען פגישות...</div>
        ) : (
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
        )}
      </section>
      <Modal
        isOpen={Boolean(selectedSession)}
        onClose={closeSessionModal}
        title="פרטי הפגישה"
        size="md"
      >
        {selectedSession && (
          <div className="doctor-appointment-modal" dir="rtl">
            <div className="doctor-appointment-modal-info">
              <div>
                <span>מטופל</span>
                <strong>{selectedSession.patient?.name || '-'}</strong>
              </div>
              <div>
                <span>טיפול</span>
                <strong>{selectedSession.serviceName}</strong>
              </div>
              <div>
                <span>תאריך</span>
                <strong>{formatDate(selectedSession.date)}</strong>
              </div>
              <div>
                <span>שעה</span>
                <strong>{selectedSession.time}</strong>
              </div>
            </div>
            <div className="doctor-appointment-modal-field">
              <label htmlFor="doctor-session-status">סטטוס הפגישה</label>
              <select
                id="doctor-session-status"
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value)}
              >
                {STATUS_OPTIONS.filter((option) => option.value !== 'all').map(
                  (option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="doctor-appointment-modal-field">
              <label htmlFor="doctor-session-note">הערות למפגש</label>
              <textarea
                id="doctor-session-note"
                rows={5}
                maxLength={1000}
                placeholder="הוסף הערות על הטיפול או סיבת הדחייה..."
                value={editNote}
                onChange={(event) => setEditNote(event.target.value)}
              />
              <small>{editNote.length}/1000</small>
            </div>
            <div className="doctor-appointment-modal-actions">
              <button type="button" onClick={closeSessionModal}>
                ביטול
              </button>
              <button
                type="button"
                disabled
                title="שמירה תהיה זמינה לאחר חיבור API לעדכון מפגש"
              >
                שמירת שינויים
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default DoctorAppointment;
