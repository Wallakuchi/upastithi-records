'use client'

import { useEffect, useState } from 'react'
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react'

interface GPSMapViewProps {
  latitude: number
  longitude: number
  title?: string
  officeLatitude?: number
  officeLongitude?: number
  officeAddress?: string
}

export function GPSMapView({
  latitude,
  longitude,
  title = 'Location Map',
  officeLatitude = 28.553306, // Default office location (Delhi, India)
  officeLongitude = 77.204705,
  officeAddress = 'Office',
}: GPSMapViewProps) {
  const [distance, setDistance] = useState<number | null>(null)
  const [zoom, setZoom] = useState(15)

  useEffect(() => {
    if (officeLatitude && officeLongitude) {
      const dist = calculateDistance(latitude, longitude, officeLatitude, officeLongitude)
      setDistance(dist)
    }
  }, [latitude, longitude, officeLatitude, officeLongitude])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.195618936056!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0cwIDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          {title}
        </h3>
      </div>

      {/* Coordinates Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Latitude</p>
          <p className="text-xl font-bold text-blue-900">{latitude.toFixed(6)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Longitude</p>
          <p className="text-xl font-bold text-blue-900">{longitude.toFixed(6)}</p>
        </div>
        {distance !== null && (
          <div className={`p-4 rounded-lg border ${distance > 2 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <p className={`text-sm font-medium ${distance > 2 ? 'text-red-600' : 'text-green-600'}`}>
              Distance from Office
            </p>
            <p className={`text-xl font-bold ${distance > 2 ? 'text-red-900' : 'text-green-900'}`}>
              {distance.toFixed(2)} km
            </p>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-md">
        <div className="relative w-full h-96">
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">📍 Check-in/Check-out Location</p>
          <p className="text-xs text-slate-600">
            Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
          </p>
        </div>
        {officeLatitude && officeLongitude && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">🏢 {officeAddress}</p>
            <p className="text-xs text-slate-600">
              Latitude: {officeLatitude.toFixed(6)}, Longitude: {officeLongitude.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      {/* Info Messages */}
      {distance !== null && (
        <div
          className={`p-4 rounded-lg ${
            distance > 2
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          <p className="text-sm font-medium">
            {distance > 2
              ? `⚠️ Employee checked in ${distance.toFixed(2)} km away from office`
              : `✓ Employee checked in at office location`}
          </p>
        </div>
      )}
    </div>
  )
}
