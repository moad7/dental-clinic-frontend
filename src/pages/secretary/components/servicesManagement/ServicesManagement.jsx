import React, { useState } from 'react';
import BoxHeader from '../../../components/BoxHeader';
import { FiPlus } from 'react-icons/fi';
import Modal from '../../../../components/modal/Modal';
import AddServiceModal from '../../../modals/ServiceModal/AddServiceModal';

const ServicesManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="main-container" dir="rtl">
        <BoxHeader
          onAction={() => {
            setOpen(true);
          }}
          actionIcon={<FiPlus size={20} />}
          actionLabel={'הוסף שירות חדש'}
          searchBox
        />
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="הוספת שירות חדש"
          size="xl"
          // footer={
          //   <button className="btn-green full" onClick={() => alert('create')}>
          //     إنشاء الخدمة
          //   </button>
          // }
        >
          <AddServiceModal />
        </Modal>
      </div>
    </>
  );
};

export default ServicesManagement;
