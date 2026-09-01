import { useLocation, useNavigate } from 'react-router-dom';
import './meetingTable.css';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdOutlineFilterList } from 'react-icons/md';
import { LuSettings2 } from 'react-icons/lu';
import { RiDownloadCloud2Line } from 'react-icons/ri';

import { AppDataContext } from '../../../context/AppDataContext';
import { AuthContext } from '../../../context/AuthContext';

import { formatAppointmentDate } from '../../../utils/functions';
import { StatusBadge } from '../statusBadge/StatusBadge';
import { confirmDateById } from '../../../api/appointmentApi';
import Modal from '../../../components/modal/Modal';
import MeetingsDetailsModal from '../../modals/addMeetingsModal/meetingsDetailsModal/MeetingsDetailsModal';
import { PillButton } from '../../../utils/ButtonFanctions';

const MeetingTable = ({ moreBtn, headerTextTable }) => {
  const { appointments, loadAllAppointments } = useContext(AppDataContext);
  const { token } = useContext(AuthContext);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [loadingAction, setLoadingAction] = useState(null);

  const isMeetingsManagement = pathname.endsWith('/meetingsManagement');

  const confirmDate = async (appointmentId, decision) => {
    const loadingKey = `${appointmentId}-${decision}`;

    try {
      setLoadingAction(loadingKey);
      await confirmDateById(appointmentId, decision, token);
      toast.success(
        decision === 'approve' ? 'התור אושר בהצלחה' : 'התור נדחה בהצלחה',
      );
      await loadAllAppointments();
    } catch (error) {
      console.error('confirmDate error:', error);
      const message =
        error?.response?.data?.message || 'אירעה שגיאה בעדכון התור';
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      className="container-box appt-card"
      style={{
        height: isMeetingsManagement ? '922px' : '428px',
      }}
    >
      {selectedAppointment && (
        <Modal
          isOpen={Boolean(selectedAppointment)}
          onClose={() => setSelectedAppointment(null)}
          title="פרטי המפגש"
          size="xl"
        >
          <MeetingsDetailsModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        </Modal>
      )}
      <div className="appt-card-top">
        <span className="appt-card-title">{headerTextTable}</span>

        {moreBtn && (
          <button
            type="button"
            className="appt-card-btn-outline"
            onClick={() => {
              navigate('../secretary/meetingsManagement');
            }}
          >
            הצג הכל
          </button>
        )}
      </div>

      <div className="appt-table-header">
        <div>המטופל</div>
        <div>שירות</div>
        <div>תאריך הזמנה</div>
        <div>רופא</div>
        <div>סטטוס טיפול</div>
        <div>סטטוס מפגש</div>
        <div>נהלים</div>
      </div>

      <div
        className={
          isMeetingsManagement
            ? 'appt-table-body-meetings-management'
            : 'appt-table-body'
        }
      >
        {appointments.slice(0, 4).map((item) => {
          const isApproving = loadingAction === `${item._id}-approve`;
          const isRejecting = loadingAction === `${item._id}-reject`;
          const isLoading = isApproving || isRejecting;

          return (
            <div className="appt-row" key={item._id}>
              <div className="appt-patient">
                <div className="appt-patient-avatar">
                  {item.treatmentId.userId.name
                    ?.split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('') || 'AA'}
                </div>

                <div className="appt-patient-info">
                  <span className="appt-patient-name">
                    {item.treatmentId.userId.name ?? '-'}
                  </span>

                  <span className="appt-patient-phone">
                    {item.treatmentId.userId.phoneNumber ?? '-'}
                  </span>
                </div>
              </div>

              <div className="appt-cell">
                {item.treatmentId.serviceItem.name ?? '-'}
              </div>

              <div className="appt-cell">
                {formatAppointmentDate(item.date, item.time) ?? '-'}
              </div>

              <div className="appt-cell">{item.doctorId.name ?? '-'}</div>

              <div>
                <StatusBadge
                  type="treatment"
                  status={item.treatmentId.status}
                />
              </div>

              <div>
                <StatusBadge type="session" status={item.status} />
              </div>

              <div className="appt-actions">
                {item.status === 'pending' ? (
                  <>
                    <PillButton
                      bg="#DCFCE7"
                      color="#166534"
                      disabled={isLoading}
                      onClick={() => confirmDate(item._id, 'approve')}
                    >
                      {isApproving ? 'מאשר...' : 'הסכמה'}
                    </PillButton>

                    <PillButton
                      bg="#FEE2E2"
                      color="#991B1B"
                      disabled={isLoading}
                      onClick={() => confirmDate(item._id, 'reject')}
                    >
                      {isRejecting ? 'דוחה...' : 'נדחה'}
                    </PillButton>
                  </>
                ) : (
                  <button
                    className="appt-link"
                    type="button"
                    onClick={() => {
                      console.log(item);

                      setSelectedAppointment(item);
                    }}
                  >
                    הצג פרטים
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingTable;
