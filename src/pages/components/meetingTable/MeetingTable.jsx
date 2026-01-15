import { useLocation, useNavigate } from 'react-router-dom';
import './meetingTable.css';
const MeetingTable = ({ moreBtn, headerTextTable, filterSearch }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMeetingsManagement = pathname.endsWith('/meetingsManagement');
  const appointmentsTable = [
    {
      _id: '1',
      initials: 'AC',
      patientName: 'אמנדה קלארק',
      patientPhone: '052-999-2525',
      serviceName: 'ניקוי שיניים',
      requestDateText: '15 בדצמבר, 14:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'pending',
    },
    {
      _id: '2',
      initials: 'JM',
      patientName: "ג'יימס מיטשל",
      patientPhone: '052-999-2527',
      serviceName: 'טיפול שורש',
      requestDateText: '16 בדצמבר, 10:00',
      doctorName: `ד"ר סמית`,
      status: 'confirmed',
    },
    {
      _id: '3',
      initials: 'LT',
      patientName: 'ליזה תומפסון',
      patientPhone: '052-924-5549',
      serviceName: 'ייעוץ',
      requestDateText: '14 בדצמבר, 15:30',
      doctorName: `ד"ר דיוויס`,
      status: 'pending',
    },
    {
      _id: '4',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
    {
      _id: '5',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
    {
      _id: '6',
      initials: 'AC',
      patientName: 'אמנדה קלארק',
      patientPhone: '052-999-2525',
      serviceName: 'ניקוי שיניים',
      requestDateText: '15 בדצמבר, 14:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'pending',
    },
    {
      _id: '7',
      initials: 'JM',
      patientName: "ג'יימס מיטשל",
      patientPhone: '052-999-2527',
      serviceName: 'טיפול שורש',
      requestDateText: '16 בדצמבר, 10:00',
      doctorName: `ד"ר סמית`,
      status: 'confirmed',
    },
    {
      _id: '8',
      initials: 'LT',
      patientName: 'ליזה תומפסון',
      patientPhone: '052-924-5549',
      serviceName: 'ייעוץ',
      requestDateText: '14 בדצמבר, 15:30',
      doctorName: `ד"ר דיוויס`,
      status: 'pending',
    },
    {
      _id: '9',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
    {
      _id: '10',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
    {
      _id: '11',
      initials: 'LT',
      patientName: 'ליזה תומפסון',
      patientPhone: '052-924-5549',
      serviceName: 'ייעוץ',
      requestDateText: '14 בדצמבר, 15:30',
      doctorName: `ד"ר דיוויס`,
      status: 'pending',
    },
    {
      _id: '12',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
    {
      _id: '13',
      initials: 'RK',
      patientName: 'רוברט קים',
      patientPhone: '052-921-4884',
      serviceName: 'הלבנת שיניים',
      requestDateText: '18 בדצמבר, 11:00',
      doctorName: `ד"ר ג'ונסון`,
      status: 'rejected',
    },
  ];

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
        {filterSearch && (
          <div style={{ height: '478px', gap: 8.5 }}>
            <div style={{ gap: 16 }}>
              <input />
              <div></div>
            </div>
          </div>
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
        {appointmentsTable.map((item) => {
          const st = badgeStyle(item.status);

          return (
            <div className="appt-row" key={item._id}>
              {/* patient */}
              <div className="appt-patient">
                <div className="appt-patient-avatar">
                  {item.initials || 'AA'}
                </div>

                <div className="appt-patient-info">
                  <span className="appt-patient-name">{item.patientName}</span>
                  <span className="appt-patient-phone">
                    {item.patientPhone}
                  </span>
                </div>
              </div>

              {/* service */}
              <div className="appt-cell">{item.serviceName}</div>

              {/* date */}
              <div className="appt-cell">{item.requestDateText}</div>

              {/* doctor */}
              <div className="appt-cell">{item.doctorName}</div>

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
