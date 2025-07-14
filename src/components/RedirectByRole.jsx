import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotAuthorized from './NotAuthorized';

const RedirectByRole = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (user?.role === 'patient')
    return <Navigate to="/patient-dashboard" replace />;
  if (user?.role === 'secretary') return <Navigate to="/secretary" replace />;
  if (user?.role === 'doctor')
    return <Navigate to="/doctor-dashboard" replace />;

  return <NotAuthorized />;
};

export default RedirectByRole;
