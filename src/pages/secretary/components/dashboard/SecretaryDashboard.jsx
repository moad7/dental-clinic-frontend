import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../secretary.css';
import './secretaryDashboard.css';
import { MdArrowBack, MdOutlinePeopleAlt } from 'react-icons/md';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRegCalendarCheck, FaRegClock } from 'react-icons/fa';
import { BellRing } from 'lucide-react';
import { RiUserAddLine } from 'react-icons/ri';
import { TbMessageCircle } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';

const SecretaryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const token = localStorage.getItem('token');
  const arryDash = [
    {
      _id: 1,
      title: 'סך החולים',
      body: '1,247 חולים',
      icon: <MdOutlinePeopleAlt size={20} />,
      color: '#6155F5',
      backgroundColor: '#6155F514',
      date: 'מאז 9 ביולי 2025',
    },
    {
      _id: 2,
      title: 'רופאים פעילים',
      body: '8 רופאים',
      icon: <FaUserDoctor size={20} />,
      color: '#11D057',
      backgroundColor: '#EFFCF4',

      date: 'מאז 22 באוקטובר 2025',
    },
    {
      _id: 3,
      title: 'בקשות חדשות',
      body: '15 בקשות',
      icon: <FaRegClock size={20} />,
      color: '#EA580C',
      backgroundColor: '#FFEDD5',
      date: 'מאז 15 בדצמבר 2025',
    },
    {
      _id: 4,
      title: 'הזמנות היום',
      body: '24 הזמנות',
      icon: <FaRegCalendarCheck size={20} />,
      color: '#0088FF',
      backgroundColor: '#EAF4FF',

      date: 'מאז 9 ביולי 2025',
    },
  ];
  const isConfirmed = (item) => {
    return item.status === 'confirmed';
  };

  const tableToday = [
    {
      _id: 1,
      timingName: '9:00 בבוקר - אחמד מוחסן',
      categoryDoctor: 'ניקיון קבוע • ד"ר גונסון',
      status: 'confirmed',
    },
    {
      _id: 2,
      timingName: '10:30 בבוקר - מגיד איברהים',
      categoryDoctor: 'טיפול שורש • ד"ר צן',
      status: 'onHold',
    },
    {
      _id: 3,
      timingName: '14:00 - שרה דיב',
      categoryDoctor: 'ייעוץ • ד"ר דיוויס',
      status: 'confirmed',
    },
  ];

  const fastManagement = [
    {
      _id: 1,
      mangName: 'קבע פגישה חדשה',
      icon: <AiOutlinePlus />,
      iconColor: '#FFFFFF',
      backColor: '#2E90FA',
      navigat: '',
    },
    {
      _id: 2,
      mangName: 'רישום מטופל חדש',
      icon: <RiUserAddLine />,
      iconColor: '#16A34A',
      backColor: '#DCFCE7',
      navigat: '',
    },
    {
      _id: 3,
      mangName: 'שלח הודעה לרופא',
      icon: <TbMessageCircle />,
      iconColor: '#2563EB',
      backColor: '#DBEAFE',
      navigat: '',
    },
  ];
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
  ];

  const PillButton = ({ children, bg, color, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: '0',
        borderRadius: 8,
        padding: '8px 14px',
        background: bg,
        color,
        fontSize: 15,
        lineHeight: '17px',
        fontWeight: 500,
        cursor: 'pointer',
        minWidth: 74,
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
    <div className="main-container" dir="rtl">
      <div className="container-box header-box">
        <span className="greeting-title">בוקר טוב, מואד!</span>
        <span className="greeting-subtitle">
          הנה סקירה כללית של ההזמנות שלך היום.
        </span>
      </div>

      <div className="dashboard-cards">
        {arryDash.map((item) => (
          <div key={item._id} className="container-box dashboard-card">
            <span className="card-title">{item.title}</span>

            <div className="card-body">
              <div
                className="card-icon"
                style={{ backgroundColor: item.backgroundColor }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>

              <span className="card-value">{item.body}</span>
            </div>

            <span className="card-date">{item.date}</span>
          </div>
        ))}
      </div>
      <div className="container-box nivg-order">
        <div className="nivg-order-header">
          <span className="nivg-order-title">בקשות אישור ממתינות</span>
          <span className="nivg-order-badge">15 ממתינים</span>
        </div>

        <div className="nivg-order-content">
          <div className="nivg-order-left">
            <div className="nivg-order-iconBox">
              <BellRing size={27} />
            </div>

            <div className="nivg-order-texts">
              <span className="nivg-order-mainText">
                בקשות לפגישות דורשות את תשומת לבך
              </span>
              <span className="nivg-order-subText">
                סקירה ואישור של הזמנות חדשות
              </span>
              <span className="nivg-order-metaText">
                הזמנה אחרונה: לפני 15 דקות
              </span>
            </div>
          </div>

          <div className="nivg-order-right">
            <button className="nivg-order-btn">בקשות סקירה</button>
          </div>
        </div>
      </div>

      <div className="today-layout">
        <div className="container-box today-card">
          <div className="today-card-header">
            <span className="today-card-title">לוח הזמנים של היום</span>
            <span className="today-card-date">15 בדצמבר, 2025</span>
          </div>

          <div className="today-card-list">
            {tableToday.map((item) => {
              const confirmed = isConfirmed(item);

              return (
                <div className="today-item" key={item.id}>
                  <div className="today-item-right">
                    <span
                      className={`today-item-indicator ${
                        confirmed ? 'is-confirmed' : 'is-pending'
                      }`}
                    />
                    <div className="today-item-info">
                      <span>{item.categoryDoctor}</span>
                      <span>{item.timingName}</span>
                    </div>
                  </div>

                  <div
                    className={`today-item-status ${
                      confirmed ? 'is-confirmed' : 'is-pending'
                    }`}
                  >
                    <span>{confirmed ? 'אושר' : 'בהמתנה'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="today-card-footer">
            <button className="today-card-link">הצג את לוח השנה המלא</button>
          </div>
        </div>

        <div
          className="container-box"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            gap: 16,
            padding: 24,
          }}
        >
          <span
            style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '700' }}
          >
            נהלים מהירים
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fastManagement.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  height: '76px',
                  borderRadius: '16px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '44px',
                    width: '180px',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '44px',
                      width: '44px',
                      borderRadius: '16px',
                      backgroundColor: item.backColor,
                      color: item.iconColor,
                      fontSize: '18px',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      lineHeight: '24px',
                      color: '#111827',
                    }}
                  >
                    {item.mangName}
                  </span>
                </div>
                <div
                  style={{
                    width: '22px',
                    fontSize: '20px',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                  }}
                >
                  <MdArrowBack />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="container-box"
        style={{ height: '428px', gap: 24, padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '20px',
              lineHeight: '28px',
              fontWeight: 700,
              color: '#111827',
            }}
          >
            בקשות אחרונות לפגישות
          </span>
          <button
            style={{
              borderRadius: '12px',
              padding: '0px 12px',
              border: 'solid 1px #11D057',
              color: '#11D057',
              backgroundColor: 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              gap: 1,
            }}
          >
            הצג הכל
          </button>
        </div>
        <div>
          {/* <div
            style={{
              height: '44px',
              borderBottom: 'solid 0.8px #E5E7EB',
              padding: '0px 24px',
              gap: 34,
            }}
          ></div>
          <div></div> */}

          {/* Header */}
          <div
            style={{
              height: 44,
              padding: '0 24px',
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: '2.2fr 1.6fr 1.8fr 1.4fr 1fr 1.4fr',
              borderBottom: '1px solid #E5E7EB',
              color: '#4B5563',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '20px',
              // gap: 34,
            }}
          >
            <div>המטופל</div>
            <div>שירות</div>
            <div>תאריך הזמנה</div>
            <div>רופא</div>
            <div style={{}}>המצב</div>
            <div style={{}}>נהלים</div>
          </div>
          {/* Rows */}
          <div style={{ height: 274, overflowY: 'scroll' }}>
            {appointmentsTable.map((item) => {
              const st = badgeStyle(item.status);

              return (
                <div
                  key={item._id}
                  style={{
                    paddingRight: '24px',
                    height: '68px',
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: '2.2fr 1.6fr 1.8fr 1.4fr 1fr 1.4fr',
                    // gap: 34,
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  {/* patient */}
                  <div
                    style={{
                      display: 'flex',
                      // flexDirection: 'row-reverse',
                      alignItems: 'center',
                      gap: 12,
                      width: '90%',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: '#E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: '#4B5563',
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {item.initials || 'AA'}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '15px',
                          color: '#111827',
                          lineHeight: '20px',
                        }}
                      >
                        {item.patientName}
                      </span>
                      <span
                        style={{
                          fontWeight: 400,
                          fontSize: '12px',
                          color: '#6B7280',
                          lineHeight: '16px',
                        }}
                      >
                        {item.patientPhone}
                      </span>
                    </div>
                  </div>

                  {/* service */}
                  <div
                    style={{
                      color: '#111827',
                      fontWeight: 500,
                      fontSize: '15px',
                      lineHeight: '20px',
                      width: '90%',
                    }}
                  >
                    {item.serviceName}
                  </div>

                  {/* date */}
                  <div
                    style={{
                      color: '#111827',
                      fontWeight: 500,
                      fontSize: '15px',
                      lineHeight: '20px',
                      width: '90%',
                    }}
                  >
                    {item.requestDateText}
                  </div>

                  {/* doctor */}
                  <div
                    style={{
                      color: '#111827',
                      fontWeight: 500,
                      fontSize: '15px',
                      lineHeight: '20px',
                      width: '90%',
                    }}
                  >
                    {item.doctorName}
                  </div>

                  {/* status */}
                  <div>
                    <span
                      style={{
                        padding: '8px 14px',
                        borderRadius: 9999,
                        background: st.bg,
                        color: st.color,
                        fontSize: 15,
                        fontWeight: 500,
                        lineHeight: '20px',
                      }}
                    >
                      {st.text}
                    </span>
                  </div>

                  {/* actions */}
                  <div
                    style={{
                      display: 'flex',
                      // justifyContent: 'center',
                      gap: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    {item.status === 'pending' ? (
                      <>
                        <PillButton
                          bg="#DCFCE7"
                          color="#166534"
                          onClick={() => {}}
                        >
                          הסכמה
                        </PillButton>
                        <PillButton
                          bg="#FEE2E2"
                          color="#991B1B"
                          onClick={() => {}}
                        >
                          נדחה
                        </PillButton>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {}}
                        style={{
                          border: '0',
                          background: 'transparent',
                          color: '#2E90FA',
                          fontWeight: 500,
                          fontSize: '15px',
                          lineHeight: '21px',
                          cursor: 'pointer',
                        }}
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
      </div>
    </div>
  );
};

export default SecretaryDashboard;
