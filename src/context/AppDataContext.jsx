import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

import { fetchServices } from '../api/serviceApi';
import { fetchAllClincis } from '../api/clinicApi';
import { fetchAllDoctors } from '../api/doctorApi';
import { fetchAllPatientBySecretary } from '../api/secretaryApi';
import {
  fetchAllAppointments,
  fetchAppointmentDay,
} from '../api/appointmentApi';
// import { getAllUsers } from '../api/userApi';

export const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  const [serviceGroups, setServiceGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientsBySecretry, setPatientsBySecretry] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDay, setAppointmentDay] = useState([]);

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

  const loadAllPatientBySecretary = async () => {
    const res = await fetchAllPatientBySecretary(token);
    setPatientsBySecretry(res.patients || []);
  };

  const loadAllAppointments = async () => {
    const res = await fetchAllAppointments(token);
    setAppointments(res.appointments);
  };
  //   const loadUsers = async () => {
  //     const res = await getAllUsers(token);
  //     setUsers(res.data.data || res.data || []);
  //   };

  const loadAppointmentsDay = async () => {
    const res = await fetchAppointmentDay(token);
    setAppointmentDay(res.data);
    console.log(appointmentDay);
  };

  const loadInitialData = async () => {
    if (!token) return;

    try {
      setLoadingData(true);
      if (user && user.role === 'secretary') {
        await Promise.all([
          loadClinics(),
          loadDoctors(),
          loadAllPatientBySecretary(),
          loadAllAppointments(),
          loadAppointmentsDay(),
        ]);
      }
      await Promise.all([
        loadServiceGroups(),
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
        addDoctorToState,

        patientsBySecretry,

        appointments,
        loadAllAppointments,

        loadServiceGroups,
        loadDoctors,
        loadInitialData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
