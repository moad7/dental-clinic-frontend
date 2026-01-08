import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../secretary.css';
import './secretaryDashboard.css';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaRegCalendarCheck, FaRegClock } from 'react-icons/fa';
import { BellRing } from 'lucide-react';

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
          <span>נהלים מהירים</span>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
