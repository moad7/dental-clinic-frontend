import { useState } from 'react';
import BoxHeader from '../../../components/BoxHeader';

import { FiPlus } from 'react-icons/fi';
import AddDoctorModal from '../../../modals/DoctorModal/AddDoctorModal';
import Modal from '../../../../components/modal/Modal';

const DoctorsManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        onAction={() => {
          setOpen(true);
        }}
        title={'ניהול הרופאים'}
        subtitle={'ניהול וצפייה בכל רישומי הרופאים'}
        actionIcon={<FiPlus size={20} />}
        actionLabel={'הוסף רופא חדש'}
      />
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="הוספת רופא חדש"
        size="xl"
      >
        <AddDoctorModal />
      </Modal>
    </div>
  );
};

export default DoctorsManagement;
