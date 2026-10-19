import { useContext, useMemo, useEffect, useState } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import {
  FiCheck,
  FiCalendar,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { patientDashboardStats } from '../../../../utils/dashboardDataStats/dataStats';
import './dashboard.css';
import { AppDataContext } from '../../../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
/* =========================
   Helpers
========================= */
const normalizeDateOnly = (value) => {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatDate = (value) => {
  if (!value) return '-';
  const normalized = normalizeDateOnly(value);
  if (!normalized) {
    return '-';
  }
  const [year, month, day] = normalized.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
const formatAppointmentDate = (date, time) => {
  const formattedDate = formatDate(date);
  if (!time) {
    return formattedDate;
  }
  return `${formattedDate}, ${time}`;
};
const getSessionTimestamp = (date, time) => {
  if (!date) return 0;
  const normalized = normalizeDateOnly(date);
  if (!normalized) {
    return 0;
  }
  const [year, month, day] = normalized.split('-').map(Number);
  const [hours = 0, minutes = 0] = String(time || '00:00')
    .split(':')
    .map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
};
/* =========================
   Component
========================= */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { patientTreatments = [] } = useContext(AppDataContext);
  const navigate = useNavigate();
  const [activeTreatmentIndex, setActiveTreatmentIndex] = useState(0);
  /* =========================
     Active Treatments
  ========================= */
  const activeTreatments = useMemo(() => {
    const treatments = Array.isArray(patientTreatments)
      ? patientTreatments
      : [];
    return treatments
      .filter((treatment) => {
        const totalSessions = Number(treatment?.totalSessions || 0);
        return treatment?.status === 'in_progress' && totalSessions > 1;
      })
      .sort((a, b) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      })
      .map((treatment) => ({
        _id: treatment._id,
        title: treatment.service?.name || '-',
        serviceGroup: treatment.serviceGroup?.title || '-',
        completedSessions: Number(treatment.completedSessions || 0),
        totalSessions: Number(treatment.totalSessions || 0),
        progress: Number(treatment.progress || 0),
        doctor: treatment.doctor || null,
        nextSession: treatment.nextSession || null,
        startDate: treatment.startDate || null,
        expectedEndDate: treatment.expectedEndDate || null,
        createdAt: treatment.createdAt || null,
        service: treatment.service || null,
        raw: treatment,
      }));
  }, [patientTreatments]);
  /* =========================
     Recent Appointments
  ========================= */
  const recentAppointments = useMemo(() => {
    const sessions = [];
    for (const treatment of Array.isArray(patientTreatments)
      ? patientTreatments
      : []) {
      for (const session of Array.isArray(treatment?.sessions)
        ? treatment.sessions
        : []) {
        sessions.push({
          _id: session._id,
          treatmentId: treatment._id,
          serviceName: treatment.service?.name || '-',
          status: session.status,
          doctorName: session.doctor?.name ? `ד"ר ${session.doctor.name}` : '-',
          doctorAvatar: session.doctor?.avatar || null,
          date: session.date,
          time: session.time,
          sessionNumber: session.sessionNumber,
          timestamp: getSessionTimestamp(session.date, session.time),
        });
      }
    }
    return sessions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [patientTreatments]);
  /* =========================
     Recent Activities
  ========================= */
  const recentActivities = useMemo(() => {
    const activities = [];
    for (const treatment of Array.isArray(patientTreatments)
      ? patientTreatments
      : []) {
      for (const session of Array.isArray(treatment?.sessions)
        ? treatment.sessions
        : []) {
        const base = {
          timestamp: getSessionTimestamp(session.date, session.time),
        };
        if (session.status === 'confirmed') {
          activities.push({
            ...base,
            _id: `confirmed-${session._id}`,
            type: 'confirmed',
            title: 'המינוי אושר',
            description: `${treatment.service?.name || 'טיפול'} - ${formatAppointmentDate(
              session.date,
              session.time,
            )}`,
          });
        }
        if (session.status === 'completed') {
          activities.push({
            ...base,
            _id: `completed-${session._id}`,
            type: 'treatment',
            title: 'המפגש הושלם',
            description: `${treatment.service?.name || 'טיפול'} - ${formatAppointmentDate(
              session.date,
              session.time,
            )}`,
          });
        }
      }
    }
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [patientTreatments]);
  /* =========================
     Config
  ========================= */
  const activityConfig = {
    confirmed: {
      icon: FiCheck,
      className: 'activity-icon--confirmed',
    },
    reminder: {
      icon: FiCalendar,
      className: 'activity-icon--reminder',
    },
    treatment: {
      icon: FiFileText,
      className: 'activity-icon--treatment',
    },
  };
  const statusLabels = {
    pending: 'בהמתנה',
    confirmed: 'מאושר',
    completed: 'הושלם',
    cancelled: 'מבוטל',
    rejected: 'נדחה',
  };
  useEffect(() => {
    if (activeTreatments.length === 0) {
      setActiveTreatmentIndex(0);
      return;
    }
    if (activeTreatmentIndex >= activeTreatments.length) {
      setActiveTreatmentIndex(0);
    }
  }, [activeTreatments, activeTreatmentIndex]);
  const handlePreviousTreatment = () => {
    setActiveTreatmentIndex((prev) => {
      if (prev === 0) {
        return activeTreatments.length - 1;
      }
      return prev - 1;
    });
  };
  const handleNextTreatment = () => {
    setActiveTreatmentIndex((prev) => {
      if (prev === activeTreatments.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };
  const currentActiveTreatment = activeTreatments[activeTreatmentIndex] || null;
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'בוקר טוב, ' + user.name}
        subtitle={'הנה סקירה כללית של ההזמנות שלך היום.'}
      />
      <DashboardStats items={patientDashboardStats} />
      <div className="patient-dashboard-overview">
        {/* =========================
            Recent Activity
        ========================= */}
        <section className="container-box patient-dashboard-card recent-activity">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">פעילות אחרונה</h2>
          </div>
          <div className="recent-activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const config =
                  activityConfig[activity.type] || activityConfig.reminder;
                const Icon = config.icon;
                return (
                  <div className="recent-activity-item" key={activity._id}>
                    <div className={`activity-icon ${config.className}`}>
                      <Icon />
                    </div>
                    <div className="activity-content">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-description">
                        {activity.description}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="dashboard-empty">אין פעילות אחרונה</div>
            )}
          </div>
        </section>
        {/* =========================
            Active Treatments
        ========================= */}
        <section className="container-box patient-dashboard-card active-treatments">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">טיפולים פעילים</h2>
          </div>
          <div className="active-treatments-list">
            {currentActiveTreatment ? (
              (() => {
                const treatment = currentActiveTreatment;
                const completed = Number(treatment.completedSessions || 0);
                const total = Number(treatment.totalSessions || 0);
                const calculatedProgress =
                  total > 0
                    ? Math.min(Math.round((completed / total) * 100), 100)
                    : 0;
                const progress = Number.isFinite(treatment.progress)
                  ? treatment.progress
                  : calculatedProgress;
                return (
                  <>
                    <div className="active-treatment-carousel">
                      {activeTreatments.length > 1 && (
                        <button
                          type="button"
                          className="treatment-carousel-arrow treatment-carousel-arrow--right"
                          onClick={handlePreviousTreatment}
                          aria-label="הטיפול הקודם"
                        >
                          <FiChevronRight />
                        </button>
                      )}
                      <div
                        className="active-treatment-wrapper"
                        key={treatment._id}
                      >
                        <div className="active-treatment-card">
                          <div className="treatment-main-row">
                            <div className="treatment-title-area">
                              <span className="treatment-name">
                                {treatment.title}
                              </span>
                              <span className="treatment-service-group">
                                {treatment.serviceGroup}
                              </span>
                            </div>
                            <span className="treatment-sessions">
                              {completed}/{total} מפגשים
                            </span>
                          </div>
                          <div className="treatment-progress-info">
                            <span>התקדמות</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="treatment-progress">
                            <div
                              className="treatment-progress-value"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                          {treatment.doctor?.name && (
                            <div className="treatment-doctor">
                              <span>רופא מטפל:</span>
                              <strong>ד"ר {treatment.doctor.name}</strong>
                            </div>
                          )}
                          {treatment.nextSession ? (
                            <div className="treatment-next-session">
                              <span>המפגש הבא:</span>
                              <strong>
                                {formatAppointmentDate(
                                  treatment.nextSession.date,
                                  treatment.nextSession.time,
                                )}
                              </strong>
                            </div>
                          ) : (
                            <div className="treatment-next-session treatment-next-session--empty">
                              טרם נקבע מפגש נוסף
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="treatment-details-button"
                          onClick={() =>
                            navigate('/patient/treatmentPlans', {
                              state: {
                                treatmentId: treatment._id,
                              },
                            })
                          }
                        >
                          הצג פרטים
                        </button>
                      </div>
                      {activeTreatments.length > 1 && (
                        <button
                          type="button"
                          className="treatment-carousel-arrow treatment-carousel-arrow--left"
                          onClick={handleNextTreatment}
                          aria-label="הטיפול הבא"
                        >
                          <FiChevronLeft />
                        </button>
                      )}
                    </div>
                    {activeTreatments.length > 1 && (
                      <div className="treatment-carousel-footer">
                        <div className="treatment-carousel-dots">
                          {activeTreatments.map((item, index) => (
                            <button
                              key={item._id}
                              type="button"
                              className={`treatment-carousel-dot ${
                                index === activeTreatmentIndex
                                  ? 'treatment-carousel-dot--active'
                                  : ''
                              }`}
                              onClick={() => setActiveTreatmentIndex(index)}
                              aria-label={`טיפול ${index + 1}`}
                            />
                          ))}
                        </div>
                        <span className="treatment-carousel-counter">
                          {activeTreatmentIndex + 1} / {activeTreatments.length}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              <div className="dashboard-empty">
                אין טיפולים פעילים עם מספר מפגשים
              </div>
            )}
          </div>
        </section>
      </div>
      {/* =========================
          Recent Appointments
      ========================= */}
      <section className="container-box patient-dashboard-card recent-appointments">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">פגישות אחרונות</h2>
          <button className="dashboard-view-all" type="button">
            הצג הכל
          </button>
        </div>
        <div className="recent-appointments-table-wrapper">
          <table className="recent-appointments-table">
            <thead>
              <tr>
                <th>שירות</th>
                <th>סטטוס</th>
                <th>רופא</th>
                <th>מפגש</th>
                <th>התאריך</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.serviceName}</td>
                    <td>
                      <span
                        className={`appointment-status appointment-status--${appointment.status}`}
                      >
                        {statusLabels[appointment.status] || appointment.status}
                      </span>
                    </td>
                    <td>{appointment.doctorName}</td>
                    <td>
                      {appointment.sessionNumber
                        ? `מפגש ${appointment.sessionNumber}`
                        : '-'}
                    </td>
                    <td>
                      {formatAppointmentDate(
                        appointment.date,
                        appointment.time,
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="dashboard-empty-table">
                    אין פגישות להצגה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
