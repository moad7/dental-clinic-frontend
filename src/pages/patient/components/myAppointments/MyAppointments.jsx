import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMoreHorizontal,
  FiX,
} from 'react-icons/fi';

import { AuthContext } from '../../../../context/AuthContext';
import BoxHeader from '../../../components/boxHeader/BoxHeader';

import './myAppointments.css';
import { getPatientAppointmentsCalendar } from '../../../../api/appointmentApi';

const HOUR_HEIGHT = 128;
const APPOINTMENT_PREVIEW_WIDTH = 370;
const APPOINTMENT_PREVIEW_HEIGHT = 300;

const WEEK_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const MINI_WEEK_DAYS = [
  'שבת',
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
];

const SESSION_STATUS_COLORS = {
  pending: 'blue',
  confirmed: 'green',
  completed: 'purple',
  cancelled: 'red',
  rejected: 'red',
};

const formatDateForApi = (year, month, day) => {
  const yyyy = year;
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

const parseTimeToMinutes = (time = '00:00') => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatAppointmentDate = (date) => {
  if (!date) return '-';

  const parsedDate = new Date(`${date.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};

const MyAppointments = () => {
  const { token } = useContext(AuthContext);

  const calendarContentRef = useRef(null);
  const previewRef = useRef(null);

  const initialMonth = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, []);

  const [currentDate, setCurrentDate] = useState(initialMonth);
  const [sidebarDate, setSidebarDate] = useState(initialMonth);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    serviceGroupId: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const queryRange = useMemo(() => {
    const year = sidebarDate.getFullYear();
    const month = sidebarDate.getMonth();

    if (rangeStart !== null && rangeEnd === null) {
      return null;
    }

    if (rangeStart === null && rangeEnd === null) {
      const lastDay = new Date(year, month + 1, 0).getDate();

      return {
        from: formatDateForApi(year, month, 1),
        to: formatDateForApi(year, month, lastDay),
      };
    }

    return {
      from: formatDateForApi(year, month, rangeStart),
      to: formatDateForApi(year, month, rangeEnd),
    };
  }, [sidebarDate, rangeStart, rangeEnd]);

  /*
   * =========================================
   * LOAD APPOINTMENTS
   * =========================================
   */
  useEffect(() => {
    if (!token || !queryRange) return;

    let ignore = false;

    const loadAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        setAppointmentsError(null);

        const data = await getPatientAppointmentsCalendar(
          {
            from: queryRange.from,
            to: queryRange.to,
            status: filters.status || undefined,
            doctorId: filters.doctorId || undefined,
            serviceGroupId: filters.serviceGroupId || undefined,
          },
          token,
        );

        if (ignore) return;

        setAppointments(data?.appointments ?? []);
        setUpcomingAppointments(data?.upcomingAppointments ?? []);
      } catch (error) {
        if (ignore) return;

        console.error('Failed to load patient appointments:', error);

        setAppointments([]);
        setUpcomingAppointments([]);

        setAppointmentsError(
          error?.response?.data?.message || 'אירעה שגיאה בטעינת התורים',
        );
      } finally {
        if (!ignore) {
          setAppointmentsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      ignore = true;
    };
  }, [
    token,
    queryRange,
    filters.status,
    filters.doctorId,
    filters.serviceGroupId,
  ]);

  /*
   * =========================================
   * DATE HELPERS
   * =========================================
   */
  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('he-IL', {
      month: 'long',
      year: 'numeric',
    }).format(currentDate);
  }, [currentDate]);

  const sidebarCalendarCells = useMemo(() => {
    const year = sidebarDate.getFullYear();
    const month = sidebarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // miniWeekDays starts with Saturday:
    // Saturday=0, Sunday=1 ... Friday=6
    const firstJsDay = new Date(year, month, 1).getDay();
    const leadingEmptyCells = (firstJsDay + 1) % 7;

    return [
      ...Array.from({ length: leadingEmptyCells }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [sidebarDate]);

  /*
   * =========================================
   * MONTH NAVIGATION
   * =========================================
   */
  const changeMonth = (offset) => {
    setCurrentDate((previous) => {
      const next = new Date(
        previous.getFullYear(),
        previous.getMonth() + offset,
        1,
      );

      setSidebarDate(next);
      return next;
    });

    setRangeStart(null);
    setRangeEnd(null);
    setSelectedAppointment(null);
  };

  const handlePreviousMonth = () => {
    changeMonth(-1);
  };

  const handleNextMonth = () => {
    changeMonth(1);
  };

  const handleToday = () => {
    const today = new Date();
    const month = new Date(today.getFullYear(), today.getMonth(), 1);

    setCurrentDate(month);
    setSidebarDate(month);

    // Today = range ليوم واحد.
    setRangeStart(today.getDate());
    setRangeEnd(today.getDate());

    setSelectedAppointment(null);
  };

  const handleSidebarPreviousMonth = () => {
    changeMonth(-1);
  };

  const handleSidebarNextMonth = () => {
    changeMonth(1);
  };

  /*
   * =========================================
   * MINI CALENDAR RANGE
   * =========================================
   */
  const handleMiniDayClick = (day) => {
    if (rangeStart === null) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }

    if (rangeEnd !== null) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }

    if (day === rangeStart) {
      setRangeEnd(day);
      return;
    }

    if (day < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(day);
      return;
    }
    setRangeEnd(day);
  };

  const getMiniCalendarRangeClass = (day) => {
    if (day === null) return '';

    if (rangeStart !== null && rangeEnd === null) {
      return day === rangeStart
        ? 'mini-day-selected mini-range-start-only'
        : '';
    }

    if (rangeStart === null || rangeEnd === null) {
      return '';
    }

    if (rangeStart === rangeEnd && day === rangeStart) {
      return 'mini-day-selected mini-range-same-day';
    }

    if (day === rangeStart) {
      return 'mini-range mini-range-start mini-day-selected';
    }

    if (day === rangeEnd) {
      return 'mini-range mini-range-end mini-day-selected';
    }

    if (day > rangeStart && day < rangeEnd) {
      return 'mini-range mini-range-middle';
    }

    return '';
  };

  /*
   * =========================================
   * FILTERS
   * =========================================
   */
  const setStatusFilter = (status) => {
    setFilters((previous) => ({
      ...previous,
      status,
    }));

    setSelectedAppointment(null);
  };

  const HALF_HOUR_HEIGHT = 64;

  const calendarRange = useMemo(() => {
    if (!appointments.length) {
      return {
        startMinutes: 8 * 60,
        endMinutes: 18 * 60,
      };
    }

    const starts = appointments.map((appointment) =>
      parseTimeToMinutes(appointment.startTime),
    );

    const ends = appointments.map((appointment) =>
      parseTimeToMinutes(appointment.endTime),
    );

    const earliestAppointment = Math.min(...starts);
    const latestAppointment = Math.max(...ends);

    return {
      startMinutes: Math.max(0, earliestAppointment - 30),
      endMinutes: Math.min(24 * 60, latestAppointment + 30),
    };
  }, [appointments]);
  const calendarTimeSlots = useMemo(() => {
    const slots = [];

    for (
      let minutes = calendarRange.startMinutes;
      minutes <= calendarRange.endMinutes;
      minutes += 30
    ) {
      slots.push(minutes);
    }

    return slots;
  }, [calendarRange]);
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };
  const getAppointmentPosition = (appointment) => {
    const startMinutes = parseTimeToMinutes(appointment.startTime);
    const endMinutes = parseTimeToMinutes(appointment.endTime);

    const offsetMinutes = startMinutes - calendarRange.startMinutes;

    const durationMinutes = Math.max(endMinutes - startMinutes, 1);

    const top = (offsetMinutes / 30) * HALF_HOUR_HEIGHT;

    const height = (durationMinutes / 30) * HALF_HOUR_HEIGHT;

    return {
      top: `${top + 5}px`,
      height: `${Math.max(height - 10, 50)}px`,
    };
  };

  const getAppointmentDayIndex = (appointment) => {
    if (!appointment?.date) return -1;

    const dateOnly = appointment.date.slice(0, 10);
    const parsedDate = new Date(`${dateOnly}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return -1;
    }

    const day = parsedDate.getDay();

    return day >= 0 && day <= 5 ? day : -1;
  };

  const getAppointmentColor = (appointment) => {
    return SESSION_STATUS_COLORS[appointment.sessionStatus] ?? 'blue';
  };

  const getAppointmentTitle = (appointment) => {
    return (
      appointment?.service?.name || appointment?.serviceGroup?.title || 'תור'
    );
  };

  /*
   * =========================================
   * APPOINTMENT PREVIEW
   * =========================================
   */
  const handleAppointmentClick = (event, appointment) => {
    event.stopPropagation();

    const calendarElement = calendarContentRef.current;

    if (!calendarElement) {
      setSelectedAppointment(appointment);
      return;
    }

    const appointmentRect = event.currentTarget.getBoundingClientRect();
    const calendarRect = calendarElement.getBoundingClientRect();

    const appointmentCenter =
      appointmentRect.left - calendarRect.left + appointmentRect.width / 2;

    let left = appointmentCenter - APPOINTMENT_PREVIEW_WIDTH / 2;
    let top = appointmentRect.bottom - calendarRect.top + 16;

    const minimumLeft = 16;
    const maximumLeft = Math.max(
      minimumLeft,
      calendarElement.scrollWidth - APPOINTMENT_PREVIEW_WIDTH - 16,
    );

    left = Math.max(minimumLeft, Math.min(left, maximumLeft));

    const availableBottom = calendarRect.bottom - appointmentRect.bottom;

    if (availableBottom < APPOINTMENT_PREVIEW_HEIGHT + 20) {
      top =
        appointmentRect.top -
        calendarRect.top -
        APPOINTMENT_PREVIEW_HEIGHT -
        16;
    }

    setPreviewPosition({
      top: Math.max(16, top),
      left,
    });

    setSelectedAppointment(appointment);
  };

  const closeAppointmentPreview = () => {
    setSelectedAppointment(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAppointmentPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /*
   * =========================================
   * CURRENT TIME
   * =========================================
   */
  const now = new Date();

  const isCurrentMonth =
    currentDate.getFullYear() === now.getFullYear() &&
    currentDate.getMonth() === now.getMonth();

  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTimeTop =
    ((currentTimeMinutes - calendarRange.startMinutes) / 30) * HALF_HOUR_HEIGHT;

  const showCurrentTime =
    isCurrentMonth &&
    currentTimeMinutes >= calendarRange.startMinutes &&
    currentTimeMinutes <= calendarRange.endMinutes;

  const currentTimeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}`;

  const timezoneLabel = useMemo(() => {
    const timezonePart = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName');

    return timezonePart?.value ?? '';
  }, []);

  const visibleUpcomingAppointments = showAllUpcoming
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 2);

  return (
    <div className="main-container my-appointments-page" dir="rtl">
      <BoxHeader
        title="בוקר טוב, מואד!"
        subtitle="הנה סקירה כללית על המועדים שלך."
      />

      <div className="appointments-calendar-scroll">
        <div className="appointments-calendar-layout">
          <main className="appointments-calendar-main">
            <div className="calendar-toolbar">
              <div className="calendar-month-navigation">
                <button
                  type="button"
                  className="today-button"
                  onClick={handleToday}
                >
                  היום
                </button>

                <strong className="calendar-current-month">{monthLabel}</strong>

                <div className="calendar-navigation-buttons">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={handlePreviousMonth}
                  >
                    <FiChevronRight />
                  </button>

                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={handleNextMonth}
                  >
                    <FiChevronLeft />
                  </button>
                </div>
              </div>

              <div className="calendar-filters">
                <button
                  type="button"
                  className={`calendar-filter ${
                    filters.status === 'confirmed' ? 'active' : ''
                  }`}
                  onClick={() => setStatusFilter('confirmed')}
                >
                  מאושר
                </button>

                <button
                  type="button"
                  className={`calendar-filter ${
                    filters.status === 'pending' ? 'active' : ''
                  }`}
                  onClick={() => setStatusFilter('pending')}
                >
                  ממתין
                </button>

                <button
                  type="button"
                  className={`calendar-filter ${
                    filters.status === '' ? 'active' : ''
                  }`}
                  onClick={() => setStatusFilter('')}
                >
                  הכל
                </button>
              </div>
            </div>

            <div
              className="calendar-content"
              ref={calendarContentRef}
              aria-busy={appointmentsLoading}
              onClick={() => {
                if (selectedAppointment) {
                  closeAppointmentPreview();
                }
              }}
            >
              {appointmentsError && (
                <div className="calendar-status-message calendar-status-message--error">
                  {appointmentsError}
                </div>
              )}

              <div className="calendar-days-header">
                {WEEK_DAYS.map((day) => (
                  <div className="calendar-day-name" key={day}>
                    {day}
                  </div>
                ))}

                <div className="calendar-timezone">{timezoneLabel}</div>
              </div>

              <div className="calendar-grid">
                <div className="calendar-hours">
                  {calendarTimeSlots.slice(0, -1).map((minutes) => (
                    <div key={minutes} className="calendar-hour">
                      {formatMinutesToTime(minutes)}
                    </div>
                  ))}
                </div>

                <div className="calendar-days-grid">
                  {WEEK_DAYS.map((_, dayIndex) => (
                    <div className="calendar-day-column" key={dayIndex}>
                      {calendarTimeSlots.slice(0, -1).map((minutes) => (
                        <div key={minutes} className="calendar-time-cell" />
                      ))}

                      {appointments
                        .filter(
                          (appointment) =>
                            getAppointmentDayIndex(appointment) === dayIndex,
                        )
                        .map((appointment) => {
                          const color = getAppointmentColor(appointment);

                          return (
                            <button
                              key={appointment._id}
                              type="button"
                              className={`calendar-appointment calendar-appointment--${color}`}
                              style={getAppointmentPosition(appointment)}
                              onClick={(event) =>
                                handleAppointmentClick(event, appointment)
                              }
                            >
                              <span className="calendar-appointment-title">
                                {getAppointmentTitle(appointment)}
                              </span>

                              <span className="calendar-appointment-time">
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  ))}

                  {showCurrentTime && (
                    <div
                      className="calendar-current-time"
                      style={{ top: `${currentTimeTop}px` }}
                    >
                      <span className="current-time-label">
                        {currentTimeLabel}
                      </span>

                      <span className="current-time-dot" />
                      <span className="current-time-line" />
                    </div>
                  )}
                </div>
              </div>

              {appointmentsLoading && (
                <div className="calendar-loading-overlay">
                  <div className="calendar-loading-box">טוען תורים...</div>
                </div>
              )}
              {selectedAppointment && (
                <div
                  ref={previewRef}
                  className="appointment-preview-card"
                  style={{
                    top: previewPosition.top,
                    left: previewPosition.left,
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="appointment-preview-header">
                    <div className="appointment-preview-number">
                      <strong>מספר תור</strong>
                      <span>#{selectedAppointment._id}</span>
                    </div>

                    <button
                      type="button"
                      className="appointment-preview-close"
                      onClick={closeAppointmentPreview}
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="appointment-preview-service">
                    <strong>{getAppointmentTitle(selectedAppointment)}</strong>

                    <span>
                      {selectedAppointment.serviceGroup?.title ?? '-'}
                    </span>

                    {selectedAppointment.note && (
                      <div className="appointment-clinic-note">
                        <strong>הערת המרפאה:</strong>
                        <p>{selectedAppointment.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="appointment-preview-info">
                    <div className="appointment-info-item">
                      <span>רופא</span>
                      <strong>{selectedAppointment.doctor?.name ?? '-'}</strong>
                    </div>

                    <div className="appointment-info-item">
                      <span>תאריך</span>
                      <strong>
                        {formatAppointmentDate(selectedAppointment.date)}
                      </strong>
                    </div>

                    <div className="appointment-info-item appointment-info-time">
                      <span>זמן</span>
                      <strong>
                        {selectedAppointment.startTime} -{' '}
                        {selectedAppointment.endTime}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <aside className="appointments-sidebar">
            <div className="appointments-sidebar-header">
              <h2>יומן תורים</h2>

              <div className="appointments-sidebar-navigation">
                <button
                  className="active"
                  type="button"
                  onClick={handleSidebarPreviousMonth}
                  aria-label="Previous month"
                >
                  <FiChevronRight />
                </button>

                <button
                  type="button"
                  onClick={handleSidebarNextMonth}
                  aria-label="Next month"
                >
                  <FiChevronLeft />
                </button>
              </div>
            </div>

            <div className="mini-calendar">
              <div className="mini-calendar-days">
                {MINI_WEEK_DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="mini-calendar-grid">
                {sidebarCalendarCells.map((day, index) => {
                  if (day === null) {
                    return (
                      <span
                        key={`empty-${index}`}
                        className="mini-calendar-empty"
                        aria-hidden="true"
                      />
                    );
                  }

                  const rangeClass = getMiniCalendarRangeClass(day);

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleMiniDayClick(day)}
                      className={rangeClass}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="upcoming-appointments">
              <div className="upcoming-title-row">
                <h3>רשימת תורים קרובים</h3>

                <button type="button">
                  <FiMoreHorizontal />
                </button>
              </div>

              <div className="upcoming-list">
                {visibleUpcomingAppointments.length === 0 ? (
                  <div className="upcoming-empty">אין תורים קרובים</div>
                ) : (
                  visibleUpcomingAppointments.map((appointment) => (
                    <div
                      className="upcoming-appointment-item"
                      key={appointment._id}
                    >
                      <div className="upcoming-appointment-logo">+</div>

                      <div className="upcoming-appointment-content">
                        <strong>הזמנה מס׳ #{appointment._id}</strong>

                        <span>{appointment.doctor?.name ?? '-'}</span>
                      </div>

                      <div className="upcoming-appointment-time">
                        <FiClock />

                        <span>
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {upcomingAppointments.length > 2 && (
                <button
                  type="button"
                  className="show-all-appointments"
                  onClick={() => setShowAllUpcoming((previous) => !previous)}
                >
                  {showAllUpcoming ? 'הצג פחות' : 'הצג הכל'}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
