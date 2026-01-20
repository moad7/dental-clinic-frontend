// dashboardIcons.js
import { FaRegCalendarAlt } from 'react-icons/fa';
import {
  FaRegCalendarCheck,
  FaRegClock,
  FaUserDoctor,
  FaRegCircle,
} from 'react-icons/fa6';
import { MdOutlinePeopleAlt } from 'react-icons/md';

export const DASHBOARD_SECRETARY_ICONS = {
  patients: MdOutlinePeopleAlt,
  doctors: FaUserDoctor,
  requests: FaRegClock,
  appointments: FaRegCalendarCheck,
  meetingsToday: FaRegCalendarAlt,
  pendingAppointment: FaRegClock,
  activePatients: FaRegCircle,
};
