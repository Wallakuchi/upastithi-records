// backend-api/src/utils/geoDistance.ts
// Haversine formula for calculating distance between two GPS coordinates

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param point1 First coordinate {latitude, longitude}
 * @param point2 Second coordinate {latitude, longitude}
 * @returns Distance in meters
 */
export function calculateDistance(point1: GeoCoordinates, point2: GeoCoordinates): number {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = toRadians(point1.latitude);
  const lat2Rad = toRadians(point2.latitude);
  const deltaLat = toRadians(point2.latitude - point1.latitude);
  const deltaLng = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

/**
 * Check if employee is within office radius
 * @param employeeLocation Employee's GPS location
 * @param officeLocation Office's GPS location
 * @param allowedRadius Allowed radius in meters
 * @returns boolean - true if within radius
 */
export function isWithinOfficeRadius(
  employeeLocation: GeoCoordinates,
  officeLocation: GeoCoordinates,
  allowedRadius: number
): boolean {
  const distance = calculateDistance(employeeLocation, officeLocation);
  return distance <= allowedRadius;
}

/**
 * Get distance from office
 * @param employeeLocation Employee's GPS location
 * @param officeLocation Office's GPS location
 * @returns Distance in meters
 */
export function getDistanceFromOffice(
  employeeLocation: GeoCoordinates,
  officeLocation: GeoCoordinates
): number {
  return calculateDistance(employeeLocation, officeLocation);
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
