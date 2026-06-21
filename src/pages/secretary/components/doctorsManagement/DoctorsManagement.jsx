import { useMemo, useState, useContext } from 'react';
import BoxHeader from '../../../components/boxHeader/BoxHeader';
import { FiPlus, FiSearch } from 'react-icons/fi';
import AddDoctorModal from '../../../modals/DoctorModal/AddDoctorModal';
import Modal from '../../../../components/modal/Modal';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryDoctorsStats } from '../../../../utils/dashboardDataStats/dataStats';
import DataTable from '../../../components/dataTable/DataTable';
import './doctorsManagement.css';
import { AppDataContext } from '../../../../context/AppDataContext';
const DoctorsManagement = () => {
  const { doctors } = useContext(AppDataContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedDoctors = useMemo(() => {
    return (Array.isArray(doctors) ? doctors : []).map((doctor) => ({
      _id: doctor._id,
      name: doctor.name,
      initials:
        doctor.name
          ?.split(' ')
          .slice(0, 2)
          .map((word) => word[0])
          .join('') || 'DR',

      phone: doctor.phoneNumber,
      email: doctor.email,
      gender: doctor.gender,
      avatar: doctor.avatar,

      status: doctor.isActive ? 'active' : 'inactive',

      specialization:
        doctor.doctor?.services
          ?.map((s) => s.groupId?.title)
          .filter(Boolean)
          .join(', ') || 'ללא התמחות',

      workingHours: doctor.doctor?.workingHours || [],
      raw: doctor,
    }));
  }, [doctors]);
  const doctorColumns = [
    {
      key: 'doctor',
      title: 'הרופא',
      width: '1fr',
      render: (item) => (
        <div className="appt-doctor">
          <div className="appt-doctor-avatar">{item.initials || 'AA'}</div>

          <div className="appt-doctor-info">
            <span className="appt-doctor-name">ד"ר {item.name}</span>
            {/* <span className="appt-doctor-id">מזהה: #{item._id}</span> */}
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
      key: 'gender',
      title: 'מיון',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-gender">
          {item.gender == 'male' ? 'זכר' : 'נקבה'}
        </div>
      ),
    },
    {
      key: 'typeWork',
      title: 'סוג העבודה',
      width: '1.2fr',
      render: (item) => {
        const activeDays =
          item.workingHours?.filter((day) => !day.isClosed).length || 0;

        return (
          <span>{activeDays == 7 ? 'כל הימים' : activeDays + ' ימים'}</span>
        );
      },
      // render: (item) => <div className="appt-typeWork">{item.typeWork}</div>,
    },

    {
      key: 'specialization',
      title: 'התמחות',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-specialization">{item.specialization}</div>
      ),
    },
    {
      key: 'status',
      title: 'סטאטוס',
      width: '1.2fr',
      render: (item) => (
        <span
          style={{
            color: item.status === 'active' ? '#16A34A' : '#DC2626',
            fontWeight: 600,
          }}
        >
          {item.status === 'active' ? 'פעיל' : 'לא פעיל'}
        </span>
      ),
    },
  ];

  const filteredDoctor = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return normalizedDoctors;

    return normalizedDoctors.filter((p) => {
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        String(p._id || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, normalizedDoctors]);

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
        <AddDoctorModal setOpen={setOpen} open={open} />
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
          emptyText="אין רופאים"
          defaultPageSize={5}
        />
      </div>
    </div>
  );
};

export default DoctorsManagement;
