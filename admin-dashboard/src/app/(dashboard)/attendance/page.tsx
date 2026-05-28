'use client'

import { useEffect, useState } from 'react'
import { attendanceApi } from '@/lib/api'
import { StatusBadge } from '@/components/StatusBadge'
import { AttendanceFilterBar } from '@/components/AttendanceFilterBar'
import { ExportButton } from '@/components/ExportButton'
import { ImagePreviewModal } from '@/components/ImagePreviewModal'
import Link from 'next/link'
import { Eye } from 'lucide-react'

interface Employee {
  id: string
  employee_code?: string
  name: string
  designation?: string
  department?: string
}

interface AttendanceRecord {
  id: string
  employee_id: string
  employee_name?: string
  attendance_date: string
  check_in_time: string
  check_out_time?: string
  attendance_status?: string
  status?: string
  department?: string
  check_in_photo?: string
  check_out_photo?: string
  employee?: Employee
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFromDate(today)
    setToDate(today)
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchAttendance()
    }
  }, [fromDate, toDate])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceApi.getReport(fromDate, toDate, 1, 100)
      let data = response?.data?.records || []

      if (department) {
        data = data.filter((r: any) => r.employee?.department === department)
      }

      if (status) {
        data = data.filter((r: any) => r.attendance_status === status)
      }

      setRecords(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch attendance records')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (records.length === 0) {
      alert('No records to export')
      return
    }

    try {
      if (format === 'csv') {
        const response = await attendanceApi.exportToCSV(fromDate, toDate, department, status)
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-${fromDate}-to-${toDate}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export. Please try again.')
    }
  }

  const handleResetFilters = () => {
    const today = new Date().toISOString().split('T')[0]
    setFromDate(today)
    setToDate(today)
    setDepartment('')
    setStatus('')
  }

  const openImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
    setPreviewModalOpen(true)
  }

  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <AttendanceFilterBar
        fromDate={fromDate}
        toDate={toDate}
        department={department}
        status={status}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDepartmentChange={setDepartment}
        onStatusChange={setStatus}
        onResetFilters={handleResetFilters}
        onApplyFilters={fetchAttendance}
      />

      {/* Export Buttons */}
      <ExportButton
        onExportCSV={async () => {
          await handleExport('csv')
        }}
        label="Export"
        disabled={records.length === 0}
      />

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Employee Code</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Employee Name</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Designation</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Department</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Check-in</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Check-out</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Photos</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900 font-medium">{record.employee?.employee_code || '-'}</td>
                  <td className="px-6 py-4 text-slate-900">{record.employee?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{record.employee?.designation || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{record.employee?.department || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(record.attendance_date).toISOString().split('T')[0]}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={record.attendance_status || record.status || ''} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {record.check_in_photo && (
                        <button
                          onClick={() => openImagePreview(record.check_in_photo!)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          Check-in
                        </button>
                      )}
                      {record.check_out_photo && (
                        <button
                          onClick={() => openImagePreview(record.check_out_photo!)}
                          className="text-green-600 hover:text-green-700 text-xs font-medium"
                        >
                          Check-out
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/attendance/${record.id}`}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-slate-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

// function StatusBadge({ status }: { status: string }) {
//   const statusConfig: Record<string, { bg: string; text: string }> = {
//     present: { bg: 'bg-green-100', text: 'text-green-800' },
//     absent: { bg: 'bg-red-100', text: 'text-red-800' },
//     late: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
//     outside_office: { bg: 'bg-purple-100', text: 'text-purple-800' },
//   }

//   const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-800' }

//   return (
//     <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}>
//       {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   )
// }
