import { useMemo, useState } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import { FiPlus, FiSearch } from 'react-icons/fi';
import AddDoctorModal from '../../../modals/DoctorModal/AddDoctorModal';
import Modal from '../../../../components/modal/Modal';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryDoctorsStats } from '../../../../utils/dashboardDataStats/dataStats';
import DataTable from '../../../components/dataTable/DataTable';
import './doctorsManagement.css';

const DoctorsManagement = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const doctors = [
    {
      _id: 'P001251',
      name: 'د. إميلي تشين',
      initials: 'אצ',
      phone: '+1 (555) 123-4567',
      email: 'emily.chen@email.com',
      typeWork: 'full',
      doctorAppointments: {
        dateTime: '2024-12-15T09:00:00',
        treatment: 'Routine Cleaning',
      },
      specialization: 'רפואת שיניים מונעת',
    },
    {
      _id: 'P001252',
      name: 'د. إميلي تشين',
      initials: 'אצ',
      phone: '+1 (555) 123-4567',
      email: 'emily.chen@email.com',
      typeWork: 'full',
      doctorAppointments: {
        dateTime: '2024-12-15T09:00:00',
        treatment: 'Routine Cleaning',
      },
      specialization: 'רפואת שיניים מונעת',
    },
    {
      _id: 'P001253',
      name: 'د. إميلي تشين',
      initials: 'אצ',
      phone: '+1 (555) 123-4567',
      email: 'emily.chen@email.com',
      typeWork: 'full',
      doctorAppointments: {
        dateTime: '2024-12-15T09:00:00',
        treatment: 'Routine Cleaning',
      },
      specialization: 'רפואת שיניים מונעת',
    },
  ];
  const doctorColumns = [
    {
      key: 'doctor',
      title: 'הרופא',
      width: '1fr',
      render: (item) => (
        <div className="appt-doctor">
          <div className="appt-doctor-avatar">{item.initials || 'AA'}</div>

          <div className="appt-doctor-info">
            <span className="appt-doctor-name">{item.name}</span>
            <span className="appt-doctor-id">מזהה: #{item._id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'צור קשר',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-doctor-contacts">
          <span className="appt-doctor-phone">{item.phone}</span>
          <span className="appt-doctor-email">{item.email}</span>
        </div>
      ),
    },
    {
      key: 'typeWork',
      title: 'סוג העבודה',
      width: '1.2fr',
      render: (item) => <div className="appt-typeWork">{item.typeWork}</div>,
    },
    {
      key: 'nextAppointment',
      title: 'הפגישה הבאה',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-doctor-next-visit">
          {item.nextAppointment ? (
            <>
              <span className="appt-doctor-date-time">
                {item.nextAppointment.dateTime}
              </span>
              <span className="appt-doctor-treatment">
                {item.nextAppointment.treatment}
              </span>
            </>
          ) : (
            <span className="appt-doctor-no-time">אין תאריכים קרובים</span>
          )}
        </div>
      ),
    },
    {
      key: 'specialization',
      title: 'התמחות',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-specialization">{item.specialization}</div>
      ),
    },
  ];

  const filteredDoctor = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return doctors;

    return doctors.filter((p) => {
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        String(p._id || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query]);

  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        onAction={() => {
          setOpen(true);
        }}
        title={'ניהול הרופאים'}
        subtitle={'ניהול וצפייה בכל רישומי הרופאים'}
        actionIcon={<FiPlus size={20} />}
        actionLabel={'הוסף רופא חדש'}
      />
      <DashboardStats items={secretaryDoctorsStats} />

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="הוספת רופא חדש"
        size="xl"
      >
        <AddDoctorModal />
      </Modal>

      <div className="container-box">
        <div className="doctors-management-top">
          <span className="doctors-management-title"> הרופאים</span>

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
            </div>
          </div>
        </div>
        <DataTable
          columns={doctorColumns}
          data={filteredDoctor}
          rowKey="_id"
          classPrefix="data-table"
          emptyText="אין תוצאות"
          defaultPageSize={5}
        />
      </div>
    </div>
  );
};

export default DoctorsManagement;
