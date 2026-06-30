import './patientsManagement.css';
import BoxHeader from '../../../../pages/components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryPatientsStats } from '../../../../utils/dashboardDataStats/dataStats';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useContext, useMemo, useState } from 'react';
import DataTable from '../../../components/dataTable/DataTable';
import { AppDataContext } from '../../../../context/AppDataContext';

const PatientsManagement = () => {
  const { patientsBySecretry } = useContext(AppDataContext);

  const normalizedPatients = useMemo(() => {
    return (Array.isArray(patientsBySecretry) ? patientsBySecretry : []).map(
      (patient) => {
        const sessions =
          patient.treatments?.flatMap((t) =>
            (t.Sessions || []).map((s) => ({
              ...s,
              treatment: t.serviceGroupId?.title || 'טיפול',
            })),
          ) || [];

        const nextSession =
          sessions
            .filter((s) => s.status === 'pending' || s.status === 'confirmed')
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;

        return {
          _id: patient.userId?._id || patient._id,
          patientProfileId: patient._id,
          name: patient.userId?.name || '',
          initials:
            patient.userId?.name
              ?.split(' ')
              .slice(0, 2)
              .map((word) => word[0])
              .join('') || 'AA',
          phone: patient.userId?.phoneNumber || '-',
          email: patient.userId?.email || '-',
          gender: patient.userId?.gender || '-',
          status: patient.userId?.isActive ? 'active' : 'inactive',
          lastVisit: patient.lastVisit || '-',

          nextAppointment: nextSession
            ? {
                dateTime: `${new Date(nextSession.date).toLocaleDateString('he-IL')} ${nextSession.time}`,
                treatment: nextSession.treatment,
              }
            : null,

          treatments:
            patient.treatments
              ?.map((t) => t.serviceGroupId?.title)
              .filter(Boolean)
              .join(', ') || 'אין טיפולים',

          raw: patient,
        };
      },
    );
  }, [patientsBySecretry]);
  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return normalizedPatients;

    return normalizedPatients.filter((p) => {
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        String(p._id || '')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [query, normalizedPatients]);

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
