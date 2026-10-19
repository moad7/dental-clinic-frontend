import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute.jsx';
import RedirectByRole from './components/RedirectByRole.jsx';
import LoginScreen from './pages/loginScreen/LoginScreen.jsx';
import Register from './pages/loginScreen/components/register/Register.jsx';
// Pages
import SecretaryDashboard from './pages/secretary/components/dashboard/SecretaryDashboard.jsx';
import CalendarView from './pages/CalendarView.jsx';
import Dashboard from './pages/patient/components/dashboard/Dashboard.jsx';
import BookAppointment from './pages/patient/components/bookAppointment/BookAppointment.jsx';
import MyAppointments from './pages/patient/components/myAppointments/MyAppointments.jsx';
import TreatmentPlans from './pages/patient/components/treatmentPlans/TreatmentPlans.jsx';
import DoctorsManagement from './pages/secretary/components/doctorsManagement/DoctorsManagement.jsx';
import MeetingsManagement from './pages/secretary/components/meetingsManagement/MeetingsManagement.jsx';
import PatientsManagement from './pages/secretary/components/patientsManagement/PatientsManagement.jsx';
import ServicesManagement from './pages/secretary/components/servicesManagement/ServicesManagement.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import { AppDataContext } from './context/AppDataContext.jsx';
import SetPassword from './components/publicPages/SetPassword.jsx';
import DoctorPatient from './pages/doctor/components/doctorPatient/DoctorPatient.jsx';
import DoctorAppointment from './pages/doctor/components/doctorAppointment/DoctorAppointment.jsx';
import DoctorDashboard from './pages/doctor/components/dashboard/doctorDashboard.jsx';
function App() {
  const { user } = useContext(AuthContext);
  // const {  } = useContext(AppDataContext);
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/set-password/:token" element={<SetPassword />} />
        {/* Public */}
        {!user && (
          <>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        {/* Protected */}
        {user && (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <RedirectByRole />
                </PrivateRoute>
              }
            />
            {/* Patient layout */}
            <Route
              element={
                <PrivateRoute>
                  {/* <PatientNavbar /> */}
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="/patient/dashboard" element={<Dashboard />} />
              <Route
                path="/patient/bookAppointment"
                element={<BookAppointment />}
              />
              <Route
                path="/patient/myAppointments"
                element={<MyAppointments />}
              />
              <Route
                path="/patient/treatmentPlans"
                element={<TreatmentPlans />}
              />
            </Route>
            {/* Doctor layout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor/appointments"
                element={<DoctorAppointment />}
              />
              <Route path="/doctor/patients" element={<DoctorPatient />} />
            </Route>
            {/* Secretary layout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route
                path="/secretary/dashboard"
                element={<SecretaryDashboard />}
              />
              <Route
                path="/secretary/meetingsManagement"
                element={<MeetingsManagement />}
              />
              <Route
                path="/secretary/doctorsManagement"
                element={<DoctorsManagement />}
              />
              <Route
                path="/secretary/patientsManagement"
                element={<PatientsManagement />}
              />
              <Route
                path="/secretary/servicesManagement"
                element={<ServicesManagement />}
              />
              {/* <Route
                path="/secretary/appointments/create"
                element={<CreateAppointment />}
              />
              <Route
                path="/secretary/appointments/edit/:id"
                element={<EditAppointment />}
              /> */}
              <Route path="/secretary/calendar" element={<CalendarView />} />
              {/* <Route path="/secretary/patients" element={<Patients />} /> */}
              {/* <Route
                path="/secretary/patients/edit/:id"
                element={<EditPatient />}
              />
              <Route
                path="/secretary/patients/profile/:id"
                element={<PatientProfile />}
              /> */}
              {/* <Route
                path="/secretary/sessions/create"
                element={<CreateSession />}
              /> */}
            </Route>
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
export default App;
