import AppHeader from '../components/appHeader/AppHeader';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-shell">
      <AppHeader user={user} onLogout={logout} />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
