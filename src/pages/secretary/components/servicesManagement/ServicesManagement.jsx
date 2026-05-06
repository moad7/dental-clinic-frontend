import React, { useContext, useState } from 'react';
import BoxHeader from '../../../components/BoxHeader';
import { FiPlus } from 'react-icons/fi';
import Modal from '../../../../components/modal/Modal';
import AddServiceModal from '../../../modals/ServiceModal/AddServiceModal';
import { SlArrowUp } from 'react-icons/sl';
import { AuthContext } from '../../../../context/AuthContext';
import { MdEdit } from 'react-icons/md';
import { AppDataContext } from '../../../../context/AppDataContext';
const ServicesManagement = () => {
  const [open, setOpen] = useState(false);
  const { serviceGroups } = useContext(AppDataContext);
  console.log('👀 serviceGroups:', serviceGroups);
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
        {serviceGroups.length > 0 &&
          serviceGroups.map((group) => (
            <section key={group._id} className="clinic-service-group-panel">
              <div className="clinic-service-group-header">
                <h3 className="clinic-service-group-title">{group.title}</h3>

                <button
                  className="clinic-service-group-collapse-btn"
                  type="button"
                >
                  <SlArrowUp />
                </button>
              </div>

              <div className="clinic-service-cards-row">
                {group.services?.map((service) => (
                  <div key={service._id} className="clinic-service-card">
                    <div className="clinic-service-card-top">
                      <div className="clinic-service-name-wrap">
                        {service.photo && (
                          <img
                            src={service.photo}
                            alt={service.name}
                            className="clinic-service-thumb"
                          />
                        )}
                        <h4 className="clinic-service-name">
                          {service.name}
                          {/* {service.nameEn && `(${service.nameEn})`} */}
                        </h4>
                      </div>

                      <span
                        className={`clinic-service-status-badge ${
                          service.active
                            ? 'clinic-service-status-active'
                            : 'clinic-service-status-inactive'
                        }`}
                      >
                        {service.active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </div>
                    <div className="clinic-service-info">
                      <span>תיאור השירות</span>
                      <strong>{service.description ?? 'אין תיאור'}</strong>
                    </div>

                    <div className="clinic-service-divider" />

                    <div className="clinic-service-bottom-grid">
                      <div>
                        <span>מחיר השירות</span>
                        <strong>
                          {service.price ? `₪${service.price}` : 'אין מחיר'}
                        </strong>
                      </div>

                      <div>
                        <span>זמן</span>
                        <strong>
                          {service.durationMin || 'אין זמן מעורך'} דקות
                        </strong>
                      </div>
                    </div>

                    <button className="clinic-service-edit-btn" type="button">
                      <MdEdit size={20} />
                      <span>שינוי שירות</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </div>
    </>
  );
};

export default ServicesManagement;
