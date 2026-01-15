import React from 'react';
import './dashboardStats.css';
import { FaRegCalendarCheck, FaRegClock, FaUserDoctor } from 'react-icons/fa6';
import { MdOutlinePeopleAlt } from 'react-icons/md';

const DashboardStats = () => {
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
  );
};

export default DashboardStats;
