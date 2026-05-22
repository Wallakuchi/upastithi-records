'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { GPSMapView } from '@/components/GPSMapView'
import { ImagePreviewModal } from '@/components/ImagePreviewModal'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface AttendanceDetail {
  id: string
  employee_name: string
  attendance_date: string
  check_in_time: string
  check_out_time?: string
  check_in_lat?: number
  check_in_lng?: number
  check_out_lat?: number
  check_out_lng?: number
  check_in_photo?: string
  check_out_photo?: string
  check_in_device?: string
  check_out_device?: string
  attendance_status: string
}

export default function AttendanceDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [record, setRecord] = useState<AttendanceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/attendance/${id}`)
        setRecord(response?.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch attendance details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [id])

  const openImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
    setPreviewModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !record) {
    return (
      <div className="space-y-6">
        <Link href="/attendance" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          Back to Attendance
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || 'Attendance record not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/attendance" className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Attendance Details</h1>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Employee Name" value={record.employee_name} />
          <DetailField label="Date" value={new Date(record.attendance_date).toDateString()} />
          <DetailField label="Status" value={record.attendance_status} />
          <DetailField label="Check-in Time" value={new Date(record.check_in_time).toLocaleTimeString()} />
          <DetailField
            label="Check-out Time"
            value={record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : 'N/A'}
          />
        </div>
      </div>

      {/* GPS Information with Map */}
      {record.check_in_lat && record.check_in_lng && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <GPSMapView
            latitude={record.check_in_lat}
            longitude={record.check_in_lng}
            title="Check-in Location"
            officeLatitude={28.553306}
            officeLongitude={77.204705}
            officeAddress="Office Headquarters"
          />
        </div>
      )}

      {record.check_out_lat && record.check_out_lng && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <GPSMapView
            latitude={record.check_out_lat}
            longitude={record.check_out_lng}
            title="Check-out Location"
            officeLatitude={28.553306}
            officeLongitude={77.204705}
            officeAddress="Office Headquarters"
          />
        </div>
      )}

      {/* GPS Coordinates (Text View) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">GPS Coordinates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Check-in Location</h3>
            <DetailField label="Latitude" value={record.check_in_lat?.toString() || 'N/A'} />
            <DetailField label="Longitude" value={record.check_in_lng?.toString() || 'N/A'} />
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Check-out Location</h3>
            <DetailField label="Latitude" value={record.check_out_lat?.toString() || 'N/A'} />
            <DetailField label="Longitude" value={record.check_out_lng?.toString() || 'N/A'} />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Check-in Photo</h3>
            {record.check_in_photo ? (
              <div
                onClick={() => openImagePreview(record.check_in_photo!)}
                className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Image
                  src={record.check_in_photo}
                  alt="Check-in"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                No photo available
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Check-out Photo</h3>
            {record.check_out_photo ? (
              <div
                onClick={() => openImagePreview(record.check_out_photo!)}
                className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Image
                  src={record.check_out_photo}
                  alt="Check-out"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                No photo available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Device Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Check-in Device" value={record.check_in_device || 'N/A'} />
          <DetailField label="Check-out Device" value={record.check_out_device || 'N/A'} />
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModalOpen}
        imageUrl={previewImageUrl}
        onClose={() => setPreviewModalOpen(false)}
        title="Photo Preview"
      />
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-slate-900">{value}</p>
    </div>
  )
}
