import React, { useMemo, useState } from 'react';
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
} from 'react-icons/fi';
import './doctorDetailsModal.css';
import DoctorEditDetails from './doctorEditDetails/DoctorEditDetails';
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
  const [isEditing, setIsEditing] = useState(false);

  const doctorProfile = doctor || {};
  const services = useMemo(() => {
    return Array.isArray(doctorProfile?.doctor?.services)
      ? doctorProfile.doctor.services
      : [];
  }, [doctorProfile?.doctor?.services]);
  const workingHours = useMemo(() => {
    return Array.isArray(doctorProfile?.doctor?.workingHours)
      ? doctorProfile.doctor.workingHours
      : [];
  }, [doctorProfile?.doctor?.workingHours]);

  const handleClose = () => {
    setIsEditing(false);
    setOpen(false);
  };
  if (!doctorProfile?._id) {
    return null;
  }

  return (
    <>
      {isEditing ? (
        <DoctorEditDetails
          doctor={doctorProfile}
          onCancel={() => {
            setIsEditing(false);
          }}
          onSuccess={() => {
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="doctor-details" dir="rtl">
          {/* Header */}
          <div className="doctor-details__hero">
            <div className="doctor-details__identity">
              <div className="doctor-details__avatar">
                {doctorProfile.avatar ? (
                  <img src={doctorProfile.avatar} alt={doctorProfile.name} />
                ) : (
                  <span>{getInitials(doctorProfile.name)}</span>
                )}
              </div>

              <div className="doctor-details__identity-info">
                <div className="doctor-details__name-row">
                  <h2>ד"ר {doctorProfile.name || '-'}</h2>

                  <span
                    className={`doctor-details__status ${
                      doctorProfile.isActive
                        ? 'doctor-details__status--active'
                        : 'doctor-details__status--inactive'
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

                <InfoRow
                  label="מין"
                  value={
                    doctorProfile.gender === 'female'
                      ? 'נקבה'
                      : doctorProfile.gender === 'male'
                        ? 'זכר'
                        : '-'
                  }
                />

                <InfoRow
                  label="תאריך לידה"
                  value={formatDate(doctorProfile.birth)}
                />

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

                  <strong>
                    {doctorProfile.doctor?.yearsOfExperience ?? 0}
                  </strong>
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
                        <div
                          className="doctor-details__service"
                          key={group?._id || `service-${index}`}
                        >
                          <span className="doctor-details__service-dot" />

                          <span>{group?.title || '-'}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="doctor-details__empty">
                    לא הוגדרו תחומי טיפול
                  </div>
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

              <div className="doctor-details__bio">
                {doctorProfile.doctor?.bio?.trim()
                  ? doctorProfile.doctor.bio
                  : 'לא נוסף תיאור עבור הרופא'}
              </div>
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
                  <div
                    key={item.day}
                    className={`doctor-details__day ${
                      item.isClosed ? 'doctor-details__day--closed' : ''
                    }`}
                  >
                    <div className="doctor-details__day-name">
                      <strong>{DAY_NAMES[item.day] || item.day}</strong>

                      {item.isClosed ? (
                        <span className="doctor-details__closed-badge">
                          סגור
                        </span>
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
                  <p>מידע על מצב החשבון במערכת</p>
                </div>
              </div>

              <div className="doctor-details__account-grid">
                <InfoBox
                  label="מצב חשבון"
                  value={doctorProfile.isActive ? 'פעיל' : 'לא פעיל'}
                  success={doctorProfile.isActive}
                />

                <InfoBox
                  label="הגדרת סיסמה"
                  value={
                    doctorProfile.mustSetPassword
                      ? 'נדרש להגדיר סיסמה'
                      : 'הסיסמה הוגדרה'
                  }
                  success={!doctorProfile.mustSetPassword}
                />

                <InfoBox
                  label="תאריך הצטרפות"
                  value={formatDate(doctorProfile.createdAt)}
                />

                <InfoBox
                  label="עדכון אחרון"
                  value={formatDate(doctorProfile.updatedAt)}
                />
              </div>
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

      <strong
        className={
          success === true ? 'doctor-details__info-box-value--success' : ''
        }
      >
        {value || '-'}
      </strong>
    </div>
  );
};

export default DoctorDetailsModal;
