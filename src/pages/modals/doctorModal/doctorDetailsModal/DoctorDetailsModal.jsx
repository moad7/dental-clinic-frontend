import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  FiCalendar,
  FiClock,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import './doctorDetailsModal.css';
import DoctorEditDetails from './doctorEditDetails/DoctorEditDetails';
import { AppDataContext } from '../../../../context/AppDataContext';
import { AuthContext } from '../../../../context/AuthContext';
import { renewActivationLink } from '../../../../api/secretaryApi';
import { toast } from 'react-toastify';
import { showErrorToast } from '../../../../utils/errorMessages';
const DAY_NAMES = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
};
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
const getInitials = (name = '') => {
  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
  return initials || 'DR';
};
const DoctorDetailsModal = ({ open, setOpen, doctor }) => {
  const { token } = useContext(AuthContext);
  const { loadAllDoctors } = useContext(AppDataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [renewingActivation, setRenewingActivation] = useState(false);
  const [activationExpires, setActivationExpires] = useState(doctor?.activationTokenExpires ?? null);
  const doctorProfile = doctor || {};
  const services = useMemo(() => {
    return Array.isArray(doctorProfile?.doctor?.services) ? doctorProfile.doctor.services : [];
  }, [doctorProfile?.doctor?.services]);
  const workingHours = useMemo(() => {
    return Array.isArray(doctorProfile?.doctor?.workingHours) ? doctorProfile.doctor.workingHours : [];
  }, [doctorProfile?.doctor?.workingHours]);
  useEffect(() => {
    setActivationExpires(doctor?.activationTokenExpires ?? null);
  }, [doctor?._id, doctor?.activationTokenExpires]);
  const handleEditSuccess = async () => {
    try {
      await loadAllDoctors();
    } catch (error) {
      console.error('Failed to refresh doctors:', error);
    } finally {
      setIsEditing(false);
    }
  };
  const activationExpired = activationExpires && new Date(activationExpires).getTime() <= Date.now();
  const handleRenewActivation = async () => {
    if (!doctorProfile?._id || renewingActivation) return;
    try {
      setRenewingActivation(true);
      const response = await renewActivationLink(doctorProfile._id, token);
      const newExpires = response?.activationTokenExpires;
      if (newExpires) {
        setActivationExpires(newExpires);
      }
      loadAllDoctors?.();
      toast.success('קישור ההפעלה חודש בהצלחה');
    } catch (error) {
      console.error('Renew activation error:', error);
      showErrorToast(error || 'אירעה שגיאה בחידוש קישור ההפעלה');
    } finally {
      setRenewingActivation(false);
    }
  };
  return (
    <>
      {isEditing ? (
        <DoctorEditDetails doctor={doctorProfile} onCancel={() => setIsEditing(false)} onSuccess={handleEditSuccess} />
      ) : (
        <div className="doctor-details" dir="rtl">
          {/* Header */}
          <div className="doctor-details__hero">
            <div className="doctor-details__identity">
              <div className="doctor-details__avatar">
                {doctorProfile.avatar ? <img src={doctorProfile.avatar} alt={doctorProfile.name} /> : <span>{getInitials(doctorProfile.name)}</span>}
              </div>
              <div className="doctor-details__identity-info">
                <div className="doctor-details__name-row">
                  <h2>ד"ר {doctorProfile.name || '-'}</h2>
                  <span
                    className={`doctor-details__status ${
                      doctorProfile.isActive ? 'doctor-details__status--active' : 'doctor-details__status--inactive'
                    }`}
                  >
                    {doctorProfile.isActive ? (
                      <>
                        <FiCheckCircle />
                        פעיל
                      </>
                    ) : (
                      <>
                        <FiXCircle />
                        לא פעיל
                      </>
                    )}
                  </span>
                </div>
                <span className="doctor-details__role">רופא</span>
                <div className="doctor-details__contact-inline">
                  <span>
                    <FiPhone />
                    {doctorProfile.phoneNumber || '-'}
                  </span>
                  <span>
                    <FiMail />
                    {doctorProfile.email || '-'}
                  </span>
                </div>
              </div>
            </div>
            <div className="doctor-details__experience">
              <span>ותק מקצועי</span>
              <strong>{doctorProfile.doctor?.yearsOfExperience ?? 0}</strong>
              <small>שנים</small>
            </div>
            <button
              type="button"
              className="doctor-details__edit-button"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <FiEdit2 />
              עריכת פרטים
            </button>
          </div>
          <div className="doctor-details__grid">
            {/* Personal Information */}
            <section className="doctor-details__card">
              <div className="doctor-details__section-title">
                <div className="doctor-details__section-icon">
                  <FiUser />
                </div>
                <div>
                  <h3>פרטים אישיים</h3>
                  <p>מידע בסיסי על הרופא</p>
                </div>
              </div>
              <div className="doctor-details__info-list">
                <InfoRow label="שם מלא" value={doctorProfile.name} />
                <InfoRow label="מספר זהות" value={doctorProfile.idNumber} />
                <InfoRow label="מין" value={doctorProfile.gender === 'female' ? 'נקבה' : doctorProfile.gender === 'male' ? 'זכר' : '-'} />
                <InfoRow label="עיר" value={doctorProfile.city || '-'} />
                <InfoRow label="תאריך לידה" value={formatDate(doctorProfile.birth)} />
                <InfoRow label="טלפון" value={doctorProfile.phoneNumber} />
                <InfoRow label="אימייל" value={doctorProfile.email} />
              </div>
            </section>
            {/* Professional Information */}
            <section className="doctor-details__card">
              <div className="doctor-details__section-title">
                <div className="doctor-details__section-icon">
                  <FiBriefcase />
                </div>
                <div>
                  <h3>פרטים מקצועיים</h3>
                  <p>ניסיון ותחומי טיפול</p>
                </div>
              </div>
              <div className="doctor-details__experience-box">
                <div>
                  <span>שנות ניסיון</span>
                  <strong>{doctorProfile.doctor?.yearsOfExperience ?? 0}</strong>
                </div>
                <FiBriefcase />
              </div>
              <div className="doctor-details__subsection">
                <span className="doctor-details__label">תחומי טיפול</span>
                {services.length > 0 ? (
                  <div className="doctor-details__services">
                    {services.map((service, index) => {
                      const group = service?.groupId;
                      return (
                        <div className="doctor-details__service" key={group?._id || `service-${index}`}>
                          <span className="doctor-details__service-dot" />
                          <span>{group?.title || '-'}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="doctor-details__empty">לא הוגדרו תחומי טיפול</div>
                )}
              </div>
            </section>
            {/* Bio */}
            <section className="doctor-details__card doctor-details__card--full">
              <div className="doctor-details__section-title">
                <div className="doctor-details__section-icon">
                  <FiUser />
                </div>
                <div>
                  <h3>אודות הרופא</h3>
                  <p>תיאור וניסיון מקצועי</p>
                </div>
              </div>
              <div className="doctor-details__bio">{doctorProfile.doctor?.bio?.trim() ? doctorProfile.doctor.bio : 'לא נוסף תיאור עבור הרופא'}</div>
            </section>
            {/* Working Hours */}
            <section className="doctor-details__card doctor-details__card--full">
              <div className="doctor-details__section-title">
                <div className="doctor-details__section-icon">
                  <FiCalendar />
                </div>
                <div>
                  <h3>שעות פעילות</h3>
                  <p>ימי ושעות העבודה של הרופא</p>
                </div>
              </div>
              <div className="doctor-details__schedule">
                {workingHours.map((item) => (
                  <div key={item.day} className={`doctor-details__day ${item.isClosed ? 'doctor-details__day--closed' : ''}`}>
                    <div className="doctor-details__day-name">
                      <strong>{DAY_NAMES[item.day] || item.day}</strong>
                      {item.isClosed ? (
                        <span className="doctor-details__closed-badge">סגור</span>
                      ) : (
                        <span className="doctor-details__open-badge">פתוח</span>
                      )}
                    </div>
                    <div className="doctor-details__day-hours">
                      <FiClock />
                      {item.isClosed ? (
                        <span>לא עובד</span>
                      ) : (
                        <span>
                          {item.start} - {item.end}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* Account */}
            <section className="doctor-details__card doctor-details__card--full">
              <div className="doctor-details__section-title">
                <div className="doctor-details__section-icon">
                  <FiCheckCircle />
                </div>
                <div>
                  <h3>פרטי חשבון</h3>
                  <p>מידע על מצב החשבון והפעלת המשתמש במערכת</p>
                </div>
              </div>
              <div className="doctor-details__account-grid">
                <InfoBox label="מצב חשבון" value={doctorProfile.isActive ? 'פעיל' : 'לא פעיל'} success={doctorProfile.isActive} />
                <InfoBox
                  label="הגדרת סיסמה"
                  value={doctorProfile.mustSetPassword ? 'נדרש להגדיר סיסמה' : 'הסיסמה הוגדרה'}
                  success={!doctorProfile.mustSetPassword}
                />
                <InfoBox label="תאריך הצטרפות" value={formatDate(doctorProfile.createdAt)} />
                <InfoBox label="עדכון אחרון" value={formatDate(doctorProfile.updatedAt)} />
              </div>
              {/* ACTIVATION LINK MANAGEMENT */}
              {doctorProfile.mustSetPassword && (
                <div className="doctor-details__activation">
                  <div className="doctor-details__activation-content">
                    <div className={`doctor-details__activation-icon ${activationExpired ? 'doctor-details__activation-icon--expired' : ''}`}>
                      {activationExpired ? <FiAlertCircle size={22} /> : <FiClock size={22} />}
                    </div>
                    <div className="doctor-details__activation-text">
                      <h4>ניהול קישור הפעלה</h4>
                      <p>
                        {activationExpired
                          ? 'קישור ההפעלה פג תוקף. ניתן לחדש את הקישור כדי לאפשר לרופא להגדיר סיסמה.'
                          : activationExpires
                            ? 'קישור ההפעלה עדיין בתוקף. ניתן להנפיק קישור חדש במידת הצורך.'
                            : 'טרם הוגדר תוקף לקישור ההפעלה. ניתן לבקש קישור חדש.'}
                      </p>
                      {activationExpires && (
                        <span className="doctor-details__activation-expiry">
                          <FiClock size={14} />
                          תוקף: {formatDate(activationExpires)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="doctor-details__renew-btn"
                    onClick={handleRenewActivation}
                    disabled={renewingActivation || !doctorProfile._id}
                  >
                    <FiRefreshCw size={17} className={renewingActivation ? 'doctor-details__renew-icon--spinning' : ''} />
                    {renewingActivation ? 'מחדש קישור...' : 'חידוש קישור הפעלה'}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};
const InfoRow = ({ label, value }) => {
  return (
    <div className="doctor-details__info-row">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
};
const InfoBox = ({ label, value, success }) => {
  return (
    <div className="doctor-details__info-box">
      <span>{label}</span>
      <strong className={success === true ? 'doctor-details__info-box-value--success' : ''}>{value || '-'}</strong>
    </div>
  );
};
export default DoctorDetailsModal;
