import { useContext, useMemo, useState } from 'react';
import { AppDataContext } from '../../../context/AppDataContext';
import {
  getTodayDate,
  isPastTimeSlot,
  useCalendar,
} from '../../../hooks/useCalendar';

import './MeetingSchedulePicker.css';

const MeetingSchedulePicker = ({
  serviceGroupId,

  doctorId,
  date,
  time,

  availableSlots = [],
  loadingSlots = false,

  disabled = false,

  onDoctorChange,
  onDateChange,
  onTimeChange,
  onMonthChange,
}) => {
  const { doctors } = useContext(AppDataContext);

  const { selectedMonth, setSelectedMonth, monthDays, today } = useCalendar();
  const [doctorSearch, setDoctorSearch] = useState('');
  //   const [doctorsLoading, setDoctorsLoading] = useState(false);

  //

  const availableDoctors = useMemo(() => {
    if (!serviceGroupId) return [];

    return (Array.isArray(doctors) ? doctors : []).filter((doctor) => {
      return (
        doctor?.isActive &&
        doctor?.doctor?.services?.some((service) => {
          const groupId = service?.groupId?._id || service?.groupId;

          return String(groupId) === String(serviceGroupId);
        })
      );
    });
  }, [doctors, serviceGroupId]);

  const filteredDoctors = useMemo(() => {
    const q = doctorSearch.trim().toLowerCase();

    if (!q) return availableDoctors;

    return availableDoctors.filter((doctor) => {
      return (
        doctor?.name?.toLowerCase().includes(q) ||
        doctor?.phoneNumber?.toLowerCase().includes(q) ||
        doctor?.email?.toLowerCase().includes(q)
      );
    });
  }, [availableDoctors, doctorSearch]);

  const handleMonthChange = (event) => {
    const value = event.target.value;

    setSelectedMonth(value);

    onMonthChange?.(value);
  };

  //   const handleDoctorChange = (event) => {
  //     onDoctorChange?.(event.target.value);
  //   };

  const handleDateChange = (selectedDate) => {
    onDateChange?.(selectedDate);
  };

  const handleTimeChange = (selectedTime) => {
    onTimeChange?.(selectedTime);
  };

  return (
    <div className="meeting-schedule">
      <div className="meeting-schedule__doctor-box">
        <div className="meeting-schedule__field">
          <label>רופא מטפל</label>

          <input
            type="text"
            placeholder="חפש רופא..."
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
            disabled={!serviceGroupId || disabled}
          />
        </div>

        <div className="meeting-schedule__doctor-list">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const isSelected = String(doctor._id) === String(doctorId);

              return (
                <button
                  type="button"
                  key={doctor._id}
                  className={`meeting-schedule__doctor ${
                    isSelected ? 'meeting-schedule__doctor--active' : ''
                  }`}
                  onClick={() => onDoctorChange?.(doctor._id)}
                >
                  <div className="meeting-schedule__doctor-avatar">
                    {doctor.avatar ? (
                      <img src={doctor.avatar} alt={doctor.name} />
                    ) : (
                      doctor.name
                        ?.split(' ')
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join('') || 'DR'
                    )}
                  </div>

                  <div className="meeting-schedule__doctor-info">
                    <strong>ד"ר {doctor.name}</strong>

                    <span>{doctor.phoneNumber || '-'}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="meeting-schedule__empty">
              לא נמצאו רופאים בתחום זה
            </div>
          )}
        </div>
      </div>

      {/* Month */}
      <div className="meeting-schedule__field">
        <label>חודש</label>

        <input
          type="month"
          value={selectedMonth}
          min={getTodayDate().slice(0, 7)}
          onChange={handleMonthChange}
          disabled={disabled || !doctorId}
        />
      </div>

      {/* Days */}
      <div className="meeting-schedule__section">
        <span className="meeting-schedule__label">בחר תאריך</span>

        <div className="meeting-schedule__days">
          {monthDays.map((day) => {
            const isPast = day.dateValue < today;

            const isSelected = date === day.dateValue;

            return (
              <button
                type="button"
                key={day.dateValue}
                disabled={disabled || !doctorId || isPast}
                className={[
                  'meeting-schedule__day',
                  isSelected ? 'meeting-schedule__day--active' : '',
                ].join(' ')}
                onClick={() => handleDateChange(day.dateValue)}
              >
                <span>{day.dayName}</span>
                <strong>{day.day}</strong>
              </button>
            );
          })}
        </div>
      </div>

      {/* Times */}
      <div className="meeting-schedule__section">
        <span className="meeting-schedule__label">שעות זמינות</span>

        {!doctorId ? (
          <div className="meeting-schedule__empty">בחר רופא תחילה</div>
        ) : !date ? (
          <div className="meeting-schedule__empty">בחר תאריך להצגת השעות</div>
        ) : loadingSlots ? (
          <div className="meeting-schedule__empty">טוען שעות זמינות...</div>
        ) : availableSlots.length === 0 ? (
          <div className="meeting-schedule__empty">
            אין שעות זמינות בתאריך זה
          </div>
        ) : (
          <div className="meeting-schedule__times">
            {availableSlots.map((slot) => {
              const isPast = isPastTimeSlot(date, slot);

              const isSelected = time === slot;

              return (
                <button
                  type="button"
                  key={slot}
                  disabled={disabled || isPast}
                  className={[
                    'meeting-schedule__time',
                    isSelected ? 'meeting-schedule__time--active' : '',
                  ].join(' ')}
                  onClick={() => handleTimeChange(slot)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingSchedulePicker;
