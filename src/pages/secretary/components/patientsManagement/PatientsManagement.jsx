import './patientsManagement.css';
import BoxHeader from '../../../components/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryPatientsStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus, FiSearch } from 'react-icons/fi';
const PatientsManagement = () => {
  const patients = [
    {
      _id: 'P001251',
      name: "אמילי צ'ן",
      initials: 'אצ',
      phone: '+1 (555) 123-4567',
      email: 'emily.chen@email.com',
      lastVisit: '2024-12-08',
      nextAppointment: {
        dateTime: '2024-12-15T09:00:00',
        treatment: 'Routine Cleaning',
      },
    },
    {
      _id: 'P001251',
      name: 'מרקוס רודריגז',
      initials: 'מר',
      phone: '+1 (555) 234-5678',
      email: 'marcus.r@email.com',
      lastVisit: '2024-11-28',
      nextAppointment: {
        dateTime: '2024-12-16T10:30:00',
        treatment: 'Root Canal',
      },
    },
    {
      _id: 'P001251',
      name: 'שרה ויליאמס',
      initials: 'שו',
      phone: '+1 (555) 345-6789',
      email: 'sarah.w@email.com',
      lastVisit: '2024-12-05',
      nextAppointment: {
        dateTime: '2024-12-18T14:00:00',
        treatment: 'Consultation',
      },
    },
    {
      _id: 'P001251',
      name: "ג'יימס דייוויס",
      initials: 'גד',
      phone: '+1 (555) 456-7890',
      email: 'james.davis@email.com',
      lastVisit: '2024-10-15',
      nextAppointment: null,
    },
    {
      _id: 'P001251',
      name: 'אמנדה מילר',
      initials: 'אמ',
      phone: '+1 (555) 567-8901',
      email: 'amanda.m@email.com',
      lastVisit: '2024-12-10',
      nextAppointment: {
        dateTime: '2024-12-20T11:00:00',
        treatment: 'Teeth Whitening',
      },
    },
    {
      _id: 'P001252',
      name: "ג'ון דו",
      initials: 'גד',
      phone: '+1 (555) 678-9012',
      email: 'john.d@email.com',
      lastVisit: '2025-01-05',
      nextAppointment: {
        dateTime: '2025-01-15T14:00:00',
        treatment: 'Dental Cleaning',
      },
    },
    {
      _id: 'P001253',
      name: "ג'יין סמית",
      initials: 'גש',
      phone: '+1 (555) 789-0123',
      email: 'jane.s@email.com',
      lastVisit: '2025-02-02',
      nextAppointment: {
        dateTime: '2025-02-12T15:30:00',
        treatment: 'Root Canal',
      },
    },
    {
      _id: 'P001254',
      name: "מייק ג'ונסון",
      initials: 'מג',
      phone: '+1 (555) 890-1234',
      email: 'mike.j@email.com',
      lastVisit: '2025-03-01',
      nextAppointment: {
        dateTime: '2025-03-08T10:00:00',
        treatment: 'Crown Installation',
      },
    },
    {
      _id: 'P001255',
      name: 'לוסי ויליאמס',
      initials: 'לו',
      phone: '+1 (555) 901-2345',
      email: 'lucy.w@email.com',
      lastVisit: '2025-04-10',
      nextAppointment: {
        dateTime: '2025-04-20T13:00:00',
        treatment: 'Orthodontic Consultation',
      },
    },
    {
      _id: 'P001256',
      name: 'רוברט טיילור',
      initials: 'רט',
      phone: '+1 (555) 012-3456',
      email: 'robert.t@email.com',
      lastVisit: '2025-05-05',
      nextAppointment: {
        dateTime: '2025-05-15T16:00:00',
        treatment: 'Gum Treatment',
      },
    },
  ];

  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'ניהול מטופלים'}
        subtitle={'ניהול וצפייה בכל רישומי המטופלים'}
        actionIcon={<FiPlus size={20} />}
        actionLabel={'הוסף מטופל חדש'}
      />
      <DashboardStats items={secretaryPatientsStats} />
      <div className="container-box">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span
            style={{ fontSize: '20px', fontWeight: 700, lineHeight: '28px' }}
          >
            רישומי מטופלים
          </span>
          <div className="toolbar">
            <div className="toolbar__left">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="למצוא את המטופל..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="patients-table-header">
          <div>המטופל</div>
          <div>צור קשר</div>
          <div>ביקור אחרון</div>
          <div>הפגישה הבאה</div>

          <div>נהלים</div>
        </div>
        <div>
          {patients.map((item) => (
            <div className="patients-table-row">
              <div className="appt-patient">
                <div className="appt-patient-avatar">
                  {item.initials || 'AA'}
                </div>

                <div className="appt-patient-info">
                  <span className="appt-patient-name">{item.name}</span>
                  <span className="appt-patient-id">מזהה: #{item._id}</span>
                </div>
              </div>
              <div className="appt-patient-contacts">
                <span className="appt-patient-phone">{item.phone}</span>
                <span className="appt-patient-email">{item.email}</span>
              </div>
              <div className="appt-last-visit ">{item.lastVisit}</div>
              <div className="appt-patient-next-visit">
                {item.nextAppointment ? (
                  <>
                    <span className="appt-patient-date-time">
                      {item.nextAppointment.dateTime}
                    </span>
                    <span className="appt-patient-treatment">
                      {item.nextAppointment.treatment}
                    </span>
                  </>
                ) : (
                  <span className="appt-patient-no-time">
                    אין תאריכים קרובים
                  </span>
                )}
              </div>
              <div className="appt-patient-procedures">
                <button
                  className="appt-patient-procedures-btn"
                  type="button"
                  style={{
                    color: '#EA580C',
                  }}
                >
                  תזמון
                </button>
                <button
                  className="appt-patient-procedures-btn"
                  type="button"
                  style={{
                    color: '#4B5563',
                  }}
                >
                  עריכה
                </button>
                <button
                  className="appt-patient-procedures-btn"
                  type="button"
                  style={{
                    color: '#2E90FA',
                  }}
                >
                  הצג
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsManagement;
