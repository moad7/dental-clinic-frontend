import './patientsManagement.css';
import BoxHeader from '../../../../pages/components/boxHeader/BoxHeader';
import DashboardStats from '../../../components/dashboardStats/DashboardStats';
import { secretaryPatientsStats } from '../../../../utils/dashboardDataStats/dataStats';
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiChevronDown,
  FiSettings,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import DataTable from '../../../components/dataTable/DataTable';
import { AppDataContext } from '../../../../context/AppDataContext';
import Modal from '../../../../components/modal/Modal';
import AddPatientModal from '../../../modals/patientModal/AddPatientModal';
import PatientModalSecretary from '../../../modals/patientModal/patientModalSevretary/PatientModalSecretary';
const PatientsManagement = () => {
  const { patients } = useContext(AppDataContext);
  const [open, setOpen] = useState(false);
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: 'all',
    gender: 'all',
    status: 'all',
  });
  const filterRef = useRef(null);
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const resetFilters = () => {
    setFilters({
      city: 'all',
      gender: 'all',
      status: 'all',
    });
  };
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== 'all',
  ).length;
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  const normalizedPatients = useMemo(() => {
    return (Array.isArray(patients) ? patients : [])
      .filter((patient) => patient?.userId?._id)
      .map((patient) => {
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
          _id: patient.userId._id,
          idNumber: patient.userId?.idNumber || '-',
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
          city: patient.city || '-',
          gender: patient.userId?.gender
            ? patient.userId.gender === 'male'
              ? 'זכר'
              : 'נקבה'
            : '-',
          status: patient.userId?.isActive ? 'active' : 'inactive',
          lastVisit: patient.lastVisit
            ? new Date(patient.lastVisit).toLocaleDateString('he-IL')
            : '-',
          nextAppointment: nextSession
            ? {
                dateTime: `${new Date(nextSession.date).toLocaleDateString(
                  'he-IL',
                )} ${nextSession.time}`,
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
      });
  }, [patients]);
  const availableCities = useMemo(() => {
    return [
      ...new Set(
        normalizedPatients
          .map((patient) => patient.city?.trim())
          .filter((city) => city && city !== '-'),
      ),
    ].sort((a, b) => a.localeCompare(b, 'he'));
  }, [normalizedPatients]);
  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalizedPatients.filter((patient) => {
      const matchesSearch =
        !q ||
        [
          patient.idNumber,
          patient.name,
          patient.email,
          patient.phone,
          patient._id,
        ].some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(q),
        );
      const matchesCity =
        filters.city === 'all' || patient.city === filters.city;
      const matchesGender =
        filters.gender === 'all' || patient.gender === filters.gender;
      const matchesStatus =
        filters.status === 'all' || patient.status === filters.status;
      return matchesSearch && matchesCity && matchesGender && matchesStatus;
    });
  }, [query, normalizedPatients, filters]);
  const patientColumns = [
    {
      key: 'patient',
      title: 'המטופל',
      width: '1fr',
      render: (item) => (
        <div
          className="appt-patient"
          onClick={() => {
            setPatientId(item._id);
            setOpen(true);
          }}
        >
          <div className="appt-patient-avatar">{item.initials || 'AA'}</div>
          <div className="appt-patient-info">
            <span className="appt-patient-name">{item.name}</span>
            <span className="appt-patient-id">
              מזהה: {item.idNumber ?? '-'}#
            </span>
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
          <span className="appt-patient-phone">{item.phone ?? '-'}</span>
          <span className="appt-patient-email">{item.email ?? '-'}</span>
        </div>
      ),
    },
    {
      key: 'city',
      title: 'עיר',
      width: '1.2fr',
      render: (item) => <div className="appt-city">{item.city ?? '-'}</div>,
    },
    {
      key: 'gender',
      title: 'מין',
      width: '1.2fr',
      render: (item) => <div className="appt-gender">{item.gender ?? '-'}</div>,
    },
    {
      key: 'lastVisit',
      title: 'ביקור אחרון',
      width: '1.2fr',
      render: (item) => (
        <div className="appt-last-visit">{item.lastVisit ?? '-'}</div>
      ),
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
      key: 'status',
      title: 'סטאטוס',
      width: '1.2fr',
      render: (item) => (
        <span
          className={`appt-patient-status ${item.status === 'active' ? 'active' : 'inactive'}`}
        >
          {item.status === 'active' ? 'פעיל' : 'לא פעיל'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'נהלים',
      width: '1.9fr',
      render: (item) => (
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
            onClick={() => {
              setPatientId(item._id);
              setOpen(true);
            }}
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
        onAction={() => {
          setOpenAddPatient(true);
        }}
      />
      <Modal
        isOpen={openAddPatient}
        onClose={() => setOpenAddPatient(false)}
        title="הוספת מטופל חדש"
        size="xl"
      >
        <AddPatientModal setOpen={setOpenAddPatient} open={openAddPatient} />
      </Modal>
      <DashboardStats items={secretaryPatientsStats} />
      <div className="container-box">
        <div className="patients-management-top">
          <span className="patients-management-title">רישומי מטופלים</span>
          <div className="toolbar patients-toolbar">
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
              <div className="patient-filter" ref={filterRef}>
                <button
                  type="button"
                  className={`patient-filter__trigger ${
                    filtersOpen || activeFiltersCount > 0
                      ? 'patient-filter__trigger--active'
                      : ''
                  }`}
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  aria-expanded={filtersOpen}
                  aria-haspopup="true"
                >
                  <FiSettings size={17} />
                  <span>
                    {activeFiltersCount > 0
                      ? `סינון (${activeFiltersCount})`
                      : 'הכל'}
                  </span>
                  <FiChevronDown
                    size={16}
                    className={`patient-filter__chevron ${
                      filtersOpen ? 'patient-filter__chevron--open' : ''
                    }`}
                  />
                </button>
                {filtersOpen && (
                  <div className="patient-filter__dropdown">
                    <div className="patient-filter__header">
                      <div>
                        <strong>סינון מטופלים</strong>
                        <span>סינון לפי פרטי המטופל</span>
                      </div>
                      <button
                        type="button"
                        className="patient-filter__close"
                        onClick={() => setFiltersOpen(false)}
                        aria-label="סגירה"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                    <div className="patient-filter__body">
                      <div className="patient-filter__field">
                        <label htmlFor="patient-city-filter">עיר</label>
                        <select
                          id="patient-city-filter"
                          value={filters.city}
                          onChange={(e) => updateFilter('city', e.target.value)}
                        >
                          <option value="all">כל הערים</option>
                          {availableCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="patient-filter__field">
                        <label htmlFor="patient-gender-filter">מין</label>
                        <select
                          id="patient-gender-filter"
                          value={filters.gender}
                          onChange={(e) =>
                            updateFilter('gender', e.target.value)
                          }
                        >
                          <option value="all">הכל</option>
                          <option value="זכר">זכר</option>
                          <option value="נקבה">נקבה</option>
                        </select>
                      </div>
                      <div className="patient-filter__field">
                        <label htmlFor="patient-status-filter">סטאטוס</label>
                        <select
                          id="patient-status-filter"
                          value={filters.status}
                          onChange={(e) =>
                            updateFilter('status', e.target.value)
                          }
                        >
                          <option value="all">הכל</option>
                          <option value="active">פעיל</option>
                          <option value="inactive">לא פעיל</option>
                        </select>
                      </div>
                    </div>
                    <div className="patient-filter__footer">
                      <button
                        type="button"
                        className="patient-filter__reset"
                        onClick={resetFilters}
                        disabled={activeFiltersCount === 0}
                      >
                        איפוס סינון
                      </button>
                      <button
                        type="button"
                        className="patient-filter__apply"
                        onClick={() => setFiltersOpen(false)}
                      >
                        <FiCheck size={16} />
                        סיום
                      </button>
                    </div>
                  </div>
                )}
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
      {patientId && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="פרטי מטופל"
          size="xl"
        >
          <PatientModalSecretary patientId={patientId} />
        </Modal>
      )}
    </div>
  );
};
export default PatientsManagement;
