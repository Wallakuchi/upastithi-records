'use client'

import { useEffect, useState } from 'react'
import { attendanceApi } from '@/lib/api'
import { StatusBadge } from '@/components/StatusBadge'
import { AttendanceFilterBar } from '@/components/AttendanceFilterBar'
import { ExportButton } from '@/components/ExportButton'

interface AttendanceRecord {
  id: string
  employee_name: string
  date: string
  check_in_time: string
  check_out_time?: string
  status: string
  department?: string
}

interface ReportStats {
  present: number
  absent: number
  total: number
}

export default function ReportsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<ReportStats>({ present: 0, absent: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [department, setDepartment] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const firstDayStr = firstDay.toISOString().split('T')[0]

    setFromDate(firstDayStr)
    setToDate(today)
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchReportData()
    }
  }, [fromDate, toDate])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await attendanceApi.getReport(fromDate, toDate, 1, 1000)

      const rawData = Array.isArray(response?.data?.data?.records)
        ? response.data.data.records
        : []

      const data = rawData.map((item: any) => ({
        id: item.id,
        employee_name: item.employee?.name || '-',
        department: item.employee?.department || '-',
        date: item.attendance_date
          ? new Date(item.attendance_date).toLocaleDateString()
          : '-',
        check_in_time: item.check_in_time || '',
        check_out_time: item.check_out_time || '',
        status: item.attendance_status?.toLowerCase() || 'absent',
      }))

      const filteredData = department
        ? data.filter((r: any) => r.department === department)
        : data

      setRecords(filteredData)

      // Calculate stats
      const present = data.filter((r: any) => r.status === 'present').length
      const absent = data.filter((r: any) => r.status === 'absent').length
      const total = data.length

      setStats({ present, absent, total })
      setError(null)
    } catch (err) {
      setError('Failed to fetch report data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilters = () => {
    const today = new Date().toISOString().split('T')[0]
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const firstDayStr = firstDay.toISOString().split('T')[0]

    setFromDate(firstDayStr)
    setToDate(today)
    setDepartment('')
  }

  const handleExportCSV = async () => {
    if (records.length === 0) {
      alert('No records to export')
      return
    }

    const csv = [
      ['Employee Name', 'Date', 'Check-in Time', 'Check-out Time', 'Status', 'Department'],
      ...records.map(r => [
        r.employee_name,
        r.date,
        r.check_in_time,
        r.check_out_time || '-',
        r.status,
        r.department || '-'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${fromDate}-to-${toDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const presentPercentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : '0'
  const absentPercentage = stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(2) : '0'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
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
        status=""
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDepartmentChange={setDepartment}
        onStatusChange={() => {}}
        onResetFilters={handleResetFilters}
        onApplyFilters={fetchReportData}
      />

      {/* Export Buttons */}
      <ExportButton
        onExportCSV={handleExportCSV}
        label="Export"
        disabled={records.length === 0}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Total Records" value={stats.total} bgColor="bg-blue-50" />
        <StatBox
          title="Present (%)"
          value={`${stats.present} (${presentPercentage}%)`}
          bgColor="bg-green-50"
        />
        <StatBox
          title="Absent (%)"
          value={`${stats.absent} (${absentPercentage}%)`}
          bgColor="bg-red-50"
        />
      </div>

      {/* Status Distribution Chart Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Status Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Present</p>
            <p className="text-2xl font-bold text-green-900">{stats.present}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">Absent</p>
            <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">Late</p>
            <p className="text-2xl font-bold text-orange-900">{records.filter((r: any) => r.status === 'late').length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 font-medium">Outside Office</p>
            <p className="text-2xl font-bold text-red-900">{records.filter((r: any) => r.status === 'outside_office').length}</p>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance Records</h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Employee Name</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Check-in</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Check-out</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.length > 0 ? (
              records.map((record) => (
               <tr key={record.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 text-slate-900">{record.employee_name}</td>
                   <td className="px-6 py-4 text-slate-600">{record.date}</td>
                   <td className="px-6 py-4 text-slate-600">
                     {new Date(record.check_in_time).toLocaleTimeString()}
                   </td>
                   <td className="px-6 py-4 text-slate-600">
                     {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : '-'}
                   </td>
                   <td className="px-6 py-4">
                     <StatusBadge status={record.status} size="sm" />
                   </td>
                   <td className="px-6 py-4 text-slate-600">{record.department || '-'}</td>
                 </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                  No records found for the selected period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatBox({ title, value, bgColor }: { title: string; value: string | number; bgColor: string }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-slate-200`}>
      <p className="text-slate-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
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
