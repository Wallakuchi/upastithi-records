'use client'

import { useEffect, useState } from 'react'
import { employeeApi } from '@/lib/api'
import Link from 'next/link'
import { Trash2, Eye } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  designation: string
  department: string
  status: boolean
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  useEffect(() => {
    fetchEmployees(currentPage)
  }, [currentPage])

  const fetchEmployees = async (page: number) => {
    try {
      setLoading(true)
      const response = await employeeApi.getAll(page, limit)
      setEmployees(response?.data || [])
      setTotalPages(response?.totalPages || 1)
      setError(null)
    } catch (err) {
      setError('Failed to fetch employees')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    try {
      await employeeApi.delete(id)
      setEmployees(employees.filter(e => e.id !== id))
    } catch (err) {
      alert('Failed to delete employee')
      console.error(err)
    }
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">ID</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Designation</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Department</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900 font-medium">{emp.id}</td>
                  <td className="px-6 py-4 text-slate-900">{emp.name}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.email}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.designation}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {emp.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/employees/${emp.id}`}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-slate-500">
                  No employees found
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
