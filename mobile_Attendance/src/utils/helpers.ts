import dayjs from 'dayjs';
import {APP_CONSTANTS, ATTENDANCE_STATUS} from '../constants/index';

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format(APP_CONSTANTS.DATE_FORMAT);
};

// export const formatTime = (time: string | Date): string => {
//   return dayjs(time).format(APP_CONSTANTS.TIME_FORMAT);
// };

export const isDateInRange = (
  date: string,
  startDate: string,
  endDate: string,
): boolean => {
  const d = dayjs(date);
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return d.isAfter(start) && d.isBefore(end);
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatTime = (timeString?: string) => {
  if (!timeString) return '--:--';

  try {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '--:--';
  }
};

export const getStatusLabel = (status?: string) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return 'Present';
    case ATTENDANCE_STATUS.LATE:
      return 'Late';
    case ATTENDANCE_STATUS.ABSENT:
      return 'Absent';
    case ATTENDANCE_STATUS.OUTSIDE_OFFICE:
      return 'Outside Office';
    default:
      return 'Not Marked';
  }
};

export const getStatusColor = (status?: string) => {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return '#44bb44';
    case ATTENDANCE_STATUS.LATE:
      return '#ff9800';
    case ATTENDANCE_STATUS.ABSENT:
      return '#ff4444';
    case ATTENDANCE_STATUS.OUTSIDE_OFFICE:
      return '#ff6b6b';
    default:
      return '#999999';
  }
};

export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
