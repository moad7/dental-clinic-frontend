import '../../secretary.css';
import './secretaryDashboard.css';
import { MdArrowBack } from 'react-icons/md';
import { BellRing } from 'lucide-react';
import { RiUserAddLine } from 'react-icons/ri';
import { TbMessageCircle } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryStats } from '../../../../utils/dashboardDataStats/dataStats';
import Modal from '../../../../components/modal/Modal';
import { useContext, useState, useEffect } from 'react';
import AddMeetingsModal from '../../../modals/addMeetingsModal/AddMeetingsModal';
import AddPatientModal from '../../../modals/patientModal/AddPatientModal';
import { AuthContext } from '../../../../context/AuthContext';
import { AppDataContext } from '../../../../context/AppDataContext';
import { formatDateTime } from '../../../../utils/functions';
import { useDashboardStats } from '../../../../hooks/useDashboardStats';
import MeetingsDetailsModal from '../../../modals/addMeetingsModal/meetingsDetailsModal/MeetingsDetailsModal';
import { SESSION_STATUS_CLASSES, SESSION_STATUS_OPTIONS } from '../../../../utils/constants';
const SecretaryDashboard = () => {
  const { user } = useContext(AuthContext);
  const { appointmentDay, appointments } = useContext(AppDataContext);
  const { items, loadingState } = useDashboardStats(secretaryStats, 'overview');
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const fastManagement = [
    {
      _id: 1,
      mangName: 'קבע פגישה חדשה',
      modalTitle: 'הוספת בקשוה חדש',
      icon: <AiOutlinePlus />,
      iconColor: '#FFFFFF',
      backColor: '#2E90FA',
      component: <AddMeetingsModal />,
    },
    {
      _id: 2,
      mangName: 'רישום מטופל חדש',
      modalTitle: 'הוספת מטופל חדש',
      icon: <RiUserAddLine />,
      iconColor: '#16A34A',
      backColor: '#DCFCE7',
      component: <AddPatientModal />,
    },
    {
      _id: 3,
      mangName: 'שלח הודעה לרופא',
      icon: <TbMessageCircle />,
      iconColor: '#2563EB',
      backColor: '#DBEAFE',
      navigat: '',
    },
  ];
  useEffect(() => {
    if (!selectedAppointmentId) {
      setSelectedAppointment(null);
      return;
    }
    const selected = appointments.find((appt) => String(appt._id) === String(selectedAppointmentId));
    setSelectedAppointment(selected || null);
  }, [selectedAppointmentId, appointments]);
  const handleCloseAppointment = () => {
    setSelectedAppointmentId(null);
    setSelectedAppointment(null);
  };
  return (
    <div className="main-container" dir="rtl">
      {selectedAppointment && (
        <Modal isOpen={Boolean(selectedAppointment)} onClose={handleCloseAppointment} title="פרטי המפגש" size="xl">
          <MeetingsDetailsModal appointment={selectedAppointment} onClose={handleCloseAppointment} />
        </Modal>
      )}
      <BoxHeader title={'בוקר טוב, ' + user.name} subtitle={'הנה סקירה כללית של ההזמנות שלך היום.'} />
      {loadingState ? <p>טוען נתונים...</p> : <DashboardStats items={items} />}
      <div className="container-box nivg-order">
        <div className="nivg-order-header">
          <span className="nivg-order-title">בקשות אישור ממתינות</span>
          <span className="nivg-order-badge">15 ממתינים</span>
        </div>
        <div className="nivg-order-content">
          <div className="nivg-order-left">
            <div className="nivg-order-iconBox">
              <BellRing size={27} />
            </div>
            <div className="nivg-order-texts">
              <span className="nivg-order-mainText">בקשות לפגישות דורשות את תשומת לבך</span>
              <span className="nivg-order-subText">סקירה ואישור של הזמנות חדשות</span>
              <span className="nivg-order-metaText">הזמנה אחרונה: לפני 15 דקות</span>
            </div>
          </div>
          <div className="nivg-order-right">
            <button className="nivg-order-btn">בקשות סקירה</button>
          </div>
        </div>
      </div>
      <div className="today-layout">
        <div className="container-box today-card">
          <div className="today-card-header">
            <span className="today-card-title">לוח הזמנים של היום</span>
            <span className="today-card-date">{formatDateTime(Date.now())}</span>
          </div>
          <div className="today-card-list">
            {appointmentDay.length > 0 ? (
              appointmentDay.map((item) => {
                const statusOption = SESSION_STATUS_OPTIONS.find((option) => option.value === item.sessionStatus);
                const status = {
                  label: statusOption?.label || 'לא ידוע',
                  className: SESSION_STATUS_CLASSES[item.sessionStatus] || 'is-pending',
                };
                return (
                  <button type="button" className="today-item" key={item._id} onClick={() => setSelectedAppointmentId(item._id)}>
                    <div className="today-item-right">
                      <span className={`today-item-indicator ${status.className}`} />
                      <div className="today-item-info">
                        <span>
                          {item.service?.groupTitle || '-'} • ד'ר {item.doctor?.name || '-'}
                        </span>
                        <span>
                          {item.patient?.name || '-'} - {item.time || '-'}
                        </span>
                      </div>
                    </div>
                    <div className={`today-item-status ${status.className}`}>
                      <span>{status.label}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="today-item no-appointments">
                <span>אין פגישות להיום</span>
              </div>
            )}
          </div>
        </div>
        <div className="container-box quick-mgmt">
          <span className="quick-mgmt-title">נהלים מהירים</span>
          <div className="quick-mgmt-list">
            {fastManagement.map((item) => (
              <div className="quick-mgmt-item" key={item._id} onClick={() => setSelectedAction(item)}>
                <div className="quick-mgmt-left">
                  <span
                    className="quick-mgmt-icon"
                    style={{
                      '--bg': item.backColor,
                      '--color': item.iconColor,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="quick-mgmt-name">{item.mangName}</span>
                </div>
                <div className="quick-mgmt-arrow">
                  <MdArrowBack />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MeetingTable headerTextTable={'בקשות אחרונות לפגישות'} moreBtn />
      {selectedAction && (
        <Modal isOpen onClose={() => setSelectedAction(null)} title={selectedAction.modalTitle} size="xl">
          {selectedAction.component}
        </Modal>
      )}
    </div>
  );
};
export default SecretaryDashboard;
