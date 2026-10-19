import { useContext, useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiCheck, FiClock, FiFileText } from 'react-icons/fi';
import { AuthContext } from '../../../../context/AuthContext';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import './treatmentPlans.css';
import { AppDataContext } from '../../../../context/AppDataContext';
import { useLocation } from 'react-router-dom';
const TreatmentPlans = () => {
  const location = useLocation();
  const stateTreatmentId = location.state?.treatmentId;
  const { patientTreatments } = useContext(AppDataContext);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(
    stateTreatmentId ? stateTreatmentId : null,
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (patientTreatments) setLoading(false);
  }, [patientTreatments]);
  /*
   * =========================================
   * SELECTED
   * =========================================
   */
  const selectedTreatment = useMemo(() => {
    return patientTreatments.find(
      (treatment) => treatment._id === selectedTreatmentId,
    );
  }, [patientTreatments, selectedTreatmentId]);
  /*
   * =========================================
   * DATE FORMAT
   * =========================================
   */
  const formatDate = (date) => {
    if (!date) return '-';
    const dateOnly = String(date).slice(0, 10);
    const parsedDate = new Date(`${dateOnly}T12:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsedDate);
  };
  /*
   * =========================================
   * STATUS
   * =========================================
   */
  const getTreatmentStatusLabel = (status) => {
    switch (status) {
      case 'in_progress':
        return 'פעיל';
      case 'completed':
        return 'הושלם';
      case 'cancelled':
        return 'בוטל';
      case 'rejected':
        return 'נדחה';
      default:
        return status;
    }
  };
  const getSessionStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'ממתין';
      case 'confirmed':
        return 'מתוכנן';
      case 'completed':
        return 'הושלם';
      case 'cancelled':
        return 'בוטל';
      case 'rejected':
        return 'נדחה';
      default:
        return status;
    }
  };
  /*
   * =========================================
   * ACTIVE TREATMENTS
   * =========================================
   */
  const getTreatmentPriority = (treatment) => {
    if (
      treatment.status === 'in_progress' &&
      Number(treatment.totalSessions) > 1
    ) {
      return 1;
    }
    if (
      treatment.status === 'in_progress' &&
      Number(treatment.totalSessions) === 1
    ) {
      return 2;
    }
    if (treatment.status === 'completed') {
      return 3;
    }
    return 4;
  };
  const activeTreatments = useMemo(() => {
    return patientTreatments
      .filter(
        (treatment) =>
          treatment.status === 'in_progress' ||
          treatment.status === 'completed',
      )
      .sort((a, b) => {
        const priorityA = getTreatmentPriority(a);
        const priorityB = getTreatmentPriority(b);
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
  }, [patientTreatments]);
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title="תוכניות טיפול ופגישות"
        subtitle="עקבו אחר הטיפולים המתמשכים וההתקדמות שלכם במהלך המפגשים"
      />
      <div className="treatment-plans-page">
        {/* =========================
            ACTIVE
        ========================= */}
        <section className="treatment-active-section">
          <div className="treatment-section-header">
            <h2>הטיפולים הפעילים</h2>
            <button type="button" className="treatment-show-all-button">
              הצג הכל
            </button>
          </div>
          {loading ? (
            <div className="treatment-loading">טוען טיפולים...</div>
          ) : activeTreatments.length === 0 ? (
            <div className="treatment-loading">אין תוכניות טיפול</div>
          ) : (
            <div className="treatment-cards-grid">
              {activeTreatments.map((treatment) => {
                const isSelected = selectedTreatmentId === treatment._id;
                return (
                  <button
                    key={treatment._id}
                    type="button"
                    className={`treatment-card ${
                      isSelected ? 'treatment-card--selected' : ''
                    }`}
                    onClick={() =>
                      setSelectedTreatmentId((current) =>
                        current === treatment._id ? null : treatment._id,
                      )
                    }
                  >
                    <div className="treatment-card-top">
                      <span className="treatment-card-file-icon">
                        <FiFileText />
                      </span>{' '}
                      <span className="treatment-card-code">
                        #{String(treatment._id).slice(-5).toUpperCase()}
                      </span>
                    </div>
                    <div className="treatment-card-body">
                      <div className="treatment-card-title-row">
                        <h3>
                          {treatment.service?.name ||
                            treatment.serviceGroup?.title ||
                            'טיפול'}
                        </h3>
                        <span
                          className={`treatment-status treatment-status--${treatment.status}`}
                        >
                          {getTreatmentStatusLabel(treatment.status)}
                        </span>
                      </div>
                      <p className="treatment-card-doctor">
                        רופא שיניים
                        {treatment.doctor?.name
                          ? ` · ${treatment.doctor.name}`
                          : ''}
                      </p>
                      <div className="treatment-card-progress-head">
                        <span>
                          התקדמות{' '}
                          {treatment.completedSessions +
                            ' / ' +
                            treatment.totalSessions}
                        </span>
                        <span>{treatment.progress}%</span>
                      </div>
                      <div className="treatment-progress-track">
                        <div
                          className="treatment-progress-fill"
                          style={{
                            width: `${treatment.progress}%`,
                          }}
                        />
                      </div>
                      <p className="treatment-card-next">
                        הבא:{' '}
                        {treatment.nextSession
                          ? `${formatDate(treatment.nextSession.date)} בשעה ${
                              treatment.nextSession.time
                            }`
                          : 'אין פגישה נוספת'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        {/* =========================
            NO SELECTED
        ========================= */}
        {!selectedTreatment ? (
          <section className="treatment-empty-state">
            <div className="treatment-empty-icon">
              <FiFileText />
            </div>
            <h2>בחר טיפול</h2>
            <p>
              בחר תוכנית טיפול מלמעלה כדי להציג מידע מפורט על המפגשים וההתקדמות.
            </p>
          </section>
        ) : (
          <div className="treatment-details-wrapper">
            {/* =========================
                SUMMARY
            ========================= */}
            <section className="treatment-details-card">
              <div className="treatment-details-heading">
                <div>
                  <h2>{selectedTreatment.service?.name || 'טיפול'}</h2>
                  <p>
                    רופא שיניים
                    {selectedTreatment.doctor?.name
                      ? ` עם ${selectedTreatment.doctor.name}`
                      : ''}
                  </p>
                </div>
                <span
                  className={`treatment-status treatment-status--${selectedTreatment.status}`}
                >
                  {getTreatmentStatusLabel(selectedTreatment.status)}
                </span>
              </div>
              <div className="treatment-details-stats">
                <div className="treatment-detail-stat">
                  <span>תאריך התחלה</span>
                  <strong>{formatDate(selectedTreatment.startDate)}</strong>
                </div>
                <div className="treatment-detail-stat">
                  <span>תאריך צפוי להשלמה</span>
                  <strong>
                    {formatDate(selectedTreatment.expectedEndDate)}
                  </strong>
                </div>
                <div className="treatment-detail-stat">
                  <span>התקדמות</span>
                  <strong>{selectedTreatment.progress}% הושלם</strong>
                </div>
              </div>
              <div className="treatment-main-progress">
                <div className="treatment-main-progress-head">
                  <span>התקדמות הטיפול</span>
                  <span>
                    {selectedTreatment.completedSessions} מתוך{' '}
                    {selectedTreatment.totalSessions} מפגשים הושלמו
                  </span>
                </div>
                <div className="treatment-main-progress-track">
                  <div
                    className="treatment-main-progress-fill"
                    style={{
                      width: `${selectedTreatment.progress}%`,
                    }}
                  />
                </div>
              </div>
              {selectedTreatment.nextSession && (
                <div className="treatment-next-session-box">
                  <strong>המפגש הבא</strong>
                  <span>
                    {formatDate(selectedTreatment.nextSession.date)} בשעה{' '}
                    {selectedTreatment.nextSession.time}
                  </span>
                </div>
              )}
            </section>
            {/* =========================
                SESSIONS
            ========================= */}
            <section className="treatment-sessions-card">
              <h2>היסטוריית המפגשים וציר הזמן</h2>
              {!selectedTreatment.sessions?.length ? (
                <div className="treatment-empty-sessions">אין מפגשים להצגה</div>
              ) : (
                <div className="treatment-timeline">
                  {selectedTreatment.sessions.map((session, index) => {
                    const isCompleted = session.status === 'completed';
                    return (
                      <div className="treatment-session-row" key={session._id}>
                        <div className="treatment-session-status-side">
                          <span
                            className={`treatment-session-status treatment-session-status--${session.status}`}
                          >
                            {getSessionStatusLabel(session.status)}
                          </span>
                        </div>
                        <div className="treatment-session-content">
                          <div className="treatment-session-main">
                            <div
                              className={`treatment-session-icon ${
                                isCompleted
                                  ? 'treatment-session-icon--completed'
                                  : 'treatment-session-icon--scheduled'
                              }`}
                            >
                              {isCompleted ? <FiCheck /> : <FiCalendar />}
                            </div>
                            <div className="treatment-session-info">
                              <h3>מפגש {session.sessionNumber}</h3>
                              <div className="treatment-session-meta">
                                {session.durationMin && (
                                  <span>
                                    <FiClock />
                                    {session.durationMin} דקות
                                  </span>
                                )}
                                <span>
                                  <FiClock />
                                  {session.time}
                                </span>
                                <span>
                                  <FiCalendar />
                                  {formatDate(session.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {session.note && (
                            <div className="treatment-session-note">
                              {session.note}
                            </div>
                          )}
                        </div>
                        {index < selectedTreatment.sessions.length - 1 && (
                          <span className="treatment-timeline-line" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
export default TreatmentPlans;
