import BoxHeader from '../../../components/boxHeader/BoxHeader';
import { patientDashboardStats } from '../../../../utils/dashboardDataStats/dataStats';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { FiCheck, FiCalendar, FiFileText } from 'react-icons/fi';
import './dashboard.css';
const Dashboard = () => {
  const recentActivities = [
    {
      _id: '1',
      type: 'confirmed',
      title: 'המינוי אושר',
      description: '15 בדצמבר, 14:00',
    },
    {
      _id: '2',
      type: 'reminder',
      title: 'התזכורת נשלחה',
      description: '24 שעות לפני הפגישה',
    },
    {
      _id: '3',
      type: 'treatment',
      title: 'הטיפול הושלם',
      description: 'טיפול שורש - 28 בנובמבר',
    },
  ];
  const activeTreatments = [
    {
      _id: '1',
      title: 'טיפול אורתודונטי',
      completedSessions: 9,
      totalSessions: 20,
      nextSession: '20 דצמבר 2024',
    },
  ];

  const recentAppointments = [
    {
      _id: '1',
      serviceName: 'טיפול שורש',
      status: 'completed',
      doctorName: `ד"ר מייקל צ'ן`,
      date: '28 אוקטובר 2024',
    },
    {
      _id: '2',
      serviceName: 'ניקוי שיניים',
      status: 'completed',
      doctorName: `ד"ר שרה ג'ונסון`,
      date: '15 אוקטובר 2024',
    },
    {
      _id: '3',
      serviceName: 'ייעוץ',
      status: 'completed',
      doctorName: 'ד"ר איימי דיוויס',
      date: '22 אוקטובר 2024',
    },
  ];
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
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'בוקר טוב, מואד!'}
        subtitle={'הנה סקירה כללית של ההזמנות שלך היום.'}
      />
      <DashboardStats items={patientDashboardStats} />
      <div className="patient-dashboard-overview">
        <section className="container-box patient-dashboard-card recent-activity">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">פעילות אחרונה</h2>
          </div>

          <div className="recent-activity-list">
            {recentActivities.map((activity) => {
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
            })}
          </div>
        </section>
        <section className="container-box patient-dashboard-card active-treatments">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">טיפולים פעילים</h2>

            <button className="dashboard-view-all" type="button">
              הצג הכל
            </button>
          </div>

          <div className="active-treatments-list">
            {activeTreatments.map((treatment) => {
              const completed = Number(treatment.completedSessions || 0);
              const total = Number(treatment.totalSessions || 0);

              const progress =
                total > 0
                  ? Math.min(Math.round((completed / total) * 100), 100)
                  : 0;

              return (
                <div className="active-treatment-wrapper" key={treatment._id}>
                  <div className="active-treatment-card">
                    <div className="treatment-main-row">
                      <span className="treatment-name">{treatment.title}</span>

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
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {treatment.nextSession && (
                      <div className="treatment-next-session">
                        המפגש הבא: {treatment.nextSession}
                      </div>
                    )}
                  </div>

                  <button type="button" className="treatment-details-button">
                    הצג פרטים
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
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
                <th>התאריך</th>
              </tr>
            </thead>

            <tbody>
              {recentAppointments.map((appointment) => (
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

                  <td>{appointment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
