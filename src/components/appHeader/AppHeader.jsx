import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { NAV_BY_ROLE } from '../../config/navConfig';
import './appHeader.css';
const ROLE_LABELS = {
  patient: 'מטופל',
  doctor: 'רופא',
  secretary: 'מזכירה',
  admin: 'מנהל',
};
export default function AppHeader({ user, onLogout }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const role = user?.role || 'patient';
  const navItems = NAV_BY_ROLE[role] || [];
  const userName = user?.name || 'משתמש';
  const roleLabel = ROLE_LABELS[role] || role;
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isUserMenuOpen]);
  const handleNavigate = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };
  const handleLogout = () => {
    setIsUserMenuOpen(false);
    onLogout?.();
  };
  return (
    <div className="main-header" dir="rtl">
      <header className="app-header">
        {/* Navigation */}
        <nav className="nav" aria-label="ניווט ראשי">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-btn ${isActive ? 'active' : ''}`
              }
              title={item.label}
            >
              {item.icon && <item.icon size={20} strokeWidth={1.9} />}
              {item.label && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        {/* User & Notifications */}
        <div className="left-nav">
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`user-box ${isUserMenuOpen ? 'opened' : ''}`}
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label="תפריט משתמש"
            >
              <div className="person-box">
                <div className="avatar-box">
                  {user?.avatar ? (
                    <img className="avatar" src={user.avatar} alt={userName} />
                  ) : (
                    <div className="avatar-placeholder">
                      <UserRound size={21} />
                    </div>
                  )}
                </div>
                <div className="meta">
                  <span className="person-name" title={userName}>
                    {userName}
                  </span>
                  <span className="role">{roleLabel}</span>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`arrow-icon ${isUserMenuOpen ? 'rotated' : ''}`}
              />
            </button>
            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="user-dropdown" role="menu">
                <div className="dropdown-header">
                  <span className="dropdown-name">{userName}</span>
                  <span className="dropdown-role">{roleLabel}</span>
                </div>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => handleNavigate('/profile')}
                >
                  <UserRound size={18} />
                  <span>הפרופיל שלי</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => handleNavigate('/settings')}
                >
                  <Settings size={18} />
                  <span>הגדרות</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>התנתקות</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="navigation-icon-box"
            aria-label="התראות"
            title="התראות"
          >
            <Bell size={21} strokeWidth={1.9} />
          </button>
        </div>
      </header>
    </div>
  );
}
