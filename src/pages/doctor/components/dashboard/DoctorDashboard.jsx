import { useContext, useState } from 'react';
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiFilePlus,
  FiPlay,
} from 'react-icons/fi';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { AuthContext } from '../../../../context/AuthContext';
import { formatDateTime } from '../../../../utils/functions';
import { doctorDashboardStats } from '../../../../utils/dashboardDataStats/dataStats';
import './doctorDashboard.css';
import { AppDataContext } from '../../../../context/AppDataContext';
const formatDate = (value) => {
  if (!value) return '-';
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};
const formatTime = (value) => {
  if (!value) return '-';
  return value.slice(0, 5);
};
const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || '?';
const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age >= 0 ? age : null;
};
const getStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'הושלם';
    case 'confirmed':
      return 'מתוכנן';
    case 'pending':
      return 'ממתין';
    case 'cancelled':
      return 'בוטל';
    case 'rejected':
      return 'נדחה';
    default:
      return status;
  }
};
const getUpcomingBadgeClass = (days) => {
  if (days <= 3) return 'doctor-dashboard-upcoming-badge--soon';
  if (days <= 14) return 'doctor-dashboard-upcoming-badge--medium';
  return 'doctor-dashboard-upcoming-badge--later';
};
const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const { doctorDashboard } = useContext(AppDataContext);
  const todaySessions = doctorDashboard?.todaySessions ?? [];
  const upcomingPatients = doctorDashboard?.upcomingPatients ?? [];
  const loading = doctorDashboard == null;
  const [showAll, setShowAll] = useState(false);
  const visibleSessions = showAll ? todaySessions : todaySessions.slice(0, 3);
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={`בוקר טוב, ${user?.name || ''}`}
        subtitle={`ברוך שובך, ${
          user?.lastSignIn
            ? `זמן אחרון לכניסה: ${formatDateTime(user.lastSignIn)}`
            : 'זו הכניסה הראשונה שלך'
        }`}
      />
      <DashboardStats items={doctorDashboardStats} />
      <div className="doctor-dashboard-content">
        {/* TODAY SCHEDULE */}
        <section className="doctor-dashboard-panel">
          <div className="doctor-dashboard-panel-header">
            <h2>לוח הזמנים להיום</h2>
            <span className="doctor-dashboard-count">
              {todaySessions.length} פגישות
            </span>
          </div>
          <div className="doctor-dashboard-sessions">
            {loading ? (
              <div className="doctor-dashboard-empty">טוען פגישות...</div>
            ) : visibleSessions.length === 0 ? (
              <div className="doctor-dashboard-empty">אין פגישות להיום</div>
            ) : (
              visibleSessions.map((session) => {
                const completed = session.status === 'completed';
                const age = getAge(session.patient?.dateOfBirth);
                console.log('Rendering session:', session);
                return (
                  <article
                    className="doctor-dashboard-session-card"
                    key={session._id}
                  >
                    <div className="doctor-dashboard-patient-header">
                      <div className="doctor-dashboard-patient">
                        <div className="doctor-dashboard-avatar">
                          {getInitial(session.patient?.name)}
                        </div>
                        <div>
                          <h3>{session.patient?.name || 'מטופל'}</h3>
                          {age !== null && <p>גיל: {age}</p>}
                        </div>
                      </div>
                      <span
                        className={`doctor-dashboard-status doctor-dashboard-status--${session.status}`}
                      >
                        {getStatusLabel(session.status)}
                      </span>
                    </div>
                    <div className="doctor-dashboard-session-treatment">
                      <span className="doctor-dashboard-green-line" />
                      <div>
                        <strong>{formatTime(session.time)}</strong>
                        <p>
                          <FiCalendar />
                          {session.serviceName}
                        </p>
                      </div>
                    </div>
                    <div className="doctor-dashboard-session-note">
                      <FiFilePlus />
                      <span>
                        {session.note ||
                          `מפגש ${session.sessionNumber || 1} מתוך ${
                            session.totalSessions || 1
                          }`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="doctor-dashboard-session-action"
                      onClick={() => {
                        console.log('Selected session:', session);
                      }}
                    >
                      {completed ? <FiCheck /> : <FiPlay />}
                      <span>{completed ? 'פרטי המפגש' : 'התחל מפגש'}</span>
                    </button>
                  </article>
                );
              })
            )}
          </div>
          {todaySessions.length > 3 && (
            <button
              type="button"
              className="doctor-dashboard-show-all"
              onClick={() => setShowAll((previous) => !previous)}
            >
              {showAll ? 'הצג פחות' : 'הצג הכל'}
            </button>
          )}
        </section>
        {/* UPCOMING PATIENTS */}
        <section className="doctor-dashboard-panel">
          <div className="doctor-dashboard-panel-header">
            <div>
              <h2>מטופלים קרובים</h2>
              <p>בימים הקרובים</p>
            </div>
          </div>
          <div className="doctor-dashboard-upcoming-list">
            {loading ? (
              <div className="doctor-dashboard-empty">טוען מטופלים...</div>
            ) : upcomingPatients.length === 0 ? (
              <div className="doctor-dashboard-empty">אין מטופלים קרובים</div>
            ) : (
              upcomingPatients.map((item) => (
                <article
                  className="doctor-dashboard-upcoming-card"
                  key={item._id}
                >
                  <div className="doctor-dashboard-upcoming-top">
                    <div className="doctor-dashboard-patient">
                      <div className="doctor-dashboard-avatar">
                        {getInitial(item.patient?.name)}
                      </div>
                      <strong>{item.patient?.name || 'מטופל'}</strong>
                    </div>

                    <span
                      className={`doctor-dashboard-upcoming-badge ${getUpcomingBadgeClass(
                        item.daysUntilNext,
                      )}`}
                    >
                      בעוד {item.daysUntilNext} ימים
                    </span>
                  </div>

                  <div className="doctor-dashboard-upcoming-treatment">
                    <span className="doctor-dashboard-green-line" />
                    <strong>{item.serviceName}</strong>
                  </div>

                  <div className="doctor-dashboard-upcoming-dates">
                    <p>
                      <FiCalendar />
                      <span>הבא: {formatDate(item.nextSession?.date)}</span>
                    </p>
                    <p>
                      <FiClock />
                      <span>
                        הקודם:{' '}
                        {item.lastSession
                          ? formatDate(item.lastSession.date)
                          : 'אין מפגש קודם'}
                      </span>
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default DoctorDashboard;
