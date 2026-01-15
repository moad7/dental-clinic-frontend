import React from 'react';
import WelcomeHeader from '../../../components/WelcomeHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';

function MeetingsManagement() {
  return (
    <div className="main-container" dir="rtl">
      <WelcomeHeader />
      <DashboardStats />
      <MeetingTable filterSearch />
    </div>
  );
}

export default MeetingsManagement;
