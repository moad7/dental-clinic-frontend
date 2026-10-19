import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchServices } from '../api/serviceApi';
import { fetchAllClincis } from '../api/clinicApi';
import {
  fetchAllDoctors,
  fetchDoctorAppointments,
  fetchDoctorDashboard,
} from '../api/doctorApi';
import { fetchAllPatientBySecretary } from '../api/secretaryApi';
import {
  fetchAllAppointments,
  fetchAppointmentDay,
  getPatientTreatmentPlans,
} from '../api/appointmentApi';
// import { getAllUsers } from '../api/userApi';
export const AppDataContext = createContext(null);
export const AppDataProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorDashboard, setDoctorDashboard] = useState(null);
  const [patientsBySecretry, setPatientsBySecretry] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [appointmentDay, setAppointmentDay] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const addDoctorToState = (doctor) => {
    setDoctors((prev) => {
      const currentDoctors = Array.isArray(prev) ? prev : [];
      return [doctor, ...currentDoctors];
    });
  };
  const loadServiceGroups = async () => {
    const res = await fetchServices(token);
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
    console.log('Doctor Appointments:', res);
  };
  const loadAllPatientBySecretary = async () => {
    const res = await fetchAllPatientBySecretary(token);
    setPatientsBySecretry(res.patients || []);
  };
  const loadAllAppointments = async () => {
    const res = await fetchAllAppointments(token);
    setAppointments(res.appointments);
  };
  const loadAppointmentsDay = async () => {
    const res = await fetchAppointmentDay(token);
    setAppointmentDay(res.data);
  };
  const loadPatientTreatmentPlans = async () => {
    const result = await getPatientTreatmentPlans(token);
    setPatientTreatments(
      Array.isArray(result?.treatments) ? result.treatments : [],
    );
  };
  const loadInitialData = async () => {
    if (!token) return;
    try {
      setLoadingData(true);
      if (user && user.role === 'secretary') {
        await Promise.all([
          loadClinics(),
          loadAllPatientBySecretary(),
          loadAllAppointments(),
          loadAppointmentsDay(),
        ]);
      }
      if (user && user.role === 'doctor') {
        await Promise.all([loadDoctorDashboard(), loadDoctorAppointments()]);
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
        patientsBySecretry,
        appointments,
        patientTreatments,
        loadAllAppointments,
        loadServiceGroups,
        loadDoctors,
        loadInitialData,
        loadDoctorDashboard,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
