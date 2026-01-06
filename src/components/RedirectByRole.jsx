import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotAuthorized from './NotAuthorized';

const RedirectByRole = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;

    case 'secretary':
      return <Navigate to="/secretary/dashboard" replace />;

    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;

    default:
      return <NotAuthorized />;
  }
};

export default RedirectByRole;
