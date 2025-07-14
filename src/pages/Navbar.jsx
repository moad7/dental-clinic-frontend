import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" dir="rtl">
      <div className="container">
        <Link className="navbar-brand" to="/">
          מרפאת שיניים
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/patients">
                מטופלים
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/calendar">
                לוח שנה
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/appointments">
                פגישות
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/appointments/create">
                פגישה חדשה
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/secretary">
                לוח בקרה
              </Link>
            </li>
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light">שלום, {user.name}</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                התנתקות
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
