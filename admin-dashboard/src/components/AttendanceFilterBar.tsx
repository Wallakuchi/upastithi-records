'use client'

import { Sliders } from 'lucide-react'

interface AttendanceFilterBarProps {
  fromDate: string
  toDate: string
  department: string
  status: string
  onFromDateChange: (date: string) => void
  onToDateChange: (date: string) => void
  onDepartmentChange: (dept: string) => void
  onStatusChange: (status: string) => void
  onResetFilters: () => void
  onApplyFilters?: () => void
  departments?: string[]
}

export function AttendanceFilterBar({
  fromDate,
  toDate,
  department,
  status,
  onFromDateChange,
  onToDateChange,
  onDepartmentChange,
  onStatusChange,
  onResetFilters,
  onApplyFilters,
  departments = [],
}: AttendanceFilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          {departments.length > 0 ? (
            <select
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Filter by department"
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="outside_office">Outside Office</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            onClick={onResetFilters}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Reset
          </button>
          {onApplyFilters && (
            <button
              onClick={onApplyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
