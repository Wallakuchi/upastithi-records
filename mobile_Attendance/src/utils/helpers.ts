import dayjs from 'dayjs';
import { APP_CONSTANTS } from '@constants/index';

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format(APP_CONSTANTS.DATE_FORMAT);
};

export const formatTime = (time: string | Date): string => {
  return dayjs(time).format(APP_CONSTANTS.TIME_FORMAT);
};

export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  const d = dayjs(date);
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return d.isAfter(start) && d.isBefore(end);
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
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
  return new Promise((resolve) => setTimeout(resolve, ms));
};
