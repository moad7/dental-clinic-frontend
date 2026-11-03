import { useContext, useState } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import { FiPlus } from 'react-icons/fi';
import Modal from '../../../../components/modal/Modal';
import AddServiceModal from '../../../modals/ServiceModal/AddServiceModal';
import { SlArrowUp } from 'react-icons/sl';
import { MdEdit } from 'react-icons/md';
import { AppDataContext } from '../../../../context/AppDataContext';
import './servicesManagement.css';
import EditServiceModal from '../../../modals/serviceModal/editServiceModal/EditServiceModal';
import { formatDateTime } from '../../../../utils/functions';
const ServicesManagement = () => {
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { serviceGroups } = useContext(AppDataContext);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const toggleGroup = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };
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
        >
          <AddServiceModal open={open} onClose={() => setOpen(false)} />
        </Modal>
        <Modal
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedService(null);
          }}
          title="עריכת שירות"
          size="xl"
        >
          {selectedService && (
            <EditServiceModal
              service={selectedService}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedService(null);
              }}
            />
          )}
        </Modal>
        {serviceGroups.length > 0 &&
          serviceGroups.map((group) => {
            const isCollapsed = Boolean(collapsedGroups[group._id]);
            return (
              <section
                key={group._id}
                className={`clinic-service-group-panel ${
                  isCollapsed ? 'clinic-service-group-panel--collapsed' : ''
                }`}
              >
                <div className="clinic-service-group-header">
                  <h3
                    className="clinic-service-group-title"
                    onClick={() => toggleGroup(group._id)}
                  >
                    {group.title}
                  </h3>
                  <button
                    className={`clinic-service-group-collapse-btn ${
                      isCollapsed
                        ? 'clinic-service-group-collapse-btn--collapsed'
                        : ''
                    }`}
                    type="button"
                    onClick={() => toggleGroup(group._id)}
                    aria-expanded={!isCollapsed}
                    aria-label={
                      isCollapsed ? 'הצגת שירותי הקבוצה' : 'הסתרת שירותי הקבוצה'
                    }
                  >
                    <SlArrowUp />
                  </button>
                </div>
                <div
                  className={`clinic-service-group-content ${
                    isCollapsed ? 'clinic-service-group-content--collapsed' : ''
                  }`}
                >
                  <div className="clinic-service-group-content-inner">
                    <div className="clinic-service-cards-row">
                      {group.services?.map((service) => {
                        const isArchived = service.isArchived === true;
                        return (
                          <div
                            key={service._id}
                            className={`clinic-service-card ${
                              isArchived ? 'clinic-service-card--archived' : ''
                            }`}
                          >
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
                                </h4>
                              </div>
                              <span
                                className={`clinic-service-status-badge ${
                                  isArchived
                                    ? 'clinic-service-status-archived'
                                    : service.active
                                      ? 'clinic-service-status-active'
                                      : 'clinic-service-status-inactive'
                                }`}
                              >
                                {isArchived
                                  ? 'בארכיון'
                                  : service.active
                                    ? 'פעיל'
                                    : 'לא פעיל'}
                              </span>
                            </div>
                            <div className="clinic-service-info">
                              <span>תיאור השירות</span>
                              <strong>
                                {service.description || 'אין תיאור'}
                              </strong>
                            </div>
                            <div className="clinic-service-divider" />
                            <div className="clinic-service-bottom-grid">
                              <div>
                                <span>מחיר השירות</span>
                                <strong>
                                  {service.price != null
                                    ? `₪${service.price}`
                                    : 'אין מחיר'}
                                </strong>
                              </div>
                              <div>
                                <span>זמן</span>
                                <strong>
                                  {service.durationMin != null
                                    ? `${service.durationMin} דקות`
                                    : 'לא צוין זמן'}
                                </strong>
                              </div>
                            </div>
                            {isArchived && (
                              <div className="clinic-service-archive-info">
                                <div className="clinic-service-archive-info-row">
                                  <span>סטטוס ארכיון</span>
                                  <strong>השירות הועבר לארכיון</strong>
                                </div>
                                <div className="clinic-service-archive-info-row">
                                  <span>תאריך העברה לארכיון</span>
                                  <strong>
                                    {formatDateTime(service.archivedAt)}
                                  </strong>
                                </div>
                              </div>
                            )}
                            <button
                              className="clinic-service-edit-btn"
                              type="button"
                              onClick={() => {
                                setSelectedService({
                                  ...service,
                                  serviceGroupId: group._id,
                                  serviceGroupTitle: group.title,
                                });
                                setOpenEditModal(true);
                              }}
                            >
                              <MdEdit size={20} />
                              <span>שינוי שירות</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </div>
    </>
  );
};
export default ServicesManagement;
