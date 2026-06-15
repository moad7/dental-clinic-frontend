import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

import { fetchServices } from '../api/serviceApi';
import { fetchAllClincis } from '../api/clinicApi';
// import { getAllUsers } from '../api/userApi';

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  const [serviceGroups, setServiceGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [loadingData, setLoadingData] = useState(false);

  const loadServiceGroups = async () => {
    const res = await fetchServices(token);
    setServiceGroups(res || []);
  };

  const loadClinics = async () => {
    const res = await fetchAllClincis(token);
    setClinics(res || []);
  };
  //   const loadUsers = async () => {
  //     const res = await getAllUsers(token);
  //     setUsers(res.data.data || res.data || []);
  //   };

  const loadInitialData = async () => {
    if (!token) return;

    try {
      setLoadingData(true);

      await Promise.all([
        loadServiceGroups(),
        loadClinics(),
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
        loadServiceGroups,
        // loadUsers,
        loadInitialData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
