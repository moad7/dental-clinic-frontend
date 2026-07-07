import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { fetchPatientFullDetailsBySecretary } from '../../../../api/secretaryApi';
import './patientModalSecretary.css';

const PatientModalSecretary = ({ patientId }) => {
  const { token } = useContext(AuthContext);

  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetchPatientFullDetailsBySecretary(patientId, token);
      console.log(res);

      setPatientData(res);
    } catch (err) {
      console.log(err);
      setError('אירעה שגיאה בטעינת פרטי המטופל');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) loadPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-secretary-modal-loading">טוען פרטי מטופל...</div>
    );
  }

  if (error) {
    return <div className="patient-secretary-modal-error">{error}</div>;
  }

  if (!patientData) {
    return null;
  }

  const { user, patientProfile, statistics, treatments } = patientData;

  const currentTreatments =
    activeTab === 'active'
      ? treatments?.active || []
      : activeTab === 'previous'
        ? treatments?.previous || []
        : treatments?.all || [];

  return (
    <div className="patient-secretary-modal" dir="rtl">
      <div className="patient-secretary-modal-hero">
        <div className="patient-secretary-modal-avatar">
          {user?.name
            ?.split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('') || 'AA'}
        </div>

        <div className="patient-secretary-modal-main-info">
          <h2>{user?.name || 'ללא שם'}</h2>
          <span>מזהה: #{user?._id}</span>
          <div className="patient-secretary-modal-status">
            {user?.isActive ? 'פעיל' : 'לא פעיל'}
          </div>
        </div>
      </div>

      <div className="patient-secretary-modal-info-grid">
        <div className="patient-secretary-modal-info-card">
          <span>תעודת זהות</span>
          <strong>{user?.idNumber || '-'}</strong>
        </div>

        <div className="patient-secretary-modal-info-card">
          <span>טלפון</span>
          <strong>{user?.phoneNumber || '-'}</strong>
        </div>

        <div className="patient-secretary-modal-info-card">
          <span>אימייל</span>
          <strong>{user?.email || '-'}</strong>
        </div>

        <div className="patient-secretary-modal-info-card">
          <span>מין</span>
          <strong>
            {user?.gender === 'male'
              ? 'זכר'
              : user?.gender === 'female'
                ? 'נקבה'
                : '-'}
          </strong>
        </div>

        <div className="patient-secretary-modal-info-card">
          <span>עיר</span>
          <strong>{patientProfile?.city || '-'}</strong>
        </div>

        <div className="patient-secretary-modal-info-card">
          <span>נוצר בתאריך</span>
          <strong>
            {patientProfile?.createdAt
              ? new Date(patientProfile.createdAt).toLocaleDateString('he-IL')
              : '-'}
          </strong>
        </div>
      </div>

      <div className="patient-secretary-modal-stats">
        <div className="patient-secretary-modal-stat-card">
          <span>כל הטיפולים</span>
          <strong>{statistics?.totalTreatments || 0}</strong>
        </div>

        <div className="patient-secretary-modal-stat-card green">
          <span>פעילים</span>
          <strong>{statistics?.activeTreatments || 0}</strong>
        </div>

        <div className="patient-secretary-modal-stat-card blue">
          <span>הושלמו</span>
          <strong>{statistics?.completedTreatments || 0}</strong>
        </div>

        <div className="patient-secretary-modal-stat-card red">
          <span>בוטלו</span>
          <strong>{statistics?.cancelledTreatments || 0}</strong>
        </div>
      </div>

      <div className="patient-secretary-modal-notes">
        <div>
          <span>אלרגיות</span>
          <p>{patientProfile?.allergies || 'אין אלרגיות רשומות'}</p>
        </div>

        <div>
          <span>הערות</span>
          <p>{patientProfile?.notes || 'אין הערות'}</p>
        </div>
      </div>

      <div className="patient-secretary-modal-tabs">
        <button
          type="button"
          className={activeTab === 'active' ? 'active' : ''}
          onClick={() => setActiveTab('active')}
        >
          טיפולים פעילים
        </button>

        <button
          type="button"
          className={activeTab === 'previous' ? 'active' : ''}
          onClick={() => setActiveTab('previous')}
        >
          טיפולים קודמים
        </button>

        <button
          type="button"
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          כל הטיפולים
        </button>
      </div>

      <div className="patient-secretary-modal-treatments">
        {currentTreatments.length > 0 ? (
          currentTreatments.map((treatment) => (
            <div
              className="patient-secretary-modal-treatment-card"
              key={treatment._id}
            >
              <div className="patient-secretary-modal-treatment-main">
                <strong>
                  {treatment.serviceGroupId?.title ||
                    treatment.serviceId?.title ||
                    'טיפול ללא שם'}
                </strong>

                <span>
                  {treatment.createdAt
                    ? new Date(treatment.createdAt).toLocaleDateString('he-IL')
                    : '-'}
                </span>
              </div>

              <div className="patient-secretary-modal-treatment-meta">
                <span>מספר מפגשים: {treatment.totalSessions || 1}</span>
                <span
                  className={`patient-secretary-modal-treatment-status ${treatment.status}`}
                >
                  {treatment.status === 'in_progress'
                    ? 'בתהליך'
                    : treatment.status === 'completed'
                      ? 'הושלם'
                      : treatment.status === 'cancelled'
                        ? 'בוטל'
                        : treatment.status}
                </span>
              </div>

              {treatment.note && (
                <p className="patient-secretary-modal-treatment-note">
                  {treatment.note}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="patient-secretary-modal-empty">אין טיפולים להצגה</div>
        )}
      </div>
    </div>
  );
};

export default PatientModalSecretary;
