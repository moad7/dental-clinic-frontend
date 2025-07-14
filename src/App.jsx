import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SecretaryDashboard from './pages/SecretaryDashboard.jsx';
import Appointments from './pages/Appointments.jsx';
import CreateAppointment from './pages/CreateAppointment.jsx';
import EditAppointment from './pages/EditAppointment.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import CalendarView from './pages/CalendarView.jsx';
import Patients from './pages/Patients.jsx';
import EditPatient from './pages/EditPatient.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import CreateSession from './pages/CreateSession.jsx';
import CreateMyAppointment from './pages/CreateMyAppointment.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import PatientNavbar from './pages/PatientNavbar.jsx';
import RedirectByRole from './components/RedirectByRole.jsx';
import DoctorDashboard from './pages/doctorDashboard.js';

function App() {
  const { user } = useContext(AuthContext);

  const role = user?.role;
  console.log(role);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }
  if (role === 'patient') {
    return (
      <Router>
        <Routes>
          <Route
            element={
              <PrivateRoute>
                <PatientNavbar />
              </PrivateRoute>
            }
          >
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route
              path="/appointments/create"
              element={<CreateMyAppointment />}
            />
            <Route path="/profile/edit/:id" element={<EditPatient />} />
          </Route>

          <Route path="*" element={<Navigate to="/patient-dashboard" />} />
        </Routes>
      </Router>
    );
  }
  if (role === 'doctor') {
    return (
      <Router>
        <Routes>
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />;
            <Route path="*" element={<Navigate to="/doctor-dashboard" />} />
          </Route>
        </Routes>
      </Router>
    );
  }
  if (role === 'secretary') {
    return (
      <Router>
        <Routes>
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<RedirectByRole />} />
            <Route path="/secretary" element={<SecretaryDashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/appointments/create"
              element={<CreateAppointment />}
            />
            <Route
              path="/appointments/edit/:id"
              element={<EditAppointment />}
            />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/edit/:id" element={<EditPatient />} />
            <Route path="/patients/profile/:id" element={<PatientProfile />} />
            <Route path="/sessions/create" element={<CreateSession />} />
          </Route>

          <Route path="*" element={<Navigate to="/secretary" />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
