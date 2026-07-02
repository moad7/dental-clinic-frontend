import { useLocation, useNavigate } from 'react-router-dom';
import './meetingTable.css';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdOutlineFilterList } from 'react-icons/md';
import { LuSettings2 } from 'react-icons/lu';
import { RiDownloadCloud2Line } from 'react-icons/ri';
import { useContext } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import { formatAppointmentDate } from '../../../utils/functions';
const MeetingTable = ({ moreBtn, headerTextTable }) => {
  const { appointments } = useContext(AppDataContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMeetingsManagement = pathname.endsWith('/meetingsManagement');

  const PillButton = ({ children, bg, color, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="pill-button"
      style={{
        background: bg,
        color,
      }}
    >
      {children}
    </button>
  );
  const badgeStyle = (type) => {
    const map = {
      confirmed: { bg: '#DCFCE7', color: '#166534', text: 'אושר' },
      pending: { bg: '#FFEDD5', color: '#9A3412', text: 'תליה' },
      rejected: { bg: '#FEE2E2', color: '#991B1B', text: 'נדחה' },
    };
    return map[type] || map.pending;
  };
  return (
    <div
      className="container-box appt-card"
      style={{ height: isMeetingsManagement ? '922px' : '428px' }}
    >
      <div className="appt-card-top">
        <span className="appt-card-title">{headerTextTable}</span>

        {moreBtn && (
          <button
            type="button"
            className="appt-card-btn-outline"
            onClick={() => {
              navigate('../secretary/meetingsManagement');
            }}
          >
            הצג הכל
          </button>
        )}
      </div>
      {/* Header */}
      <div className="appt-table-header">
        <div>המטופל</div>
        <div>שירות</div>
        <div>תאריך הזמנה</div>
        <div>רופא</div>
        <div>המצב</div>
        <div>נהלים</div>
      </div>

      {/* Rows */}
      <div
        className={
          isMeetingsManagement
            ? 'appt-table-body-meetings-management'
            : 'appt-table-body'
        }
      >
        {appointments.slice(0, 5).map((item) => {
          const st = badgeStyle(item.status);
          return (
            <div className="appt-row" key={item._id}>
              {/* patient */}
              <div className="appt-patient">
                <div className="appt-patient-avatar">
                  {item.treatmentId.userId.name
                    ?.split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('') || 'AA'}
                </div>

                <div className="appt-patient-info">
                  <span className="appt-patient-name">
                    {item.treatmentId.userId.name}
                  </span>
                  <span className="appt-patient-phone">
                    {item.treatmentId.userId.phoneNumber}
                  </span>
                </div>
              </div>

              {/* service */}
              <div className="appt-cell">
                {item.treatmentId.serviceItemId.name}
              </div>

              {/* date */}
              <div className="appt-cell">
                {formatAppointmentDate(item.date, item.time)}
              </div>

              {/* doctor */}
              <div className="appt-cell">{item.doctorId.name}</div>

              {/* status */}
              <div>
                <span
                  className="appt-badge"
                  style={{
                    '--bg': st.bg,
                    '--color': st.color,
                  }}
                >
                  {st.text}
                </span>
              </div>

              {/* actions */}
              <div className="appt-actions">
                {item.status === 'pending' ? (
                  <>
                    <PillButton bg="#DCFCE7" color="#166534" onClick={() => {}}>
                      הסכמה
                    </PillButton>
                    <PillButton bg="#FEE2E2" color="#991B1B" onClick={() => {}}>
                      נדחה
                    </PillButton>
                  </>
                ) : (
                  <button
                    className="appt-link"
                    type="button"
                    onClick={() => {}}
                  >
                    הצג פרטים
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingTable;
