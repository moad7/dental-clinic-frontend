// dashboardIcons.js
import { FaRegCalendarAlt } from 'react-icons/fa';
import {
  FaRegCalendarCheck,
  FaRegClock,
  FaUserDoctor,
  FaRegCircle,
  FaCheck,
  FaStethoscope,
} from 'react-icons/fa6';
import { MdOutlinePeopleAlt, MdOutlineDoneOutline } from 'react-icons/md';
export const ICONS = {
  patients: MdOutlinePeopleAlt,
  doctors: FaUserDoctor,
  requests: FaRegClock,
  appointments: FaRegCalendarCheck,
  meetingsToday: FaRegCalendarAlt,
  pendingAppointment: FaRegClock,
  activeCircle: FaRegCircle,
  check: FaCheck,
  completedRequests: MdOutlineDoneOutline,
  incomingPatients: FaStethoscope,
};
