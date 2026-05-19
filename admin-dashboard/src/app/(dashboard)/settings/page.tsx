'use client'

import { useEffect, useState } from 'react'
import { settingsApi } from '@/lib/api'
import { Save } from 'lucide-react'

interface OfficeSettings {
  id?: string
  office_name: string
  office_latitude: number
  office_longitude: number
  allowed_radius: number
  office_start_time: string
  office_end_time: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<OfficeSettings>({
    office_name: '',
    office_latitude: 0,
    office_longitude: 0,
    allowed_radius: 100,
    office_start_time: '09:00',
    office_end_time: '17:00',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsApi.getOfficeSettings()
      console.log('office response :', response)
      if (response?.data) {
        setSettings(response.data)
      }
      setError(null)
    } catch (err) {
      setError('Failed to fetch office settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const { id, ...dataToSave } = settings
      await settingsApi.updateOfficeSettings(dataToSave)
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
      setError(null)
    } catch (err) {
      setError('Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Office Settings</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Office Name</label>
          <input
            type="text"
            name="office_name"
            value={settings.office_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Office Latitude</label>
            <input
              type="number"
              name="office_latitude"
              value={settings.office_latitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Office Longitude</label>
            <input
              type="number"
              name="office_longitude"
              value={settings.office_longitude}
              onChange={handleChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Allowed Radius (meters)</label>
          <input
            type="number"
            name="allowed_radius"
            value={settings.allowed_radius}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Office Start Time</label>
            <input
              type="time"
              name="office_start_time"
              value={settings.office_start_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Office End Time</label>
            <input
              type="time"
              name="office_end_time"
              value={settings.office_end_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {/* Current Settings Display */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Settings Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Office Name</p>
            <p className="font-medium text-slate-900">{settings.office_name || '-'}</p>
          </div>
          <div>
            <p className="text-slate-600">Coordinates</p>
            <p className="font-medium text-slate-900">
              {settings.office_latitude.toFixed(6)}, {settings.office_longitude.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Allowed Radius</p>
            <p className="font-medium text-slate-900">{settings.allowed_radius} meters</p>
          </div>
          <div>
            <p className="text-slate-600">Office Hours</p>
            <p className="font-medium text-slate-900">
              {settings.office_start_time} - {settings.office_end_time}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
