import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PatientNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" dir="rtl">
        <div className="container">
          <span className="navbar-brand">👨‍⚕️ מרפאת שיניים</span>
          <div>
            <NavLink className="btn btn-link" to="/patient-dashboard">
              📋 פגישות שלי
            </NavLink>
            <NavLink className="btn btn-link" to="/appointments/create">
              ➕ קבע תור
            </NavLink>
            <NavLink className="btn btn-link" to={`/profile/edit/${user?.id}`}>
              ⚙️ ערוך פרופיל
            </NavLink>
            <button className="btn btn-danger ms-2" onClick={handleLogout}>
              🚪 התנתק
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default PatientNavbar;
