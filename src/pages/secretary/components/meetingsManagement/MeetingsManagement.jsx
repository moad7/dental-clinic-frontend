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
const MeetingsManagement = () => {
  const { appointments } = useContext(AppDataContext);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  console.log(appointments);

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

      serviceName: appt.treatmentId.serviceItemId.name,
      requestDate: appt.date,
      requestTime: appt.time,
      doctorName: appt.doctorId.name,

      status: appt.treatmentId.status,
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
      key: 'status',
      title: 'המצב',
      width: '1fr',
      render: (item) => {
        const st = badgeStyle(item.status);

        return (
          <span
            className="appt-badge"
            style={{
              '--bg': st.bg,
              '--color': st.color,
            }}
          >
            {st.text}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'נהלים',
      width: '1.3fr',
      render: (item) => (
        <div className="appt-actions">
          {item.status === 'in_progress' ? (
            <>
              <PillButton bg="#DCFCE7" color="#166534" onClick={() => {}}>
                הסכמה
              </PillButton>

              <PillButton bg="#FEE2E2" color="#991B1B" onClick={() => {}}>
                נדחה
              </PillButton>
            </>
          ) : (
            <button className="appt-link" type="button" onClick={() => {}}>
              הצג פרטים
            </button>
          )}
        </div>
      ),
    },
  ];
  const badgeStyle = (type) => {
    const map = {
      confirmed: { bg: '#DCFCE7', color: '#166534', text: 'אושר' },
      pending: { bg: '#FFEDD5', color: '#9A3412', text: 'תליה' },
      rejected: { bg: '#FEE2E2', color: '#991B1B', text: 'נדחה' },
    };
    return map[type] || map.pending;
  };
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
