// import { useEffect, useState } from 'react';
// import axios from 'axios';
import '../../secretary.css';
import './secretaryDashboard.css';
import { MdArrowBack } from 'react-icons/md';
import { BellRing } from 'lucide-react';
import { RiUserAddLine } from 'react-icons/ri';
import { TbMessageCircle } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import WelcomeHeader from '../../../components/WelcomeHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';

const SecretaryDashboard = () => {
  // const [stats, setStats] = useState(null);
  // const [todayAppointments, setTodayAppointments] = useState([]);
  // const token = localStorage.getItem('token');

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

  return (
    <div className="main-container" dir="rtl">
      <WelcomeHeader />
      <DashboardStats />
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
                <div className="today-item" key={item._id}>
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

        <div className="container-box quick-mgmt">
          <span className="quick-mgmt-title">נהלים מהירים</span>

          <div className="quick-mgmt-list">
            {fastManagement.map((item) => (
              <div className="quick-mgmt-item" key={item._id}>
                <div className="quick-mgmt-left">
                  <span
                    className="quick-mgmt-icon"
                    style={{
                      '--bg': item.backColor,
                      '--color': item.iconColor,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span className="quick-mgmt-name">{item.mangName}</span>
                </div>

                <div className="quick-mgmt-arrow">
                  <MdArrowBack />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MeetingTable headerTextTable={'בקשות אחרונות לפגישות'} moreBtn />
    </div>
  );
};

export default SecretaryDashboard;
