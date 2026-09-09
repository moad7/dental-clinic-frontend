import { useContext, useEffect, useMemo, useState } from 'react';
import { FiClock, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AppDataContext } from '../../../../../context/AppDataContext';
import { AuthContext } from '../../../../../context/AuthContext';
import { fetchDoctorAvailableSlots } from '../../../../../api/doctorApi';
import './bookingPage.css';
import { showErrorToast } from '../../../../../utils/errorMessages';
import { createAppointments } from '../../../../../api/appointmentApi';
const BookingPage = ({ service, setService }) => {
  const { doctors } = useContext(AppDataContext);
  const { token } = useContext(AuthContext);
  const today = useMemo(() => new Date(), []);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  /*
   * =========================================
   * DOCTORS FOR THIS SERVICE GROUP
   * =========================================
   */
  const availableDoctors = useMemo(() => {
    if (!service?.serviceGroupId) return [];
    return (Array.isArray(doctors) ? doctors : []).filter((doctor) => {
      if (!doctor?.isActive) return false;
      return doctor?.doctor?.services?.some((doctorService) => {
        const groupId = doctorService?.groupId?._id || doctorService?.groupId;
        return String(groupId) === String(service.serviceGroupId);
      });
    });
  }, [doctors, service?.serviceGroupId]);
  useEffect(() => {
    if (!availableDoctors.length) {
      setSelectedDoctorId(null);
      return;
    }
    const selectedStillExists = availableDoctors.some(
      (doctor) => doctor._id === selectedDoctorId,
    );
    if (!selectedStillExists) {
      setSelectedDoctorId(availableDoctors[0]._id);
    }
  }, [availableDoctors, selectedDoctorId]);
  const selectedDoctor = useMemo(() => {
    return availableDoctors.find((doctor) => doctor._id === selectedDoctorId);
  }, [availableDoctors, selectedDoctorId]);
  /*
   * =========================================
   * CALENDAR
   * =========================================
   */
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const calendarDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return {
      days: Array.from({ length: totalDays }, (_, index) => index + 1),
      firstDay,
    };
  }, [currentYear, currentMonth]);
  const formatDateForApi = (day) => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  /*
   * =========================================
   * LOAD AVAILABLE SLOTS
   * =========================================
   */
  useEffect(() => {
    if (!token || !selectedDoctorId || !selectedDate) {
      setAvailableSlots([]);
      setSelectedTime('');
      return;
    }
    let ignoreResult = false;
    const loadDoctorSlots = async () => {
      console.log('g', service?.serviceGroupId);
      console.log('i', service?.serviceItemId);
      try {
        setSlotsLoading(true);
        setSelectedTime('');
        setAvailableSlots([]);
        const result = await fetchDoctorAvailableSlots(
          {
            doctorId: selectedDoctorId,
            date: selectedDate,
            serviceGroupId: service?.serviceGroupId,
            serviceItemId: service?.serviceItemId,
          },
          token,
        );
        if (ignoreResult) return;
        setAvailableSlots(Array.isArray(result?.slots) ? result.slots : []);
      } catch (error) {
        if (ignoreResult) return;
        console.error('Failed to load slots:', error);
        setAvailableSlots([]);
        setSelectedTime('');
        toast.error('שגיאה בטעינת שעות זמינות');
      } finally {
        if (!ignoreResult) {
          setSlotsLoading(false);
        }
      }
    };
    loadDoctorSlots();
    return () => {
      ignoreResult = true;
    };
  }, [token, selectedDoctorId, selectedDate]);
  /*
   * =========================================
   * SPLIT SLOTS
   * =========================================
   */
  const morningSlots = useMemo(() => {
    return availableSlots.filter((slot) => {
      const hour = Number(slot.split(':')[0]);
      return hour < 12;
    });
  }, [availableSlots]);
  const afternoonSlots = useMemo(() => {
    return availableSlots.filter((slot) => {
      const hour = Number(slot.split(':')[0]);
      return hour >= 12;
    });
  }, [availableSlots]);
  /*
   * =========================================
   * TIME FORMAT
   * =========================================
   */
  const formatTimeLabel = (time) => {
    if (!time) return '';
    const [hourString, minute] = time.split(':');
    const hour = Number(hourString);
    if (hour < 12) {
      return `${hour}:${minute} בבוקר`;
    }
    if (hour === 12) {
      return `12:${minute} בצהריים`;
    }
    return `${hour - 12}:${minute} אחר הצהריים`;
  };
  /*
   * =========================================
   * DATE FORMAT FOR SUMMARY
   * =========================================
   */
  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return '-';
    const [year, month, day] = selectedDate.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  }, [selectedDate]);
  /*
   * =========================================
   * SELECT DOCTOR
   * =========================================
   */
  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setSelectedTime('');
  };
  /*
   * =========================================
   * SELECT DATE
   * =========================================
   */
  const handleDateSelect = (day) => {
    const selected = formatDateForApi(day);
    setSelectedDate(selected);
    setSelectedTime('');
  };
  /*
   * =========================================
   * CONFIRM
   * =========================================
   */
  const handleConfirmBooking = async () => {
    if (!selectedDoctor) {
      toast.error('יש לבחור רופא');
      return;
    }
    if (!selectedDate) {
      toast.error('יש לבחור תאריך');
      return;
    }
    if (!selectedTime) {
      toast.error('יש לבחור שעה');
      return;
    }
    const bookingData = {
      serviceGroupId: service.serviceGroupId,
      serviceItemId: service._id,
      doctorId: selectedDoctor._id,
      session: {
        date: selectedDate,
        time: selectedTime,
      },
      requiresMultipleSessions: false,
      totalSessions: 1,
      note: '',
    };
    try {
      setBookingLoading(true);
      const response = await createAppointments(bookingData, token);
      toast.success('התור נקבע בהצלחה');
      console.log('Appointment created:', response);
      // ننظف الوقت لأن slot صار محجوز
      setSelectedTime('');
      // نعيد تحميل الساعات المتاحة لنفس الطبيب والتاريخ
      const slotsResult = await fetchDoctorAvailableSlots(
        {
          doctorId: selectedDoctor._id,
          date: selectedDate,
        },
        token,
      );
      setAvailableSlots(
        Array.isArray(slotsResult?.slots) ? slotsResult.slots : [],
      );
      // إذا ودك ترجع للخدمات بعد نجاح الحجز:
      // setService(null);
    } catch (error) {
      console.log(error.response.data.message);
      showErrorToast(error, 'אירעה שגיאה ביצירת המפגש');
    } finally {
      setBookingLoading(false);
    }
  };
  return (
    <div className="booking-page">
      {/* ===================================================
          MAIN CONTENT
      ==================================================== */}
      <div className="booking-page-content">
        {/* SERVICE */}
        <section className="booking-section booking-service-summary">
          <div className="booking-service-image-wrapper">
            {service.photo ? (
              <img
                src={service.photo}
                alt={service.name}
                className="booking-service-image"
              />
            ) : (
              <div className="booking-service-image-fallback">
                {service.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="booking-service-content">
            <h2>{service.name}</h2>
            <p>{service.description || 'אין תיאור לשירות'}</p>
            <div className="booking-service-meta">
              <span>
                {service.price ? `₪${service.price}` : 'מחיר לא זמין'}
              </span>
              <span>
                <FiClock />
                {service.durationMin
                  ? `${service.durationMin} דקות`
                  : 'משך זמן לא זמין'}
              </span>
            </div>
          </div>
        </section>
        {/* ===================================================
            DOCTORS
        ==================================================== */}
        <section className="booking-section booking-doctors-section">
          <h2 className="booking-section-title">בחר את הרופא שלך</h2>
          {availableDoctors.length === 0 ? (
            <div className="booking-empty-state">
              אין רופאים זמינים עבור השירות הזה
            </div>
          ) : (
            <div className="booking-doctors-grid">
              {availableDoctors.map((doctor, index) => {
                const isSelected = doctor._id === selectedDoctorId;
                const initials = doctor.name
                  ?.split(' ')
                  .filter(Boolean)
                  .slice(-2)
                  .map((part) => part.charAt(0))
                  .join('')
                  .toUpperCase();
                return (
                  <button
                    type="button"
                    key={doctor._id}
                    className={`booking-doctor-card ${
                      isSelected ? 'booking-doctor-card--selected' : ''
                    }`}
                    onClick={() => handleDoctorSelect(doctor._id)}
                  >
                    <div
                      className={`booking-doctor-avatar booking-doctor-avatar--${
                        (index % 3) + 1
                      }`}
                    >
                      {doctor.avatar ? (
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="booking-doctor-avatar-image"
                        />
                      ) : (
                        initials || 'DR'
                      )}
                    </div>
                    <div className="booking-doctor-info">
                      <strong>{doctor.name}</strong>
                      <span>{doctor.doctor?.bio || 'רופא שיניים'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        {/* ===================================================
            DATE + TIME
        ==================================================== */}
        <section className="booking-section booking-date-time-section">
          <h2 className="booking-section-title">בחר תאריך ושעה</h2>
          <div className="booking-date-time-layout">
            {/* ==============================
                CALENDAR
            =============================== */}
            <div className="booking-calendar">
              <h3>בחר תאריך</h3>
              <div className="booking-calendar-weekdays">
                <span>ראשון</span>
                <span>שני</span>
                <span>שלישי</span>
                <span>רביעי</span>
                <span>חמישי</span>
                <span>שישי</span>
                <span>שבת</span>
              </div>
              <div className="booking-calendar-days">
                {Array.from({
                  length: calendarDays.firstDay,
                }).map((_, index) => (
                  <span
                    key={`empty-${index}`}
                    className="booking-calendar-empty"
                  />
                ))}
                {calendarDays.days.map((day) => {
                  const date = new Date(currentYear, currentMonth, day);
                  /*
                   * نخلي الأيام الماضية disabled.
                   */
                  const startOfToday = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  );
                  const disabled = date.getTime() < startOfToday.getTime();
                  const dateValue = formatDateForApi(day);
                  const isSelected = selectedDate === dateValue;
                  return (
                    <button
                      type="button"
                      key={day}
                      disabled={disabled}
                      className={`booking-calendar-day ${
                        isSelected ? 'booking-calendar-day--selected' : ''
                      }`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* ==============================
                TIMES
            =============================== */}
            <div className="booking-times">
              <h3>שעות זמינות</h3>
              {!selectedDate ? (
                <div className="booking-empty-state">
                  בחר תאריך כדי לראות שעות זמינות
                </div>
              ) : slotsLoading ? (
                <div className="booking-slots-loading">טוען שעות זמינות...</div>
              ) : availableSlots.length === 0 ? (
                <div className="booking-empty-state">
                  אין שעות זמינות בתאריך שנבחר
                </div>
              ) : (
                <>
                  {morningSlots.length > 0 && (
                    <>
                      <span className="booking-time-period">בוקר</span>
                      <div className="booking-time-grid">
                        {morningSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`booking-time-button ${
                              selectedTime === slot
                                ? 'booking-time-button--selected'
                                : ''
                            }`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {formatTimeLabel(slot)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {afternoonSlots.length > 0 && (
                    <>
                      <span className="booking-time-period booking-time-period--afternoon">
                        אחר הצהריים
                      </span>
                      <div className="booking-time-grid">
                        {afternoonSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`booking-time-button ${
                              selectedTime === slot
                                ? 'booking-time-button--selected'
                                : ''
                            }`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {formatTimeLabel(slot)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* ===================================================
          SUMMARY
      ==================================================== */}
      <aside className="booking-summary-card">
        <h2>סיכום ההזמנה</h2>
        <div className="booking-summary-list">
          <div className="booking-summary-row">
            <span>שירות</span>
            <strong>{service.name}</strong>
          </div>
          <div className="booking-summary-row">
            <span>משך</span>
            <strong>
              {service.durationMin ? `${service.durationMin} דקות` : '-'}
            </strong>
          </div>
          <div className="booking-summary-row">
            <span>רופא</span>
            <strong>{selectedDoctor?.name || '-'}</strong>
          </div>
          <div className="booking-summary-row">
            <span>תאריך</span>
            <strong>{selectedDateLabel}</strong>
          </div>
          <div className="booking-summary-row">
            <span>שעה</span>
            <strong>
              {selectedTime ? formatTimeLabel(selectedTime) : '-'}
            </strong>
          </div>
        </div>
        <div className="booking-summary-total">
          <strong>סה״כ</strong>
          <strong>{service.price ? `₪${service.price}` : '-'}</strong>
        </div>
        <button
          type="button"
          className="booking-confirm-button"
          disabled={
            bookingLoading ||
            !selectedDoctor ||
            !selectedDate ||
            !selectedTime ||
            slotsLoading
          }
          onClick={handleConfirmBooking}
        >
          {bookingLoading ? 'שומר...' : 'אישור הזמנה'}
        </button>
        <button
          type="button"
          className="booking-back-button"
          onClick={() => setService(null)}
        >
          חזרה לשירותים
        </button>
        <div className="booking-policy">
          <div className="booking-policy-title">
            <FiInfo />
            <strong>מדיניות ההזמנה</strong>
          </div>
          <p>
            ניתן לבטל או לשנות את מועד ההזמנה עד 24 שעות לפני התור ללא תשלום.
          </p>
        </div>
      </aside>
    </div>
  );
};
export default BookingPage;
