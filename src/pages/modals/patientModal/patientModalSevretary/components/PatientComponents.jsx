import { useState } from 'react';
import { FiHeart, FiCalendar, FiClock, FiUser, FiChevronUp, FiChevronDown } from 'react-icons/fi';
// استورد الدوال والثوابت من ملف مستقل
import { STATUS_CLASSES, STATUS_LABELS, formatDate, formatPrice } from '../../../../../components/helpers/patientHelpers';
// =========================================================
// REUSABLE COMPONENTS
// =========================================================
export const SectionHeader = ({ icon: Icon, title, subtitle, count }) => (
  <div className="patient-sec-section-header">
    <div className="patient-sec-section-heading">
      <div className="patient-sec-section-icon">
        <Icon size={19} />
      </div>
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
    {count !== undefined && <span className="patient-sec-section-count">{count}</span>}
  </div>
);
export const DetailItem = ({ icon: Icon, label, value, full = false }) => (
  <div className={`patient-sec-detail-item ${full ? 'patient-sec-detail-item--full' : ''}`}>
    <div className="patient-sec-detail-label">
      {Icon && <Icon size={15} />}
      <span>{label}</span>
    </div>
    <strong>{value ?? '-'}</strong>
  </div>
);
export const StatCard = ({ icon: Icon, label, value, tone = 'default' }) => (
  <div className={`patient-sec-stat-card tone-${tone}`}>
    <div className="patient-sec-stat-icon">
      <Icon size={20} />
    </div>
    <div className="patient-sec-stat-content">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  </div>
);
export const StatusBadge = ({ status }) => (
  <span className={`patient-sec-status-badge ${STATUS_CLASSES[status] || 'default'}`}>
    <span className="patient-sec-status-dot" />
    {STATUS_LABELS[status] || status || '-'}
  </span>
);
// =========================================================
// TREATMENT CARD
// =========================================================
export const TreatmentCard = ({ treatment }) => {
  const [expanded, setExpanded] = useState(false);
  const sessions = Array.isArray(treatment.sessions) ? treatment.sessions : [];
  const total = treatment.totalSessions ?? 0;
  const completed = treatment.completedSessions ?? 0;
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <article className="patient-sec-treatment-card">
      <div className="patient-sec-treatment-header">
        <div className="patient-sec-treatment-service">
          <div className="patient-sec-treatment-image">
            {treatment.service?.photo ? <img src={treatment.service.photo} alt={treatment.service?.itemName || 'טיפול'} /> : <FiHeart size={23} />}
          </div>
          <div className="patient-sec-treatment-name">
            <h4>{treatment.service?.itemName || 'טיפול'}</h4>
            <span>{treatment.service?.groupTitle || 'ללא קטגוריה'}</span>
          </div>
        </div>
        <StatusBadge status={treatment.status} />
      </div>
      {treatment.service?.description && <p className="patient-sec-treatment-description">{treatment.service.description}</p>}
      <div className="patient-sec-treatment-metrics">
        <div>
          <span>מחיר הטיפול</span>
          <strong>{formatPrice(treatment.service?.price)}</strong>
        </div>
        <div>
          <span>משך מפגש</span>
          <strong>{treatment.service?.durationMin != null ? `${treatment.service.durationMin} דקות` : '-'}</strong>
        </div>
        <div>
          <span>סה״כ מפגשים</span>
          <strong>{total}</strong>
        </div>
        <div>
          <span>מפגשים שנותרו</span>
          <strong>{treatment.remainingSessions ?? 0}</strong>
        </div>
      </div>
      <div className="patient-sec-progress">
        <div className="patient-sec-progress-heading">
          <span>התקדמות הטיפול</span>
          <strong>
            {completed} מתוך {total} מפגשים
          </strong>
        </div>
        <div
          className="patient-sec-progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="התקדמות הטיפול"
        >
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button type="button" className="patient-sec-sessions-toggle" onClick={() => setExpanded((prev) => !prev)} aria-expanded={expanded}>
        <span>
          <FiCalendar size={17} />
          פרטי מפגשים ({sessions.length})
        </span>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {expanded && (
        <div className="patient-sec-sessions-list">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div className="patient-sec-session-row" key={session._id}>
                <div className="patient-sec-session-main">
                  <div className="patient-sec-session-date">
                    <FiCalendar size={15} />
                    <strong>{formatDate(session.date)}</strong>
                    <span>•</span>
                    <FiClock size={15} />
                    <strong>{session.time || '-'}</strong>
                  </div>
                  <div className="patient-sec-session-doctor">
                    <FiUser size={14} />
                    <span>ד״ר {session.doctor?.name || '-'}</span>
                    {session.doctor?.phoneNumber && <span>• {session.doctor.phoneNumber}</span>}
                  </div>
                  {session.note && <p className="patient-sec-session-note">{session.note}</p>}
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))
          ) : (
            <div className="patient-sec-empty-small">אין מפגשים להצגה</div>
          )}
        </div>
      )}
    </article>
  );
};
