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
const MeetingsManagement = () => {
  const { appointments } = useContext(AppDataContext);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isUpdatingAppointment, setIsUpdatingAppointment] = useState(false);
  const [isDeletingAppointment, setIsDeletingAppointment] = useState(false);

  const normalizedAppointments = useMemo(() => {
    return (Array.isArray(appointments) ? appointments : []).map((appt) => ({
      _id: appt._id,

      patientName: appt.treatmentId.userId.name,
      patientPhone: appt.treatmentId.userId.phoneNumber,
      initials:
        appt.initials ||
        appt.treatmentId.userId.name
          ?.split(' ')
          .slice(0, 2)
          .map((word) => word[0])
          .join('') ||
        'AA',

      serviceName: appt.treatmentId.serviceItem.name ?? '-',
      requestDate: appt.date,
      requestTime: appt.time,
      doctorName: appt.doctorId.name,
      sessions: appt.treatmentId.totalSessions,
      treatmentStatus: appt.treatmentId?.status,
      sessionStatus: appt.status,
      raw: appt,
    }));
  }, [appointments]);

  console.log(normalizedAppointments);

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
      render: (item) => (
        <div className="appt-actions">
          {item.status === 'pending' ? (
            <>
              <PillButton bg="#DCFCE7" color="#166534" onClick={() => {}}>
                הסכמה
              </PillButton>

              <PillButton bg="#FEE2E2" color="#991B1B" onClick={() => {}}>
                נדחה
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
      ),
    },
  ];
  const PillButton = ({ children, bg, color, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="pill-button"
      style={{
        background: bg,
        color,
      }}
    >
      {children}
    </button>
  );
  const filteredAppointments = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return normalizedAppointments;

    return normalizedAppointments.filter((appt) => {
      return (
        (appt.patientName || '').toLowerCase().includes(q) ||
        (appt.patientPhone || '').toLowerCase().includes(q) ||
        (appt.serviceName || '').toLowerCase().includes(q) ||
        (appt.doctorName || '').toLowerCase().includes(q) ||
        (appt.status || '').toLowerCase().includes(q) ||
        String(appt._id || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, normalizedAppointments]);
  const handleUpdateAppointment = async (appointmentId, updateData) => {
    try {
      setIsUpdatingAppointment(true);

      // const response = await updateTreatmentSession(
      //   appointmentId,
      //   updateData,
      // );

      // setAppointments((prev) =>
      //   prev.map((appointment) =>
      //     appointment._id === appointmentId
      //       ? {
      //           ...appointment,
      //           ...response.session,
      //         }
      //       : appointment,
      //   ),
      // );

      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    } finally {
      setIsUpdatingAppointment(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setIsDeletingAppointment(true);

      // await deleteTreatmentSession(appointmentId);

      // setAppointments((prev) =>
      //   prev.filter(
      //     (appointment) => appointment._id !== appointmentId,
      //   ),
      // );

      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    } finally {
      setIsDeletingAppointment(false);
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
            isUpdating={isUpdatingAppointment}
            isDeleting={isDeletingAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={handleUpdateAppointment}
            onDelete={handleDeleteAppointment}
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
