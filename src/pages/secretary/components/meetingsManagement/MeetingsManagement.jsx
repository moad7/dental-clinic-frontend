import React from 'react';
import BoxHeader from '../../../components/BoxHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryStats } from '../../../../utils/dashboardDataStats/dataStats';
function MeetingsManagement() {
  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'בוקר טוב, מואד!'}
        subtitle={'הנה סקירה כללית של ההזמנות שלך היום.'}
      />
      <DashboardStats items={secretaryStats} />
      <MeetingTable filterSearch headerTextTable={'בקשות לפגישות'} />
    </div>
  );
}

export default MeetingsManagement;
