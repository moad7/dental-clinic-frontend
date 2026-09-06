import { useMemo, useState } from 'react';
export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export const isPastTimeSlot = (date, slot) => {
  if (!date || !slot) return false;
  const today = getTodayDate();
  if (date !== today) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [hours, minutes] = slot.split(':').map(Number);
  const slotMinutes = hours * 60 + minutes;
  return slotMinutes <= currentMinutes;
};
export const useCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  });
  const monthDays = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysCount = new Date(year, month, 0).getDate();
    return Array.from({ length: daysCount }, (_, index) => {
      const day = index + 1;
      const dateValue = `${year}-${String(month).padStart(2, '0')}-${String(
        day,
      ).padStart(2, '0')}`;
      const localDate = new Date(year, month - 1, day);
      const dayName = localDate.toLocaleDateString('he-IL', {
        weekday: 'short',
      });
      return {
        day,
        dateValue,
        dayName,
      };
    });
  }, [selectedMonth]);
  return {
    selectedMonth,
    setSelectedMonth,
    monthDays,
    today: getTodayDate(),
    isPastTimeSlot,
  };
};
