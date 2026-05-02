import React, { useContext, useEffect, useState } from 'react';
import BoxHeader from '../../../components/BoxHeader';
import { FiPlus } from 'react-icons/fi';
import Modal from '../../../../components/modal/Modal';
import AddServiceModal from '../../../modals/ServiceModal/AddServiceModal';
import { SlArrowUp } from 'react-icons/sl';
import { fetchServices } from '../../../../services/service';
import { AuthContext } from '../../../../context/AuthContext';
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
        {groups.length > 0 &&
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
              <div style={{}}></div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ServicesManagement;
