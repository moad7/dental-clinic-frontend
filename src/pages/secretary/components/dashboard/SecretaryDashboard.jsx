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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontWeight: '700',
              fontStyle: 'Bold',
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '0%',
              alignItems: 'center',
              color: '#111827',
            }}
          >
            בקשות אישור ממתינות
          </span>
          <span
            style={{
              borderRadius: '9999px',
              padding: '4px 12px',
              backgroundColor: '#FFEDD5',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              alignItems: 'center',
              color: '#9A3412',
            }}
          >
            15 ממתינים
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                height: '75px',
                width: '75px',
                borderRadius: '16px',
                backgroundColor: '#FFEDD5',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#EA580C',
              }}
            >
              <BellRing size={27} />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0%',
                  color: '#111827',
                }}
              >
                בקשות לפגישות דורשות את תשומת לבך
              </span>
              <span
                style={{
                  fontWeight: '400',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0%',
                  color: '#4B5563',
                }}
              >
                סקירה ואישור של הזמנות חדשות
              </span>
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#6B7280',
                }}
              >
                הזמנה אחרונה: לפני 15 דקות
              </span>
            </div>
          </div>
          <div>
            <button
              style={{
                width: '144px',
                borderRadius: '8px',
                padding: '8px 16px',
                backgroundColor: '#11D057',
                color: '#fff',
                border: '1px solid var(--Main, #11D057)',
              }}
            >
              בקשות סקירה
            </button>
          </div>
        </div>
      </div>

      <div className="container-box empty-box"></div>
    </div>
  );
};

export default SecretaryDashboard;
