import { useContext, useEffect, useState } from 'react';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiShield,
  FiFileText,
  FiUserPlus,
  FiHeart,
  FiChevronDown,
  FiChevronUp,
  FiHash,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../context/AuthContext';
import { calculateAge, formatDateTime } from '../../../../utils/functions';
import './patientModalSecretary.css';
import { fetchPatientFullProfile } from '../../../../api/patients';
import { renewActivationLink } from '../../../../api/secretaryApi';
import { formatDate, getActivationState, getInitials } from '../../../../components/helpers/patientHelpers';
import { DetailItem, SectionHeader, StatCard, TreatmentCard } from './components/PatientComponents';
// =========================================================
// MAIN COMPONENT
// =========================================================
const PatientModalSecretary = ({ patientId }) => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renewing, setRenewing] = useState(false);
  const [activationExpires, setActivationExpires] = useState(null);
  // -------------------------------------------------------
  // LOAD PATIENT
  // -------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const loadPatient = async () => {
      if (!patientId || !token) {
        setData(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        setData(null);
        setActivationExpires(null);
        const response = await fetchPatientFullProfile(patientId, token);
        if (cancelled) return;
        setData(response);
        setActivationExpires(response?.user?.activationTokenExpires ?? null);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load patient:', err);
        setError(err.response?.data?.message || 'אירעה שגיאה בטעינת פרטי המטופל');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPatient();
    return () => {
      cancelled = true;
    };
  }, [patientId, token]);
  // -------------------------------------------------------
  // RENEW ACTIVATION LINK
  // -------------------------------------------------------
  const handleRenewActivation = async () => {
    if (!data?.user?._id || renewing) return;
    try {
      setRenewing(true);
      const response = await renewActivationLink(data.user._id, token);
      const newExpires = response?.user?.activationTokenExpires ?? response?.activationTokenExpires;
      if (newExpires) {
        setActivationExpires(newExpires);
      }
      toast.success('קישור ההפעלה חודש בהצלחה');
    } catch (err) {
      console.error('Renew activation failed:', err);
      toast.error(err.response?.data?.message || 'אירעה שגיאה בחידוש קישור ההפעלה');
    } finally {
      setRenewing(false);
    }
  };
  // -------------------------------------------------------
  // LOADING / ERROR
  // -------------------------------------------------------
  if (loading) {
    return (
      <div className="patient-sec-loading">
        <span className="patient-sec-spinner" />
        טוען פרטי מטופל...
      </div>
    );
  }
  if (error) {
    return (
      <div className="patient-sec-error">
        <FiAlertCircle size={24} />
        <strong>שגיאה בטעינת הנתונים</strong>
        <p>{error}</p>
      </div>
    );
  }
  if (!data?.user) {
    return <div className="patient-sec-empty">אין מידע להצגה</div>;
  }
  const { user, patientProfile, statistics, treatments } = data;
  const activeTreatments = treatments?.active || [];
  const previousTreatments = treatments?.previous || [];
  const activationState = getActivationState(user, activationExpires);
  const stats = [
    {
      icon: FiActivity,
      label: 'סה״כ טיפולים',
      value: statistics?.totalTreatments,
      tone: 'default',
    },
    {
      icon: FiHeart,
      label: 'טיפולים פעילים',
      value: statistics?.activeTreatments,
      tone: 'green',
    },
    {
      icon: FiCheckCircle,
      label: 'טיפולים שהושלמו',
      value: statistics?.completedTreatments,
      tone: 'green',
    },
    {
      icon: FiClock,
      label: 'טיפולים קודמים',
      value: statistics?.previousTreatments,
    },
    {
      icon: FiXCircle,
      label: 'טיפולים שבוטלו',
      value: statistics?.cancelledTreatments,
      tone: 'red',
    },
    {
      icon: FiAlertCircle,
      label: 'טיפולים שנדחו',
      value: statistics?.rejectedTreatments,
      tone: 'orange',
    },
    {
      icon: FiCalendar,
      label: 'סה״כ מפגשים',
      value: statistics?.totalSessions,
    },
    {
      icon: FiCheckCircle,
      label: 'מפגשים שהושלמו',
      value: statistics?.completedSessions,
      tone: 'green',
    },
    {
      icon: FiClock,
      label: 'מפגשים ממתינים',
      value: statistics?.pendingSessions,
      tone: 'orange',
    },
    {
      icon: FiShield,
      label: 'מפגשים מאושרים',
      value: statistics?.confirmedSessions,
      tone: 'blue',
    },
  ];
  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div className="patient-sec-modal" dir="rtl">
      {/* ===================================================
          PATIENT HERO
      =================================================== */}
      <header className="patient-sec-hero">
        <div className="patient-sec-hero-main">
          <div className="patient-sec-avatar">{getInitials(user.name)}</div>
          <div className="patient-sec-hero-info">
            <div className="patient-sec-hero-title">
              <h2>{user.name || 'מטופל'}</h2>
              <span className={`patient-sec-account-status ${user.isActive ? 'is-active' : 'is-inactive'}`}>
                <span />
                {user.isActive ? 'פעיל' : 'לא פעיל'}
              </span>
            </div>
            <p>פרופיל מטופל • תיק רפואי</p>
            <div className="patient-sec-hero-contact">
              <span>
                <FiHash size={14} />
                {user.idNumber || '-'}
              </span>
              <span>
                <FiPhone size={14} />
                <bdi>{user.phoneNumber || '-'}</bdi>
              </span>
              {user.email && (
                <span>
                  <FiMail size={14} />
                  <bdi>{user.email}</bdi>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="patient-sec-hero-aside">
          <span>תאריך הצטרפות</span>
          <strong>{formatDate(user.createdAt)}</strong>
        </div>
      </header>
      {/* ===================================================
          PERSONAL INFORMATION
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiUser} title="פרטים אישיים" subtitle="מידע אישי ופרטי יצירת קשר" />
        <div className="patient-sec-details-grid">
          <DetailItem icon={FiUser} label="שם מלא" value={user.name} />
          <DetailItem icon={FiHash} label="מספר זהות" value={user.idNumber} />
          <DetailItem icon={FiCalendar} label="תאריך לידה" value={formatDate(user.birth)} />
          <DetailItem icon={FiUser} label="גיל" value={user.birth ? calculateAge(user.birth) : '-'} />
          <DetailItem icon={FiUser} label="מין" value={user.gender === 'male' ? 'זכר' : user.gender === 'female' ? 'נקבה' : '-'} />
          <DetailItem icon={FiPhone} label="טלפון" value={<bdi>{user.phoneNumber || '-'}</bdi>} />
          <DetailItem icon={FiMail} label="אימייל" value={<bdi>{user.email || '-'}</bdi>} />
          <DetailItem icon={FiShield} label="תפקיד במערכת" value="מטופל" />
        </div>
      </section>
      {/* ===================================================
          MEDICAL INFORMATION
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiHeart} title="מידע רפואי" subtitle="רגישויות והערות רפואיות" />
        <div className="patient-sec-medical-grid">
          <div className="patient-sec-medical-card">
            <div className="patient-sec-medical-heading">
              <FiAlertCircle size={18} />
              <strong>אלרגיות ורגישויות</strong>
            </div>
            <p>{patientProfile?.allergies?.trim() || 'לא צוינו אלרגיות'}</p>
          </div>
          <div className="patient-sec-medical-card">
            <div className="patient-sec-medical-heading">
              <FiFileText size={18} />
              <strong>הערות רפואיות</strong>
            </div>
            <p>{patientProfile?.notes?.trim() || 'לא נוספו הערות'}</p>
          </div>
        </div>
      </section>
      {/* ===================================================
          ACCOUNT INFORMATION
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiShield} title="פרטי חשבון" subtitle="מצב החשבון והפעלת המשתמש" />
        <div className="patient-sec-details-grid">
          <DetailItem icon={FiCheckCircle} label="מצב חשבון" value={user.isActive ? 'פעיל' : 'לא פעיל'} />
          <DetailItem icon={FiShield} label="הגדרת סיסמה" value={user.mustSetPassword ? 'נדרש להגדיר סיסמה' : 'הסיסמה הוגדרה'} />
          <DetailItem icon={FiClock} label="תוקף קישור הפעלה" value={formatDateTime(activationExpires)} />
          <DetailItem icon={FiCalendar} label="תאריך יצירת המשתמש" value={formatDateTime(user.createdAt)} />
          <DetailItem icon={FiRefreshCw} label="עדכון אחרון" value={formatDateTime(user.updatedAt)} />
        </div>
        {user.mustSetPassword && (
          <div className="patient-sec-activation">
            <div className="patient-sec-activation-info">
              <div className="patient-sec-activation-icon">
                {activationState === 'expired' ? <FiAlertCircle size={22} /> : <FiShield size={22} />}
              </div>
              <div>
                <h4>ניהול קישור הפעלה</h4>
                <p>
                  {activationState === 'expired'
                    ? 'קישור ההפעלה פג תוקף. ניתן להנפיק קישור חדש.'
                    : activationState === 'valid'
                      ? 'קישור ההפעלה עדיין בתוקף. ניתן לחדש אותו במידת הצורך.'
                      : 'ניתן לחדש את קישור ההפעלה לצורך הגדרת סיסמה.'}
                </p>
              </div>
            </div>
            <button type="button" className="patient-sec-renew-btn" onClick={handleRenewActivation} disabled={renewing}>
              <FiRefreshCw className={renewing ? 'patient-sec-spin' : ''} />
              {renewing ? 'מחדש קישור...' : 'חידוש קישור הפעלה'}
            </button>
          </div>
        )}
      </section>
      {/* ===================================================
          PROFILE CREATION DETAILS
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiUserPlus} title="פרטי יצירת התיק" subtitle="מידע על פתיחת תיק המטופל" />
        <div className="patient-sec-details-grid">
          <DetailItem icon={FiUser} label="נוצר על ידי" value={patientProfile?.createdBy?.name || '-'} />
          <DetailItem
            icon={FiShield}
            label="תפקיד היוצר"
            value={patientProfile?.createdBy?.role === 'secretary' ? 'מזכירות' : patientProfile?.createdBy?.role || '-'}
          />
          <DetailItem icon={FiPhone} label="טלפון היוצר" value={<bdi>{patientProfile?.createdBy?.phoneNumber || '-'}</bdi>} />
          <DetailItem icon={FiCalendar} label="תאריך פתיחת התיק" value={formatDateTime(patientProfile?.createdAt)} />
          <DetailItem icon={FiRefreshCw} label="עדכון התיק האחרון" value={formatDateTime(patientProfile?.updatedAt)} />
        </div>
      </section>
      {/* ===================================================
          STATISTICS
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiActivity} title="סטטיסטיקות טיפולים" subtitle="סיכום פעילות המטופל במרפאה" />
        <div className="patient-sec-stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>
      {/* ===================================================
          ACTIVE TREATMENTS
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiActivity} title="טיפולים פעילים" subtitle="טיפולים הנמצאים כעת בתהליך" count={activeTreatments.length} />
        {activeTreatments.length > 0 ? (
          <div className="patient-sec-treatment-list">
            {activeTreatments.map((treatment) => (
              <TreatmentCard key={treatment._id} treatment={treatment} />
            ))}
          </div>
        ) : (
          <div className="patient-sec-empty">אין טיפולים פעילים</div>
        )}
      </section>
      {/* ===================================================
          PREVIOUS TREATMENTS
      =================================================== */}
      <section className="patient-sec-panel">
        <SectionHeader icon={FiCheckCircle} title="היסטוריית טיפולים" subtitle="טיפולים שהושלמו, בוטלו או נדחו" count={previousTreatments.length} />
        {previousTreatments.length > 0 ? (
          <div className="patient-sec-treatment-list">
            {previousTreatments.map((treatment) => (
              <TreatmentCard key={treatment._id} treatment={treatment} />
            ))}
          </div>
        ) : (
          <div className="patient-sec-empty">אין טיפולים קודמים</div>
        )}
      </section>
    </div>
  );
};
export default PatientModalSecretary;
