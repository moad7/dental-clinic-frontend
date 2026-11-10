import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { fetchServices } from '../api/serviceApi';
import { fetchAllClincis } from '../api/clinicApi';
import { fetchAllDoctors, fetchDoctorAppointments, fetchDoctorDashboard } from '../api/doctorApi';
import { fetchAllPatients } from '../api/patients';
import { fetchAllAppointments, fetchAppointmentDay, getPatientTreatmentPlans } from '../api/appointmentApi';
import { fetchDashboardStats } from '../api/dashboardApi';
import { showErrorToast } from '../utils/errorMessages';
// import { getAllUsers } from '../api/userApi';
export const AppDataContext = createContext(null);
export const AppDataProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const serviceView = user?.role === 'secretary' ? 'all' : 'available';
  const [serviceGroups, setServiceGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorDashboard, setDoctorDashboard] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [appointmentDay, setAppointmentDay] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [dashboardLoading, setDashboardLoading] = useState({});
  const dashboardCacheRef = useRef({});
  const dashboardRequestsRef = useRef({});
  const dashboardSessionRef = useRef(null);
  const sessionKey = token && user ? `${user._id ?? user.id ?? ''}:${token}` : null;
  if (dashboardSessionRef.current !== sessionKey) {
    dashboardSessionRef.current = sessionKey;
    dashboardCacheRef.current = {};
    dashboardRequestsRef.current = {};
  }
  if (dashboardSessionRef.current !== sessionKey) {
    dashboardSessionRef.current = sessionKey;
    dashboardCacheRef.current = {};
    dashboardRequestsRef.current = {};
  }
  const loadDashboardStats = useCallback(
    async (view = 'overview', force = false) => {
      if (!token || !user) return null;
      const role = user.role;
      const allowedViews =
        role === 'secretary'
          ? ['overview', 'patients', 'doctors']
          : role === 'doctor'
            ? ['overview', 'patients']
            : role === 'patient'
              ? ['overview']
              : [];
      if (!allowedViews.includes(view)) {
        return null;
      }
      const key = `${role}:${view}`;
      const requestSession = sessionKey;
      // Return cached data if available
      if (!force && dashboardCacheRef.current[key] !== undefined) {
        return dashboardCacheRef.current[key];
      }
      // Prevent duplicate requests
      if (dashboardRequestsRef.current[key]) {
        return dashboardRequestsRef.current[key];
      }
      setDashboardLoading((prev) => ({
        ...prev,
        [key]: true,
      }));
      const request = (async () => {
        try {
          const response = await fetchDashboardStats(view, token);
          const stats = response.stats;
          if (dashboardSessionRef.current === requestSession) {
            dashboardCacheRef.current[key] = stats;
            setDashboardStats((prev) => ({
              ...prev,
              [key]: stats,
            }));
          }
          return stats;
        } catch (error) {
          if (dashboardSessionRef.current === requestSession) {
            console.error('Dashboard stats error:', error);
            showErrorToast(error, 'אירעה שגיאה בטעינת נתוני לוח הבקרה');
          }
          return null;
        } finally {
          if (dashboardSessionRef.current === requestSession) {
            setDashboardLoading((prev) => ({
              ...prev,
              [key]: false,
            }));
          }
          if (dashboardRequestsRef.current[key] === request) {
            delete dashboardRequestsRef.current[key];
          }
        }
      })();
      dashboardRequestsRef.current[key] = request;
      return request;
    },
    [token, user?._id, user?.role, sessionKey],
  );
  useEffect(() => {
    setDashboardStats({});
    setDashboardLoading({});
  }, [sessionKey]);
  const addDoctorToState = (doctor) => {
    setDoctors((prev) => {
      const currentDoctors = Array.isArray(prev) ? prev : [];
      return [doctor, ...currentDoctors];
    });
  };
  const loadServiceGroups = async () => {
    const res = await fetchServices(token, serviceView);
    setServiceGroups(res || []);
  };
  const loadClinics = async () => {
    const res = await fetchAllClincis(token);
    setClinics(res.clinics || []);
  };
  const loadDoctors = async () => {
    const res = await fetchAllDoctors(token);
    setDoctors(res.doctors || []);
  };
  const loadDoctorDashboard = async () => {
    const res = await fetchDoctorDashboard(token);
    setDoctorDashboard(res || []);
  };
  const loadDoctorAppointments = async () => {
    const res = await fetchDoctorAppointments(token);
    setDoctorAppointments(res || []);
  };
  const loadAllPatients = async () => {
    const res = await fetchAllPatients(token);
    setPatients(res.patients || []);
  };
  const loadAllAppointments = async () => {
    const res = await fetchAllAppointments(token);
    setAppointments(res.appointments);
  };
  const loadAppointmentsDay = async () => {
    const res = await fetchAppointmentDay(token);
    setAppointmentDay(res.appointments || []);
  };
  const loadPatientTreatmentPlans = async () => {
    const result = await getPatientTreatmentPlans(token);
    setPatientTreatments(Array.isArray(result?.treatments) ? result.treatments : []);
  };
  const loadInitialData = async () => {
    if (!token) return;
    try {
      setLoadingData(true);
      if (user && user.role === 'secretary') {
        await Promise.all([loadClinics(), loadAllPatients(), loadAllAppointments(), loadAppointmentsDay()]);
      }
      if (user && user.role === 'doctor') {
        await Promise.all([loadDoctorDashboard(), loadDoctorAppointments(), loadAllPatients()]);
      }
      if (user.role === 'patient') {
        loadPatientTreatmentPlans();
      }
      await Promise.all([
        loadServiceGroups(),
        loadDoctors(),
        //  loadUsers()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    if (user && token) {
      loadInitialData();
    }
  }, [user, token]);
  return (
    <AppDataContext.Provider
      value={{
        appointmentDay,
        serviceGroups,
        setServiceGroups,
        users,
        setUsers,
        loadingData,
        clinics,
        doctors,
        doctorDashboard,
        doctorAppointments,
        addDoctorToState,
        patients,
        appointments,
        patientTreatments,
        loadAllAppointments,
        loadServiceGroups,
        loadDoctors,
        loadInitialData,
        loadDoctorDashboard,
        // Dashboard stats
        dashboardStats,
        dashboardLoading,
        loadDashboardStats,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
