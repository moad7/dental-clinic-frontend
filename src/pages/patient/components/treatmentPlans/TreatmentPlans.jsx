// import { useMemo, useState } from 'react';
// import { FiCalendar, FiCheck, FiClock, FiFileText } from 'react-icons/fi';
// import BoxHeader from '../../../components/boxHeader/BoxHeader';
// import './treatmentPlans.css';
// const treatmentsMock = [
//   {
//     _id: '23544',
//     code: '#23544',
//     title: 'טיפול שורש',
//     doctorName: 'ד"ר מייקל צ׳ן',
//     doctorSpecialty: 'רופא שיניים',
//     status: 'active',
//     startDate: '15 בנובמבר 2024',
//     expectedEndDate: '20 בדצמבר 2024',
//     completedSessions: 3,
//     totalSessions: 4,
//     nextSession: {
//       date: '18 בדצמבר 2024',
//       time: '2:00 مساءً',
//     },
//     sessions: [
//       {
//         _id: 'session-1',
//         title: 'הבדיקה הראשונית וצילומי הרנטגן',
//         duration: 45,
//         date: '15 בנובמבר 2024',
//         time: '2:00 مساءً',
//         note: 'השן #14 זקוקה לטיפול שורש. נמצא זיהום בתעלת השורש.',
//         status: 'completed',
//       },
//       {
//         _id: 'session-2',
//         title: 'ניקוי תעלת השורש - שלב ראשון',
//         duration: 45,
//         date: '15 בנובמבר 2024',
//         time: '2:00 مساءً',
//         note: 'הוסרה הרקמה הנגועה. בוצעה תרופה. המטופל עבר את ההליך היטב.',
//         status: 'completed',
//       },
//       {
//         _id: 'session-3',
//         title: 'עיצוב תעלות השורש ומילוי זמני',
//         duration: 45,
//         date: '15 בנובמבר 2024',
//         time: '2:00 مساءً',
//         note: 'בוצע עיצוב התעלות והונח מילוי זמני. לא נצפו סיבוכים.',
//         status: 'completed',
//       },
//       {
//         _id: 'session-4',
//         title: 'השחזור הסופי והנחת הכתר',
//         duration: 45,
//         date: '15 בנובמבר 2024',
//         time: '2:00 مساءً',
//         note: 'המפגש הסופי להשלמת הטיפול עם הכתר הקבוע.',
//         status: 'scheduled',
//       },
//     ],
//   },
//   {
//     _id: '66423',
//     code: '#66423',
//     title: 'טיפול חניכיים',
//     doctorName: 'ד"ר מייקל צ׳ן',
//     doctorSpecialty: 'רופא שיניים',
//     status: 'active',
//     startDate: '01 בדצמבר 2024',
//     expectedEndDate: '10 בינואר 2025',
//     completedSessions: 2,
//     totalSessions: 5,
//     nextSession: {
//       date: '22 בדצמבר 2024',
//       time: '11:00 صباحًا',
//     },
//     sessions: [],
//   },
//   {
//     _id: '44323',
//     code: '#44323',
//     title: 'טיפול בסדקים',
//     doctorName: 'ד"ר מייקל צ׳ן',
//     doctorSpecialty: 'רופא שיניים',
//     status: 'completed',
//     startDate: '05 בנובמבר 2024',
//     expectedEndDate: '18 בדצמבר 2024',
//     completedSessions: 4,
//     totalSessions: 4,
//     nextSession: null,
//     sessions: [],
//   },
// ];
// const TreatmentPlans = () => {
//   const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
//   const selectedTreatment = useMemo(() => {
//     return treatmentsMock.find(
//       (treatment) => treatment._id === selectedTreatmentId,
//     );
//   }, [selectedTreatmentId]);
//   const progress = selectedTreatment
//     ? Math.round(
//         (selectedTreatment.completedSessions /
//           selectedTreatment.totalSessions) *
//           100,
//       )
//     : 0;
//   const getTreatmentProgress = (treatment) => {
//     if (!treatment.totalSessions) return 0;
//     return Math.round(
//       (treatment.completedSessions / treatment.totalSessions) * 100,
//     );
//   };
//   const getTreatmentStatusLabel = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'הושלם';
//       case 'active':
//         return 'פעיל';
//       default:
//         return status;
//     }
//   };
//   const getSessionStatusLabel = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'הושלם';
//       case 'scheduled':
//         return 'מתוכנן';
//       default:
//         return status;
//     }
//   };
//   return (
//     <div className="main-container" dir="rtl">
//       <BoxHeader
//         title="תוכניות טיפול ופגישות"
//         subtitle="עקבו אחר הטיפולים המתמשכים וההתקדמות שלכם במהלך המפגשים"
//       />
//       <div className="treatment-plans-page">
//         {/* =====================================================
//             ACTIVE TREATMENTS
//         ====================================================== */}
//         <section className="treatment-active-section">
//           <div className="treatment-section-header">
//             <h2>הטיפולים הפעילים</h2>
//             <button type="button" className="treatment-show-all-button">
//               הצג הכל
//             </button>
//           </div>
//           <div className="treatment-cards-grid">
//             {treatmentsMock.map((treatment) => {
//               const cardProgress = getTreatmentProgress(treatment);
//               const isSelected = selectedTreatmentId === treatment._id;
//               return (
//                 <button
//                   key={treatment._id}
//                   type="button"
//                   className={`treatment-card ${
//                     isSelected ? 'treatment-card--selected' : ''
//                   }`}
//                   onClick={() =>
//                     setSelectedTreatmentId((current) =>
//                       current === treatment._id ? null : treatment._id,
//                     )
//                   }
//                 >
//                   <div className="treatment-card-top">
//                     <span className="treatment-card-file-icon">
//                       <FiFileText />
//                     </span>
//                     <span className="treatment-card-code">
//                       {treatment.code}
//                     </span>
//                   </div>
//                   <div className="treatment-card-body">
//                     <div className="treatment-card-title-row">
//                       <h3>{treatment.title}</h3>
//                       <span
//                         className={`treatment-status treatment-status--${treatment.status}`}
//                       >
//                         {getTreatmentStatusLabel(treatment.status)}
//                       </span>
//                     </div>
//                     <p className="treatment-card-doctor">
//                       {treatment.doctorSpecialty} · {treatment.doctorName}
//                     </p>
//                     <div className="treatment-card-progress-head">
//                       <span>התקדמות</span>
//                       <span>{cardProgress}%</span>
//                     </div>
//                     <div className="treatment-progress-track">
//                       <div
//                         className="treatment-progress-fill"
//                         style={{
//                           width: `${cardProgress}%`,
//                         }}
//                       />
//                     </div>
//                     <p className="treatment-card-next">
//                       הבא:{' '}
//                       {treatment.nextSession
//                         ? `${treatment.nextSession.date} בשעה ${treatment.nextSession.time}`
//                         : 'אין פגישה נוספת'}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </section>
//         {/* =====================================================
//             EMPTY / DETAILS
//         ====================================================== */}
//         {!selectedTreatment ? (
//           <section className="treatment-empty-state">
//             <div className="treatment-empty-icon">
//               <FiFileText />
//             </div>
//             <h2>בחר טיפול</h2>
//             <p>בחר תוכנית טיפול מלמעלה כדי להציג את פרטי המפגשים וההתקדמות.</p>
//           </section>
//         ) : (
//           <div className="treatment-details-wrapper">
//             {/* =================================================
//                 DETAILS SUMMARY
//             ================================================== */}
//             <section className="treatment-details-card">
//               <div className="treatment-details-heading">
//                 <div>
//                   <h2>{selectedTreatment.title}</h2>
//                   <p>
//                     {selectedTreatment.doctorSpecialty} עם{' '}
//                     {selectedTreatment.doctorName}
//                   </p>
//                 </div>
//                 <span
//                   className={`treatment-status treatment-status--${selectedTreatment.status}`}
//                 >
//                   {getTreatmentStatusLabel(selectedTreatment.status)}
//                 </span>
//               </div>
//               <div className="treatment-details-stats">
//                 <div className="treatment-detail-stat">
//                   <span>תאריך התחלה</span>
//                   <strong>{selectedTreatment.startDate}</strong>
//                 </div>
//                 <div className="treatment-detail-stat">
//                   <span>תאריך צפוי להשלמה</span>
//                   <strong>{selectedTreatment.expectedEndDate}</strong>
//                 </div>
//                 <div className="treatment-detail-stat">
//                   <span>התקדמות</span>
//                   <strong>{progress}% הושלם</strong>
//                 </div>
//               </div>
//               <div className="treatment-main-progress">
//                 <div className="treatment-main-progress-head">
//                   <span>התקדמות הטיפול</span>
//                   <span>
//                     {selectedTreatment.completedSessions} מתוך{' '}
//                     {selectedTreatment.totalSessions} מפגשים הושלמו
//                   </span>
//                 </div>
//                 <div className="treatment-main-progress-track">
//                   <div
//                     className="treatment-main-progress-fill"
//                     style={{
//                       width: `${progress}%`,
//                     }}
//                   />
//                 </div>
//               </div>
//               {selectedTreatment.nextSession && (
//                 <div className="treatment-next-session-box">
//                   <strong>המפגש הבא</strong>
//                   <span>
//                     {selectedTreatment.nextSession.date} בשעה{' '}
//                     {selectedTreatment.nextSession.time}
//                   </span>
//                 </div>
//               )}
//             </section>
//             {/* =================================================
//                 SESSIONS TIMELINE
//             ================================================== */}
//             <section className="treatment-sessions-card">
//               <h2>היסטוריית המפגשים וציר הזמן</h2>
//               {selectedTreatment.sessions.length === 0 ? (
//                 <div className="treatment-empty-sessions">אין מפגשים להצגה</div>
//               ) : (
//                 <div className="treatment-timeline">
//                   {selectedTreatment.sessions.map((session, index) => {
//                     const isCompleted = session.status === 'completed';
//                     return (
//                       <div className="treatment-session-row" key={session._id}>
//                         <div className="treatment-session-status-side">
//                           <span
//                             className={`treatment-session-status treatment-session-status--${session.status}`}
//                           >
//                             {getSessionStatusLabel(session.status)}
//                           </span>
//                         </div>
//                         <div className="treatment-session-content">
//                           <div className="treatment-session-main">
//                             <div
//                               className={`treatment-session-icon ${
//                                 isCompleted
//                                   ? 'treatment-session-icon--completed'
//                                   : 'treatment-session-icon--scheduled'
//                               }`}
//                             >
//                               {isCompleted ? <FiCheck /> : <FiCalendar />}
//                             </div>
//                             <div className="treatment-session-info">
//                               <h3>{session.title}</h3>
//                               <div className="treatment-session-meta">
//                                 <span>
//                                   <FiClock />
//                                   {session.duration} דקות
//                                 </span>
//                                 <span>
//                                   <FiClock />
//                                   {session.time}
//                                 </span>
//                                 <span>
//                                   <FiCalendar />
//                                   {session.date}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           {session.note && (
//                             <div className="treatment-session-note">
//                               {session.note}
//                             </div>
//                           )}
//                         </div>
//                         {index < selectedTreatment.sessions.length - 1 && (
//                           <span className="treatment-timeline-line" />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default TreatmentPlans;
import { useContext, useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiCheck, FiClock, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/AuthContext';
import { getPatientTreatmentPlans } from '../../../../api/appointmentApi';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import './treatmentPlans.css';
const TreatmentPlans = () => {
  const { token } = useContext(AuthContext);
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  /*
   * =========================================
   * LOAD
   * =========================================
   */
  useEffect(() => {
    if (!token) return;
    let ignore = false;
    const loadTreatments = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getPatientTreatmentPlans(token);
        if (ignore) return;
        setTreatments(
          Array.isArray(result?.treatments) ? result.treatments : [],
        );
      } catch (error) {
        if (ignore) return;
        console.error('Failed to load treatments:', error);
        setTreatments([]);
        setError('אירעה שגיאה בטעינת תוכניות הטיפול');
        toast.error('אירעה שגיאה בטעינת תוכניות הטיפול');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    loadTreatments();
    return () => {
      ignore = true;
    };
  }, [token]);
  /*
   * =========================================
   * SELECTED
   * =========================================
   */
  const selectedTreatment = useMemo(() => {
    return treatments.find(
      (treatment) => treatment._id === selectedTreatmentId,
    );
  }, [treatments, selectedTreatmentId]);
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
  const activeTreatments = useMemo(() => {
    return treatments.filter(
      (treatment) =>
        treatment.status === 'in_progress' || treatment.status === 'completed',
    );
  }, [treatments]);
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
          ) : error ? (
            <div className="treatment-error">{error}</div>
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
                        <span>התקדמות</span>
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
