import './patientsManagement.css';
import BoxHeader from '../../../../pages/components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryPatientsStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useMemo, useState } from 'react';
import DataTable from '../../../components/dataTable/DataTable';

const PatientsManagement = () => {
  const patients = [
    {
      _id: 'P001251',
      name: "אמילי צ'ן",
      initials: 'אצ',
      phone: '+1 (555) 123-4567',
      email: 'emily.chen@email.com',
      lastVisit: '2024-12-08',
      nextAppointment: {
        dateTime: '2024-12-15T09:00:00',
        treatment: 'Routine Cleaning',
      },
    },
    {
      _id: 'P001252',
      name: 'מרקוס רודריגז',
      initials: 'מר',
      phone: '+1 (555) 234-5678',
      email: 'marcus.r@email.com',
      lastVisit: '2024-11-28',
      nextAppointment: {
        dateTime: '2024-12-16T10:30:00',
        treatment: 'Root Canal',
      },
    },
    {
      _id: 'P001253',
      name: 'שרה ויליאמס',
      initials: 'שו',
      phone: '+1 (555) 345-6789',
      email: 'sarah.w@email.com',
      lastVisit: '2024-12-05',
      nextAppointment: {
        dateTime: '2024-12-18T14:00:00',
        treatment: 'Consultation',
      },
    },
    {
      _id: 'P001254',
      name: "ג'יימס דייוויס",
      initials: 'גד',
      phone: '+1 (555) 456-7890',
      email: 'james.davis@email.com',
      lastVisit: '2024-10-15',
      nextAppointment: null,
    },
    {
      _id: 'P001255',
      name: 'אמנדה מילר',
      initials: 'אמ',
      phone: '+1 (555) 567-8901',
      email: 'amanda.m@email.com',
      lastVisit: '2024-12-10',
      nextAppointment: {
        dateTime: '2024-12-20T11:00:00',
        treatment: 'Teeth Whitening',
      },
    },
  ];

  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return patients;

    return patients.filter((p) => {
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

  const patientColumns = [
    {
      key: 'patient',
      title: 'המטופל',
      width: '1fr',
      render: (item) => (
        <div className="appt-patient">
          <div className="appt-patient-avatar">{item.initials || 'AA'}</div>

          <div className="appt-patient-info">
            <span className="appt-patient-name">{item.name}</span>
            <span className="appt-patient-id">מזהה: #{item._id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'צור קשר',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-patient-contacts">
          <span className="appt-patient-phone">{item.phone}</span>
          <span className="appt-patient-email">{item.email}</span>
        </div>
      ),
    },
    {
      key: 'lastVisit',
      title: 'ביקור אחרון',
      width: '1.2fr',
      render: (item) => <div className="appt-last-visit">{item.lastVisit}</div>,
    },
    {
      key: 'nextAppointment',
      title: 'הפגישה הבאה',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-patient-next-visit">
          {item.nextAppointment ? (
            <>
              <span className="appt-patient-date-time">
                {item.nextAppointment.dateTime}
              </span>
              <span className="appt-patient-treatment">
                {item.nextAppointment.treatment}
              </span>
            </>
          ) : (
            <span className="appt-patient-no-time">אין תאריכים קרובים</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'נהלים',
      width: '1.9fr',
      render: () => (
        <div className="appt-patient-procedures">
          <button
            className="appt-patient-procedures-btn"
            type="button"
            style={{ color: '#EA580C' }}
          >
            תזמון
          </button>

          <button
            className="appt-patient-procedures-btn"
            type="button"
            style={{ color: '#4B5563' }}
          >
            עריכה
          </button>

          <button
            className="appt-patient-procedures-btn"
            type="button"
            style={{ color: '#2E90FA' }}
          >
            הצג
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="main-container" dir="rtl">
      <BoxHeader
        title="ניהול מטופלים"
        subtitle="ניהול וצפייה בכל רישומי המטופלים"
        actionIcon={<FiPlus size={20} />}
        actionLabel="הוסף מטופל חדש"
      />

      <DashboardStats items={secretaryPatientsStats} />

      <div className="container-box">
        <div className="patients-management-top">
          <span className="patients-management-title">רישומי מטופלים</span>

          <div className="toolbar">
            <div className="toolbar__left">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="למצוא את המטופל..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={patientColumns}
          data={filteredPatients}
          rowKey="_id"
          classPrefix="patients-table"
          emptyText="אין תוצאות"
          defaultPageSize={5}
        />
      </div>
    </div>
  );
};

export default PatientsManagement;
