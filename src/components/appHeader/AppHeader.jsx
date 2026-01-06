import { NAV_BY_ROLE } from '../../config/navConfig';
import { NavLink } from 'react-router-dom';
import './appHeader.css';
import { ArrowBigDownDash, Bell, BellDot } from 'lucide-react';
import { IoIosArrowDown } from 'react-icons/io';
export default function AppHeader({ user, onLogout }) {
  const role = user?.role || 'patient';
  const navItems = NAV_BY_ROLE[role] || [];

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
      }}
    >
      <nav className="nav" style={{ display: 'flex', gap: 16 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'nav-btn' + (isActive ? ' active' : '')
            }
            style={{
              gap: item.label ? 8 : 0,
            }}
          >
            {item.icon && <item.icon size={22} />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="left-nav">
        <div className="user-box">
          <div className="person-box">
            <div className="avatar-box">
              <img
                className="avatar"
                src={
                  user?.avatar ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2uLl8zBoK0_iM5pNwJAC8hQ2f68YKtlgc7Q&s'
                }
                alt=""
              />
            </div>
            <div className="meta">
              <div className="person-name">{user?.name}</div>
              <div className="role">
                {role === 'patient'
                  ? 'חולה'
                  : role === 'doctor'
                  ? 'רופא'
                  : 'מזכירה'}
              </div>
            </div>
          </div>

          <div className="arrow-icon">
            <IoIosArrowDown size={18} />
          </div>
        </div>
        <div className="navigation-icon-box">
          <Bell size={22} />
          {/* <BellDot/> */}
        </div>
      </div>

      {/* لو بدك زر خروج */}
      {/* 
      <div className="right">
        <button className="icon-btn" onClick={onLogout}>
          خروج
        </button>
        <div className="logo">🦷</div>
      </div> 
      */}
    </header>
  );
}
