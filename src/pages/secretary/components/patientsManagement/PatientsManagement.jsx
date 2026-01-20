import React from 'react';
import BoxHeader from '../../../components/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryPatientsStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus } from 'react-icons/fi';
const PatientsManagement = () => {
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'ניהול מטופלים'}
        subtitle={'ניהול וצפייה בכל רישומי המטופלים'}
        actionIcon={<FiPlus size={20} />}
        actionLabel={'הוסף מטופל חדש'}
      />
      <DashboardStats items={secretaryPatientsStats} />
    </div>
  );
};

export default PatientsManagement;
