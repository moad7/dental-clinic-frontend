// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from './context/AuthContext';
// import Login from './pages/loginScreen/components/login/Login.jsx';
// import Register from './pages/loginScreen/components/register/Register.jsx';
// import SecretaryDashboard from './pages/SecretaryDashboard.jsx';
// import Appointments from './pages/Appointments.jsx';
// import CreateAppointment from './pages/CreateAppointment.jsx';
// import EditAppointment from './pages/EditAppointment.jsx';
// import PrivateRoute from './utils/PrivateRoute.jsx';
// import Layout from './components/Layout.jsx';
// import CalendarView from './pages/CalendarView.jsx';
// import Patients from './pages/Patients.jsx';
// import EditPatient from './pages/EditPatient.jsx';
// import PatientProfile from './pages/PatientProfile.jsx';
// import CreateSession from './pages/CreateSession.jsx';
// import CreateMyAppointment from './pages/CreateMyAppointment.jsx';
// import PatientDashboard from './pages/PatientDashboard.jsx';
// import PatientNavbar from './pages/PatientNavbar.jsx';
// import RedirectByRole from './components/RedirectByRole.jsx';
// import DoctorDashboard from './pages/doctorDashboard.js';
// import LoginScreen from './pages/loginScreen/LoginScreen.jsx';
// import { Slide, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// function App() {
//   const { user } = useContext(AuthContext);

//   const role = user?.role;
//   console.log(role);

//   if (!user) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginScreen />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     );
//   }
//   if (role === 'patient') {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             element={
//               <PrivateRoute>
//                 <PatientNavbar />
//               </PrivateRoute>
//             }
//           >
//             <Route path="/patient-dashboard" element={<PatientDashboard />} />
//             <Route
//               path="/appointments/create"
//               element={<CreateMyAppointment />}
//             />
//             <Route path="/profile/edit/:id" element={<EditPatient />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/patient-dashboard" />} />
//         </Routes>
//       </Router>
//     );
//   }
//   if (role === 'doctor') {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             element={
//               <PrivateRoute>
//                 <Layout />
//               </PrivateRoute>
//             }
//           >
//             <Route path="/doctor-dashboard" element={<DoctorDashboard />} />;
//             <Route path="*" element={<Navigate to="/doctor-dashboard" />} />
//           </Route>
//         </Routes>
//       </Router>
//     );
//   }
//   if (role === 'secretary') {
//     return (
//       <Router>
//         <Routes>
//           <Route
//             element={
//               <PrivateRoute>
//                 <Layout />
//               </PrivateRoute>
//             }
//           >
//             <Route path="/" element={<RedirectByRole />} />
//             <Route path="/secretary" element={<SecretaryDashboard />} />
//             <Route path="/appointments" element={<Appointments />} />
//             <Route
//               path="/appointments/create"
//               element={<CreateAppointment />}
//             />
//             <Route
//               path="/appointments/edit/:id"
//               element={<EditAppointment />}
//             />
//             <Route path="/calendar" element={<CalendarView />} />
//             <Route path="/patients" element={<Patients />} />
//             <Route path="/patients/edit/:id" element={<EditPatient />} />
//             <Route path="/patients/profile/:id" element={<PatientProfile />} />
//             <Route path="/sessions/create" element={<CreateSession />} />
//           </Route>

//           <Route path="*" element={<Navigate to="/secretary" />} />
//         </Routes>
//       </Router>
//     );
//   }
// }

// export default App;
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

// Layouts
import Layout from './components/Layout.jsx';
import PatientNavbar from './pages/PatientNavbar.jsx';

// Pages
import SecretaryDashboard from './pages/secretary/components/dashboard/SecretaryDashboard.jsx';
import DoctorDashboard from './pages/doctorDashboard.js';
import PatientDashboard from './pages/PatientDashboard.jsx';

import Appointments from './pages/Appointments.jsx';
import CalendarView from './pages/CalendarView.jsx';
import Patients from './pages/Patients.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import EditPatient from './pages/EditPatient.jsx';

import CreateAppointment from './pages/CreateAppointment.jsx';
import EditAppointment from './pages/EditAppointment.jsx';
import CreateSession from './pages/CreateSession.jsx';

import CreateMyAppointment from './pages/CreateMyAppointment.jsx';
import AppLayout from './layouts/AppLayout.jsx';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
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
            {/* أول ما يفوت يوديه حسب role */}
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
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route
                path="/patient/appointments/create"
                element={<CreateMyAppointment />}
              />
              <Route
                path="/patient/profile/edit/:id"
                element={<EditPatient />}
              />
            </Route>

            {/* Doctor + Secretary layout (Layout واحد) */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              {/* Doctor */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

              {/* Secretary */}
              <Route
                path="/secretary/dashboard"
                element={<SecretaryDashboard />}
              />
              <Route
                path="/secretary/appointments"
                element={<Appointments />}
              />
              <Route
                path="/secretary/appointments/create"
                element={<CreateAppointment />}
              />
              <Route
                path="/secretary/appointments/edit/:id"
                element={<EditAppointment />}
              />
              <Route path="/secretary/calendar" element={<CalendarView />} />
              <Route path="/secretary/patients" element={<Patients />} />
              <Route
                path="/secretary/patients/edit/:id"
                element={<EditPatient />}
              />
              <Route
                path="/secretary/patients/profile/:id"
                element={<PatientProfile />}
              />
              <Route
                path="/secretary/sessions/create"
                element={<CreateSession />}
              />
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
