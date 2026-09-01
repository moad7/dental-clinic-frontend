import React, { useContext, useMemo, useState } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import MeetingTable from '../../../components/meetingTable/meetingTable';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdOutlineFilterList } from 'react-icons/md';
import { LuSettings, LuSettings2 } from 'react-icons/lu';
import { RiDownloadCloud2Line } from 'react-icons/ri';
import AddMeetingsModal from '../../../modals/addMeetingsModal/AddMeetingsModal';
import Modal from '../../../../components/modal/Modal';
import { AppDataContext } from '../../../../context/AppDataContext';
import DataTable from '../../../components/dataTable/DataTable';
import { formatAppointmentDate } from '../../../../utils/functions';
import { StatusBadge } from '../../../components/statusBadge/StatusBadge';
import MeetingsDetailsModal from '../../../modals/addMeetingsModal/meetingsDetailsModal/MeetingsDetailsModal';
import { confirmDateById } from '../../../../api/appointmentApi';
import { AuthContext } from '../../../../context/AuthContext';
import { toast } from 'react-toastify';
import { PillButton } from '../../../../utils/ButtonFanctions';
const MeetingsManagement = () => {
  const { appointments, loadAllAppointments } = useContext(AppDataContext);
  const { token } = useContext(AuthContext);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const normalizedAppointments = useMemo(() => {
    return (Array.isArray(appointments) ? appointments : []).map((appt) => ({
      _id: appt._id,
      patientName: appt.treatmentId?.userId?.name || '-',
      patientPhone: appt.treatmentId?.userId?.phoneNumber || '-',
      initials:
        appt.initials ||
        appt.treatmentId.userId.name
          ?.split(' ')
          .slice(0, 2)
          .map((word) => word[0])
          .join('') ||
        'AA',

      serviceName: appt.treatmentId?.serviceItem?.name || '-',
      requestDate: appt.date,
      requestTime: appt.time,
      doctorName: appt.doctorId?.name || '-',
      sessions: appt.treatmentId.totalSessions,
      treatmentStatus: appt.treatmentId?.status,
      sessionStatus: appt.status,
      raw: appt,
    }));
  }, [appointments]);

  const appointmentColumns = [
    {
      key: 'patient',
      title: 'המטופל',
      width: '1.5fr',
      render: (item) => (
        <div className="appt-patient">
          <div className="appt-patient-avatar">{item.initials || 'AA'}</div>

          <div className="appt-patient-info">
            <span className="appt-patient-name">{item.patientName}</span>
            <span className="appt-patient-phone">{item.patientPhone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'service',
      title: 'שירות',
      width: '1fr',
      render: (item) => <div className="appt-cell">{item.serviceName}</div>,
    },
    {
      key: 'date',
      title: 'תאריך הזמנה',
      width: '1fr',
      render: (item) => (
        <div className="appt-cell">
          {formatAppointmentDate(item.requestDate, item.requestTime)}
        </div>
      ),
    },
    {
      key: 'doctor',
      title: 'רופא',
      width: '1fr',
      render: (item) => <div className="appt-cell">{item.doctorName}</div>,
    },
    {
      key: 'treatmentStatus',
      title: 'סטטוס טיפול',
      width: '1fr',
      render: (item) => (
        <StatusBadge type="treatment" status={item.treatmentStatus} />
      ),
    },
    {
      key: 'sessionStatus',
      title: 'סטטוס מפגש',
      width: '1fr',
      render: (item) => (
        <StatusBadge type="session" status={item.sessionStatus} />
      ),
    },
    {
      key: 'sessions',
      title: 'מפגשים',
      width: '1fr',
      render: (item) => <div className="appt-cell">{item.sessions}</div>,
    },
    {
      key: 'actions',
      title: 'נהלים',
      width: '1.3fr',

      render: (item) => {
        const isApproving = loadingAction === `${item._id}-approve`;
        const isRejecting = loadingAction === `${item._id}-reject`;
        const isLoading = isApproving || isRejecting;
        return (
          <div className="appt-actions">
            {item.sessionStatus === 'pending' ? (
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
                  setSelectedAppointment(item);
                }}
              >
                הצג פרטים
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const filteredAppointments = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return normalizedAppointments;

    return normalizedAppointments.filter((appt) => {
      return (
        (appt.patientName || '').toLowerCase().includes(q) ||
        (appt.patientPhone || '').toLowerCase().includes(q) ||
        (appt.serviceName || '').toLowerCase().includes(q) ||
        (appt.doctorName || '').toLowerCase().includes(q) ||
        (appt.sessionStatus || '').toLowerCase().includes(q) ||
        String(appt._id || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, normalizedAppointments]);
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
      <div className="container-box">
        <div className="doctors-management-top">
          <span className="doctors-management-title">בקשות לפגישות</span>

          <div className="toolbar">
            <div className="toolbar__left">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="למצוא את הרופא..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="filter-btn">
                <LuSettings />
                <span>הכל</span>
                <IoIosArrowDown />
              </div>
            </div>
            <div className="print-btn">
              <RiDownloadCloud2Line />
              <span>הדפסה</span>
            </div>
          </div>
        </div>
        <DataTable
          columns={appointmentColumns}
          data={filteredAppointments}
          rowKey="_id"
          classPrefix="data-table"
          emptyText="אין תורים"
          defaultPageSize={5}
        />
      </div>
    </div>
  );
};

export default MeetingsManagement;
