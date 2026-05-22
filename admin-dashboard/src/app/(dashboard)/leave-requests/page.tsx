'use client'

import { useEffect, useState } from 'react'
import { leaveApi } from '@/lib/api'
import { Eye, Check, X } from 'lucide-react'

export interface LeaveRequest {
  id: string;

  employee_id: string;

  from_date: string;
  to_date: string;

  leave_type: string;

  reason: string;

  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  approved_by?: string | null;

  created_at: string;
  updated_at: string;

  employee?: {
    id: string;
    name: string;
    employee_code: string;
  };
}

export default function LeaveRequestsPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    fetchLeaves(currentPage)
  }, [currentPage, statusFilter])

  const fetchLeaves = async (page: number) => {
    try {
      setLoading(true)
      const response = await leaveApi.getAll(page, limit)
      let data = response?.data || []

      if (statusFilter !== 'ALL') {
        data = data.filter((l: any) => l.status === statusFilter)
      }

      setLeaves(data)
      setTotalPages(response?.totalPages || 1)
      setError(null)
    } catch (err) {
      setError('Failed to fetch leave requests')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await leaveApi.approve(id)
      setLeaves(leaves.map(l =>
        l.id === id ? { ...l, status: 'APPROVED' } : l
      ))
    } catch (err) {
      alert('Failed to approve leave request')
      console.error(err)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await leaveApi.reject(id)
      setLeaves(leaves.map(l =>
        l.id === id ? { ...l, status: 'REJECTED' } : l
      ))
    } catch (err) {
      alert('Failed to reject leave request')
      console.error(err)
    }
  }

  if (loading && leaves.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Leave Requests</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Employee Name</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">From Date</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">To Date</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Leave Type</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900">{leave.employee?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(leave.from_date).toDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(leave.to_date).toDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{leave.leave_type}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={leave.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {leave.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="text-green-600 hover:text-green-700 p-2"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-slate-400 p-2 cursor-not-allowed"
                          disabled
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-800' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800' },
  }

  const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-800' }

  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}>
      {status}
    </span>
  )
}
