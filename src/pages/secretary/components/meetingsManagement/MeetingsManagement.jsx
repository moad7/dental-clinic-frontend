import React, { useState } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus } from 'react-icons/fi';
import AddMeetingsModal from '../../../modals/addMeetingsModal/AddMeetingsModal';
import Modal from '../../../../components/modal/Modal';
const MeetingsManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title={'ניהול פגישות'}
        subtitle={'הנה סקירה כללית של ההזמנות שלך היום.'}
        actionIcon={<FiPlus size={20} />}
        actionLabel="הוסף בקשוה חדש"
        onAction={() => {
          setOpen(true);
        }}
      />
      <DashboardStats items={secretaryStats} />
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="הוספת בקשוה חדש"
        size="xl"
      >
        <AddMeetingsModal setOpen={setOpen} open={open} />
      </Modal>
      <MeetingTable filterSearch headerTextTable={'בקשות לפגישות'} />
    </div>
  );
};

export default MeetingsManagement;
