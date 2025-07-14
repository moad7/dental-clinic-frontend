import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const locales = {
  'he-IL': he,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState([]);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((a) => ({
          id: a.id,
          title: `פגישה עם ${a.patient.name || 'מטופל'}`,
          start: new Date(`${a.date}T${a.time}`),
          end: new Date(`${a.date}T${a.time}`),
          allDay: false,
        }));

        const formattedAppet = res.data.map((a) => ({
          id: a.id,
          date: a.date,
          time: a.time,
          note: a.note,
          status: a.status,
        }));

        setAppointments(formatted);
        setAppointment(formattedAppet);
      } catch (err) {
        console.error('שגיאה בטעינת הפגישות', err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mt-4" dir="rtl">
      <h3 className="text-center mb-4">לוח פגישות</h3>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        culture="he-IL"
        onSelectEvent={(event) => {
          const item = appointment.find((appt) => appt.id === event.id);
          navigate(`/appointments/edit/${event.id}`, {
            state: { appointment: item },
          });
        }}
      />
    </div>
  );
};

export default CalendarView;
