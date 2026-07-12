import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { fetchPatientFullDetailsBySecretary } from '../../../../api/secretaryApi';
import './patientModalSecretary.css';
import { calculateAge } from '../../../../utils/functions';

const statusLabels = {
  in_progress: 'פעיל',
  completed: 'הושלם',
  cancelled: 'בוטל',
  pending: 'ממתין',
  confirmed: 'מאושר',
};

const formatDate = (date) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const TreatmentCard = ({ treatment, type = 'active' }) => {
  return (
    <div className="patient-sec-treatment-card">
      <div className="patient-sec-treatment-top">
        <div className="patient-sec-treatment-service">
          {treatment.service?.photo && (
            <img
              src={treatment.service.photo}
              alt={treatment.service.itemName}
              className="patient-sec-treatment-img"
            />
          )}

          <div>
            <h4>{treatment.service?.itemName || 'טיפול'}</h4>
            <span>{treatment.service?.groupTitle}</span>
          </div>
        </div>

        <span className={`patient-sec-status-badge ${type}`}>
          {statusLabels[treatment.status] || treatment.status}
        </span>
      </div>

      <p className="patient-sec-treatment-desc">
        {treatment.service?.description || 'אין תיאור'}
      </p>

      <div className="patient-sec-treatment-info-grid">
        <div>
          <span>מחיר</span>
          <strong>₪{treatment.service?.price || 0}</strong>
        </div>

        <div>
          <span>משך טיפול</span>
          <strong>{treatment.service?.durationMin || 0} דקות</strong>
        </div>

        <div>
          <span>סה״כ מפגשים</span>
          <strong>{treatment.totalSessions}</strong>
        </div>

        <div>
          <span>הושלמו</span>
          <strong>{treatment.completedSessions}</strong>
        </div>
      </div>

      <div className="patient-sec-sessions-box">
        <h5>מפגשים</h5>

        {treatment.sessions?.length > 0 ? (
          treatment.sessions.map((session) => (
            <div className="patient-sec-session-row" key={session._id}>
              <div>
                <strong>
                  {formatDate(session.date)} · {session.time}
                </strong>
                <span>
                  ד״ר {session.doctor?.name || '-'} ·{' '}
                  {session.doctor?.phoneNumber || '-'}
                </span>
              </div>

              <span className={`patient-sec-session-status ${session.status}`}>
                {statusLabels[session.status] || session.status}
              </span>
            </div>
          ))
        ) : (
          <div className="patient-sec-empty-small">אין מפגשים</div>
        )}
      </div>
    </div>
  );
};

const PatientModalSecretary = ({ patientId }) => {
  const { token } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const res = await fetchPatientFullDetailsBySecretary(patientId, token);
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) loadPatient();
  }, [patientId]);

  if (loading) {
    return <div className="patient-sec-loading">טוען פרטי מטופל...</div>;
  }

  if (!data) {
    return <div className="patient-sec-loading">אין מידע להצגה</div>;
  }

  const { user, patientProfile, statistics, treatments } = data;
  return (
    <div className="patient-sec-modal" dir="rtl">
      <div className="patient-sec-header-card">
        <div className="patient-sec-user-main">
          <div className="patient-sec-avatar">
            {user?.name
              ?.split(' ')
              .slice(0, 2)
              .map((word) => word[0])
              .join('') || 'AA'}
          </div>

          <div>
            <h2>{user?.name}</h2>
            <span>מזהה: #{user?._id}</span>
          </div>
        </div>

        <div className="patient-sec-contact">
          <span>{user?.phoneNumber || '-'}</span>
          <span>{user?.isActive ? 'פעיל' : 'לא פעיל'}</span>
        </div>
      </div>

      <div className="patient-sec-profile-grid">
        <div className="patient-sec-profile-card">
          <span>גיל</span>
          <strong>{calculateAge(user?.birth) || '-'}</strong>
        </div>

        <div className="patient-sec-profile-card">
          <span>אלרגיות</span>
          <strong>{patientProfile?.allergies || 'אין'}</strong>
        </div>

        <div className="patient-sec-profile-card">
          <span>הערות</span>
          <strong>{patientProfile?.notes || 'אין'}</strong>
        </div>

        <div className="patient-sec-profile-card">
          <span>נוצר בתאריך</span>
          <strong>{formatDate(patientProfile?.createdAt)}</strong>
        </div>
      </div>

      <div className="patient-sec-stats-grid">
        <div className="patient-sec-stat-card">
          <span>סה״כ טיפולים</span>
          <strong>{statistics?.totalTreatments || 0}</strong>
        </div>

        <div className="patient-sec-stat-card">
          <span>טיפולים פעילים</span>
          <strong>{statistics?.activeTreatments || 0}</strong>
        </div>

        <div className="patient-sec-stat-card">
          <span>טיפולים קודמים</span>
          <strong>{statistics?.previousTreatments || 0}</strong>
        </div>

        <div className="patient-sec-stat-card">
          <span>סה״כ מפגשים</span>
          <strong>{statistics?.totalSessions || 0}</strong>
        </div>

        <div className="patient-sec-stat-card">
          <span>מפגשים שהושלמו</span>
          <strong>{statistics?.completedSessions || 0}</strong>
        </div>

        <div className="patient-sec-stat-card">
          <span>מפגשים ממתינים</span>
          <strong>{statistics?.pendingSessions || 0}</strong>
        </div>
      </div>

      <div className="patient-sec-section">
        <div className="patient-sec-section-title">
          <h3>טיפולים פעילים</h3>
          <span>{treatments?.active?.length || 0}</span>
        </div>

        {treatments?.active?.length > 0 ? (
          <div className="patient-sec-treatment-list">
            {treatments.active.map((treatment) => (
              <TreatmentCard
                key={treatment._id}
                treatment={treatment}
                type="active"
              />
            ))}
          </div>
        ) : (
          <div className="patient-sec-empty">אין טיפולים פעילים</div>
        )}
      </div>

      <div className="patient-sec-section">
        <div className="patient-sec-section-title">
          <h3>טיפולים קודמים</h3>
          <span>{treatments?.previous?.length || 0}</span>
        </div>

        {treatments?.previous?.length > 0 ? (
          <div className="patient-sec-treatment-list">
            {treatments.previous.map((treatment) => (
              <TreatmentCard
                key={treatment._id}
                treatment={treatment}
                type="previous"
              />
            ))}
          </div>
        ) : (
          <div className="patient-sec-empty">אין טיפולים קודמים</div>
        )}
      </div>
    </div>
  );
};

export default PatientModalSecretary;
