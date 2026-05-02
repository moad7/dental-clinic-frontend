import React, { useContext, useEffect, useState } from 'react';
import BoxHeader from '../../../components/BoxHeader';
import { FiPlus } from 'react-icons/fi';
import Modal from '../../../../components/modal/Modal';
import AddServiceModal from '../../../modals/ServiceModal/AddServiceModal';
import { SlArrowUp } from 'react-icons/sl';
import { fetchServices } from '../../../../services/service';
import { AuthContext } from '../../../../context/AuthContext';
import { MdEdit } from 'react-icons/md';
const ServicesManagement = () => {
  const [open, setOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const services = await fetchServices(token);
      setGroups(services);
      console.log(services);
    };
    loadServices();
  }, [token]);

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
        {/* {groups.length > 0 &&
          groups.map((group) => (
            <div
              key={group._id}
              style={{
                display: 'flex',
                height: '500px',
                borderRadius: '16px',
                padding: '0px 12px 18px 12px',
                gap: '12px',
                backgroundColor: '#fff',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '72px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    fontWeight: '700',
                    fontSize: '22px',
                    lineHeight: '130%',
                    letterSpacing: '-4%',
                  }}
                >
                  {group.title}
                </span>
                <button
                  style={{
                    border: '0',
                    backgroundColor: 'transparent',
                    fontWeight: '800',
                    fontSize: '22px',
                    lineHeight: '130%',
                    letterSpacing: '-4%',
                  }}
                >
                  <SlArrowUp />
                </button>
              </div>
              <div style={{}}>
                <div style={{display:'flex',width:'400'}}></div>
              </div>
            </div>
          ))} */}
        {groups.length > 0 &&
          groups.map((group) => (
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
