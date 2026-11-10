import { useContext, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppDataContext } from '../context/AppDataContext';
import { buildDashboardStats } from '../utils/dashboardDataStats/dataStats';
export const useDashboardStats = (config, view = 'overview') => {
  const { user, token } = useContext(AuthContext);
  const { dashboardStats, dashboardLoading, loadDashboardStats } = useContext(AppDataContext);
  const key = `${user?.role}:${view}`;
  const stats = token && user ? (dashboardStats[key] ?? null) : null;
  const loadingState = token && user ? (dashboardLoading[key] ?? stats === null) : false;
  useEffect(() => {
    if (!token || !user) return;
    loadDashboardStats(view);
  }, [token, user?._id, user?.role, view, loadDashboardStats]);
  const refetch = useCallback(() => {
    return loadDashboardStats(view, true);
  }, [loadDashboardStats, view]);
  const items = useMemo(() => {
    return stats ? buildDashboardStats(config, stats) : [];
  }, [config, stats]);
  return {
    items,
    stats,
    loadingState,
    refetch,
  };
};
