import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const attendanceApi = {
  getReport: async (fromDate: string, toDate: string, page?: number, limit?: number) => {
    try {
      const params = new URLSearchParams()
      params.append('from_date', fromDate)
      params.append('to_date', toDate)
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())

      const response = await apiClient.get(`/attendance/report?${params.toString()}`)
      return response
    } catch (error) {
      console.error('Error fetching attendance report:', error)
      throw error
    }
  },

  getAttendanceById: async (id: string) => {
    try {
      const response = await apiClient.get(`/attendance/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching attendance details:', error)
      throw error
    }
  },

  exportToCSV: async (fromDate: string, toDate: string, department?: string, status?: string) => {
    try {
      const params = new URLSearchParams()
      params.append('from_date', fromDate)
      params.append('to_date', toDate)
      if (department) params.append('department', department)
      if (status) params.append('status', status)

      const response = await apiClient.get(`/attendance/export/csv?${params.toString()}`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      console.error('Error exporting CSV:', error)
      throw error
    }
  },
}

export const employeeApi = {
  getAll: async (page: number = 1, limit: number = 20) => {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await apiClient.get(`/employees?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/employees/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching employee details:', error)
      throw error
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/employees/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },
}

export const leaveApi = {
  getAll: async (page: number = 1, limit: number = 20) => {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await apiClient.get(`/leaves?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      throw error
    }
  },

  approve: async (id: string) => {
    try {
      const response = await apiClient.put(`/leaves/${id}`, { status: 'APPROVED' })
      return response.data
    } catch (error) {
      console.error('Error approving leave request:', error)
      throw error
    }
  },

  reject: async (id: string) => {
    try {
      const response = await apiClient.put(`/leaves/${id}`, { status: 'REJECTED' })
      return response.data
    } catch (error) {
      console.error('Error rejecting leave request:', error)
      throw error
    }
  },
}

export const settingsApi = {
  getOfficeSettings: async () => {
    try {
      const response = await apiClient.get('/office-settings')
      return response.data
    } catch (error) {
      console.error('Error fetching office settings:', error)
      throw error
    }
  },

  updateOfficeSettings: async (data: {
    office_name?: string
    office_latitude?: number
    office_longitude?: number
    allowed_radius?: number
    office_start_time?: string
    office_end_time?: string
  }) => {
    try {
      const response = await apiClient.put('/office-settings', data)
      return response.data
    } catch (error) {
      console.error('Error updating office settings:', error)
      throw error
    }
  },
}
