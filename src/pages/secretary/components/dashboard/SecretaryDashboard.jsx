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

  const tableToday = [
    {
      _id: 1,
      timingName: '9:00 صباحًا - احمد محسن',
      categoryDoctor: 'تنظيف دوري • د. جونسون',
      status: 'confirmed',
    },
    {
      _id: 2,
      timingName: '10:30 صباحًا - ماجد ابراهيم',
      categoryDoctor: 'قناة جذر • د. تشين',
      status: 'onHold',
    },
    {
      _id: 3,
      timingName: '2:00 مساءً - سارة ديب',
      categoryDoctor: 'استشارة • د. ديفيس',
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

      <div className="" style={{ display: 'flex', gap: 24 }}>
        <div
          className="container-box "
          style={{ width: '50%', height: '376px', padding: 24, gap: 16 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: '700',
                alignItems: 'center',
                color: '#111827',
                letterSpacing: '0%',
              }}
            >
              جدول اليوم
            </span>
            <span
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: '400',
                alignItems: 'center',
                color: '#6B7280',
                letterSpacing: '0%',
              }}
            >
              15 ديسمبر 2025
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 16,
              height: '248px',
              // overflowY: 'scroll',
              flexDirection: 'column',
            }}
          >
            {tableToday.map((item) => (
              <div
                style={{
                  display: 'flex',
                  height: '72px',

                  borderRadius: '16px',
                  backgroundColor: '#F9FAFB',
                  padding: 12,
                  width: '100%',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: 48,
                    borderRadius: 9999,
                    backgroundColor:
                      item.status == 'confirmed' ? '#11D057' : '#FB923C',
                  }}
                ></span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 12,
                    width: '100%',
                  }}
                >
                  <span>{item.categoryDoctor}</span>
                  <span>{item.timingName}</span>
                </div>
                <button
                  style={{
                    display: 'flex',
                    backgroundColor:
                      item.status == 'confirmed' ? '#DCFCE7' : '#FFEDD5',
                    borderRadius: 9999,
                    padding: '8px 12px',
                    border: 'solid 0px',
                    width: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      fontWeight: 500,
                    }}
                  >
                    {item.status == 'confirmed' ? 'تم التأكيد' : 'قيد الانتظار'}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div>
            <button>عرض التقويم الكامل</button>
          </div>
        </div>
        <div
          className="container-box"
          style={{ width: '50%', height: '376px', padding: 24 }}
        ></div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
